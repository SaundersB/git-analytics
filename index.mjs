import {
  getAllCommitersByName,
  getPrsByOpenandReview,
  getCommitsByRepository,
  processCommits
} from './git-tool-providers/azure-dev-ops.mjs'
import fs from 'fs'

try {
  const commiters = await getAllCommitersByName()
  // console.log(commiters)

  const prsStats = await getPrsByOpenandReview()
  // console.log(prsStats)
  const stats = { prs: prsStats, commits: commiters }
  // console.log(stats)
  fs.writeFileSync('./stats.json', JSON.stringify(stats, null, 2))
} catch (error) {
  console.error(error)
}
