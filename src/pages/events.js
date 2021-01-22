import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../custom-antd.css';
import { Pagination, Modal, Select, Avatar, Card, Input, Divider, Button } from 'antd';
import LinesEllipsis from 'react-lines-ellipsis'
import MainLayout from '../layout';
import { useHistory } from "react-router-dom";
import UserManager from '../manager/user_manager';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import { ReloadOutlined, EyeOutlined, DeleteOutlined, FieldTimeOutlined, DollarCircleOutlined, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { getEventQuantity, getAllEvent, searchAllEvent } from '../manager/EventManager'
import '../components/event/card.css'
import { EventCard } from '../components/event/EventCard'
import queryString from 'query-string'
import LoadingOverlay from 'react-loading-overlay';
import {responseCode} from '../helpers/define'

const { Search } = Input;

const { Option } = Select;

const { Meta } = Card;

var eventFilter = null

const Events = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [totalIem, setTotalIem] = useState(0);
    const [events, setEvents] = useState(null)
    const [searchValue, setSearchValue] = useState("")//0: name, 1: createBy
    const [searchMode, setSearchMode] = useState(0)
    var page = queryString.parse(history.location.search).page;
    console.log(page)
    const [currentPage, setCurrentPage] = useState(1)



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
                content: 'Please try again'
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
    
    const fetchAPI = async (filter) => {
        var param
        if (filter==null)
            param = { page: queryString.parse(history.location.search).page } 
        else
            param = filter
        setIsLoading(true)
        await Promise.all([getEventQuantity(param),getAllEvent(param)])
        .then(([quantity,allEvent])=>{
            if (quantity)
            {
                console.log(quantity);
                setTotalIem(quantity)
                setIsLoading(false)
            }
            if (allEvent)
            {
                console.log(allEvent);
                setEvents(allEvent)
            }
            setIsLoading(false)
        })
        .catch (err => {
            setIsLoading(false)
            handleError(err, fetchAPI)
            throw err
        })
        return true
    }

    useEffect(() => {
        

        if (!isLoggedIn()) {
            return history.push('/login')
        }

        if (totalIem == 0) {
            fetchAPI(null)
            
        }

    }, []);


    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))


    const getEvents = async (filter) => {
        var param
        if (filter==null)
            param = { page: queryString.parse(history.location.search).page }
        else
            param = filter
        await getAllEvent(param).then(res => {
            console.log(res);
            setEvents(res)
            setIsLoading(false)
        }).catch(err => {
            handleError(err, getEvents)
        });

    }


    const currentUser = UserManager.currentUser;
    const gender = currentUser.gender;

    const renderEventCard = () => {
        if (events == null)
            return null;
        var rows = []
        for (var j = 0; j < Object.keys(events).length; j += 1) {
            rows.push(
                <div style={{ display: 'inline-block', margin: '5px' }}>
                    <EventCard
                        id={events[j].id}
                        banner={events[j].banner}
                        description={events[j].description}
                        name={events[j].name}
                        startDate={events[j].startDate}
                        endDate={events[j].endDate}
                        distance={events[j].distance}
                        fee={events[j].fee}
                    />
                </div>
            )
        }

        return rows


    }

    const onChange = async page => {
        history.push(`/events?page=${page}`)
        setCurrentPage(page)

        setIsLoading(true)
        if (eventFilter)
            eventFilter.page = page
        await getEvents(eventFilter)
    };

    const onSearch = async value =>{
        if (value==='')
            return
        console.log(value)
        console.log(searchMode)
        if (searchMode===0)
        {
            
            setIsLoading(true)
            
            await searchAllEvent(value).then(res => {
                if (res==null)
                {
                    Modal.info({
                        title: "Notice",
                        content: 'No matching result!',
                    })
                    setIsLoading(false)
                    return
                }
                
                history.push(`/events?page=1`)
                
                setSearchValue(value)
                setCurrentPage(1)
                console.log(res);
                setTotalIem(res.length)
                setEvents(res)
                setIsLoading(false)
            }).catch(err => {
                handleError(err, searchAllEvent(value))
            });
        }
        else if (searchMode===1)
        {
            
            
            
            var filter = { 
                createdBy: value,
                page: 1
            }
            await fetchAPI(filter)
            .then(res=>{
                eventFilter = filter
                setSearchValue(value)
                history.push(`/events?page=1`)
                setCurrentPage(1)
            })
            .catch(err=>{
            })
        }
    }

    const resetSearch = async () =>{
        clearAllFilter()
        await fetchAPI(null)
    }

    const clearAllFilter = () =>{
        eventFilter = null
        setSearchMode(0)
        setSearchValue('')
    }

    var searchOption = 
        [
            {
                name: "Event name",
                value: 0
            },
            {
                name: "Created by",
                value: 1
            }
        ]
    

    const buildSearchOption = () =>{
        var re = []
        for (const i in searchOption)
            re.push(<Option value={searchOption[i].value}>{searchOption[i].name}</Option>)
        return re
    }

    return <>
        {totalIem === 0 ?
            <MainLayout>
            
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
            </MainLayout> :
            <MainLayout >
                <LoadingOverlay
                    styles={{
                        overlay: (base) => ({
                            ...base,
                            background: 'rgba(255, 128, 0, 0.3)'
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

                    <div style={{ width: '100%'}}>
                        <div style={{ width: '100%', margin: 'auto', left:0, right:0, textAlign:'center'}}>
                        <Select value={searchOption[searchMode].name} style={{ width: 120, marginRight:'10px' }} onChange={value => setSearchMode(value)}>
                                {buildSearchOption()}
                        </Select>
                        <Search style={{width:'50%', marginRight:'10px'}} defaultValue={searchValue} placeholder="Search..." allowClear onSearch={onSearch} enterButton />
                        <Button icon={<ReloadOutlined />} onClick={resetSearch} > Reset All</Button>
                        </div>
                        <Divider/>
                        {renderEventCard()}

                        <br />
                        <br />
                    </div>


                    <div style={{ width: '100%' }} className="center" >
                        <Pagination current={currentPage} pageSize={9} total={totalIem} onChange={onChange} />
                    </div>
                </LoadingOverlay>
            </MainLayout>
        }
    </>
};

export default React.memo(Events);