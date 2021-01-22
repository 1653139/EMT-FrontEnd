
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import '../custom-antd.css';
import '../whole-app-style.css';
import { Modal, Button, Card, Row, Col, Select, DatePicker, Divider } from 'antd';
import { UserOutlined, TeamOutlined, RightCircleFilled } from '@ant-design/icons';
import MainLayout from '../layout';
import { useHistory } from "react-router-dom";
import UserManager from '../manager/user_manager';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import EditableLabel from 'react-inline-editing';
import { ExclamationCircleOutlined, WarningOutlined, DeleteOutlined, FieldTimeOutlined, DollarCircleOutlined, TrophyOutlined } from '@ant-design/icons';

import {
    getEventDetail, getEventParticipants, updateEvent, deleteEvent,
    updateEventSponsor, getEventOrganization, deleteSponsor, updateParticipant, deleteParticipant, currentEventParticipants
} from '../manager/EventManager'
import { getAllSponsor, getEventSponsor, currentEventSponsor } from '../manager/SponsorManager'
import queryString from 'query-string'
import {EventDetailView} from '../components/event/EventDetailView'
import {EditParticipant} from '../components/EditParticipants'
import {CustomSearchInput} from '../components/CustomSearchInput'
import {searchSponsor,formatTime,searchUser} from '../helpers/utils'
import {CustomImagePicker} from '../components/CustomImagePicker'
import {responseCode} from '../helpers/define'

import LoadingOverlay from 'react-loading-overlay';
const { Option } = Select;
const { RangePicker } = DatePicker;



const EventDetails = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isEdited, setEdited] = useState(null);
    const [sponsors, setSponsor] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [allSponsors, setAllSponsors] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [organization, setOrganization] = useState(null);
    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))

    function redirectToLogin() {
        return history.push('/login')
    }

    function handleExpiredSession() {
        Modal.error({
            title: "Session expired!",
            content: 'Please login again',
            onOk: { redirectToLogin }
        });
    }


    function handleError(error, tryAgainFunction) {
        if (error.response) {
            if (error.response.data.code && error.response.data.code === responseCode.SESSION_EXPIRED_CODE)
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
                onOk: async () => { tryAgainFunction() },
                okText: "OK",
                cancelText: "Cancel"

            });
        } else {
            // happened in setting up the request
            Modal.error({
                title: "Network connection error!",
                content: 'Try again?',
                onOk: async () => { tryAgainFunction() },
                okText: "OK",
                cancelText: "Cancel"
            });
            console.log('Error', error.message);
        }
    }


    const fetchAPI = async ()=>{
        setIsLoading(true)
        var id = queryString.parse(history.location.search).id;
        Promise.all([getEventDetail(id), getAllSponsor(),getEventSponsor(id),getEventParticipants(id)])
        .then(([event, allSponsor, sponsor, participants]) => {
            // both have loaded!
            if (event)
                {
                    getEventOrganization(event.poweredBy).then(res=>{
                        event.startDate = moment.utc(event.startDate).format('YYYY-MM-DD HH:mm:ss')
                        event.endDate = moment.utc(event.endDate).format('YYYY-MM-DD HH:mm:ss')
                        setCurrentEvent(event)
                        setOrganization(res)
                    })
                        .catch(err => {
                            handleError(err, fetchAPI)
                        })
                }
                if (allSponsor)
                    setAllSponsors(allSponsor)
                if (sponsor) {
                    sponsor == null ? setSponsor([]) : setSponsor(sponsor)
                }
            if (allSponsor)
                setAllSponsors(allSponsor)
            if (sponsor){
                sponsor==null?setSponsor([]):setSponsor(sponsor)
            }
            if (participants)
                participants==null?setParticipants([]):setParticipants(participants)
            
                
            setIsLoading(false)
                
          })
        .catch(function(err) {
            setIsLoading(false)
            handleError(err, fetchAPI)
         });
         

    }

    useEffect(() => {
        if (!isLoggedIn()) {
            return history.push('/login')
        }
        if (currentEvent == null)
            fetchAPI()
    }, []);
    const history = useHistory();

    if (isEdited) {
        console.log("edited")
    }

    const currentUser = UserManager.currentUser;


    function handleLogoChange(img) {
        currentEvent.logo = img
        setEdited(true)
    }
    function handleBannerChange(img) {
        currentEvent.banner = img
        setEdited(true)
    }
    function handlePosterChange(img) {
        currentEvent.poster = img
        setEdited(true)
    }


    function handleStartDay(date) {

        if (currentEvent.startDate != moment(date).format('YYYY-MM-DD HH:mm:ss')) {
            setEdited(true);
            console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'));
            currentEvent.startDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    function handleEndDay(date) {
        if (currentEvent.endDate != moment(date).format('YYYY-MM-DD HH:mm:ss')) {
            setEdited(true);
            console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'));
            currentEvent.endDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }

    function handleFocusOutDescription(text) {
        if (currentEvent.description != text) {
            console.log(text)
            setEdited(true);
            currentEvent.description = text;
        }
    }
    function handleFocusOutName(text) {
        if (currentEvent.name != text) {
            console.log(text)
            setEdited(true);
            currentEvent.name = text;
        }
    }
    function handleFocusOutFee(text) {
        if (currentEvent.fee != parseInt(text)) {
            console.log(text)
            setEdited(true);
            currentEvent.fee = parseInt(text);
        }
    }
    function handleFocusOutDistance(text) {
        if (currentEvent.distance != parseFloat(text)) {
            console.log(text)
            setEdited(true);
            currentEvent.distance = parseFloat(text);
        }
    }

    function actionBtnCallback(delItem) {
        if (delItem != null)
            EventDetails.delSponsor.push(delItem)
        setEdited(true)
        console.log(EventDetails.delSponsor)
    }

    function actionBtnCallbackPart(delItem) {
        if (delItem != null)
            EventDetails.delPart.push(delItem)
        setEdited(true)
        console.log(EventDetails.delPart)
    }

    function verifyUpdateInfo() {
        var msg = null
        if (isNaN(currentEvent.fee))
            msg = 'Fee must be a number'
        if (isNaN(currentEvent.distance))
            msg = 'Distance must be a number'
        if (moment(currentEvent.startDate).format('YYYY-MM-DD HH:mm:ss') <= moment().format('YYYY-MM-DD HH:mm:ss')) {
            msg = 'Start day must be bigger than today'
        }
        if (moment(currentEvent.endDate).format('YYYY-MM-DD HH:mm:ss') <= moment(currentEvent.startDate).format('YYYY-MM-DD HH:mm:ss')) {
            msg = 'End day must be bigger than start day'
        }
        return msg
    }

    function onUpdateClick() {
        Modal.confirm({
            title: 'Notice',
            icon: <WarningOutlined />,
            content: 'Update this event?',
            okText: 'OK',
            onOk: async () => {
                setEdited(false)
                await handleUpdate()
            },
            cancelText: 'Cancle',
        });
    }

    async function handleUpdate() {
        var msg = verifyUpdateInfo()
        if (msg !== null) {
            console.log(msg)
            Modal.error({
                title: (msg),
                content: 'Please try again',
            });

            return
        }
        
        var delSponsorParam = {
            eventId: currentEvent.id,
            idArray: []
        }

        for (const s in EventDetails.delSponsor) {
            delSponsorParam.idArray.push(EventDetails.delSponsor[s].id)
        }

        var sponsorParam = {
            eventId: currentEvent.id,
            idArray: []
        }
        for (const s in sponsors) {
            sponsorParam.idArray.push(sponsors[s].id)
        }

        var delPart = {
            eventId: currentEvent.id,
            emailArray: []
        }

        for (const p in EventDetails.delPart) {
            delPart.emailArray.push(EventDetails.delPart[p].email)
        }

        var part = {
            eventId: currentEvent.id,
            emailArray: []
        }
        for (const p in participants) {
            part.emailArray.push(participants[p].email)
        }

        await Promise.all([updateEvent(currentEvent), EventDetails.delSponsor.length !== 0 ? deleteSponsor(delSponsorParam) : null
            , EventDetails.delPart.length !== 0 ? deleteParticipant(delPart) : null])
            .then(([currentEvent, sponsor, parts]) => {
                // both have loaded!
                if (currentEvent)
                    setCurrentEvent(currentEvent)

                updateEventSponsor(sponsorParam)

                updateParticipant(part)

                EventDetails.delSponsor = []
                EventDetails.delPart = []
                setEdited(false)
                Modal.success({
                    title: "Successfully change event infomation!",
                    onOk() { history.push(`/events/view?id=${currentEvent.id}`) },
                });
            })
            .catch(function (err) {
                handleError(err, handleUpdate)
            });
    }

    async function handleDelete() {
        console.log(`${{ id: currentEvent.id }}`)
        var param = { id: currentEvent.id }
        Modal.confirm({
            title: 'Notice',
            icon: <WarningOutlined />,
            content: 'Delete this event?',
            okText: 'OK',
            onOk: async () => {
                await deleteEvent(param).then(res => {
                    console.log(res);
                    Modal.success({
                        title: "Successfully delete event!",
                        onOk() { history.push("/events?page=1"); },
                    });
                })
                    .catch(err => {
                        handleError(err, handleDelete);
                    });
            },
            cancelText: 'Cancle',
        });


    }

    return (
        currentEvent===null? <MainLayout>
            
            <LoadingOverlay
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgba(255, 128, 0, 0)'
                    }),
                    spinner: (base) => ({
                        ...base,
                        width: '100px',
                        '& svg circle': {
                            stroke: 'rgba(255, 128, 0)'
                        }
                    }),
                }}
                active={isLoading}
                spinner
            >
            <div style={{height:'100vh', top:0,right:0,left:0,bottom:0,margin:'auto'}}/>
            </LoadingOverlay>
        </MainLayout>:
            currentEvent.eventStatus === "ONGOING" ?
                <EventDetailView currentEvent={currentEvent} sponsors={sponsors} participants={participants} organization={organization} ></EventDetailView> :

                <MainLayout >
                    <CustomImagePicker onImageChange={handleBannerChange} imgSrc={currentEvent.banner} />
                    <div className="site-card-wrapper">
                        <Row gutter={[8, 8]}>
                            <Col span={16}>
                                <Card style={{ width: '100%' }}>
                                    <div>
                                        <Row>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <CustomImagePicker onImageChange={handleLogoChange} imgSrc={currentEvent.logo} width='40px' height='40px' btnSize='10px' iconSize='10px' />
                                                <div style={{ marginLeft: '10px', height: '50px' }}>
                                                    <EditableLabel text={currentEvent.name}
                                                        labelClassName='myLabelClass'
                                                        inputClassName='inputClass'
                                                        labelFontSize='40px'
                                                        inputWidth='200px'
                                                        inputMaxLength='50'
                                                        onFocusOut={handleFocusOutName}

                                                    />
                                                </div>
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
                                                <div style={{ fontSize: '20xp', width: "120px" }}><b>Start day:</b></div>
                                                <DatePicker bordered={false} showTime defaultValue={moment.utc(currentEvent.startDate)} onChange={handleStartDay} onOk={handleStartDay} />
                                            </div>
                                        </Row>
                                        <Row >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ fontSize: '20xp', width: "120px" }}><b>End day   :</b></div>
                                                <DatePicker bordered={false} showTime defaultValue={moment.utc(currentEvent.endDate)} onChange={handleEndDay} onOk={handleEndDay} />
                                            </div>
                                        </Row>
                                        <Row >
                                            <div style={{ fontSize: '20xp', width: "120px", marginRight: '11px' }}><b>Distance (km):</b></div>
                                            <EditableLabel text={currentEvent.distance}
                                                labelClassName='myLabelClass'
                                                inputClassName='myInputClass'
                                                labelFontWeight="20px"
                                                inputHeight='auto'
                                                inputMaxLength='50'
                                                onFocusOut={handleFocusOutDistance}
                                            />
                                        </Row>
                                        <Row >
                                            <div style={{ lineHeight: '3', display: 'flex' }}>
                                                <div style={{ fontSize: '20xp', width: "120px", marginRight: '11px' }}><b>Descriptions:</b></div>
                                                <div style={{ width: '300px', lineHeight: '1.6em', height: '100px', overflowY: 'scroll', marginTop: '10px' }}>
                                                    <EditableLabel text={currentEvent.description}
                                                        inputHeight='100px'
                                                        inputWidth='100%'
                                                        inputMaxLength='1000'
                                                        onFocusOut={handleFocusOutDescription}
                                                    />
                                                </div>
                                            </div>
                                        </Row>
                                        <Divider></Divider>
                                        <div >
                                            <div style={{ fontSize: '20xp', marginBottom: '10px' }}><b>Participants:</b></div>
                                        </div>
                                        <div>

                                            <EditParticipant
                                                height={'500px'}
                                                isAddMore={true}
                                                listItem={participants}
                                                searchFunc={searchUser}
                                                actionBtnCallBack={actionBtnCallbackPart}
                                            >

                                            </EditParticipant>

                                        </div>

                                        <Divider></Divider>
                                        <Row style={{ width: '100%', justifyContent: 'space-around' }}>
                                            {isEdited ?
                                                <Row style={{ width: '400px', justifyContent: 'space-around' }}>
                                                    <Button style={{ width: '150px', alignItems: 'center' }} type="primary" onClick={onUpdateClick} >Update Event</Button>
                                                    <Button style={{ width: '150px', alignItems: 'center' }} type="danger" onClick={handleDelete} >Delete Event</Button>
                                                </Row> :
                                                <Row className='center'>
                                                    <Button style={{ width: '150px', alignItems: 'center' }} type="danger" onClick={handleDelete} >Delete Event</Button>
                                                </Row>
                                            }
                                        </Row>

                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card style={{ width: '100%' }}>
                                    <div>
                                        <div >
                                            <div style={{ marginRight: "10px", fontSize: '20xp' }}><b>Fee(VND):</b></div>
                                            <div style={{ height: '50px' }}>
                                                <EditableLabel text={currentEvent.fee.toString()}
                                                    labelClassName='myLabelClass'
                                                    inputClassName='inputClass'
                                                    labelFontSize='40px'
                                                    labelFontWeight='bold'
                                                    inputWidth='100%'
                                                    inputHeight='50px'
                                                    inputMaxLength='50'
                                                    onFocusOut={handleFocusOutFee}
                                                />
                                            </div>
                                        </div>
                                        <Divider></Divider>
                                        <div >
                                            <div style={{ marginRight: "10px", marginBottom: '10px', fontSize: '20xp' }}><b>Sponsor:</b></div>

                                            <CustomSearchInput
                                                isEnable={true}
                                                listAllItem={allSponsors}
                                                listItem={sponsors}
                                                searchFunc={searchSponsor}
                                                actionBtnCallBack={actionBtnCallback}
                                            >

                                            </CustomSearchInput>

                                        </div>
                                        <Divider></Divider>
                                        <div >
                                            <div style={{ marginRight: "10px", fontSize: '20xp' }}><b>Poster:</b></div>
                                            <br></br>
                                            <CustomImagePicker onImageChange={handlePosterChange} imgSrc={currentEvent.poster} height={'400px'} />

                                        </div>
                                        {/* <Row>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar size={40} >USER</Avatar>
                                        <div style={{ marginLeft: '20px' }}>{currentUser.name}</div>
                                    </div>

                                </Row> */}
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

EventDetails.delSponsor = []
EventDetails.delPart = []
export default React.memo(EventDetails);