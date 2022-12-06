import * as dotenv from 'dotenv' 
dotenv.config();
import * as azdev from "azure-devops-node-api";

export async function getAzureDevOpsProvider(orgUrl, token) {
    let authHandler = azdev.getPersonalAccessTokenHandler(token); 
    let webApi = new azdev.WebApi(orgUrl, authHandler);  
    let gitApiObject = await webApi.getGitApi();
    return gitApiObject;
}
