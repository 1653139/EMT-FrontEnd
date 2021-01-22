import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";
import { Row, Col, Modal } from 'antd';
import LineChart from "../components/LineChart"
import DounutChart from "../components/DonutChart"
import MainLayout from '../layout';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import queryString from 'query-string'
import { useHistory } from "react-router-dom";
import {getEventStats,processEventStatsData} from '../manager/StatsManager';
import {responseCode} from '../helpers/define'

const StatsDetail = (props) => {

    const history = useHistory();
    
    const [stats,setStats] = useState(null)

    function redirectToLogin(){
        return history.push('/login')
    }

    function handleExpiredSession(){
        Modal.error({
            title: "Session expired!",
            content: 'Please login again',
            onOk: {redirectToLogin}
        });
    }

    
    function handleError(error, tryAgainFunction) {
        if (error.response) {
            if (error.response.data.code && error.response.data.code===responseCode.SESSION_EXPIRED_CODE)
                handleExpiredSession()
            Modal.error({
                title: (error.response.data.message),
                content: 'Please try again',
            });
        } else if (error.request) {
            //server
            Modal.error({
                title: "Network connection error!",
                content: 'Try again?',
                onOk: async()=>{tryAgainFunction()},
                okText: "OK",
                cancelText: "Cancel"
                
            });
        } else {
            // happened in setting up the request
            Modal.error({
                title: "Network connection error!",
                content: 'Try again?',
                onOk: async()=>{tryAgainFunction()},
                okText: "OK",
                cancelText: "Cancel"
            });
            console.log('Error', error.message);
        }
    }

    

    const fetchAPI = async ()=>{
        var id = queryString.parse(history.location.search).id;
        await getEventStats(id).then(res=>{
            setStats(processEventStatsData(res))
            console.log(processEventStatsData(res))
        })
        .catch(err=>
        {
            handleError(err,fetchAPI)

        })
    }

    useEffect(() => {
        if (!isLoggedIn()) {
            return history.push('/login')
        }
        if (stats==null)
            fetchAPI()
       }, []);

    const dataEventDetails = stats!=null?{
        "attendStats": [{
            "options": {
                title: "Attendance statistics",
                legend: { position: "bottom" },
                pieSliceText: 'value',
                pieHole: 0.7,
                slices: {
                    0: { color: '#DE1B0B' },
                    1: { color: '#DE680B' },
                    2: { color: '#DE840B' },
                    3: { color: '#DEA40B' },
                    4: { color: '#DEC10B' },
                },
                backgroundColor: {
                    fill: '#C7C4C2 ',
                    fillOpacity: 0.1
                }
            }
        },
        {
            "data":
                [
                    ['Event', 'Status'],
                    ['Attended', stats.active],
                    ['Not Attended', stats.inactive],
                ]

        }],
        "activityStatus": [{
            "options": {
                title: "Activity Stats",
                series: {
                    0: { color: '#e2431e' },
                },
                vAxis: {
                    title: 'Number',
                },
                hAxis: {
                    title: 'Day',
                },
                backgroundColor: {
                    fill: '#C7C4C2 ',
                    fillOpacity: 0.1
                }
            }
        },
        {
            "data": stats.activities

        }],
        "distanceStatus": [{
            "options": {
                title: "Distance Stats",
                series: {
                    0: { color: '#e2431e' },
                },
                vAxis: {
                    title: 'Number',
                },
                hAxis: {
                    title: 'Day',
                },
                backgroundColor: {
                    fill: '#C7C4C2 ',
                    fillOpacity: 0.1
                }
            }
        },
        {
            "data": stats.distance

        }],
        "userStats": [{
            "options": {
                title: "Acitve user",
                series: {
                    0: { color: '#e2431e' },
                },
                vAxis: {
                    title: 'Number',
                },
                hAxis: {
                    title: 'Day',
                },
                backgroundColor: {
                    fill: '#C7C4C2 ',
                    fillOpacity: 0.1
                }
            }
        },
        {
            "data": stats.activeUsers

        }],
    }:null
    console.log(dataEventDetails)
    return <>
        {
            dataEventDetails!=null?
            <MainLayout>
                <Row>
                    <Col xs={12}>
                        <DounutChart options={dataEventDetails.attendStats[0].options} data={dataEventDetails.attendStats[1].data} ></DounutChart>
                    </Col>
                    <Col xs={12}>
                        <LineChart options={dataEventDetails.activityStatus[0].options} data={dataEventDetails.activityStatus[1].data} ></LineChart>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <LineChart options={dataEventDetails.distanceStatus[0].options} data={dataEventDetails.distanceStatus[1].data} ></LineChart>
                    </Col>
                    <Col xs={12}>
                        <LineChart options={dataEventDetails.userStats[0].options} data={dataEventDetails.userStats[1].data} ></LineChart>
                    </Col>
                </Row>
            </MainLayout>:null
        }
    </>
};

export default StatsDetail;