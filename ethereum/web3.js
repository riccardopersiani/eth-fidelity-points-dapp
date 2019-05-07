const Web3 = require('web3');
const { infuraKey } = require('./apikeys.js')
const { getExternalVariable } = require('./test/utils')
const KOVAN_WSS = `wss://kovan.infura.io/ws/v3/${infuraKey}`
const web3 = new Web3(new Web3.providers.WebsocketProvider(KOVAN_WSS))

module.exports = web3
