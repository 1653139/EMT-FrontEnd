import React, { useState } from 'react';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import MainLayout from '../layout';
import { changePassword } from '../network/client';
import { useHistory, Redirect, Link } from "react-router-dom";
import UserManager from '../manager/user_manager';
import isLoggedIn from '../helpers/isLoggedIn';
import { WarningOutlined } from '@ant-design/icons';
import { responseCode } from '../helpers/define'
import {
    Form,
    Input,
    Button,
    Modal,
} from 'antd';


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

const ChangePassword = () => {
    const history = useHistory();
    const [form] = Form.useForm();
    if (!isLoggedIn()) {
        return <Redirect to="/login" />;
    }
    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const currentUser = UserManager.currentUser;
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

    const onFinish = values => {
        console.log('Received values of form: ', values);
        Modal.confirm({
            title: 'Notice',
            icon: <WarningOutlined />,
            content: 'Are you sure change your password?',
            okText: 'OK',
            onOk: async () => {
                await changePassword(values).then(res => {
                    console.log(res);
                    Modal.success({
                        title: "Change password successful!",
                        onOk() { history.push("/profile") },
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
        <MainLayout>
            <div className="text-center Typography-h4">

            </div>
            <Form
                {...formItemLayout}

                form={form}
                name="changpassword"
                onFinish={onFinish}
                initialValues={{

                }}
                scrollToFirstError
            >
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            min: 6,
                            message: 'Password must be at least 6 charaters!',
                        },
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        {
                            min: 6,
                            message: 'Password must be at least 6 charaters!',
                        },
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            min: 6,
                            message: 'Password must be at least 6 charaters!',
                        },
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">CHANGE PASSWORD</Button>
                </Form.Item>
            </Form>
        </MainLayout>
    );
};

export default React.memo(ChangePassword);