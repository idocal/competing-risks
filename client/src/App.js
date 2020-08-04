import React, { useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import PatientInformation from "./views/PatientInformation";
import Results from "./views/Results";
import config from "./config"

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/shards-dashboards.1.1.0.min.css";
import "./App.css";

const initialState = {
  isLoading: false,
  analysis : {}
}

const stateType = function(state) {
  let stateList = state.toString().split('')
  if (stateList.includes("3")) {
    return 3
  }
  else if (stateList.includes("4")){
    return 4
  }
  return 0
}

export default function() {
  console.log(config)
  const [appState, setAppState] = useState(initialState)
  async function getAnalysis({age, gender, startState, states}) {
    let start_state_type = stateType(startState.medicalState)
    setAppState({analysis: {}, isLoading: true})
    let url = config['API_HOST'] + "patient"
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({age, gender, start_state_type, start_state: startState.medicalState, states})
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
          <div className="center"><CircularProgress /></div> :
          screen(appState.analysis)
        }        
      </div>
  )
} 
