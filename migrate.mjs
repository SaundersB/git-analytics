import Postgrator from "postgrator";
import { openDb } from './db.mjs';

async function main() {
  const db = await openDb();
  db.on('trace', (data) => {
    console.log(data);
  })
  await db.migrate()
  await db.close();
}
main();
