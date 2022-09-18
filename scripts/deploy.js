const hre = require("hardhat");

async function main() {
  try {
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();
    await token.deployed();
    console.log("MyToken deployed to:", token.address);
  } catch (error) {
    console.log(error);
  }  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });