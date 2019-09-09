
const mnemonic = ""; // your mnemonic here

const HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(mnemonic, "https://web3.devnet.oasiscloud.io"),
      host: "127.0.0.1",
      port: 8546,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  },
  solc: {
    optimizer: {
      enabled: true
    }
  },
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || undefined
};
