import request from 'superagent'

export function post (endpoint, details, cb) {
  request.post(endpoint)
    .type('form')
    .accept('application/json')
    .send(details)
    .end(cb)
}
