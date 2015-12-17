import { parseLink } from './link-helpers'
import { post } from './benicio-helpers'

export default function haxfredSlackLinkLogging (haxfred) {
  if (!haxfred.slack) return console.error('haxfred-slack-link-logging requires haxfred-slack')

  let linkLoggingConfig = haxfred.config.linkLogging || {}

  if (!linkLoggingConfig.endpoint) return console.error('haxfred-slack-link-logging requires you to configure linkLogging.endpoint')

  const API_ENDPOINT = `${linkLoggingConfig.endpoint}/api/links`

  haxfred.on('slack.message', '', (data, deferred) => {
    let message = data.text
    let sender = data.user

    let linkDetails = parseLink(message, linkLoggingConfig)

    if (linkDetails) {
      let channel = haxfred.slack.getChannelGroupOrDMByID(data.channel)
      let user = haxfred.slack.getUserByID(sender)

      let details = {
        user: user.name,
        url: linkDetails.link,
        caption: linkDetails.comment,
        type: linkDetails.type,
        postDate: new Date()
      }

      post(API_ENDPOINT, details, (err, result) => {
        if (err) {
          channel.send(`Something went wrong :cry: \n\n: ${err}`)
          return deferred.reject()
        }

        let id = result.body.id

        channel.send(`Your link was logged to ${API_ENDPOINT}?id=${id}`)

        deferred.resolve()
      })
    } else {
      deferred.resolve()
    }
  })
}

module.exports = haxfredSlackLinkLogging
