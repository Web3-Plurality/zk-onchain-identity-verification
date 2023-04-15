import React, { useRef, useState } from 'react';
import '../bootstrap.css';
import { removeMemberFromGroup } from '../components/Web3Client';
import mortgage from '../images/mortgage.png';


const Revocation = () => {
  const [textAreaValue, setTextAreaValue] = useState('');

  const logoRef=useRef();

  let message = `Revoking user access from dapp that has identity commitment ${window.userIdentity.commitment} \n`;

  async function revokeAccess() {
    setTextAreaValue(message);
    removeMemberFromGroup(window.userIdentity.commitment).then(tx => {
      console.log(tx);
      setTextAreaValue(`Revocation Complete: User's access to dapp has been revoked. \nNow ask user to submit proof of membership again and check that access has been revoked.`);
    }).catch(err => {
      console.log(err);
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
          <h4>One of the verified users no longer satisfies the proof criteria? Use this page to revoke access</h4>
          <br/>
          <button onClick={revokeAccess} type="button" class="btn btn-primary me-md-2" data-bs-toggle="button" autocomplete="off">Revoke Access For User</button>
          <br/> <br/><br/>
          <div class="mb-3" id="textarea-readonly">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="12" value={textAreaValue} aria-label="Disabled input example" disabled readonly></textarea>
          </div>
        </div>
      );
}

export default Revocation;