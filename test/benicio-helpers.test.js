import superagent from 'superagent';
import { post } from '../src/benicio-helpers.js';

describe('benicio helpers', () => {
  describe('#post', () => {
    let details, sendSpy, endSpy;

    beforeEach(() => {
      details = {
        user: 'some user',
        url: 'some link',
        caption: 'some comment',
        type: 'some type',
      };

      sendSpy = sinon.stub().returnsThis();
      endSpy = sinon.stub().yields();
      sinon.stub(superagent, 'post').returns({
        end: endSpy,
        send: sendSpy,
        type: sinon.stub().returnsThis(),
        accept: sinon.stub().returnsThis(),
      });
    });

    afterEach(() => {
      superagent.post.restore();
    });

    it('posts to benicio', () => {
      post('https://someendpoint.com', details, () => {});

      expect(superagent.post).to.be.calledOnce;
      expect(superagent.post).to.be.calledWith('https://someendpoint.com');
    });

    it('sends link details to benicio', () => {
      post('https://someendpoint.com', details, () => {});

      expect(sendSpy).to.be.calledOnce;
      expect(sendSpy).to.be.calledWith(details);
    });

    it('has a callback', () => {
      let cbSpy = sinon.spy();

      post('https://someendpoint.com', details, cbSpy);

      expect(cbSpy).to.be.calledOnce;
    });
  });
});
