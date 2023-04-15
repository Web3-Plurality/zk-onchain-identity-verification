import React, { useState } from 'react';
import '../bootstrap.css';
import { Identity } from "@semaphore-protocol/identity";
import { createGroup, addMemberToGroup, verifyMemberIsPartOfGroup, removeMemberFromGroup } from '../components/Web3Client';


let identityCommitment;
let identity;
let verifyRequestDappTx;
const SemaphoreDemo = () => {
  const [isGenerateIdMaterialDisabled, setGenerateIdMaterialDisabled] = useState(false);
  const [isAddZkProofToSemaphoreDisabled, setAddZkProofToSemaphoreDisabled] = useState(true);
  const [isVerifyRequestDAppDisabled, setVerifyRequestDAppDisabled] = useState(true);
  const [isCheckVerificationStatusDisabled, setCheckVerificationStatusDisabled] = useState(true);
  const [isRemoveMemberFromGroupDisabled, setRemoveMemberFromGroupDisabled] = useState(true);
  const [textAreaValue, setTextAreaValue] = useState('Step 1/4: Generate Identity Material by clicking on the button!');

  function generateIdMaterial() {
    alert('User is generating the identity material');
    identity = new Identity("pairwise-did");
    setGenerateIdMaterialDisabled(true);
    setAddZkProofToSemaphoreDisabled(false);
    setTextAreaValue(`Your identity material has been generated against the seed "pairwise-did". Please copy the following material and keep it safe and private \n
    Trapdoor: ${identity.trapdoor} \n
    Nullifier: ${identity.nullifier} \n
    Commitment: ${identity.commitment} \n \n
    Step 2/4: Adding generated identity to a group on smart contract in a privacy-preserving manner \n
    * Verifier creates a group on the semaphore zk smart contract \n
    * Verifier adds the public material of the generated identity to the group \n
    * After the above two steps, user will now be able to prove his group membership in zero-knowledge way `);
    identityCommitment = identity.commitment;
  }
  
  async function addZkProofToSemaphore() {
    alert('Verifier is adding member to the group by sending ZK-Proof to Semaphore!');
    let message = `Verifier created the group\n`
    createGroup().then(tx => {
      console.log(tx);
      setTextAreaValue(message);
    }).catch(err => {
      console.log(err);
      message = "An error occured while creating a group\n";
      setTextAreaValue(message)
    });    

    message = message + `Verifier added member to group with commitment: ${identityCommitment} \n`
    // add member to group
    addMemberToGroup(identityCommitment).then(tx => {
      console.log(tx);
      setTextAreaValue(message);
    }).catch(err => {
      console.log(err);
      message = "An error occured while adding member to the group\n";
      setTextAreaValue(message);
    }); 

    setAddZkProofToSemaphoreDisabled(true);
    setVerifyRequestDAppDisabled(false);
    message = message + `\nStep 3/4: User can now request the DApp for verification by submitting a zero knowledge proof of membership of a group\n` 
    setTextAreaValue(message);
  }
  
  async function verifyRequestDApp() {
    alert('User is requesting the DApp for Verification!');
    setVerifyRequestDAppDisabled(true);
    setCheckVerificationStatusDisabled(false);

    // generate proof
    let message = `User has created zero-knowledge proof of membership and sent to dapp for verification\n`

    verifyMemberIsPartOfGroup(identity).then(tx => {
      setTextAreaValue(message);
      console.log(tx);
      console.log(tx.events.ProofVerified);
      verifyRequestDappTx = tx;
      setTextAreaValue(`Step 4/4: Check Verification Status at DApp Contract Explanation`);

    }).catch(err => {
      console.log(err);
      verifyRequestDappTx = err;
    }); 

  }
  
  function checkVerificationStatus() {
    alert('Check Verification Status at DApp Contract!');
    setCheckVerificationStatusDisabled(true);
    setRemoveMemberFromGroupDisabled(false);
    console.log(verifyRequestDappTx)
    try {
      if (verifyRequestDappTx.events.ProofVerified)
        setTextAreaValue('Verification done. User is a part of the specified group. \n');
    }
    catch(err) {
      setTextAreaValue('Verification done. User is NOT part of the specified group. \n');
    }
  }
  
  async function removeMemberFromSmartContract() {
    alert('Revoking user access from dapp!');
    setVerifyRequestDAppDisabled(false);

    removeMemberFromGroup(identityCommitment).then(tx => {
      console.log(tx);
      setTextAreaValue(`Revocation Step: User's access to dapp has been revoked. Now submit proof of membership again and check that access has been revoked.`);

    }).catch(err => {
      console.log(err);
    }); 

  }
  return (
    
    <div>
      <div>
        <h1 class="display-4 text-center">Zero Knowledge based Identity Verification Layer Demo </h1>
      </div>
      <div class="text-center">
        <button onClick={generateIdMaterial} type="button" class="btn btn-primary me-md-2" disabled={isGenerateIdMaterialDisabled} data-bs-toggle="button" autocomplete="off" aria-pressed="true">Generate Identity Material</button>
        <button onClick={addZkProofToSemaphore} type="button" class="btn btn-primary me-md-2" disabled={isAddZkProofToSemaphoreDisabled} data-bs-toggle="button" autocomplete="off">Verifier Adds User-ZK-Proof to Blockchain</button>
        <button onClick={verifyRequestDApp} type="button" class="btn btn-primary me-md-2" disabled={isVerifyRequestDAppDisabled} data-bs-toggle="button" autocomplete="off">User Requests the DApp for membership verification</button>
        <button onClick={checkVerificationStatus} type="button" class="btn btn-primary me-md-2" disabled={isCheckVerificationStatusDisabled} data-bs-toggle="button" autocomplete="off">Check Verification Status at DApp Contract</button>
      </div>
      <div class="text-center">
        <button onClick={removeMemberFromSmartContract} type="button" class="btn btn-primary me-md-2" disabled={isRemoveMemberFromGroupDisabled} data-bs-toggle="button" autocomplete="off">Revoke User Access From Group</button>
      </div>
      <div class="mb-3" id="textarea-readonly">
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="12" value={textAreaValue} aria-label="Disabled input example" disabled readonly></textarea>
      </div>
    </div>
  );
};

export default SemaphoreDemo;