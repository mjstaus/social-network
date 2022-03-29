const { assert } = require('chai')
const { FormControlStatic } = require('react-bootstrap')

const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('SocialNetwork', ([deployer, author, tipper]) => {
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
        assert.deepEqual(name, 'Dapp University Social Network')
      })
    })
    
    describe('posts', async () => {
      let result, postCount
      it('creates posts', async() => {
        result = await socialNetwork.createPost('hello!', { from: author });
        postCount = await socialNetwork.postCount();
        
        // SUCCESS
        assert.equal(postCount, 1);
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct');
        assert.equal(event.content, 'hello!', 'content is correct');
        assert.equal(event.tipAmount, '0', 'tipAmount is correct');
        assert.equal(event.author, author, 'author is correct');

        // FAILURE: Post must have content
        await socialNetwork.createPost('', { from: author }).should.be.rejected;
      })
      // it('lists all the posts', async() => {

      // })
      // it('allows users to tip posts', async() => {

      // })
    })
  })