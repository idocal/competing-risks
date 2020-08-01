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

const dict = {
    'Male': 1,
    'Female': 2
}

const initialState = {
    'age': 30,
    'gender': 1
}

export default function PatientInformation({getAnalysis}) {
    const [info, setInfo] = useState(initialState)
    const setAge = age => {
        age = age[0] | 0  // Round float
        setInfo(prevInfo => {
            prevInfo.age = age
            return prevInfo
        })
    }
    const setGender = gender => {
        console.log('gender: ', gender)
        let genderType = dict[gender]
        setInfo(prevInfo => {
            prevInfo.gender = genderType
            return prevInfo
        })
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
                                                                Object.keys(dict).map((gender) => (
                                                                    <option key={gender}>{gender}</option>
                                                                ))
                                                            }
                                                        </FormSelect>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={() => {getAnalysis(info)}}>Analyze Patient</Button>
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
