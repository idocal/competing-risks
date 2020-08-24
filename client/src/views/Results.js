import React from "react";
import {
    Container,
    Row,
    Button,
    Col,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem
} from "shards-react";

import SmallStats from "./../components/common/SmallStats";
import Graph from "./Graph";

const quantiles = ["10%", "25%", "50% (median)", "75%", "90%"]

const genders = {
    1: 'Male',
    2: 'Female'
}

const medicalStates = {
    2: 'Moderate',
    3: 'Severe',
    4: 'Critical',
    23: 'Moderate / Severe',
    16: 'Recovered / OOHQ'
}

const formatStates = function (states) {
    const stateTypes = states.map(s => {
        return medicalStates[s.medicalState] + " (" + s.hospital + ")"
    })
    return stateTypes.join(" -> ")
}

export default function Results({ analysis, reset, patient }) {

    const smallStats = [
        {
            label: "In-hospital Mortality Probability",
            value: (parseFloat(analysis.death_prob) * 100).toFixed(2) + "%",
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: analysis.severe_quantiles
                }
            ]
        },
        {
            label: "Entering Critical Condition Probability",
            value: (parseFloat(analysis.severe) * 100).toFixed(2) + "%",
            chartLabels: [null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: analysis.hospital_quantiles
                }
            ]
        }
    ]

    return (
        <Container fluid className="main-content-container px-4" style={{ marginTop: '15px' }}>
            <Row>
                <Col lg={{ size: 8, offset: 2 }} className="mb-4">
                    <h4 className="text-center">Online Risk and Length-of-Stay Calculator for Hospitalized Patients</h4>
                    <h5 className="text-center">Based on <a href="#">Multi State Competing Risk</a></h5>
                    <h6 className="text-center">by Name 1, Name 2, Name 3, Name 4, Name 5, Name 6, Name 7, Name 8, Name 9</h6>
                </Col>
            </Row>
            <Row>
                <Col className="col-lg mb-4">
                    <Card small>
                        <CardHeader className="border-bottom">
                            <div className="d-flex" style={{ alignItems: 'center' }}>
                                <h6 className="m-0">Patient Information</h6>
                                <Button className="ml-auto text-right" theme="danger" onClick={() => { reset() }}>Reset</Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="d-flex">
                                <span className="info-subtitle">Age:</span> {patient.age}
                                <span className="info-subtitle" style={{ marginLeft: '10px' }}>Sex:</span> {genders[patient.gender]}
                            </div>
                            <div className="d-flex">
                                <span className="info-subtitle">States:</span> {formatStates([patient.startState, ...patient.states])}
                            </div>



                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                {smallStats.map((stats, idx) => (
                    <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                        <SmallStats
                            id={`small-stats-${idx}`}
                            variation="1"
                            chartData={stats.datasets}
                            chartLabels={stats.chartLabels}
                            label={stats.label}
                            value={stats.value}
                            percentage={stats.percentage}
                            increase={stats.increase}
                            decrease={stats.decrease}
                        />
                    </Col>
                ))}
            </Row>
            <Row>
                <Col className="col-lg mb-4">
                    <Card small>
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Length of Hospital Stay</h6>
                            <h6 className="m-0 subtitle">&nbsp;</h6>
                            <div className="block-handle" />
                        </CardHeader>

                        <CardBody className="p-0">
                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-fiord-blue" style={{ fontWeight: 700 }}>Quantile</span>
                                    <span className="ml-auto text-right text-fiord-blue" style={{ fontWeight: 700 }}>Days</span>
                                </ListGroupItem>
                                {analysis.hospital_quantiles.map((item, idx) => (
                                    <ListGroupItem key={idx} className="d-flex px-3">
                                        <span className="text-semibold text-fiord-blue">{quantiles[idx]}</span>
                                        <span className="ml-auto text-right text-semibold text-reagent-gray">
                                            {item}
                                        </span>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
                <Col className="col-lg mb-4">
                    <Card small>
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Length of Stay in Critical Condition</h6>
                            <h6 className="m-0 subtitle">Conditioned on Entering Critical State</h6>
                            <div className="block-handle" />
                        </CardHeader>

                        <CardBody className="p-0">
                            <ListGroup small flush className="list-group-small">
                                <ListGroupItem className="d-flex px-3">
                                    <span className="text-fiord-blue" style={{ fontWeight: 700 }}>Quantile</span>
                                    <span className="ml-auto text-right text-fiord-blue" style={{ fontWeight: 700 }}>Days</span>
                                </ListGroupItem>
                                {analysis.severe_quantiles.map((item, idx) => (
                                    <ListGroupItem key={idx} className="d-flex px-3">
                                        <span className="text-semibold text-fiord-blue">{quantiles[idx]}</span>
                                        <span className="ml-auto text-right text-semibold text-reagent-gray">
                                            {item}
                                        </span>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className="col-lg mb-4">
                    <Graph x={analysis.hospital.x} y={analysis.hospital.y} />
                </Col>
            </Row>
        </Container>


    )
}
