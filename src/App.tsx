import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import MuselabsNavbar from './components/MuselabsNavbar';
import PersonDetectionPanel from "./components/PersonDetectionPanel";
import SafetyHarnessPanel from './components/SafetyHarnessPanel';
import './styles.css'

function App() {

  return (
    <div className="App">
      <div className="outerContainer">
        <MuselabsNavbar />
        <div className="safetyPlatformInfoContainer">
          {/* <PersonDetectionPanel /> */}
          <SafetyHarnessPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
