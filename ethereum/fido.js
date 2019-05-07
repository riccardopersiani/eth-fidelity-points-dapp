const Web3 = require('web3');
const { getExternalVariable } = require('./test/utils')
const KOVAN_WSS = `wss://kovan.infura.io/ws/v3/3bd9a228345e49aea2af469746a97814}`
const web3Socket = new Web3(new Web3.providers.WebsocketProvider(KOVAN_WSS))
const web3 = require('./web3')
const FidelityPoints = require('./build/contracts/FidelityPoints.json')

// Create the instance from the contract deployed in the Rinkeby network.
const instance = new web3.eth.Contract(
    FidelityPoints.abi,
    '0xad819e335534ebd7581e609fd446c0366bc8958b'
);

module.exports = instance;
