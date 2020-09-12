import React, { useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import PatientInformation from "./views/PatientInformation";
import Results from "./views/Results";
import Welcome from "./views/Welcome";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/shards-dashboards.1.1.0.min.css";
import "./App.css";

const initialState = {
  isLoading: false,
  analysis : {},
  patient: {},
  welcome: true
}

export default function() {
  const [appState, setAppState] = useState(initialState)
  async function getAnalysis({age, gender, startState, states}) {
    let start_state_type = startState.medicalState
    setAppState({analysis: {}, isLoading: true, patient: {}})
    states = [startState, ...states]
    const response = await fetch("/patient", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({age, gender, start_state_type, states})
    });
    const content = await response.json();
    content.hospital.x = content.hospital.x.slice(0, content.hospital.x.length - 1)
    content.hospital.x[0] = 0
    content.hospital.y = content.hospital.y.slice(0, content.hospital.y.length - 1)
    setAppState({
      analysis: content,
      isLoading: false,
      patient: {age, gender, states}
    })
  }

  const reset =  function() {
    setAppState(initialState)
  }

  const start = function() {
    setAppState({...initialState, welcome: false})
  }

  const screen = function(analysis, welcome) {
    console.log('screen', analysis)
    if (welcome) {
      return (
        <Welcome start={start} />
      )
    } else {
      if (Object.keys(analysis).length) {
        return (
          <Results analysis={analysis} reset={reset} patient={appState.patient} />
        )
      } else {
        return (
          <PatientInformation getAnalysis={getAnalysis} />
        )
      }
    }
  }

  return (
      <div>
        {
          appState.isLoading ?
          <div className="center">
            <CircularProgress />
            <div className="loading-text" style={{marginTop: '15px'}}>
              Running Monte Carlo Simulations...
            </div>
            </div> :
          screen(appState.analysis, appState.welcome)
        }        
      </div>
  )
} 
