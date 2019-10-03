# Uniswap on Oasis 

[Uniswap](https://uniswap.io/) is a decentralized exchange (DEX) for ERC20 tokens built on Ethereum. Here, it is configured for deployment on Oasis. This tutorial's methods for deploying Solidity contracts using Truffle and Web3.js are applicable to any Ethereum contract written in Solidity. For contracts written in Vyper, see the Uniswap tutorial.

## Quickstart

If you have the Oasis Toolchain installed and just want to deploy right away:

1. Clone this repo.
2. Install dependencies with `npm install`.
3. Run a local oasis network with `oasis chain` in a separate terminal window.
4. Run `node deploy-uniswap` to deploy the contracts.

## Prerequisites

If you haven't already installed the Oasis Toolchain, these docs will help you do so. You can test your installation using oasis commands:

```bash
oasis --version
```

Using the Oasis Toolchain, you can create a local network (or "personal blockchain") very similar to the truffle develop command or Ganache. Run the following:

```bash
oasis chain
```

This command will spawn a local network with 10 accounts (private keys and public addresses) each funded with 100 DEV (Oasis' equivalent of ether). The output will look something like this:

```bash
2019-09-27 10:54:21,448 INFO  [oasis_chain] Starting Oasis local chain
Accounts (100 DEV each)
==================
(0) 0xb8b3666d8fea887d97ab54f571b8e5020c5c8b58
(1) 0xff8c7955506c8f6ae9df7efbc3a26cc9105e1797
(2) 0x0056b9346d9a64dcdd9d7be4ee3f5cf65940167d
(3) 0x4bbbf0653dab1e8abbe603fe3c4300032ff9224e
(4) 0xb99e5a84415e4bf715efd8a390344d7121015920
(5) 0xfa5c64dbcc09bdceaea11ca1f413c40031fa4412
(6) 0x17ef28e540a7cf63a8cbfd533cbbec530eac356f
(7) 0x223b7e8dda3afeb788259de0bc7bf157c8e18888
(8) 0x5e66f3176cb59205d4897509a11d117ed855502e
(9) 0x07b23940821ea777b9a26e3c8dc3027648236bbf
Private Keys
==================
(0) 0xb5144c6bda090723de712e52b92b4c758d78348ddce9aa80ca8ef51125bfb308
(1) 0x7ec6102f6a2786c03b3daf6ac4772491f33925902326a0d2d83521b964a87402
(2) 0x069f89ed3070c73586672b4d64f08dcc0f91d65dbdd201b27d5949a437035e4a
(3) 0x142b968d9b046c5545ed5d0c97c2f4b89c0ed78e19ec600d2ea8c703231d13f4
(4) 0x1a8722ce2d1f296e73a8a0de6ffecea349197188feb32e949f95f0f5d404db5d
(5) 0xf47bf050ec19b8573b32fda50436526e8c3f5b1c7f260bbdb55d4ca39585d78d
(6) 0x2424da82ad906f131674f05f207af85e7f6046fd9e0b6a4d4f37414c4933ab09
(7) 0x133e548822a035a5db2a43a091146db96f10a5c680d2114145493b921df1b19e
(8) 0xb67377abfa1a229ba56826661736ceca99d2b0be055e84498c7b0847431e4d9d
(9) 0xa08930847a93d725a62f6866afac2642eaebb4d0410610822833b0474871b7b8
HD Wallet
==================
Mnemonic:      range drive remove bleak mule satisfy mandate east lion minimum unfold ready
Base HD Path:  m/44'/60'/0'/0/{account_index}
2019-09-27 10:54:21,491 INFO  [ws] Listening for new connections on 127.0.0.1:8546.
2019-09-27 10:54:21,492 INFO  [oasis_chain] Oasis local chain is running
```

Save the Mnemonic; you will need it later. 

Note that the port :8546 corresponds to ws. You will need to use the port :8545 for http connections. 
You might also want to save one of the public addresses to serve as your account to deploy contracts with. For example you can copy-paste an account like so:

```js
my_address = '0xb8b3666d8fea887d97ab54f571b8e5020c5c8b58'
```

## Compiling the Contracts

### Install Vyper

Clone the [Vyper repository](https://github.com/ethereum/vyper). 
```bash 
git clone https://github.com/ethereum/vyper
cd vyper
```
To retrieve the version that the Uniswap contracts are compatible with, you should reset to a previous version. If you don't have the correct version, you may get compiler errors. 
```bash
git reset --hard 35038d20bd9946a35261c4c4fbcb27fe61e65f78
```

Vyper requires Python version 3.6 or higher. The best way to install vyper is to use `virtualenv` to create a python virtual environment:

First make sure you have Python 3.6 installed, then get your path to python 3.
```bash
which python3
```
Start a virtualenv.
```
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

## Deploying the Contracts

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
factory_json = fs.readFileSync('./path/to/file.json', 'utf8');
factory_abi = JSON.parse(factory_json)["abi"];
factory_bytecode = JSON.parse(factory_json)["bytecode"];
exchange_json = fs.readFileSync('./path/to/file.json', 'utf8');
exchange_abi = JSON.parse(exchange_json)["abi"];
exchange_bytecode = JSON.parse(exchange_json)["bytecode"];
```

Initialize your contract objects.

```js
factory_contract = new web3.eth.Contract(factory_abi);
exchange_contract = new web3.eth.Contract(exchange_abi);
```

Finally, deploy your contracts and save their addresses for future use.

```js
factory_contract.deploy({data:factory_bytecode})
.send( { from: my_address }) 
.on('error', function(err){ console.log("error: " + err)})
.then(function(newContractInstance){
    console.log("Factory Deployed successfully:" + newContractInstance.options.address);
    factory_contract.options.address = newContractInstance.options.address;
});
exchange_contract.deploy({data:exchange_bytecode})
.send( { from: my_address }) 
.on('error', function(err){ console.log("error: " + err)})
.then(function(newContractInstance){
    console.log("Exchange Deployed successfully:" + newContractInstance.options.address);
    exchange_contract.options.address = newContractInstance.options.address;
});
```

The HD Wallet Provider may continue running and cause execution to "hang" at the end. To gracefully exit, use the stop function:

```js
provider.engine.stop();
```

## Testing the Deployment

Once you've deployed your contracts, you can interact with them! Try initializing the factory by giving it a template (the exchange contract address). Make sure to do all of this before you call the stop function.

Assuming you have your factory and exchange contracts already deployed, fill these in with their corresponding addresses:

```js
factory_address = '0x...'; 
exchange_address = '0x...';
factory_contract = new web3.eth.Contract(factory_abi, factory_address);
exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);
```

To initialize the factory:

```js
factory_contract.methods.initializeFactory(exchange_address).send( {from: my_address}).then( () => {
    factory_contract.methods.exchangeTemplate().call((err, result) => {
      console.log("\n\nSuccessfully initialized Uniswap factory with template: " + result)
    });
  }).catch(console.log);
```

You can also create a new exchange for the ERC20 token of your choice. All you need is the address to the token contract.

```js
token_address = '0x...';
factory_contract.methods.createExchange(token_address).send( {from: my_address}).then(() => {
    factory_contract.methods.getExchange( token_contract.options.address).call((err, result) => {
      console.log("Successfully created a new exchange for token at " + result);
    });
  })
```

Now you can deploy and interact with any Vyper contract on the Oasis platform!

