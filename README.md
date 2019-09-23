# Uniswap on Oasis 

Uniswap is a Decentralized Exchange (DEX) on the Ethereum platform. Here, it is configured to work on Oasis.

For information on Uniswap:
* Website: [uniswap.io/](https://uniswap.io/)
* Docs: [docs.uniswap.io/](https://docs.uniswap.io/)
* Twitter: [@UniswapExchange](https://twitter.com/UniswapExchange)
* Reddit: [/r/Uniswap/](https://www.reddit.com/r/UniSwap/)
* Email: [contact@uniswap.io](mailto:contact@uniswap.io)
* Slack: [uni-swap.slack.com/](https://join.slack.com/t/uni-swap/shared_invite/enQtNDYwMjg1ODc5ODA4LWEyYmU0OGU1ZGQ3NjE4YzhmNzcxMDAyM2ExNzNkZjZjZjcxYTkwNzU0MGE3M2JkNzMxOTA2MzE2ZWM0YWQwNjU)
* Whitepaper: [Link](https://hackmd.io/C-DvwDSfSxuh-Gd4WKE_ig)

## Compiling Uniswap Contracts

### Install Vyper

Clone the [vyper repository](https://github.com/ethereum/vyper). 
```bash 
git clone https://github.com/ethereum/vyper
cd vyper
```
To retrieve the version that the Uniswap contracts are compatible with, you should reset to a previous version. If you don't have the correct version, you may get compiler errors. 
```bash
git reset --hard 35038d20bd9946a35261c4c4fbcb27fe61e65f78
```

Vyper requires Python version 3.6 or higher. The best way to install vyper is to use `virtualenv` to create a python virtual environment:
```bash
which python3
virtualenv -p <PATH/TO/PYTHON3.6> my_project
source my_project/bin/activate
```
Then, run `make` in your `vyper` directory. You may need to use `sudo` if on mac:
```bash
sudo make
```
Vyper should be installed now and you should be able to compile contracts. The [Vyper Documentation](https://vyper.readthedocs.io/en/latest/installing-vyper.html) has more installation information.

Uniswap Vyper contracts can be found at [this repository](https://github.com/Uniswap/contracts-vyper). 
You can compile using the `vyper` command or using truffle. 

## Deploying Uniswap Contracts

### Deploy Using Truffle

If you choose to deploy using truffle, you'll need to create migrations contracts. 

The first are a `Migrations.sol` in your project's `./contracts` folder and `1_initial_migrations` in your project's `./migrations` folder, both of which can be automatically generated using `truffle init`. 

You also need a `2_deploy_contracts` which should look like this:
```js
var uniswap_exchange = artifacts.require("./uniswap_exchange"); //note there is no ".vy"
var uniswap_factory = artifacts.require("./uniswap_factory"); //note there is no ".vy"

module.exports = function(deployer, network, accounts) {
  deployer.deploy(uniswap_exchange, accounts[0]);
  deployer.deploy(uniswap_factory);
}
```
Use `truffle migrate` to deploy.

### Deploy Using Web3

First, connect to Web3 using a `truffle-hdwallet-provider`. You can run `oasis-chain` to start up a local network and retrieve your mnemonic and url. 

```js
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const URL = 'http://localhost:8545';
const provider = new HDWalletProvider(MNEMONIC, URL);
const web3 = new Web3(provider);
```

Using the contract ABI and bytecode from the compilation of your vyper contracts, instantiate new contract objects. Uniswap requires a **factory** contract to create new exchanges, and an **exchange** contract that serves as a template for each exchange.

```js
const factory_json = fs.readFileSync('./abi/uniswap_factory.json', 'utf8');
let factory_abi = JSON.parse(factory_json)["abi"];
let factory_bytecode = JSON.parse(factory_json)["bytecode"];


const exchange_json = fs.readFileSync('./abi/uniswap_exchange.json', 'utf8');
let exchange_abi = JSON.parse(exchange_json)["abi"];
let exchange_bytecode = JSON.parse(exchange_json)["bytecode"];

const exchange_contract = new web3.eth.Contract(exchange_abi);
const factory_contract = new web3.eth.Contract(factory_abi);
```

Finally, deploy your contracts and save their addresses for future use.

```js
exchange_contract.deploy({data: exchange_bytecode})
.send( { from: addresses[0] })
.on('error', function(err){ console.log("error: " + err)})
.then(function(newContractInstance){
    console.log("Deployed successfully. Uniswap exchange template address: " + newContractInstance.options.address);
    exchange_contract.options.address = newContractInstance.options.address;
});

factory_contract.deploy({data: factory_bytecode})
.send( { from: addresses[0] })
.on('error', function(err){ console.log("error: " + err)})
.then(function(newContractInstance){
    console.log("Deployed successfully. Uniswap factory address: " + newContractInstance.options.address);
    factory_contract.options.address = newContractInstance.options.address;
});
```
