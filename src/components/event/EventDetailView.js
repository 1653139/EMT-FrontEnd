
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../../custom-antd.css';
import { Alert, Divider, Button, Avatar, Card, Row, Col, Tooltip, DatePicker } from 'antd';
import MainLayout from '../../layout';
import { PieChartOutlined, EyeOutlined, DeleteOutlined, FieldTimeOutlined, DollarCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { formatTime } from '../../helpers/utils'
import { CustomSearchInput } from '../CustomSearchInput'
import { useHistory } from "react-router-dom";

export const EventDetailView = ({ currentEvent, sponsors, participants, organization }) => {

    const history = useHistory();
    const goToStats = () => {
        history.push(`/stats/view?id=${currentEvent.id}`)
    }

    return (
        <MainLayout >
            <Alert message="This event is on going, it's view only" type="warning" />
            <div >
                <img src={currentEvent.banner} style={{ width: '100%' }} />
            </div>
            <div className="site-card-wrapper">
                <Row gutter={[8, 8]}>
                    <Col span={16}>
                        <Card style={{ width: '100%', height: '1000px' }}>
                            <div>
                                <Row>
                                    <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <img src={currentEvent.logo} style={{ width: '30px' }, { height: '30px' }} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <label style={{ fontSize: '40px' }}>{currentEvent.name}</label>
                                        </div>
                                        <Tooltip placement="bottom" title={"View event's statistic"} color='#f50'>
                                            <Button onClick={goToStats} style={{ position: 'absolute', right: 0 }} icon={<PieChartOutlined />} />
                                        </Tooltip>
                                    </div>

                                </Row>
                                <br />
                                <Row >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ fontSize: '20xp', width: "120px" }}><b>Powered by:</b></div>
                                        <img src={organization ? organization.logo : null} style={{ width: '20px' }, { height: '20px' }} />
                                        <div style={{ fontSize: '20xp' }}>{organization ? organization.name : ''}</div>
                                    </div>
                                </Row>
                                <Row >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <b style={{ width: "120px" }}> Start date:</b> {`${formatTime(currentEvent.startDate)}`}
                                    </div>
                                </Row>
                                <Row >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <b style={{ width: "120px" }}> End date:</b> {`${formatTime(currentEvent.endDate)}`}

                                    </div>
                                </Row>
                                <Row >
                                    <div style={{ fontSize: '20xp', width: "120px" }}><b>Distance (km):</b></div>
                                    <label>{currentEvent.distance}</label>
                                </Row>
                                <br />
                                <Row >
                                    <div style={{ width: '100%' }}>
                                        <div style={{ fontSize: '20xp', width: "120px", marginBottom: '10px' }}><b>Descriptions:</b></div>
                                        <div style={{ fontSize: '20xp', height: "150px", width: '100%', overflowY: 'scroll' }}>
                                            {currentEvent.description}
                                        </div>

                                    </div>
                                </Row>
                                <Divider></Divider>
                                <div >
                                    <div style={{ fontSize: '20xp' }}><b>Participants:</b></div>
                                </div>
                                <div>

                                    <CustomSearchInput
                                        height={'500px'}
                                        isEnable={false}
                                        listItem={participants}
                                    >

                                    </CustomSearchInput>

                                </div>

                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ width: '100%', height: '1000px' }}>
                            <div>
                                <div >
                                    <div style={{ marginRight: "10px", fontSize: '20xp' }}><b>Fee(VND):</b></div>
                                    <label style={{ fontSize: '40px', fontWeight: 'bold' }}>{currentEvent.fee}</label>
                                </div>
                                <div >
                                    <div style={{ marginRight: "10px", fontSize: '20xp' }}><b>Sponsor:</b></div>
                                </div>
                                <Divider></Divider>
                                <div style={{ height: '100%' }}>

                                    <CustomSearchInput
                                        isEnable={false}
                                        listItem={sponsors}
                                    >

                                    </CustomSearchInput>

                                </div>
                                <Divider></Divider>
                                <div >
                                    <div style={{ marginRight: "10px", fontSize: '20xp' }}><b>Poster:</b></div>
                                    <br></br>
                                    <img width="100%" height="400px" src={currentEvent.poster}></img>

                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className="center" >

            </div>
        </MainLayout >
    );
};
