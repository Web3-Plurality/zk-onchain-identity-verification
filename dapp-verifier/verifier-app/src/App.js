import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import SemaphoreDemo from './pages/SemaphoreDemo';
import Verifier from './pages/Verifier';
import DApp from './pages/DApp';
import NoPage from './pages/NoPage';
import Revocation from './pages/Revocation';

import React, { useEffect } from 'react';
import {init} from './components/Web3Client';

function App() {
  useEffect(() => {
    init();
  }, []);
  
  return (
    <Router>
    {<Navbar />}
    <Routes>
        <Route exact path='/' exact element={<Verifier />} />
        <Route path='/verifier' element={<Verifier/>} />
        <Route path='/dapp' element={<DApp/>} />
        <Route path='/revocation' element={<Revocation/>} />
        <Route path='/semaphore' element={<SemaphoreDemo/>} />
        <Route path='*' element={<NoPage/>} />
    </Routes>
    </Router>
  );
}

export default App;