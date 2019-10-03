var uniswap_exchange = artifacts.require("./uniswap_exchange");
var uniswap_factory = artifacts.require("./uniswap_factory");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(uniswap_exchange, accounts[0]);
  deployer.deploy(uniswap_factory);
}
