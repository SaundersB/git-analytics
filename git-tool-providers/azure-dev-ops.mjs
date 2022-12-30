import * as azdev from "azure-devops-node-api";

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
    }

    return commiters
}
