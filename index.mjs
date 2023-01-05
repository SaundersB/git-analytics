import {
  getCommitersByName,
  getPrsByOpenandReview
} from './git-tool-providers/azure-dev-ops.mjs'
// import * as dotenv from 'dotenv'
// dotenv.config()

try {
  // let commiters = await getCommitersByName()
  // console.log(commiters)

  const prsStats = await getPrsByOpenandReview()
  console.log(prsStats)
} catch (error) {
  console.error(error)
}
