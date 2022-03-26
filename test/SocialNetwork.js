const { assert } = require('chai')
const { FormControlStatic } = require('react-bootstrap')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('SocialNetwork', (accounts) => {
    let socialNetwork

    before(async () => {
      socialNetwork = await SocialNetwork.deployed();
    })

    describe('deployment', async () => {
      it('deploys successfully', async () => {
        const address = await socialNetwork.address;
        assert.notEqual(address, 0x0)
        assert.notEqual(address, "")
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })
      it('has a name', async() => {
        const name = await socialNetwork.name();
        assert.deepEqual(name, "Dapp University Social Network")
      })
    })
    
    describe('posts', async () => {
      it('creates posts', async() => {
        
      })
      it('lists all the posts', async() => {

      })
      it('allows users to tip posts', async() => {

      })
    })
  })