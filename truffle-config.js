module.exports = {
  contracts_build_directory: './client/src/artifacts',
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
  },
  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
    }
  },

  db: {
    enabled: false
  }
};


// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const mnemonic =
//
// module.exports = {
//   networks: {
//     goerli: {
//       provider: function() {
//         return new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/your_infura_project_id")
//       },
//       network_id: 5, // Goerli network id
//       gas: 6000000, // Gas limit
//       gasPrice: 10000000000 // Gas price (10 gwei)
//     }
//   }
// };
