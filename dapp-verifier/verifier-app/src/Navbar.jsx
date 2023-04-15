import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Verifier</Link>
        </li>
        <li>
          <Link to="/verifier">Verifier</Link>
        </li>
        <li>
          <Link to="/dapp">DApp</Link>
        </li>
        <li>
          <Link to="/revocation">Revocation</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;