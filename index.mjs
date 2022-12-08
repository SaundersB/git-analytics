import * as dotenv from 'dotenv' 
dotenv.config();
import { getAzureDevOpsProvider } from './git-tool-providers/azure-dev-ops.mjs';
import { openDb } from './db.mjs';

let orgUrl = process.env.ORG_URL
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

let gitApiObject = await getAzureDevOpsProvider(orgUrl, token);

const commits = await gitApiObject.getCommits(repoId, {$skip: 0, $top: 5}, project)
console.log(commits);        

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        


const db = await openDb();
console.log(`Importing ${commits.length} commits`)
commits.map(async (commit) => {
    const author = await db.get('SELECT * FROM authors WHERE email = ?;', commit.committer.email);
    console.log(`author`, author)

    if(!author) {
        await db.run(
            'INSERT INTO authors (name, email, createDate) VALUES (?, ?, ?);', 
            commit.committer.name, 
            commit.committer.email, 
            commit.committer.date
        )
    }
})
