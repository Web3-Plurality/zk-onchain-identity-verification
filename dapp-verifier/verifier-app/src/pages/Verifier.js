import React, { useEffect, useRef, useState } from 'react';
import '../bootstrap.css';
import { Identity } from "@semaphore-protocol/identity";
import { createGroup, addMemberToGroup } from '../components/Web3Client';
import QRCode from "qrcode";
import mortgage from '../images/mortgage.png';
import axios from 'axios'; 
import { encode } from "base-64";


const Verifier = () => {
  const [text, setText] = useState("");

  const canvasRef = useRef();
  const [textAreaValue, setTextAreaValue] = useState("Results");

  const logoRef=useRef();

  let partnerId;
  let connectionId;
  let identity;
  let identityCommitment;
  let message;
  const proofTemplateId = "ecfacbf5-c75b-4867-bcf6-9258ede36525";

  function generateQR() {

    axios.post('http://bpa.westeurope.cloudapp.azure.com:8080/api/invitations', {}, {
      auth: {
        username: 'admin',
        password: 'changeme'
      }
    }).then(response => {
        console.log(response);
        const invitationUrl = response.data.invitationUrl;
        console.log(invitationUrl);
        setText(invitationUrl);
        partnerId = response.data.partnerId;
        connectionId = response.data.connectionId;
        message = `Step 1/4 Started: Created connection invitation for the user.\n`;
        setTextAreaValue(message);
        
        // start looping
        waitForAcceptance();
    })
    .catch(error => {
      message = message + 'There was an error!'+ error + '\n'; 
      console.error(message);
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForAcceptance() {
    let status;
    const url = `http://bpa.westeurope.cloudapp.azure.com:8080/api/partners/${partnerId}`;
    console.log(`Wait for invitation acceptance url: ${url}`);
    while (status !== "response")
    {
      fetch(url, {
        method:'GET', 
        headers:{'Authorization': 'Basic ' + encode('admin:changeme')}})
      .then(response => response.json())
      .then(json => {
        console.log(json);
        status = json.state;
        console.log(status);
        if (status === "response")
        {
          console.log(`connection id is: ${connectionId}`);
          message = message + `Step 1/4 Complete: Connection Invitation has been accepted by user. \nStep 2/4 Started: Sending proof request to user.\n`; 
          setTextAreaValue(message);
          requestProofPresentation();
        }
      }); 
      await sleep(5000);
    }
  }

  function requestProofPresentation() {
    const url = `http://bpa.westeurope.cloudapp.azure.com:8080/api/partners/${partnerId}/proof-request/${proofTemplateId}`;
    console.log(`Request proof presentation url: ${url}`)
    axios.put(url, {}, {
      auth: {
        username: 'admin',
        password: 'changeme'
      }
    }).then(response => {
        console.log(response);
        message = message + `Step 2/4 Waiting: Proof Request Sent. Waiting for user's proof presentation.\n`; 
        setTextAreaValue(message);
        // start looping
        waitForProofPresentation();
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }

  async function waitForProofPresentation() {
    let status;
    let proofData;
    const url = `http://bpa.westeurope.cloudapp.azure.com:8080/api/partners/${partnerId}/proof-exchanges/${proofTemplateId}`;
    console.log(url);
    while (status !== "verified")
    {
      fetch(url, {
        method:'GET', 
        headers:{'Authorization': 'Basic ' + encode('admin:changeme')}})
      .then(response => response.json())
      .then(json => {
        console.log(json);
        status = json.state;
        console.log(status);
        if (status === "verified")
        {
          proofData = json.proofData;
          message = message + `Step 2/4 Complete: Proof Request Received and Verified. \n User's revealed proof data is: \n ${JSON.stringify(proofData)}\n Step 3/4 Started: Creating zero-knowledge identity for this user\n`; 
          setTextAreaValue(message);
          createUserIdentity();
        }
      }); 
      await sleep(5000);
    }
  }

  async function createUserIdentity() {
    identity = new Identity("pairwise-did");
    message = message + `Step 3/4 Complete: Your identity material has been generated against the seed "pairwise-did". Please copy the following material and keep it safe and private \n
    Trapdoor: ${identity.trapdoor} \n
    Nullifier: ${identity.nullifier} \n
    Commitment: ${identity.commitment} \n \n
    Step 4/4 Started: Adding generated identity to a group on smart contract in a privacy-preserving manner \n
    * Verifier creates a group on the semaphore zk smart contract \n
    * Verifier adds the public material of the generated identity to the group \n
    * After the above two steps, user will now be able to prove his group membership in zero-knowledge way \n`; 
    setTextAreaValue(message);
    identityCommitment = identity.commitment;
    window.userIdentity = identity;
    await sleep(5000);
    addZkProofToSemaphore();
  }

  async function addZkProofToSemaphore() {

    message = message + `Step 4/4 In Progress: Verifier is now creating the group\n`
    setTextAreaValue(message);
    console.log("Calling CreateGroup");

    createGroup().then(tx => {
      console.log(tx);
      message = message + `Group creation complete. Verifier is now adding member to group with commitment: ${identityCommitment} \n`
      setTextAreaValue(message);
      // add member to group
      addMemberToGroup(identityCommitment).then(tx => {
        console.log(tx);
        message = message + `Step 4/4 Complete: User added to group. \n User can now request the DApp for verification by submitting a zero knowledge proof of membership of a group\n` 
        setTextAreaValue(message);
      }).catch(err => {
        console.log(err);
        message = message + "An error occured while adding member to the group\n";
        setTextAreaValue(message);
      }); 
      
    }).catch(err => {
      console.log(err);
      message = message + "An error occured while creating a group\n";
      setTextAreaValue(message)
    });
  }

  useEffect(()=>{
    generateQR();
  }, []) // <-- empty dependency array, ensures that the function runs only once on load

  useEffect(() => {
    QRCode.toCanvas(
      canvasRef.current,
      // QR code doesn't work with an empty string
      // so we are using a blank space as a fallback
      text || " ",
      (error) => error && console.error(error),
      () => {
        // fix again the CSS because lib changes it –_–
        canvasRef.current.style.width = `400px`
        canvasRef.current.style.height = `400px`
      },
    );
  }, [text]);

    
    return (
        <div class="text-center">
          <br/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}}>
            <img src={mortgage} ref={logoRef} alt={"None"} style={{width: '50px', height: '50px' }} />
            <h1 class="display-6 text-center"> &nbsp; Verifier for Mortgage Loans DApp</h1>
          </div>
          <br/>
          <h4 class="text-center">Scan the QR code to connect to verifier and provide proof details</h4>
          <p>Proof Required: Information from Identity Card  </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}}>
            <canvas ref={canvasRef}  />
          </div>
          {/*<p>Connection Url: {text}</p>*/}
          
          <button onClick={generateQR} type="button" class="btn btn-primary me-md-2" data-bs-toggle="button">Generate New Proof Invitation</button>
          <br/> <br/>
          <textarea class="form-control" rows="12" value={textAreaValue} aria-label="Disabled input example" disabled readonly></textarea>
        </div>
      );
}

export default Verifier;