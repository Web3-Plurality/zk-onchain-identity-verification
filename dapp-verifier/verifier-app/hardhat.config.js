/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// test account for development
const Private_Key = "eca174322b9147ab070f8145de6b66c5b508ec68b2d575ad131566c2fc929bc6"

module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
        url: `https://frosty-young-slug.ethereum-sepolia.discover.quiknode.pro/976585700ba4db38a305a56f8e3cdbcc01dbc116/`,
        accounts: [`0x${Private_Key}`]
    }
  }
};

