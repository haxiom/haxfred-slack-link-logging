function parseConfig (config = {}) {
  let { linkLogging } = config

  if (!linkLogging) return {}

  let {
    blacklist = [],
    endpoint
  } = linkLogging

  blacklist.push(endpoint)

  return {
    blacklist,
    endpoint
  }
}

module.exports = parseConfig
