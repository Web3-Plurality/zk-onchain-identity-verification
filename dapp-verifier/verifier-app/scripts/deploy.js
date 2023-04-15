async function main() {
    //setup variables
    const semaphore_verifier_address = "0x3d3df6CFc6BFf68d9693e097F32bF4a9903E77a5"; //sepolia address for semaphore verifier contract
    const incremental_binary_tree_address = "0x181B7f34538cE3BceC68597d4A212aB3f7881648"; //sepolia address for IncrementalBinaryTree library

    const [deployer] = await ethers.getSigners();

    console.log(
    "Deploying contracts with the account:",
    deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SemaphoreIdentity = await ethers.getContractFactory("SemaphoreIdentity", {
      libraries: {
        IncrementalBinaryTree : incremental_binary_tree_address 
      }
    });

    const contract = await SemaphoreIdentity.deploy(semaphore_verifier_address);

    console.log("Contract deployed at:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });