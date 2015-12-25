import linkLogging from '../src/haxfred-slack-link-logging.js'
import * as benecioHelpers from '../src/benicio-helpers.js'
import * as linkHelpers from '../src/link-helpers.js'

describe('linkLogging', () => {
  let haxfred, channel

  beforeEach(() => {
    channel = {
      send: sinon.stub()
    }
    haxfred = {
      config: {
        linkLogging: {
          endpoint: 'http://localhost:3000'
        }
      },
      on: sinon.stub(),
      slack: {
        getChannelGroupOrDMByID: sinon.stub().returns(channel),
        getUserByID: sinon.stub().returns({ name: 'someUser' })
      }
    }

    sinon.stub(benecioHelpers, 'post')
    sinon.stub(linkHelpers, 'parseLink')
    sinon.stub(console, 'error')
  })

  afterEach(() => {
    benecioHelpers.post.restore()
    linkHelpers.parseLink.restore()
    console.error.restore()
  })

  it('creates a listener for slack.message', () => {
    linkLogging(haxfred)

    expect(haxfred.on).to.be.calledOnce
    expect(haxfred.on).to.be.calledWith('slack.message')
  })

  it('resolves if no link is contained in slack message', () => {
    let data = {
      text: 'some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(promiseStub.resolve).to.be.calledOnce
  })

  it('posts to endpoint', () => {
    linkHelpers.parseLink.returns({
      link: 'http://google.com',
      comment: 'some message http://google.com some message',
      type: 'article'
    })
    let data = {
      text: 'some message http://google.com some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(benecioHelpers.post).to.be.calledOnce
    expect(benecioHelpers.post).to.be.calledWith(
      `${haxfred.config.linkLogging.endpoint}/api/links`,
      sinon.match({
        user: 'someUser',
        url: 'http://google.com',
        caption: 'some message http://google.com some message',
        type: 'article'
      })
    )
  })

  it('adds endpoint to haxfred blacklist automatically', () => {
    haxfred.config.linkLogging.blacklist = ['http://somedomain.com']

    linkLogging(haxfred)

    expect(haxfred.config.linkLogging.blacklist).to.include('http://localhost:3000')
  })

  it('sends a confirmation message to slack', () => {
    linkHelpers.parseLink.returns({
      link: 'http://google.com',
      comment: 'some message http://google.com some message',
      type: 'article'
    })
    benecioHelpers.post.yields(null, { body: { id: '1' } })
    let data = {
      text: 'some message http://google.com some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(channel.send).to.be.calledOnce
    expect(channel.send).to.be.calledWith(`Your link was logged to ${haxfred.config.linkLogging.endpoint}/api/links?id=1`)
  })

  it('resolves promise when posts', () => {
    linkHelpers.parseLink.returns({
      link: 'http://google.com',
      comment: 'some message http://google.com some message',
      type: 'article'
    })
    benecioHelpers.post.yields(null, { body: { id: '1' } })
    let data = {
      text: 'some message http://google.com some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(promiseStub.resolve).to.be.calledOnce
  })

  it('sends a message to slack if post errors', () => {
    benecioHelpers.post.yields('an error')
    linkHelpers.parseLink.returns({
      link: 'http://google.com',
      comment: 'some message http://google.com some message',
      type: 'article'
    })
    let data = {
      text: 'some message http://google.com some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(channel.send).to.be.calledOnce
    expect(channel.send).to.be.calledWith('Something went wrong :cry: \n\n: an error')
  })

  it('rejects the promise if post errors', () => {
    benecioHelpers.post.yields('an error')
    linkHelpers.parseLink.returns({
      link: 'http://google.com',
      comment: 'some message http://google.com some message',
      type: 'article'
    })
    let data = {
      text: 'some message http://google.com some message',
      user: '@userId'
    }
    let promiseStub = {
      resolve: sinon.stub(),
      reject: sinon.stub()
    }

    haxfred.on.callsArgWith(2, data, promiseStub)

    linkLogging(haxfred)

    expect(promiseStub.reject).to.be.calledOnce
  })
})
