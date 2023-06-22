import { MongoClient } from 'mongodb';
const { MONGODB_URI, MONGODB_DB, SERVER,MONGODB_URI_DEV,MONGODB_URI_PROD,MONGODB_DB_PROD,MONGODB_DB_DEV } = process.env;
!MONGODB_URI
if (SERVER === "PROD" ? !MONGODB_URI_PROD : !MONGODB_URI_DEV) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}
if (SERVER === "PROD" ? !MONGODB_DB_PROD : !MONGODB_DB_DEV) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 */
let cached = global.mongo;
if (!cached) cached = global.mongo = {};
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const conn = {};
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = MongoClient.connect(SERVER === "PROD" ? MONGODB_URI_PROD : MONGODB_URI_DEV, opts)
      .then((client) => {
        conn.client = client;
        return client.db(SERVER === "PROD" ? MONGODB_DB_PROD : MONGODB_DB_DEV);
      })
      .then((db) => {
        conn.db = db;
        cached.conn = conn;
      });
  }
  await cached.promise;
  return cached.conn;
};
