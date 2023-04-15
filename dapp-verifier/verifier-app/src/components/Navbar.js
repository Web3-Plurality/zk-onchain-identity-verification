import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          {/*<NavLink to="/" activeStyle>
            Zero Knowledge Semaphore Demo
  </NavLink>*/}
          <NavLink to="/verifier" activeStyle>
            Verifier
          </NavLink>
          <NavLink to="/dapp" activeStyle>
            DApp
          </NavLink>
          <NavLink to="/revocation" activeStyle>
            Revocation
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;