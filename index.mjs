import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';
// import { openDb } from './db.mjs';
// import { importCommits } from './importData.mjs';

try {
    let commiters = await getCommitersByName()
    console.log(commiters)
} catch (error) {
    console.error(error)
}

// const db = await openDb();
// await importCommits(db, commits);
