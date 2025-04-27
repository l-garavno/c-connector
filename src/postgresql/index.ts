import { Pool } from 'pg';

export function pgConnector(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  timeout: number;
}) {
  let idleTimer: NodeJS.Timeout | null = null;
  const IDLE_TIMEOUT_MS = config.timeout || 30e3; // 30 seconds
  let pool: Pool | null = null;

  function createNewPool() {
    return new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  function resetIdleTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }

    idleTimer = setTimeout(async () => {
      if (pool) {
        await pool.end();
        pool = null;
      }
    }, IDLE_TIMEOUT_MS);
  }

  async function query<T>(text: string, params?: unknown[]) {
    if (!pool) {
      pool = createNewPool();
    }
    resetIdleTimer();
    const result = await pool.query(text, params);
    return result.rows as T[];
  }

  return {
    query,
  };
}
