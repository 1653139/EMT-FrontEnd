import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";
import { Row, Col } from 'antd';
import LineChart from "../components/LineChart"
import DounutChart from "../components/DonutChart"
import MainLayout from '../layout';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import {getGenralStats, processData} from '../manager/StatsManager'
import {
    Modal
} from 'antd';
import {responseCode} from '../helpers/define'

import { useHistory } from "react-router-dom";

const Stats = (props) => {

    const [stats,setStats] = useState(null)

    const history = useHistory();

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
        await getGenralStats().then(res=>{
            setStats(processData(res))
            console.log(res)
        })
        .catch(err=>
        {
            handleError(err, fetchAPI)

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
        "eventStatus": [{
            "options": {
                title: "Event Status",
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
                    ['Opening', stats.opening],
                    ['Ongoing', stats.onGoing],
                    ['Ended', stats.ended],
                ]

        }],
        "activityStatus": [{
            "options": {
                title: "Activity stats",
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
                    title: 'Km',
                },
                hAxis: {
                    title: 'Events',
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
        "revenueStatus": [{
            "options": {
                title: "Revenue Stats",
                series: {
                    0: { color: '#e2431e' },
                },
                vAxis: {
                    title: 'VNĐ',
                },
                hAxis: {
                    title: 'Events',
                },
                backgroundColor: {
                    fill: '#C7C4C2 ',
                    fillOpacity: 0.1
                }
            }
        },
        {
            "data": stats.revenue
                

        }],
    }:null
    console.log(dataEventDetails)

    return <>
        {stats!=null?
        <MainLayout>
            <Row>
                <Col xs={12}>
                    <DounutChart options={dataEventDetails.eventStatus[0].options} data={dataEventDetails.eventStatus[1].data} ></DounutChart>
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
                    <LineChart options={dataEventDetails.revenueStatus[0].options} data={dataEventDetails.revenueStatus[1].data} ></LineChart>
                </Col>
            </Row>
        </MainLayout>:null}
    </>
};

export default Stats;