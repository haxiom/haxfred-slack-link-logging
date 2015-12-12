import { each } from 'lodash'
import {
  parseLink
} from '../src/link-helpers.js'

describe('Link Helpers', () => {
  describe('#parseLink', () => {
    context('does not contain a link', () => {
      it('returns false if string does not contain a link', () => {
        let containsLink = parseLink('start nothttps://somelink.com end')

        expect(containsLink).to.eql(false)
      })
    })

    context('links', () => {
      it('returns link if string contains http:// and a tld', () => {
        let containsLink = parseLink('start <http://somelink.com> end').link

        expect(containsLink).to.eql('http://somelink.com')
      })

      it('returns true if string contains https:// and tld', () => {
        let containsLink = parseLink('start <https://somelink.com> end').link

        expect(containsLink).to.eql('https://somelink.com')
      })

      it('returns true if string begins with http:// and a tld', () => {
        let containsLink = parseLink('<http://somelink.com> end').link

        expect(containsLink).to.eql('http://somelink.com')
      })

      it('returns true if string begins with https:// and tld', () => {
        let containsLink = parseLink('<https://somelink.com> end').link

        expect(containsLink).to.eql('https://somelink.com')
      })

      it('returns true for subdomains', () => {
        let containsLink = parseLink('<https://subdomain.somelink.com/foo/bar> end').link

        expect(containsLink).to.eql('https://subdomain.somelink.com/foo/bar')
      })
    })

    context('links in blacklist options', () => {
      it('ignores passed in blacklist domains', () => {
        let options = {
          blacklist: ['github.com', 'haxiom.io']
        }

        let containsGithubLink = parseLink('start <https://github.com/foo/bar> end', options)
        let containsHaxiomLink = parseLink('start <https://haxiom.io> end', options)

        expect(containsGithubLink).to.eql(false)
        expect(containsHaxiomLink).to.eql(false)
      })

      it('ignores subdomains in blacklist', () => {
        let options = {
          blacklist: ['github.com', 'haxiom.io']
        }

        let containsHaxiomLinkWithSubdomain = parseLink('start <https://haxfred.haxiom.io> end', options)

        expect(containsHaxiomLinkWithSubdomain).to.eql(false)
      })

      it('can blacklist specific subdomain', () => {
        let options = {
          blacklist: ['gist.github.com']
        }

        let containsGithbuLink = parseLink('start <https://github.com/foo/bar> end', options).link
        let containsGistLink = parseLink('start <https://gist.github.com/foo/bar> end', options)

        expect(containsGithbuLink).to.eql('https://github.com/foo/bar')
        expect(containsGistLink).to.eql(false)
      })
    })

    context('link type', () => {
      it('returns image for an image link', () => {
        let imageUrls = [
          '<https://something.com/something/booo/bar.gif>',
          '<https://something.com/something/booo/bar.jpg>',
          '<https://something.com/something/booo/bar.jpeg>',
          '<https://something.com/something/booo/bar.png>'
        ]

        each(imageUrls, (url) => {
          let type = parseLink(url).type

          expect(type).to.eql('image')
        })
      })

      it('returns youtube for youtube link', () => {
        let youtubeUrls = [
          '<https://www.youtube.com/something/booo/bar>',
          '<http://www.youtube.com/something/booo/bar>',
          '<https://youtube.com/something/booo/bar>',
          '<http://youtube.com/something/booo/bar>',
          '<http://youtu.be/something/booo/bar>',
          '<https://youtu.be/something/booo/bar>'
        ]

        each(youtubeUrls, (url) => {
          let type = parseLink(url).type

          expect(type).to.eql('youtube')
        })
      })

      it('returns vimeo for vimeo link', () => {
        let youtubeUrls = [
          '<https://vimeo.com/foo/bar>',
          '<http://vimeo.com/foo/bar>'
        ]

        each(youtubeUrls, (url) => {
          let type = parseLink(url).type

          expect(type).to.eql('vimeo')
        })
      })

      it('returns article for non images or videos', () => {
        let articleUrls = [
          '<https://something.com>',
          '<http://somethingwith.gif.intheurl>',
          '<http://something.with/youtube.com/intheurl>'
        ]

        each(articleUrls, (url) => {
          let type = parseLink(url).type

          expect(type).to.eql('article')
        })
      })
    })

    context('comments', () => {
      it('returns an empty string if no message is present with link', () => {
        let comment = parseLink('<https://foo.bar.com/foo/bar>').comment

        expect(comment).to.eql('')
      })

      it('returns the phrase before the link if the message ends in a link', () => {
        let comment = parseLink('something before the link <https://foo.bar.com/foo/bar>').comment

        expect(comment).to.eql('something before the link')
      })

      it('returns the phrase after the link if the message begins with a link', () => {
        let comment = parseLink('<https://foo.bar.com/foo/bar> something after the link').comment

        expect(comment).to.eql('something after the link')
      })

      it('returns the whole message if there is a comment before and after the link', () => {
        let comment = parseLink('something before the link <https://foo.bar.com/foo/bar> something after the link').comment

        expect(comment).to.eql('something before the link <https://foo.bar.com/foo/bar> something after the link')
      })
    })
  })
})
