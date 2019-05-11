const {
    waitForEvent,
} = require('./utils')

const web3 = require('../web3');
const fidelityPoints = artifacts.require('./FidelityPoints.sol')
const BigNumber = require('bignumber.js');

contract('❍  Fidelity Points Tests', async accounts => {

  const gasAmt = 3e6
  const deployerAddress = accounts[0]
  const tokenSymbol = 'FID'
  const tokenName = 'Fido Coin'
  const tokenDecimals = 18
  const tokenRate = 1000000000000000000
  const tokenInitialSupply = 1000000000000

  before(async () => (
    { contract } = await fidelityPoints.deployed(),
    { methods } = contract,
    { events } = new web3.eth.Contract(
      contract._jsonInterface,
      contract._address
    )
  ))

  it('marks deployer as the contract owner', async () => {
    const owner = await contract.owner.call();
    assert.strictEqual(
      deployerAddress,
      owner,
      'Contract owner was not set correctly'
    )
  })

  it('checks token symbol', async () => {
    const symbol = await contract.symbol.call()
    assert.strictEqual(
      symbol,
      tokenSymbol,
      'Token symbol was not set correctly'
    )
  })

  it('checks token name', async () => {
    const name = await contract.name.call()
    assert.strictEqual(
      name,
      tokenName,
      'Token name was not set correctly'
    )
  })

  it('checks token decimals', async () => {
    const decimals = await contract.decimals.call()
    assert.strictEqual(
      parseInt(decimals),
      tokenDecimals,
      'Token decimals was not set correctly'
    )
  })

  it('checks token RATE', async () => {
    const RATE = await contract.RATE.call()
    assert.strictEqual(
      parseInt(RATE),
      tokenRate,
      'Token rate was not set correctly'
    )
  })

  it('checks token INITIAL_SUPPLY', async () => {
    const INITIAL_SUPPLY = await contract.INITIAL_SUPPLY.call()
    assert.strictEqual(
      parseInt(INITIAL_SUPPLY),
      tokenInitialSupply,
      'Token total supply was not set correctly'
    )
  })

  it('checks create tokens increment final owner balance', async () => {
    const balanceStart = await contract.balanceOf(deployerAddress)
    await contract.createTokens({
        from: deployerAddress,
        value: '1'
      })
    let balanceFinal = await contract.balanceOf(deployerAddress)
    assert(parseFloat(balanceFinal) > parseFloat(balanceStart))
  })

  it('checks total supply increment with token creation', async () => {
    const totalSupplyStart = await contract.totalSupply.call();
    await contract.createTokens({
      from: deployerAddress,
      value: '2'
    })
    const totalSupplyFinal = await contract.totalSupply.call()
    assert(totalSupplyFinal > totalSupplyStart)
  })

  it('should revert new tokens creation with not-owner account ', async () => {
    const expectedError = 'VM Exception while processing transaction: revert'
    try {
      await contract.createTokens({
          from: accounts[1],
          value: '20'
      })
      assert.fail('Create tokens should not have succeeded!')
    } catch (e) {
      assert.isTrue(
        e.message.startsWith(`${expectedError}`),
        `Expected ${expectedError} but got ${e.message} instead!`
      )
    }
  })

  it('checks summary token total supply', async () => {
    const summary = await contract.getSummary()
    const totalSupply = await contract.totalSupply.call()
    console.log(summary[0])
    console.log(totalSupply)
    assert.strictEqual(
      summary[0].toString(),
      totalSupply.toString(),
      'Token total supply was not set correctly in the summary'
    )
  })

  it('checks summary contract owner', async () => {
    const summary = await contract.getSummary()
    assert.strictEqual(
      summary[1],
      deployerAddress,
      'Contract owner was not set correctly in the summary'
    )
  })

  it('checks summary token symbol', async () => {
    const summary = await contract.getSummary()
    assert.strictEqual(
      summary[2],
      tokenSymbol,
      'Token symbol was not set correctly in the summary'
    )
  })

  it('checks summary token name', async () => {
    const summary = await contract.getSummary()
    assert.strictEqual(
      summary[3],
      tokenName,
      'Token name was not set correctly in the summary'
    )
  })

  it('checks summary token decimals', async () => {
    const summary = await contract.getSummary()
    assert.strictEqual(
      parseInt(summary[4]),
      tokenDecimals,
      'Token decimals was not set correctly in the summary'
    )
  })

  it('checks summary token rate', async () => {
    const summary = await contract.getSummary()
    assert.strictEqual(
      parseInt(summary[5]),
      tokenRate,
      'Token rate was not set correctly in the summary'
    )
  })

  it('checks contract deployer owning all the tokes', async () => {
    const ownerBalance = await contract.balanceOf(deployerAddress)
    const totalSupply = await contract.totalSupply.call()
    assert.strictEqual(
      ownerBalance.toString(),
      totalSupply.toString(),
      'Total supply is not owned completely by the deployer'
    )
  })
})
