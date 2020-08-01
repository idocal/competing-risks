import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader
} from "shards-react";

import SmallStats from "./../components/common/SmallStats";

export default function Results({ analysis }) {

    const smallStats = [
        {
            label: "Death Probability",
            value: analysis.death_prob[0] * 100 + "%",
            chartLabels: [null, null, null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [1, 2, 1, 3, 5, 4, 7]
                }
            ]
        },
        {
            label: "Days in Severe Condition",
            value: analysis.severe,
            chartLabels: [null, null, null, null, null, null, null],
            attrs: { md: "6", sm: "6" },
            datasets: [
                {
                    label: "Today",
                    fill: "start",
                    borderWidth: 1.5,
                    backgroundColor: "rgba(0, 184, 216, 0.1)",
                    borderColor: "rgb(0, 184, 216)",
                    data: [1, 2, 1, 3, 5, 4, 7]
                }
            ]
        }
    ]

    return (
        <div className="center">
            <Container fluid className="main-content-container px-4">
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
            </Container>
        </div>


    )
}
