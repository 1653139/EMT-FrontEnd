import React, { useEffect, useState } from 'react';
import { useLocation, Link, Redirect } from 'react-router-dom'
import '../whole-app-style.css';
import { Form, Input, Button, Checkbox, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { adminLogin } from '../network/client';
import isLoggedInAd from '../helpers/isLoggedInAd';
import store from 'store';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 20, color: "white", marginLeft: "10px" }} spin />;

const LoginAdmin = (props) => {
    const [loading, setLoaing] = useState(false);
    if (isLoggedInAd()) {
        return <Redirect to="/admin/dashboard" />;
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
        console.log("Received values of form: ", values);
        setLoaing(true)
        adminLogin(values).then(res => {
            store.set('loggedInAd', true);
            store.remove('loggedIn');
            console.log("you're logged in. yay!");
            props.history.push("/admin/dashboard");
        }).catch(error => {
            setLoaing(false)
            handleError(error);
        });

    };

    return (

        <div className="model-content">
            <div className="text-center Typography-h4 ">
                <h4>Welcome to EMT for Admin</h4>
            </div>

            <div className="center">

                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Username!"
                            },

                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                min: 6,
                                message: 'Password must be at least 6 charaters!',
                            },
                            {
                                required: true,
                                message: "Please input your Password!"
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            LOG IN
                            {loading && <Spin indicator={antIcon} />}
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>

    );
}

export default React.memo(LoginAdmin);
