import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Form,
    FormSelect,
    Button,
    Slider
} from "shards-react";

const genders = {
    'Male': 1,
    'Female': 2
}

const startMedicalStates = {
    'Moderate': 2,
    'Severe': 3,
    'Critical': 4
}

const medicalStates = {
    'Moderate / Severe': 23,
    'Critical': 4,
    'Discharged': 16
}

const initialState = {
    age: 30,
    gender: 1,
    startState: {
        medicalState: startMedicalStates['Moderate'],
        hospital: 0
    },
    states: [],
    possibleStates: []
}

const possibleStateTransition = state => {
    // Transition from Mild/Moderate
    if (state === 2 || state === 3 || state === 23) {
        return ['Critical', 'Discharged']
    }
    // Transition from Severe
    if (state === 4) {
        return ['Moderate / Severe']
    }
    // Transition from OOHQ
    if (state === 16) {
        return ['Moderate / Severe']
    }
}

export default function PatientInformation({ getAnalysis }) {
    const [info, setInfo] = useState(initialState)
    const setAge = age => {
        setInfo({ ...info, age: age[0] | 0 })
    }
    const setGender = gender => {
        setInfo({ ...info, gender: genders[gender] })
    }
    const setStartMedicalState = s => {
        let startState = info.startState
        startState.medicalState = startMedicalStates[s]
        setInfo({ ...info, startState })
    }
    const setStartHospital = days => {
        let startState = info.startState
        startState.hospital = days[0] | 0
        setInfo({ ...info, startState })
    }
    const setMedicalState = (s, i) => {
        let states = info.states
        states[i].medicalState = medicalStates[s]
        setInfo({ ...info, states })
    }
    const setHospital = (days, i) => {
        let states = info.states
        states[i].hospital = days[0] | 0
        setInfo({ ...info, states })
    }
    const addState = () => {
        let currentStates = info.states.length
        let lastState = (currentStates) ? info.states[currentStates - 1] : info.startState
        lastState = lastState.medicalState
        let nextPossibleStates = possibleStateTransition(lastState)
        let possibleStates = [...info.possibleStates, nextPossibleStates]
        
        let startState = info.startState
        if (startState.hospital === 0) {
            startState.hospital = 1
        }

        let newState = {
            medicalState: medicalStates[nextPossibleStates[0]],
            hospital: 1
        }
        let states = [...info.states, newState]
        setInfo({ ...info, startState, states, possibleStates })
    }

    return (
        <div className="center">

            <Container fluid className="main-content-container px-4">
                <Row>
                    <Col lg={{ size: 8, offset: 2 }} className="mb-4">
                        <h4 className="text-center">Online Risk and Length-of-Stay Calculator for Hospitalized COVID-19 Patients</h4>
                        <h5 className="text-center">Based on <a href="#">Multi State Competing Risk</a></h5>
                        <h6 className="text-center">by Name 1, Name 2, Name 3, Name 4, Name 5, Name 6, Name 7, Name 8, Name 9</h6>
                    </Col>
                </Row>
                <Row>
                    <Col lg={{ size: 8, offset: 2 }} className="mb-4">
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Patient Information</h6>
                            </CardHeader>
                            <ListGroup flush>
                                <ListGroupItem className="p-3">
                                    <Row>
                                        <Col>
                                            <Form>
                                                <Row form>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feAge">Age</label>
                                                        <Slider
                                                            theme="success"
                                                            className="age-slider"
                                                            connect={[true, false]}
                                                            start={[info.age]}
                                                            range={{ min: 18, max: 100 }}
                                                            tooltips
                                                            step={1}
                                                            pips={{
                                                                mode: "positions",
                                                                values: [3, 27, 51, 75],
                                                                stepped: true,
                                                                density: 5
                                                            }}
                                                            onChange={value => setAge(value)}
                                                        />
                                                    </Col>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feGender">Sex</label>
                                                        <FormSelect onChange={event => setGender(event.target.value)}
                                                            id="feGender" style={{ marginTop: '15px', width: '200px' }}>
                                                            {
                                                                Object.keys(genders).map((gender) => (
                                                                    <option key={gender}>{gender}</option>
                                                                ))
                                                            }
                                                        </FormSelect>
                                                    </Col>
                                                </Row>

                                                <Row form>
                                                    <Col md="6" className="form-group">
                                                        <Row form>
                                                            <label htmlFor="feState">Initial Clinical State</label>
                                                            <FormSelect disabled={info.states.length} onChange={event => setStartMedicalState(event.target.value)}
                                                                id="feState" style={{ marginTop: '15px', width: '200px' }}>
                                                                {
                                                                    Object.keys(startMedicalStates).map((s) => (
                                                                        <option key={s}>{s}</option>
                                                                    ))
                                                                }
                                                            </FormSelect>
                                                        </Row>
                                                    </Col>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feAge">Days in State</label>
                                                        <Slider
                                                            className="hospital-slider"
                                                            connect={[true, false]}
                                                            start={[info.startState.hospital]}
                                                            range={{ min: 0, max: 60 }}
                                                            tooltips
                                                            step={1}
                                                            pips={{
                                                                mode: "positions",
                                                                values: [0, 25, 50, 75, 100],
                                                                stepped: true,
                                                                density: 5
                                                            }}
                                                            onChange={value => setStartHospital(value)}
                                                        />
                                                    </Col>
                                                </Row>

                                                {
                                                    info.possibleStates.map((options, key) => {
                                                        return (
                                                            <Row key={key} form>
                                                                <Col md="6" className="form-group">
                                                                    <Row form>
                                                                        <label htmlFor="feState">Clinical State {key + 1}</label>
                                                                        <FormSelect disabled={key !== info.states.length - 1} onChange={event => setMedicalState(event.target.value, key)}
                                                                            id="feState" style={{ marginTop: '15px', width: '200px' }}>
                                                                            {
                                                                                Object.keys(options).map((option) => (
                                                                                    <option key={option}>{options[option]}</option>
                                                                                ))
                                                                            }
                                                                        </FormSelect>
                                                                    </Row>
                                                                </Col>
                                                                <Col md="6" className="form-group">
                                                                    <label htmlFor="feAge">Days in State</label>
                                                                    <Slider
                                                                        className="hospital-slider"
                                                                        connect={[true, false]}
                                                                        start={[info.states[key].hospital]}
                                                                        range={{ min: 1, max: 60 }}
                                                                        tooltips
                                                                        step={1}
                                                                        pips={{
                                                                            mode: "positions",
                                                                            values: [0, 25, 49, 75, 100],
                                                                            stepped: true,
                                                                            density: 5
                                                                        }}
                                                                        onChange={value => setHospital(value, key)}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })
                                                }

                                                <Row>
                                                    <Col>
                                                        <Button disabled={info.states.length >= 4} theme="secondary" onClick={() => { addState() }}>Add State</Button>
                                                        <Button style={{ marginLeft: '10px' }} onClick={() => { getAnalysis(info) }}>Analyze Patient</Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                        </Card>
                        <div className="footer">
                            <div style={{fontSize: '0.9rem'}}><span style={{color: "#c4183c", fontWeight: 700}}>NOTICE:</span> The calculator is based on Israeli patient data up to early May 2020. <br />The calculator will be updated as more recent data becomes available.</div>
                            <div style={{marginTop: '10px'}}>Website designed and developed by <a href="https://www.idocal.com" target="_blank" rel="noopener noreferrer">Ido Calman</a></div>
                            
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>


    )
}
