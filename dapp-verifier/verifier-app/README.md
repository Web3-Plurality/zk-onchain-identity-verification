<p align="center">
    <h1 align="center">
      <picture>
        <img width="40" alt="Plurality icon." src="https://github.com/Web3-Plurality/zk-identity-verification/blob/main/src/images/plurality.png">
      </picture>
      Plurality
    </h1>
</p>

| Plurality is the first identity-lego-building-block for dapp creators that lets them identify their users without using any third-party KYC provider or other middlemen. It encourages modular application design, allowing dApp developers to choose and customize the on-chain and off-chain components they need. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

Plurality supercharges DApps by helping them to:

1. Setup a verification mechanism tied to off-chain credentials in a few clicks
2. Use ZK-Proofs to prove on-chain that a user has been verified
3. Verify Personal Identifiable Information of user off-chain and never publish any sensitive information on chain - not even the blockchain address!

## Adding zero knowledge verification proofs on chain after verifying through Verifiable Credentials (VCs)

A demo to demonstrate how a user can use off-chain W3C verifiable credentials to prove its identity to a DApp's verifier.

The DApp in this case is a mortgage lending platform that needs to check the identity of its users before allowing them access to lending resources. The DApp sets up a verifier and requests users to provide proof of valid german identity card. After verification, the verifier pushes zero knowledge proof of identification on chain so that the DApp can allow/disallow the user from accessing its services on-chain.

TODO: Add a picture here
![alt text](https://github.com/Web3-Plurality/zk-identity-verification/blob/main/src/images/workflow.png)

To run this demo, you need:

- an SSI wallet ([android](https://play.google.com/store/apps/details?id=com.esatus.wallet&hl=de&pli=1), [apple](https://apps.apple.com/de/app/esatus-wallet/id1496769057))
- the wallet needs to be on the Bcovrin Test Ledger (you can change the ledger from settings)
- the wallet needs to have an identity card issued to it by [issuer](http://bpa.westeurope.cloudapp.azure.com/)

The application has two pages: Verifier and Dapp

The Verifier:

- Asks the user to connect using QR code scanning by mobile wallet
- Asks the user to present proof using the credentials in his/her mobile wallet
- Verifies the credentials to check if proof requirements are satisfied
- Create a new identity for this user correlated with this user's Decentralized Identifier (DID)
- Adds this user's identity to the SemaphoreIdentity contract to the appropriate group
- Can revoke this user's access at a later point in time too

The DApp:

- Asks the user to create a zero knowledge proof that he/she is already verified on the SemaphoreIdentity contract
- Grants access if the user's zero knowledge proof is correct.

The demo video for this can be found here: TODO: Add link
The deployed SemaphoreIdentity contract can be found here: 0x6E4380d5DC97a396441B4F6b5e7b1F1ad3AfD048

The discussion thread on ethereum magicians forum for this idea can be found here:
https://ethereum-magicians.org/t/eliminating-the-middleman-from-kyc-verification-of-blockchain-addresses/13671

## Steps to run the demo

Clone the repository

```
git clone TODO: Add link
```

First time from root folder, install the npm dependencies:

```
npm install
```

To run the website:

```
npm start
```

## Extra Dev Steps

To compile the smart contract:

```
npx hardhat compile
```

To deploy the smart contract:

```
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment of an updated smart contract, you need to update in .env file the address of REACT_APP_SEMAPHORE_IDENTITY_CONTRACT
