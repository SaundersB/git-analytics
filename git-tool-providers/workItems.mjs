import * as azdev from 'azure-devops-node-api'
import * as dotenv from 'dotenv'
dotenv.config('../env')

const orgUrl = process.env.ORG_URL
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const projects = process.env.PROJECT_NAMES.split(', ')

export async function getAzureDevOpsProvider() {
  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  let webApi = new azdev.WebApi(orgUrl, authHandler)
  let witApi = await webApi.getWorkItemTrackingApi()
  const projectAnalysisApiObject = await webApi.getProjectAnalysisApi()

  return { witApi, projectAnalysisApiObject }
}
const { witApi, projectAnalysisApiObject } = await getAzureDevOpsProvider()

export const workItems = async () => {
  const doodle = await witApi.getRecentActivityData()
  console.log(
    await projectAnalysisApiObject.getGitRepositoriesActivityMetrics(
      projects[0],
      '1/1/2022',
      1,
      0,
      15000
    )
  )
  // console.log(await witApi.getWorkItems())
  // console.log(JSON.stringify(doodle, null, 2))
}

workItems()
