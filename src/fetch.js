import axios from 'axios'
import { isObject, startsWith, forEach } from 'lodash'
import pluralize from 'pluralize'

module.exports = async ({
  apiURL,
  contentType,
  jwtToken,
  queryLimit,
  maxPerPage,
  reporter,
}) => {
  // Define API endpoint.
  const apiBase = `${apiURL}/${pluralize(contentType)}`
  //const apiEndpoint = `${apiBase}?_limit=${queryLimit}`

  const apiEndpoints = Array(parseInt(queryLimit / maxPerPage)).fill().map((_, i) => {
    return `${apiBase}?_limit=${maxPerPage}&_start=${maxPerPage * i}`
  })

  console.log(apiEndpoints)

  reporter.info(`Starting to fetch data from Strapi - ${apiBase}`)

  // Set authorization token
  let fetchRequestConfig = {}
  if (jwtToken !== null) {
    fetchRequestConfig.headers = {
      Authorization: `Bearer ${jwtToken}`,
    }
  }

  // Make API request.
  let documents = []

  // apiEndpoints.forEach((api) => {
  //   const paginatedDocs = await axios(api, fetchRequestConfig)
  //   const paginatedCleanedDocs = paginatedDocs.data.map(item => clean(item))
  //   documents.concat(paginatedCleanedDocs)
  // })
  
  axios.all(apiEndpoints).then(axios.spread((...responses) => {
    responses.forEach((resp) => {
      const cleanedDocs = resp.data.map(item => clean(item))
      documents = documents.concat(cleanedDocs)
      console.log(documents.length)
    })
  }))
  
  //const documents = await axios(apiEndpoint, fetchRequestConfig)

  // Map and clean data.
  return documents
}

/**
 * Remove fields starting with `_` symbol.
 *
 * @param {object} item - Entry needing clean
 * @returns {object} output - Object cleaned
 */
const clean = item => {
  forEach(item, (value, key) => {
    if (startsWith(key, `__`)) {
      delete item[key]
    } else if (startsWith(key, `_`)) {
      delete item[key]
      item[key.slice(1)] = value
    } else if (isObject(value)) {
      item[key] = clean(value)
    }
  })

  return item
}
