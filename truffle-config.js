
const mnemonic = "range drive remove bleak mule satisfy mandate east lion minimum unfold ready"; // your mnemonic here

const HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(mnemonic, "http://localhost:8545"),
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
