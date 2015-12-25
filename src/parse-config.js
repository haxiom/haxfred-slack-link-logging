function parseConfig (config = {}) {
  let {
    blacklist = [],
    endpoint
  } = config.linkLogging

  blacklist.push(endpoint)

  return {
    blacklist,
    endpoint
  }
}

module.exports = parseConfig
