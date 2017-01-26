/* eslint-disable */
global.chai = require('chai');
global.expect = global.chai.expect;

global.sinon = require('sinon');
chai.use(require('sinon-chai'));
chai.use(require('chai-fs'));
