import * as azdev from 'azure-devops-node-api'
import * as dotenv from 'dotenv'
dotenv.config('../env')
import { DateTime } from 'luxon'
import { userMapping } from '../userMapping.mjs'

const orgUrl = process.env.ORG_URL
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN

export async function getAzureDevOpsProvider(orgUrl, token) {
  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  let webApi = new azdev.WebApi(orgUrl, authHandler)
  let gitApiObject = await webApi.getGitApi()

  return gitApiObject
}
// made this a const since I was recalling it a bunch
const gitApiObject = await getAzureDevOpsProvider(orgUrl, token)

const fromDate = process.env.FROM_DATE
const maxToFetch = process.env.MAX_RECORDS
const projects = process.env.PROJECT_NAMES.split(', ')
const DAYS_BETWEEN_COMMITS = 'days between commits'
const SUM_DAYS_BETWEEN_COMMITS = `sum of all ${DAYS_BETWEEN_COMMITS}`
const AVG_DAYS_BETWEEN_COMMITS = `avg ${DAYS_BETWEEN_COMMITS}`

export const getRepositoryNames = async projectName => {
  // const gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
  return gitApiObject.getRepositories(projectName)
}

export const getAllCommits = async projectName => {
  // const gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
  const repos = await getRepositoryNames(projectName)

  return (
    await Promise.all(
      repos.map(({ name: repoName }) =>
        getCommitsByRepository(projectName, repoName)
      )
    )
  ).flat()
}

export const getCommitsByRepository = async (projectName, repositoryName) => {
  return gitApiObject.getCommits(
    repositoryName,
    {
      fromDate
    },
    projectName,
    0,
    maxToFetch
  )
}

export const processCommits = commits => {
  if (commits && commits.length) {
    let commiters = {}
    for (const commit of commits) {
      if (commit) {
        const author = commit?.author.name

        const name = userMapping[author] ?? author
        if (commiters[name]) {
          const start = DateTime.fromJSDate(commiters[name].commitDates.at(-1))
          const end = DateTime.fromJSDate(commit.author.date)

          // find the interval between commit dates and ensure positive
          commiters[name][SUM_DAYS_BETWEEN_COMMITS] += Math.abs(
            start.diff(end, 'days').toObject().days
          )
          // running avg of the commit interval in days. done before count++ since intervals will always be one less than count.
          commiters[name][AVG_DAYS_BETWEEN_COMMITS] =
            commiters[name][SUM_DAYS_BETWEEN_COMMITS] / commiters[name].count

          // iterate count
          commiters[name].count++
          // reassign date to current objects date
          commiters[name].commitDates.push(commit.author.date)
          commiters[name].changeCounts.Add += commit.changeCounts.Add
          commiters[name].changeCounts.Edit += commit.changeCounts.Edit
          commiters[name].changeCounts.Delete += commit.changeCounts.Delete
        } else
          commiters[name] = {
            count: 1,
            commitDates: [commit.author.date],
            [SUM_DAYS_BETWEEN_COMMITS]: 0,
            [AVG_DAYS_BETWEEN_COMMITS]: 0,
            changeCounts: commit.changeCounts
          }
      }
    }

    return commiters
  }
  return null
}

export async function getAllCommitersByName() {
  const commits = (
    await Promise.all(projects.map(project => getAllCommits(project)))
  ).flat()

  return processCommits(commits)
}

// Functions dealing with PRS

/**
 * PR Stats, stats prs opened by an individual, and stats on people who reviewed prs
 * @returns Object {open: {}, reviewers:{}}
 */

export async function getPrsByOpenandReview() {
  // let gitApiObject = await getAzureDevOpsProvider(orgUrl, token)
  const getPrs = async projectName =>
    gitApiObject.getPullRequestsByProject(
      projectName,
      {
        status: 'Completed',
        fromDate
      },
      undefined,
      0,
      maxToFetch
    )
  const prs = (
    await Promise.all(projects.map(project => getPrs(project)))
  ).flat()

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
