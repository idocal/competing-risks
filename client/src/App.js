import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

import routes from "./routes";
import withTracker from "./withTracker";
import PatientInformation from "./views/PatientInformation";
import Results from "./views/Results";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./App.css";

const initialState = {
  isLoading: false,
  analysis : {}
}

export default function() {
  const [appState, setAppState] = useState(initialState)
  async function getAnalysis({age, gender}) {
    setAppState({analysis: {}, isLoading: true})
    const response = await fetch("/patient", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({age, gender, start_state_type: 3, start_state: 23})
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
