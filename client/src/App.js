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

const a = {
  "death_prob": [
    0.0036
  ],
  "hospital": {
    "x": [
      "-Inf",
      1,
      6,
      13,
      12,
      10,
      7,
      47,
      9,
      24,
      2,
      5,
      11,
      3,
      4,
      45,
      48,
      18,
      14,
      8,
      51,
      15,
      21,
      17,
      34,
      20,
      31,
      29,
      38,
      16,
      22,
      23,
      25,
      37,
      30,
      27,
      19,
      26,
      36,
      32,
      39,
      44,
      40,
      41,
      28,
      42,
      33,
      35,
      43,
      46,
      "Inf"
    ],
    "y": [
      0,
      0.0984,
      0.5458,
      0.8256,
      0.7988,
      0.7502,
      0.6144,
      0.9894,
      0.7154,
      0.9192,
      0.1994,
      0.4694,
      0.7788,
      0.2952,
      0.394,
      0.9804,
      0.993,
      0.8838,
      0.8416,
      0.6689,
      1,
      0.8526,
      0.9049,
      0.8737,
      0.951,
      0.8977,
      0.9442,
      0.9378,
      0.958,
      0.8636,
      0.9099,
      0.9148,
      0.9236,
      0.9564,
      0.9407,
      0.9314,
      0.8896,
      0.9284,
      0.9538,
      0.9461,
      0.9606,
      0.9738,
      0.9618,
      0.9634,
      0.9351,
      0.9676,
      0.9472,
      0.9512,
      0.9678,
      0.9806,
      1
    ]
  },
  "hospital_quantiles": [
    2,
    3,
    6,
    10,
    21
  ],
  "severe": [
    17.5225
  ],
  "severe_quantiles": [
    3,
    7,
    15,
    26,
    38
  ]
}

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
  const [appState, setAppState] = useState(initialState)
  async function getAnalysis({age, gender, startState, states}) {
    let start_state_type = stateType(startState.medicalState)
    console.log('analyzing', {age, gender, startState, states, start_state_type})
    setAppState({analysis: {}, isLoading: true})
    const response = await fetch("/patient", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({age, gender, start_state_type, start_state: startState.medicalState, states})
    });
    const content = await response.json();
    console.log(content)
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
