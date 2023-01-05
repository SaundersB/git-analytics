import {
  getCommitersByName,
  getPrsByOpenandReview
} from './git-tool-providers/azure-dev-ops.mjs'

try {
  const commiters = await getCommitersByName()
  console.log(commiters)

  const prsStats = await getPrsByOpenandReview()
  console.log(prsStats)
} catch (error) {
  console.error(error)
}
