const os = require('os');
const { Pool } = require('pg');
const { createClient } = require('redis');

// PostgreSQL
const pgPool = new Pool({
  user: process.env.POSTGRES_USER || 'app-client',      // PostgreSQL username
  host: process.env.POSTGRES_HOST || 'localhost',           // Database host
  database: process.env.POSTGRES_DATABASE || 'postgres',   // Database name
  password: process.env.POSTGRES_PASSWORD || "postgres",   // PostgreSQL password
  port: 5432,                  // PostgreSQL default port
});

// Redis
const redis = createClient({
  url: process.env.REDIS_URL || "redis://172.19.0.6:6379",
  retryStrategy: (times) => {
    // Return null to stop retrying
    if (times > 10) {
      console.error('Max retries reached, giving up');
      return null;
    }

    // Exponential backoff: 100ms, 200ms, 400ms, ... capped at 30s
    const delay = Math.min(100 * Math.pow(2, times - 1), 30000);
    console.log(`Retry attempt ${times}, next in ${delay}ms`);
    return delay;
  },
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: 3,
  connectTimeout: 5000,         
  commandTimeout: 2000,          
  enableReadyCheck: true,        
});
redis.connect().catch(console.error);

async function initDb() {
  const create = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0)
  );`;
  await pgPool.query(create);
}

initDb().catch(err => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});


let requestCounter = 0;

function pad(s) {
  return (s < 10 ? '0' : '') + s;
}

function getServerUptime() {
  const seconds = Math.floor(os.uptime());
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

async function getServerHealth() {
  requestCounter += 1;

  let pgStatus = 'ok';
  try {
    await pgPool.query('SELECT 1');
  } catch (e) {
    pgStatus = 'error';
  }

  let redisStatus = 'ok';
  try {
    await redis.ping();
  } catch (e) {
    redisStatus = 'error';
  }

  return {
    status: 'ok',
    serverUptime: getServerUptime(),
    handledRequests: requestCounter,
    postgres: pgStatus,
    eloo: "lol",
    redis: redisStatus
  };
}
async function checkServerReadiness(){
    requestCounter += 1;

  let pgStatus = 'ok';
  try {
    await pgPool.query('SELECT 1');
  } catch (e) {
    pgStatus = 'error';
  }

  let redisStatus = 'ok';
  try {
    await redis.ping();
  } catch (e) {
    redisStatus = 'error';
  }

  return {
    status: 'ok',
    handledRequests: requestCounter,
    postgres: pgStatus,
    redis: redisStatus
  };
}
async function listItems() {
  requestCounter += 1;
  const result = await pgPool.query('SELECT id, name, price FROM items ORDER BY id ASC');
  return result.rows;
}

async function createItem(payload) {
  requestCounter += 1;
  const { name, price } = payload || {};
  if (!name || price == null) {
    return { error: 'name and price are required' };
  }

  const result = await pgPool.query(
    'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING id, name, price',
    [name, Number(price)]
  );

  return result.rows[0];
}

async function getStats() {
  requestCounter += 1;

  const cacheKey = 'stats-cache';
  var cached = null
  try {
    cached = await redis.get(cacheKey);
  } catch (e) {
    cached = false
  } 

  if (cached) {
    return {
      data: JSON.parse(cached),
      cached: true
      
    };
  }

  const instanceId = process.env.INSTANCE_ID || 'local-instance';

  const totalItemsRes = await pgPool.query('SELECT COUNT(*) AS count FROM items');
  const totalItems = Number(totalItemsRes.rows[0].count);

  const data = {
    totalItems,
    instanceId,
    serverUptime: getServerUptime(),
    handledRequests: requestCounter
  };

  await redis.set(cacheKey, JSON.stringify(data), { expiration: {value: 10,type:'EX'} });

  return {
    data,
    cached: false
    //headers: { 'X-Cache': 'MISS' }
  };
}

module.exports = {
  _internal: {
    get requestCounter() { return requestCounter; },
    set requestCounter(v) { requestCounter = v; }
  },
  getServerUptime,
  getServerHealth,
  listItems,
  createItem,
  getStats
};
