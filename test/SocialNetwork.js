const { assert } = require("chai");
const { FormControlStatic } = require("react-bootstrap");
const Web3 = require("web3");

const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    it("has a name", async () => {
      const name = await socialNetwork.name();
      assert.deepEqual(name, "Dapp University Social Network");
    });
  });

  describe("posts", async () => {
    let result, postCount;
    before(async () => {
      result = await socialNetwork.createPost("hello!", { from: author });
      postCount = await socialNetwork.postCount();
    });
    it("creates posts", async () => {
      // SUCCESS
      assert.equal(postCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.content, "hello!", "content is correct");
      assert.equal(event.tipAmount, "0", "tipAmount is correct");
      assert.equal(event.author, author, "author is correct");

      // FAILURE: Post must have content
      await socialNetwork.createPost("", { from: author }).should.be.rejected;
    });
    it("lists all the posts", async () => {
      const post = await socialNetwork.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(post.content, "hello!", "content is correct");
      assert.equal(post.tipAmount, "0", "tipAmount is correct");
      assert.equal(post.author, author, "author is correct");
    });
    it("allows users to tip posts", async () => {
      // Track the author's balance before tipping
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new Web3.utils.BN(oldAuthorBalance);

      let tipAmount;
      tipAmount = Web3.utils.toWei("1", "Ether");

      result = await socialNetwork.tipPost(postCount, {
        from: tipper,
        value: tipAmount,
      });

      // SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.content, "hello!", "content is correct");
      assert.equal(event.tipAmount, tipAmount, "tipAmount is correct");
      assert.equal(event.author, author, "author is correct");

      // Check that author received the funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new Web3.utils.BN(newAuthorBalance);

      tipAmount = new Web3.utils.BN(tipAmount);
      const expectedBalance = oldAuthorBalance.add(tipAmount);

      assert.equal(
        newAuthorBalance.toString(),
        expectedBalance.toString(),
        "author balance is correct"
      );

      // FAILURE: Tries to tip a post that does not exist
      await socialNetwork.tipPost(99, {
        from: tipper,
        value: Web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
