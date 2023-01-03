import * as dotenv from 'dotenv' 
dotenv.config();
import { getAzureDevOpsProvider } from './git-tool-providers/azure-dev-ops.mjs';
import { openDb } from './db.mjs';
import { importCommits } from './importData.mjs';

let orgUrl = process.env.ORG_URL
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME


try {
    let gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
    const commits = await gitApiObject.getCommits(repoId, {$skip: 0, $top: 15000}, project)
    if(commits && commits.length) {
        let reviewers = {}
        commits.forEach((commit) => {
            reviewers[commit.author.name] ? reviewers[commit.author.name]++ : reviewers[commit.author.name] = 1
        })
        console.log(reviewers)
    }
} catch (error) {
    console.error(error)
}

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        
const db = await openDb();
await importCommits(db, commits);
