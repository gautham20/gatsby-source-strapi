const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

//field contains info that has to go into File
//item is the overall item in which key is saved
//key is the key it saved in the object

const createFileName = async (store, cache, createNode, touchNode, auth, field, item, key, isArray) => {
  let fileNodeID
  // using field on the cache key for multiple image field
  const mediaDataCacheKey = `strapi-media-${item.id}-${key}`
  const cacheMediaData = await cache.get(mediaDataCacheKey)

  // If we have cached media data and it wasn't modified, reuse
  // previously created file node to not try to redownload
  if (cacheMediaData && field.updatedAt === cacheMediaData.updatedAt) {
    fileNodeID = cacheMediaData.fileNodeID
    touchNode({ nodeId: cacheMediaData.fileNodeID })
  }

  // If we don't have cached data, download the file
  if (!fileNodeID) {
    try {
      // full media url
      const source_url = `${field.url.startsWith('http') ? '' : apiURL}${
        field.url
      }`

      const fileNode = await createRemoteFileNode({
        url: source_url,
        store,
        cache,
        createNode,
        auth,
      })

      // If we don't have cached data, download the file
      if (fileNode) {
        fileNodeID = fileNode.id

        await cache.set(mediaDataCacheKey, {
          fileNodeID,
          modified: field.updatedAt,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (fileNodeID) {
    if(isArray){
      if(!(item.hasOwnProperty(`${key}_nodes`))){
        item[`${key}__NODE`] = []
      }
      item[`${key}__NODE`].push(fileNodeID)
    } else {
      item[`${key}___NODE`] = fileNodeID
    }
  }
}

const extractFields = async (
  apiURL,
  store,
  cache,
  createNode,
  touchNode,
  auth,
  item,
) => {
  if(item && item.hasOwnProperty('mime')){
    await createFileName(store, cache, createNode, touchNode, auth, item, item, 'localfile')
  } else {
    for (const key of Object.keys(item)) {
      const field = item[key]
      if (Array.isArray(field)) {
        // add recursion to fetch nested strapi references
        await Promise.all(
          field.map(async f => {
              return extractFields(apiURL, store, cache, createNode, touchNode, auth, f, key)
            }
          )
        )
      } else {
        // image fields have a mime property among other
        // maybe should find a better test
        if (field !== null && field !== undefined && field.hasOwnProperty('mime')) {
          await createFileName(store, cache, createNode, touchNode, auth, field, item, key)
        }
      }
    }
  }
}

// Downloads media from image type fields
exports.downloadMediaFiles = async ({
  entities,
  apiURL,
  store,
  cache,
  createNode,
  touchNode,
  jwtToken: auth,
}) =>
  Promise.all(
    entities.map(async entity => {
      for (let item of entity) {
        // loop item over fields
        await extractFields(
          apiURL,
          store,
          cache,
          createNode,
          touchNode,
          auth,
          item
        )
      }
      return entity
    })
  )
