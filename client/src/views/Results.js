import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem
} from "shards-react";

import SmallStats from "./../components/common/SmallStats";
import Graph from "./Graph";

const quantiles = ["10%", "25%", "50%", "75%", "90%"]

export default function Results({ analysis }) {

    const smallStats = [
        {
            label: "Death Probability",
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
            label: "Days in Severe Condition",
            value: parseFloat(analysis.severe).toFixed(2),
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
                            <h6 className="m-0">Length of Severe Condition</h6>
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
