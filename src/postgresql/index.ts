import { Pool } from 'pg';

export function pgConnector(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  timeout: number;
}) {
  let idleTimer: NodeJS.Timeout | undefined;
  const idleTimeoutMs = config.timeout || 30e3; // 30 seconds
  let pool: Pool | undefined;

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
        pool = undefined;
      }
    }, idleTimeoutMs);
  }

  async function query<T>(text: string, parameters?: unknown[]) {
    pool ||= createNewPool();
    resetIdleTimer();
    const result = await pool.query(text, parameters);
    return result.rows as T[];
  }

  return {
    query,
  };
}
