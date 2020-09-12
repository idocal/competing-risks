import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Button,
} from "shards-react";

export default function Welcome({start}) {
    return (
            <Container fluid className="main-content-container px-4" style={{ marginTop: '15px' }}>
                <Row>
                    <Col lg={{ size: 8, offset: 2 }} className="mb-4">
                        <h4 className="text-center">
                        <a href="https://www.medrxiv.org/content/10.1101/2020.09.04.20185645v1" target="_blank" rel="noopener noreferrer">
                                Predicting Illness Trajectory and Hospital Utilization of COVID-19 Hospitalized Patients -
                                A Nationwide Study in Israel
                            </a>
                        </h4>
                            
                        <h6 className="text-center">Michael Roimi, Rom Gutman, Jonathan Somer, Asaf Ben Arie, Ido Calman, Yaron Bar-Lavie, Udi Gelbshtein, Sigal Liverant-Taub, Arnona Ziv, Danny Eytan, Malka Gorfine, Uri Shalit</h6>
                    </Col>
                </Row>

                <Row>
                    <Col lg={{ size: 8, offset: 2 }} className="mb-4">
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Welcome</h6>
                            </CardHeader>
                            <CardBody>
                            This application is based on a <a href="https://github.com/JonathanSomer/covid-19-multi-state-model" target="_blank" rel="noopener noreferrer">multi-state survival analysis model</a> which predicts COVID-19 patients' disease course from the time of their hospitalization.<br /><br />
                            <span style={{color: "#c4183c", fontWeight: 700}}>NOTICE:</span> The model is based on nationwide Israeli COVID-19 patient data up to early May 2020, and will be updated as more recent data becomes available.<br /><br />
                            By supplying patient <strong>age</strong>, <strong>sex</strong> and <strong>hospitalization history</strong> (a list of clinical states along with days spent at each state), the application predicts:<br /><br />
                            <ul>
                                <li>The patient’s remaining length of hospital stay</li>
                                <li>The patient’s probability of becoming critical in the future, as well as the length of stay in the critical condition in the case if occurs.</li>
                                <li>The patient’s probability of in hospital mortality.</li>
                            </ul>

                            The clinical states: <strong>moderate</strong>, <strong>severe</strong>, and <strong>critical</strong>, are defined according to the Israeli Ministry of Health guidelines.
                            The critical state, for which we provide predictions is defined as: 

                            <div className="quote">
                            "[...] A state where the patient suffers from respiratory failure which requires invasive/non-invasive mechanical ventilation, septic shock, or multiorgan dysfunction."
                            </div>

                            Example: a patient hospitalized 8 days ago in a critical state might have the following history: <br />
                            Critical -> 5 days <br />
                            Moderate -> 3 days

                            <Row>
                                <Col style={{textAlign: "center"}}>
                                    <Button style={{ marginTop: '20px', fontSize: '15px' }} onClick={() => { start() }}>Start now!</Button>
                                </Col>
                            </Row>
                            
                            
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div className="footer">
                    <div>Website designed and developed by <a href="https://www.idocal.com" target="_blank" rel="noopener noreferrer">Ido Calman</a></div>
                </div>
            </Container>

    )
}
