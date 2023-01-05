import { Commit } from 'azure-devops-node-api/interfaces/GitInterfaces'
import { IRequestOptions } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces'
import { GitApi } from 'azure-devops-node-api/GitApi'
import { getBasicHandler } from 'azure-devops-node-api/handlers/basiccreds'

async function getCommitsByUserId(
  organizationUrl: string,
  personalAccessToken: string,
  repositoryId: string,
  project: string
): Promise<Map<string, Commit[]>> {
  // Set up the API client
  const handler = getBasicHandler(personalAccessToken)
  const api = new GitApi(organizationUrl, handler)

  // Fetch all commits
  const commits: Commit[] = []
  let continuationToken: string | undefined
  do {
    const options: IRequestOptions = {
      continuationToken
    }
    const result = await api.getCommits(
      repositoryId,
      project,
      undefined,
      undefined,
      undefined,
      undefined,
      options
    )
    continuationToken = result.continuationToken
    commits.push(...result.commits)
  } while (continuationToken)

  // Group the commits by user ID
  const commitsByUserId = new Map<string, Commit[]>()
  for (const commit of commits) {
    const userId = commit.author.id
    if (!commitsByUserId.has(userId)) {
      commitsByUserId.set(userId, [])
    }
    commitsByUserId.get(userId)!.push(commit)
  }

  return commitsByUserId
}
