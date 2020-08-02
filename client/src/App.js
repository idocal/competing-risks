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
    0.0038
  ],
  "hospital": [
    {
      "y": 0,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.3975,
      "x": 4,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.2972,
      "x": 3,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.5484,
      "x": 6,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.6738,
      "x": 8,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.093,
      "x": 1,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.4706,
      "x": 5,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.1913,
      "x": 2,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.7206,
      "x": 9,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8632,
      "x": 16,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8262,
      "x": 13,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.99,
      "x": 47,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.783,
      "x": 11,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.6191,
      "x": 7,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8966,
      "x": 20,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8043,
      "x": 12,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9486,
      "x": 32,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.7565,
      "x": 10,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.842,
      "x": 14,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.947,
      "x": 31,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9092,
      "x": 22,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8731,
      "x": 17,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.883,
      "x": 18,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9148,
      "x": 23,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.959,
      "x": 37,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9824,
      "x": 45,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9256,
      "x": 25,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.854,
      "x": 15,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9043,
      "x": 21,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9762,
      "x": 44,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 1,
      "x": 51,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9434,
      "x": 30,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.8895,
      "x": 19,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.921,
      "x": 24,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9696,
      "x": 42,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9382,
      "x": 28,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9638,
      "x": 39,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9406,
      "x": 29,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9314,
      "x": 26,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9542,
      "x": 34,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9614,
      "x": 38,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9346,
      "x": 27,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9568,
      "x": 36,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9648,
      "x": 40,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9936,
      "x": 48,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9664,
      "x": 41,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9697,
      "x": 43,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9498,
      "x": 33,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9545,
      "x": 35,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9936,
      "x": 49,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9824,
      "x": 46,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 0.9936,
      "x": 50,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    },
    {
      "y": 1,
      "PANEL": "1",
      "group": -1,
      "colour": "black",
      "size": 0.5,
      "linetype": 1
    }
  ],
  "hospital_quantiles": [
    2,
    3,
    6,
    10,
    21
  ],
  "severe": [
    17.4481
  ],
  "severe_quantiles": [
    3,
    7,
    15,
    26,
    36
  ]
}

const initialState = {
  isLoading: false,
  analysis : a
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
