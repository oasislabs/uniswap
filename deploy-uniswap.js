const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const URL = 'http://localhost:8545';
const provider = new HDWalletProvider(MNEMONIC, URL);
const web3 = new Web3(provider);
const fs = require('fs');

my_address = '0xb8b3666d8fea887d97ab54f571b8e5020c5c8b58'

factory_json = fs.readFileSync('./abi/uniswap_factory.json', 'utf8');
factory_abi = JSON.parse(factory_json)["abi"];
factory_bytecode = JSON.parse(factory_json)["bytecode"];
exchange_json = fs.readFileSync('./abi/uniswap_exchange.json', 'utf8');
exchange_abi = JSON.parse(exchange_json)["abi"];
exchange_bytecode = JSON.parse(exchange_json)["bytecode"];

factory_contract = new web3.eth.Contract(factory_abi);
exchange_contract = new web3.eth.Contract(exchange_abi);

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



provider.engine.stop();
