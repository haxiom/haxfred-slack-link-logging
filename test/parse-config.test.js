import parseConfig from '../src/parse-config.js'

describe('#parseConfig', () => {
  it('returns an empty object if no linkingLogging field is specified', () => {
    expect(parseConfig({foo: 'bar'})).to.eql({})
  })

  it('returns an object with specified endpoint', () => {
    let config = {
      linkLogging: {
        endpoint: 'http://localhost:3000'
      }
    }

    expect(parseConfig(config)).to.have.property('endpoint', 'http://localhost:3000')
  })

  it('returns an object with a blacklist array if no blacklist config is provided', () => {
    let config = {
      linkLogging: {
        endpoint: 'http://localhost:3000'
      }
    }
    let blacklist = parseConfig(config).blacklist

    expect(blacklist).to.be.an('array')
  })

  it('returns an object with provided blacklist array', () => {
    let config = {
      linkLogging: {
        endpoint: 'http://localhost:3000',
        blacklist: [
          'foo',
          'bar'
        ]
      }
    }

    let blacklist = parseConfig(config).blacklist

    expect(blacklist).to.include('foo')
    expect(blacklist).to.include('bar')
  })

  it('includes the endpoint as a part of the blacklist', () => {
    let config = {
      linkLogging: {
        endpoint: 'http://localhost:3000',
        blacklist: [
          'foo',
          'bar'
        ]
      }
    }

    let blacklist = parseConfig(config).blacklist

    expect(blacklist).to.include('http://localhost:3000')
  })
})
