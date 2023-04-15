import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
//import { Nav, NavLink, NavMenu } from "./components/NavbarElements";
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity";


window.group = new Group(0);
window.groupId = 0;
window.userIdentity = new Identity();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // disabling the strict mode to ensure that useEffect runs only once
  //https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
