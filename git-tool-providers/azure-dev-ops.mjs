import * as azdev from "azure-devops-node-api";
import * as dotenv from 'dotenv' 
dotenv.config('../env');

const orgUrl = process.env.ORG_URL
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

export async function getAzureDevOpsProvider(orgUrl, token) {
    let authHandler = azdev.getPersonalAccessTokenHandler(token); 
    let webApi = new azdev.WebApi(orgUrl, authHandler);  
    let gitApiObject = await webApi.getGitApi();
    return gitApiObject;
}

export async function getCommitersByName() {
    let gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
    const commits = await gitApiObject.getCommits(repoId, {$skip: 0, $top: 15000}, project)
    
    if(commits && commits.length) {
        let commiters = {}

        commits.forEach((commit) => {
            commiters[commit.author.name] ? 
                commiters[commit.author.name].commitCount++ : commiters[commit.author.name] = { commitCount : 1 }
        })

        return commiters
    }
    
    return null
}
