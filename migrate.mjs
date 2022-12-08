import { openDb } from './db.mjs';

async function main() {
  const db = await openDb();
  await db.migrate()
  await db.close();
}
main();
