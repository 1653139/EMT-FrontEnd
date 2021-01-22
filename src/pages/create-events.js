import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import MainLayout from '../layout';
import moment from 'moment';
import { createManagers } from '../network/client';
import { useHistory, Redirect, Link } from "react-router-dom";
import UserManager from '../manager/user_manager';
import isLoggedIn from '../helpers/isLoggedIn';
import UploadImage from '../components/UploadImage'
import { createEvent } from '../manager/EventManager'
import { getAllOrg } from '../manager/OrgManager'

import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Upload,
    Modal,
    Col, Row
} from 'antd';

import { UploadOutlined, } from '@ant-design/icons'
import FormItem from 'antd/lib/form/FormItem';
import { render } from '@testing-library/react';
import { responseCode } from '../helpers/define'

const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};


const CreateEvents = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [ruleUploadLogo, setRuleUploadLogo] = useState(true);
    const [ruleUploadPoster, setRuleUploadPoster] = useState(true);
    const [ruleUploadBanner, setRuleUploadBanner] = useState(true);
    const [ruleOrg, setRuleOrg] = useState(true);
    const [imgUrlLogo, setImgUrlLogo] = useState(null);
    const [org, setOrg] = useState(null);
    const [imgUrlBanner, setImgUrlBanner] = useState(null);
    const [imgUrlPoster, setImgUrlPoster] = useState(null);
    const [organizations, setOrganizations] = useState([]);


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


    function handleError(error) {
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
                content: 'Please try later',
            });
        } else {
            // happened in setting up the request
            Modal.error({
                title: "Network connection error!",
                content: 'Please try later',
            });
            console.log('Error', error.message);
        }
    }

    const fetchAPI = async () => {
        await getAllOrg().then(res => {
            setOrganizations(res)
        })
            .catch(err => {
                handleError(err)
            })
    }

    useEffect(() => {
        if (!isLoggedIn()) {
            return history.push('/login')
        }
        if (organizations.length === 0)
            fetchAPI()
    }, []);


    if (!isLoggedIn()) {
        return history.push('/login')
    }
    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const currentUser = UserManager.currentUser;


    const buildOptions = () => {
        var options = []
        for (const o in organizations)
            options.push(<Select.Option value={organizations[o].id}>{organizations[o].name}</Select.Option>)
        return options
    }

    const handleOnGetImageUrlLogo = imgUrl => {
        setImgUrlLogo(imgUrl);
        setRuleUploadLogo(false);

    };
    const handleOnGetImageUrlBanner = imgUrl => {
        setImgUrlBanner(imgUrl);
        setRuleUploadBanner(false);

    };
    const handleOnGetImageUrlPoster = imgUrl => {
        setImgUrlPoster(imgUrl);
        setRuleUploadPoster(false);

    };

    const handleSelectOrg = (value) => {
        console.log(value);
        setOrg(value)
        setRuleOrg(false)
    }

    function handleError(error) {
        if (error.response) {
            Modal.error({
                title: (error.response.data.message),
                content: 'Please try again',
            });
        } else if (error.request) {
            //server
            Modal.error({
                title: "Network connection error!",
                content: 'Please try later',
            });
        } else {
            // happened in setting up the request
            Modal.error({
                title: "Network connection error!",
                content: 'Please try later',
            });
            console.log('Error', error.message);
        }
    }


    const onFinish = values => {
        const rangeValue = values['range-time-picker'];
        values.startDate = moment(values.startDate).format('YYYY-MM-DD HH:mm:ss');
        values.endDate = moment(values.endDate).format('YYYY-MM-DD HH:mm:ss');
        values.createdBy = currentUser.email;
        values.poweredBy = org;
        values.logo = imgUrlLogo;
        values.banner = imgUrlBanner;
        values.poster = imgUrlPoster;
        console.log('Received values of form: ', values);

        Modal.confirm({
            title: 'Notice',
            icon: <ExclamationCircleOutlined />,
            content: 'Create this event?',
            okText: 'OK',
            onOk: async () => {
                await createEvent(values).then(res => {
                    Modal.success({
                        title: "Create event successful!",
                        onOk() { history.push(`/events/view?id=${res.id}`) },
                    });

                }).catch(err => {
                    handleError(err);
                });
            },
            cancelText: 'Cancle',
        });


    };

    return (
        <MainLayout>
            <div className="text-center Typography-h4"></div>
            <Form
                {...formItemLayout}
                form={form}
                name="create-events"
                onFinish={onFinish}
                initialValues={{

                }}
                scrollToFirstError
            >
                <Form.Item name="select" label="Powered by:"
                    rules={[
                        {
                            required: ruleOrg,
                            message: 'Please select an organization!',

                        },
                    ]}>
                    <Select onChange={handleSelectOrg} defaultValue={organizations.length !== 0 ? organizations[0].id : null}>
                        {buildOptions()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="logo"
                    label="Logo (<2MB):"
                    rules={[
                        {
                            required: ruleUploadLogo,
                            message: 'Please upload your logo!',

                        },
                    ]}
                >
                    <UploadImage onGetImageUrl={handleOnGetImageUrlLogo}></UploadImage>
                </Form.Item>
                <Form.Item
                    name="name"
                    label={
                        <span>
                            Event name&nbsp;
                    </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input event name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item >

                <Form.Item
                    name="startDate"
                    label="Start Date:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Start date',
                        },
                        {
                            validator(rule, value) {
                                var startDay = moment(value).format('YYYY-MM-DD');
                                var today = moment().format('YYYY-MM-DD');
                                if (!value || startDay >= today) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Start date cannot be smaller than the current date!');
                            },
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                var endDay = moment(getFieldValue('endDate')).format('YYYY-MM-DD');
                                var startDay = moment(value).format('YYYY-MM-DD');
                                if (!getFieldValue('endDate') || startDay < endDay) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('Start date cannot be the same or bigger than End date!');
                            },
                        }),
                    ]}

                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item
                    name="endDate"
                    label="End Date:"
                    rules={[
                        {
                            required: true,
                            message: 'Please input End date',
                        },
                        {
                            validator(rule, value) {
                                var endDay = moment(value).format('YYYY-MM-DD');
                                var today = moment().format('YYYY-MM-DD');
                                if (!value || endDay >= today) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('End date cannot be smaller than the current date!');
                            },
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                var startDay = moment(getFieldValue('startDate')).format('YYYY-MM-DD');
                                var endDay = moment(value).format('YYYY-MM-DD');
                                if (!value || endDay > startDay) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('End date cannot be the same or smaller than Start date!');
                            },
                        }),
                    ]}

                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[
                    {
                        required: true,
                        message: 'Please input description!',

                    },
                ]}>
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
                </Form.Item>
                <Form.Item
                    label="Fee and Distance"
                >
                    <Form.Item
                        name="fee"
                        label="Fee(VND):"
                        rules={[
                            {
                                required: true,
                                message: 'Please input fee!',

                            },
                            {
                                validator: (_, value) =>
                                    (!value || value >= 0) ? Promise.resolve() : Promise.reject('Fee must be positive number'),
                            },
                        ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <Input type="number" placeholder="Input Fee" />
                    </Form.Item>
                    <Form.Item
                        name="distance"
                        label="Distance(Km):"
                        rules={[
                            {
                                required: true,
                                message: 'Please input distance!',

                            },
                            {
                                validator: (_, value) =>
                                    (!value || value >= 0) ? Promise.resolve() : Promise.reject('Distance must be positive number!'),
                            },
                        ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                    >
                        <Input type="number" placeholder="Input distance" />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Image">
                    <Form.Item
                        name="banner"
                        label="Banner (<2MB):"
                        rules={[
                            {
                                required: ruleUploadBanner,
                                message: 'Please upload your banner!',

                            },
                        ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <UploadImage onGetImageUrl={handleOnGetImageUrlBanner}></UploadImage>
                    </Form.Item>


                    <Form.Item
                        name="poster"
                        label="Poster (<2MB):"
                        rules={[
                            {
                                required: ruleUploadPoster,
                                message: 'Please upload your poster!',

                            },
                        ]}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}

                    >

                        <UploadImage onGetImageUrl={handleOnGetImageUrlPoster}></UploadImage>
                    </Form.Item>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">CREATE NEW EVENT</Button>
                </Form.Item>
            </Form>
        </MainLayout>
    );
};

export default React.memo(CreateEvents);