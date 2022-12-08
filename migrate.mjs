import Postgrator from "postgrator";
import { openDb } from './db.mjs';

async function main() {
  const db = await openDb();
  console.log(await db.open());

  try {
    // Establish a database connection
    await db.connect();

    // Create postgrator instance
    const postgrator = new Postgrator({
      migrationPattern: "./migrations/*",
      driver: "sqlite3",
      database: "history",
      schemaTable: "schemaversion",
      execQuery: (query) => db.exec(query),
    });

    // Migrate to specific version
    const appliedMigrations = await postgrator.migrate();
    console.log(appliedMigrations);
  } catch (error) {
    // If error happened partially through migrations,
    // error object is decorated with appliedMigrations
    console.error(error.appliedMigrations); // array of migration objects
  }

  // Once done migrating, close your connection.
  await db.close();
}
main();
