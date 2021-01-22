import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import MainLayout from '../layout';
import moment from 'moment';
import { updateProfile } from '../network/client';
import { useHistory, Redirect, Link } from "react-router-dom";
import UserManager from '../manager/user_manager'
import UploadImage from '../components/UploadImage'
import isLoggedIn from '../helpers/isLoggedIn';
import { responseCode } from '../helpers/define'
import { WarningOutlined } from '@ant-design/icons';

import {
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    DatePicker,
    Modal
} from 'antd';


const { Option } = Select;

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

const EditProfile = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [avatar, setAvatar] = useState(null);
    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const currentUser = UserManager.currentUser;
    const sex = ["Male", "Female"];


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



    if (!isLoggedIn()) {
        return history.push('/login')
    }
    const handleOnGetImageUrlAvatar = imgUrl => {
        setAvatar(imgUrl);

    };

    const onFinish = values => {
        values.email = currentUser.email;
        if (avatar != null) {
            values.avatar = avatar;
        }
        values.gender = sex.indexOf(values.gender);
        values.dob = moment(values.dob).format('YYYY-MM-DD');
        console.log('Received values of form: ', values);
        Modal.confirm({
            title: 'Notice',
            icon: <WarningOutlined />,
            content: 'Are you sure you want to change your profile?',
            okText: 'OK',
            onOk: async () => {
                await updateProfile(values).then(res => {
                    console.log(res);
                    Modal.success({
                        title: "Change profile successful!",
                        onOk() { history.push("/profile") },
                    });
                })
                    .catch(err => {
                        handleError(err);
                    });
            },
            cancelText: 'Cancle',
        });
    };
    return (
        <MainLayout>
            <div className="text-center"></div>
            <Form
                {...formItemLayout}

                form={form}
                name="edit"
                onFinish={onFinish}
                initialValues={{
                    name: currentUser.name,
                    gender: sex[currentUser.gender],
                    dob: moment(currentUser.dob),
                    avatar: currentUser.avatar
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="avatar"
                    label="Avatar (<2MB):"
                >
                    <UploadImage imageUrl={currentUser.avatar} onGetImageUrl={handleOnGetImageUrlAvatar}></UploadImage>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                >
                    <Input placeholder={currentUser.email} disabled="true" />
                </Form.Item>

                <Form.Item
                    name="name"
                    label={
                        <span>
                            Display Name&nbsp;
                    </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input your user name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="dob"
                    label="Day of birth"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your date',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (moment(value) < moment()) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Date of birth cannot be greater than the current date!');
                            },
                        }),
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Male or female"
                        allowClear
                    >
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                    </Select>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">UPDATE YOUR PROFILE</Button>
                </Form.Item>
            </Form>
        </MainLayout>
    );
};

export default React.memo(EditProfile);