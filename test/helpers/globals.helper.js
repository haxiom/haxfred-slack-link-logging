/* eslint-disable no-undef, no-shadow */
// ------------------------------
// Global modules
// ------------------------------

import chai from 'chai'
import sinon from 'sinon'

chai.use(require('sinon-chai'))

global.sinon = sinon
global.expect = chai.expect
