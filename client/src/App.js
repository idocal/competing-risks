import React, { useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import PatientInformation from "./views/PatientInformation";
import Results from "./views/Results";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/shards-dashboards.1.1.0.min.css";
import "./App.css";

const initialState = {
  isLoading: false,
  analysis : {}
}

const stateType = function(state) {
  if (state === 2 || state === 3) {
    return 23
  }
  return state
}

export default function() {
  const [appState, setAppState] = useState(initialState)
  async function getAnalysis({age, gender, startState, states}) {
    let start_state_type = startState.medicalState
    let start_state = stateType(startState.medicalState)
    setAppState({analysis: {}, isLoading: true})
    const response = await fetch("/patient", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({age, gender, start_state_type, start_state, states})
    });
    const content = await response.json();
    setAppState({
      analysis: content,
      isLoading: false
    })
  }

  const screen = function(analysis) {
    if (Object.keys(analysis).length) {
      return (
        <Results analysis={analysis} />
      )
    } else {
      return (
        <PatientInformation getAnalysis={getAnalysis} />
      )
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
          screen(appState.analysis)
        }        
      </div>
  )
} 
