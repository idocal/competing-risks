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

const medicalStates = {
    'Mild': 2,
    'Moderate': 3,
    'Severe': 4
}

const startMedicalStates = {
    'Mild/Moderate': 23,
    'Severe': 4,
    'Recovered / OOHQ': 16
}

const initialState = {
    age: 30,
    gender: 1,
    startState: {
        medicalState: startMedicalStates['Mild/Moderate'],
        hospital: 5
    },
    states: []
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
        setInfo({...info, states})
    }
    const setHospital = (days, i) => {
        let states = info.states
        states[i].hospital = days[0] | 0
        setInfo({...info, states})
    }
    const addState = () => {
        let newState = {
            medicalState: medicalStates['Mild'],
            hospital: 1
        }
        let states = [...info.states, newState]
        setInfo({ ...info, states })
    }

    return (
        <div className="center">
            <Container fluid className="main-content-container px-4">
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
                                                            range={{ min: 1, max: 100 }}
                                                            tooltips
                                                            step={1}
                                                            pips={{
                                                                mode: "positions",
                                                                values: [0, 24, 49, 75, 100],
                                                                stepped: true,
                                                                density: 5
                                                            }}
                                                            onChange={value => setAge(value)}
                                                        />
                                                    </Col>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feGender">Gender</label>
                                                        <FormSelect onChange={event => setGender(event.target.value)}
                                                            id="feGender" style={{ marginTop: '15px' }}>
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
                                                            <label htmlFor="feState">Start State</label>
                                                            <FormSelect onChange={event => setStartMedicalState(event.target.value)}
                                                                id="feState" style={{ marginTop: '15px' }}>
                                                                {
                                                                    Object.keys(startMedicalStates).map((s) => (
                                                                        <option key={s}>{s}</option>
                                                                    ))
                                                                }
                                                            </FormSelect>
                                                        </Row>
                                                    </Col>
                                                    <Col md="6" className="form-group">
                                                        <label htmlFor="feAge">Days in Hospital</label>
                                                        <Slider
                                                            className="age-slider"
                                                            connect={[true, false]}
                                                            start={[info.startState.hospital]}
                                                            range={{ min: 1, max: 100 }}
                                                            tooltips
                                                            step={1}
                                                            pips={{
                                                                mode: "positions",
                                                                values: [0, 24, 49, 75, 100],
                                                                stepped: true,
                                                                density: 5
                                                            }}
                                                            onChange={value => setStartHospital(value)}
                                                        />
                                                    </Col>
                                                </Row>

                                                {
                                                    info.states.map((s, key) => {
                                                        return (
                                                            <Row key={key} form>
                                                                <Col md="6" className="form-group">
                                                                    <Row form>
                                                                        <label htmlFor="feState">State {key + 1}</label>
                                                                        <FormSelect onChange={event => setMedicalState(event.target.value, key)}
                                                                            id="feState" style={{ marginTop: '15px' }}>
                                                                            {
                                                                                Object.keys(medicalStates).map((s) => (
                                                                                    <option key={s}>{s}</option>
                                                                                ))
                                                                            }
                                                                        </FormSelect>
                                                                    </Row>
                                                                </Col>
                                                                <Col md="6" className="form-group">
                                                                    <label htmlFor="feAge">Days in Hospital</label>
                                                                    <Slider
                                                                        className="age-slider"
                                                                        connect={[true, false]}
                                                                        start={[s.hospital]}
                                                                        range={{ min: 1, max: 100 }}
                                                                        tooltips
                                                                        step={1}
                                                                        pips={{
                                                                            mode: "positions",
                                                                            values: [0, 24, 49, 75, 100],
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
                    </Col>
                </Row>
            </Container>
        </div>


    )
}
