const {
    waitForEvent,
} = require('./utils')

const web3 = require('../web3');
const fidelityPoints = artifacts.require('./FidelityPoints.sol')

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

  it('checks totalSupply increment with token creation', async () => {
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
      assert.fail('Create tokens should not have succeded!')
    } catch (e) {
      assert.isTrue(
        e.message.startsWith(`${expectedError}`),
        `Expected ${expectedError} but got ${e.message} instead!`
      )
    }
  })

  it('getSummary', async () => {
      const summary = await contract.getSummary();
      console.log("summary[0]: " + summary[0]);
      console.log("summary[1]: " + summary[1]);
      console.log("summary[2]: " + summary[2]);
      console.log("summary[3]: " + summary[3]);
      console.log("summary[4]: " + summary[4]);
      assert.strictEqual(
        summary[2],
        tokenSymbol,
        'Token symbol was not set correctly in the summary'
      )
  })
})
