import * as azdev from 'azure-devops-node-api'
import * as dotenv from 'dotenv'
dotenv.config('../env')
import { DateTime } from 'luxon'
import { userMapping } from '../userMapping.mjs'

const orgUrl = process.env.ORG_URL
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const projects = process.env.PROJECT_NAMES.split(', ')
const t = 'days between commits'
const recent = `sum of all ${t}`
const avgDays = `avg ${t}`

export async function getAzureDevOpsProvider(orgUrl, token) {
  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  let webApi = new azdev.WebApi(orgUrl, authHandler)
  let gitApiObject = await webApi.getGitApi()

  return gitApiObject
}

export async function getCommitersByName() {
  let gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
  const getCommits = async projectName => {
    const repos = await gitApiObject.getRepositories(projectName)
    const repoNames = repos.map(repo => repo.name)
    return (
      await Promise.all(
        repoNames.map(repoName =>
          gitApiObject.getCommits(
            repoName,
            {
              fromDate: '01/01/2022 12:00:00 AM'
            },
            projectName,
            0,
            150000
          )
        )
      )
    ).flat()
  }
  const commits = (
    await Promise.all(projects.map(project => getCommits(project)))
  ).flat()
  if (commits && commits.length) {
    let commiters = {}
    for (const commit of commits) {
      if (commit) {
        const author = commit?.author.name

        const name = userMapping[author] ?? author
        if (commiters[name]) {
          const start = DateTime.fromJSDate(
            commiters[name].mostRecentCommitDate
          )
          const end = DateTime.fromJSDate(commit.author.date)

          // find the interval between commit dates
          commiters[name][recent] += start.diff(end, 'days').toObject().days
          // running avg of the commit interval in days. done before count++ since intervals will always be one less than count.
          commiters[name][avgDays] =
            commiters[name][recent] / commiters[name].count

          // iterate count
          commiters[name].count++
          // reassign date to current objects date
          commiters[name].mostRecentCommitDate = commit.author.date
          commiters[name].changeCounts.Add += commit.changeCounts.Add
          commiters[name].changeCounts.Edit += commit.changeCounts.Edit
          commiters[name].changeCounts.Delete += commit.changeCounts.Delete
        } else
          commiters[name] = {
            count: 1,
            mostRecentCommitDate: commit.author.date,
            [recent]: 0,
            [avgDays]: 0,
            changeCounts: commit.changeCounts
          }
      }
    }

    return commiters
  }

  return null
}

export async function getPrsByOpenandReview(orgUrl, token) {
  let gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
  const getPrs = async projectName =>
    gitApiObject.getPullRequestsByProject(
      projectName,
      {
        status: 'Completed',
        fromDate: '01/01/2022 12:00:00 AM'
      },
      undefined,
      0,
      15000
    )
  const prs = await Promise.all(projects.map(project => getPrs(project)))

  if (prs && prs.length) {
    const prsStats = prs.reduce(
      (acc, cur) => {
        cur.reviewers.map(reviewer => {
          // 0 not reviewed, 5 approved with suggestions, 10 approved
          if (reviewer.vote > 0) {
            const name =
              userMapping[reviewer.displayName] ?? reviewer.displayName
            acc.reviewer[name] ? acc.reviewer[name]++ : (acc.reviewer[name] = 1)
          }
        })
        const opened = DateTime.fromJSDate(cur.creationDate)
        const closed = DateTime.fromJSDate(cur.closedDate)
        const name =
          userMapping[cur.createdBy.displayName] ?? cur.createdBy.displayName
        if (acc.open[name]) {
          acc.open[name].count++
          acc.open[name].timeOpenHours.push(
            closed.diff(opened, 'hours').toObject().hours
          )
          acc.open[name].sum += acc.open[name].timeOpenHours.at(-1)
          acc.open[name].avgTimeOpenHours =
            acc.open[name].sum / acc.open[name].count
        } else {
          acc.open[name] = {
            count: 1,
            timeOpenHours: [],
            avgTimeOpenHours: 0,
            sum: 0
          }
        }
        return acc
      },
      { open: {}, reviewer: {} }
    )
    return prsStats
  }
  return null
}
