import { describe, expect, it } from 'vitest';

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { XerionConfigError } from '../../src/errors/errors.js';

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const waitForRpc = async (
  connection: Connection,
  attempts: number,
  params: {
    getLogs: () => Readonly<{ stdout: string; stderr: string }>;
    getExitStatus: () => Readonly<{ code: number | null; signal: NodeJS.Signals | null }> | null;
  },
): Promise<void> => {
  let lastError: unknown = undefined;
  for (let i = 0; i < attempts; i += 1) {
    const exitStatus = params.getExitStatus();
    if (exitStatus) {
      const logs = params.getLogs();
      const stderrOneLine = logs.stderr.replaceAll('\n', ' ').slice(0, 800);
      const stdoutOneLine = logs.stdout.replaceAll('\n', ' ').slice(0, 800);
      throw new XerionConfigError(
        `Local validator exited before becoming ready (code=${String(exitStatus.code)}, signal=${String(
          exitStatus.signal,
        )}). stderrTail=${stderrOneLine} stdoutTail=${stdoutOneLine}`,
        {
        exitStatus,
        stdoutTail: logs.stdout,
        stderrTail: logs.stderr,
        lastError,
        },
      );
    }
    try {
      await connection.getLatestBlockhash('confirmed');
      return;
    } catch (err: unknown) {
      lastError = err;
      await delay(250);
    }
  }
  const logs = params.getLogs();
  throw new XerionConfigError('Local validator did not become ready in time', {
    attempts,
    lastError,
    stdoutTail: logs.stdout,
    stderrTail: logs.stderr,
  });
};

const findFreePort = async (): Promise<number> => {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  if (address === null || typeof address === 'string') {
    server.close();
    throw new XerionConfigError('Failed to allocate a free localhost port', { address });
  }
  const port = address.port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return port;
};

const startLocalValidator = async (): Promise<{
  rpcUrl: string;
  stop: () => Promise<void>;
  getLogs: () => Readonly<{ stdout: string; stderr: string }>;
  getExitStatus: () => Readonly<{ code: number | null; signal: NodeJS.Signals | null }> | null;
}> => {
  const ledgerDir = await mkdtemp(path.join(os.tmpdir(), 'xerion-ledger-'));
  const rpcPort = await findFreePort();
  const rpcUrl = `http://127.0.0.1:${rpcPort}`;

  let stdoutTail = '';
  let stderrTail = '';
  const maxTailChars = 16_384;
  let exitStatus: { code: number | null; signal: NodeJS.Signals | null } | null = null;

  let child: ReturnType<typeof spawn>;
  try {
    child = spawn(
      'solana-test-validator',
      [
        '--reset',
        '--quiet',
        '--ledger',
        ledgerDir,
        '--bind-address',
        '127.0.0.1',
        '--rpc-port',
        String(rpcPort),
      ],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          COPYFILE_DISABLE: '1',
          COPY_EXTENDED_ATTRIBUTES_DISABLE: '1',
        },
      },
    );
  } catch (err: unknown) {
    await rm(ledgerDir, { recursive: true, force: true });
    const e = err as Partial<{ code?: unknown; message?: unknown }>;
    const code = typeof e.code === 'string' ? e.code : undefined;
    const message = typeof e.message === 'string' ? e.message : undefined;
    if (code === 'ENOENT') {
      throw new XerionConfigError('solana-test-validator binary not found on PATH', {
        binary: 'solana-test-validator',
        code,
        message,
        installHint: 'Install Solana CLI (includes solana-test-validator) and ensure it is on PATH.',
      });
    }
    throw new XerionConfigError('Failed to spawn solana-test-validator', {
      binary: 'solana-test-validator',
      code,
      message,
    });
  }

  child.stdout?.on('data', (buf: Buffer) => {
    stdoutTail = (stdoutTail + buf.toString('utf8')).slice(-maxTailChars);
  });

  child.stderr?.on('data', (buf: Buffer) => {
    stderrTail = (stderrTail + buf.toString('utf8')).slice(-maxTailChars);
  });

  child.once('exit', (code: number | null, signal: NodeJS.Signals | null) => {
    exitStatus = { code, signal };
  });

  const stop = async (): Promise<void> => {
    child.kill('SIGTERM');
    await delay(250);
    if (!child.killed) {
      child.kill('SIGKILL');
    }
    await rm(ledgerDir, { recursive: true, force: true });
  };

  const spawnOutcome:
    | { kind: 'spawn' }
    | { kind: 'error'; err: unknown } = await once(child, 'spawn')
    .then(() => ({ kind: 'spawn' as const }))
    .catch((err: unknown) => ({ kind: 'error' as const, err }));

  if (spawnOutcome.kind === 'error') {
    await stop();
    const err = spawnOutcome.err as Partial<{ code?: unknown; message?: unknown }>;
    const code = typeof err.code === 'string' ? err.code : undefined;
    const message = typeof err.message === 'string' ? err.message : undefined;

    if (code === 'ENOENT') {
      throw new XerionConfigError('solana-test-validator binary not found on PATH', {
        binary: 'solana-test-validator',
        code,
        message,
        installHint: 'Install Solana CLI (includes solana-test-validator) and ensure it is on PATH.',
      });
    }

    throw new XerionConfigError('Failed to start solana-test-validator', {
      binary: 'solana-test-validator',
      code,
      message,
    });
  }

  return {
    rpcUrl,
    stop,
    getLogs: () => ({ stdout: stdoutTail, stderr: stderrTail }),
    getExitStatus: () => exitStatus,
  };
};

describe('local validator integration', () => {
  it('airdrop and transfer lamports on local validator', async () => {
    const validator = await startLocalValidator();
    try {
      const connection = new Connection(validator.rpcUrl, { commitment: 'confirmed' });
      await waitForRpc(connection, 240, {
        getLogs: validator.getLogs,
        getExitStatus: validator.getExitStatus,
      });

      const payer = Keypair.generate();
      const receiver = Keypair.generate();

      const sig = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
      const latest = await connection.getLatestBlockhash('confirmed');
      await connection.confirmTransaction({ signature: sig, ...latest }, 'confirmed');

      const rentExemptLamports = await connection.getMinimumBalanceForRentExemption(0, 'confirmed');

      const ix = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: receiver.publicKey,
        lamports: rentExemptLamports,
      });

      const tx = new Transaction({
        feePayer: payer.publicKey,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      }).add(ix);

      tx.sign(payer);

      const sendSig = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      await connection.confirmTransaction({ signature: sendSig, ...latest }, 'confirmed');

      const receiverBalance = await connection.getBalance(receiver.publicKey, 'confirmed');
      expect(receiverBalance).toBe(rentExemptLamports);
    } finally {
      await validator.stop();
    }
  });
});
