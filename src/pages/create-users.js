import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import MainLayout from '../layout';
import moment from 'moment';
import { createManagers } from '../network/client';
import { useHistory, Redirect, Link } from "react-router-dom";
import UserManager from '../manager/user_manager';
import isLoggedInAd from '../helpers/isLoggedInAd';
import { WarningOutlined } from '@ant-design/icons';

import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Modal,
} from 'antd';
import { responseCode } from '../helpers/define'


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

const Registration = () => {
    const [form] = Form.useForm();
    const history = useHistory();
    const [error, setError] = useState(null);
    if (!isLoggedInAd()) {
        return history.push('admin/login')
    }

    function redirectToLogin() {
        return history.push('admin/login')
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

    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const currentUser = UserManager.currentUser;

    const onFinish = values => {
        values.avatar = "";
        values.gender = parseInt(values.gender)
        values.dob = moment(values.dob).format('YYYY-MM-DD');
        values.createdBy = currentUser.username;
        console.log('Received values of form: ', values);
        Modal.confirm({
            title: 'Notice',
            icon: <WarningOutlined />,
            content: 'Create new manager?',
            okText: 'OK',
            onOk: async () => {
                await createManagers(values).then(res => {
                    console.log(res);
                    Modal.success({
                        title: "Create manager successful!",
                        onOk() { window.location.reload(); },
                    });
                })
                    .catch(error => {
                        handleError(error);
                    });
            },
            cancelText: 'Cancle',
        });


    };

    return (
        <MainLayout isAdmin="true">
            <div className="text-center Typography-h4">

            </div>
            <Form
                {...formItemLayout}

                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{

                }}
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            min: 6,
                            message: 'Password must be at least 6 charaters!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            min: 6,
                            message: 'Password must be at least 6 charaters!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
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
                        {
                            validator(rule, value) {
                                if (!value || moment(value) < moment()) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Date of birth cannot be greater than the current date!');
                            },
                        }
                    ]}
                >
                    <DatePicker defaultValue={moment('1990-01-01')} />
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
                        placeholder="Male or Female"
                        allowClear
                    >
                        <Option value="0">Male</Option>
                        <Option value="1">Female</Option>
                    </Select>
                </Form.Item>


                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">REGISTER NEW MANAGER</Button>
                </Form.Item>
            </Form>
            <span className="center text-danger">
                {
                    error && <div>{error.message}</div>
                }
            </span>
        </MainLayout>
    );
};

export default React.memo(Registration);