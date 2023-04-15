import React, { useRef, useState } from 'react';
import '../bootstrap.css';
import { verifyMemberIsPartOfGroup } from '../components/Web3Client';
import verifiedImg from '../images/verified.png';
import unverifiedImg from '../images/unverified.png';
import mortgage from '../images/mortgage.png';
import pending from '../images/pending.png';

let verifyRequestDappTx;

const DApp = () => {
  const [textAreaValue, setTextAreaValue] = useState('');

  const imageRef=useRef();

  const logoRef=useRef();

  let message = `Verification Started: User provide zk-proof to the DApp for membership verification with identity commitment ${window.userIdentity.commitment}\n`;

  async function verifyRequestDApp() {
    setTextAreaValue(message);

    verifyMemberIsPartOfGroup(window.userIdentity).then(tx => {
      console.log(tx);
      console.log(tx.events.ProofVerified);
      verifyRequestDappTx = tx;
      message = message + `Verification In Progress: Your zero knowledge proof is being checked against the contract.\n`; 
      setTextAreaValue(message);
      try {
        if (verifyRequestDappTx.events.ProofVerified)
        {
          message = message + 'Verification Complete. Access GRANTED. Your proof was valid. \n'; 
          setTextAreaValue(message);
          imageRef.current.src=verifiedImg;
        }
        else {
          message = message + 'Verification Complete. Access DENIED. You are not a part of valid participants \n' 
          setTextAreaValue(message);
          imageRef.current.src=unverifiedImg;
        }
      }
      catch(err) {
        message = message + 'Verification Complete. Access DENIED. You are not a part of valid participants \n' 
        setTextAreaValue(message);
        imageRef.current.src=unverifiedImg;
      }
    }).catch(err => {
      console.log(err);
      verifyRequestDappTx = err;
      message = message + `Your zero knowledge proof is invalid. Access DENIED`; 
      setTextAreaValue(message);
      imageRef.current.src=unverifiedImg;
    });
  }


    return (
        <div class="text-center">
          <br/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}}>
            <img src={mortgage} ref={logoRef} alt={"None"} style={{width: '50px', height: '50px' }} />
            <h1 class="display-6 text-center">&nbsp; Mortgage Loans DApp</h1>
          </div>
          <br />
          <h4>Already verified yourself through our verifier? Please provide zero knowledge proof of verification</h4>
          <br/>
          <button onClick={verifyRequestDApp} type="button" class="btn btn-primary me-md-2" data-bs-toggle="button" autocomplete="off">Provide ZK-Proof to DApp for Access</button>
          <br/> <br/><br/>

          <img ref={imageRef} src={pending} alt={"None"} style={{width: '200px', height: '200px'}} />

          <div class="mb-3" id="textarea-readonly">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="12" value={textAreaValue} aria-label="Disabled input example" disabled readonly></textarea>
          </div>
        </div>
      );
}

export default DApp;