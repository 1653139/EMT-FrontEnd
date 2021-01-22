import React, { useEffect, useState } from 'react';
import '../whole-app-style.css';
import '../custom-antd.css';
import { Form, Input, Button, Checkbox, Modal, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { managerLogin } from '../network/client';
import store from 'store';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 20, color: "white", marginLeft: "10px" }} spin />;

const Login = (props) => {
    const [loading, setLoaing] = useState(false);
    if (isLoggedIn()) {
        return <Redirect to="/events?page=1" />;
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
        managerLogin(values).then(res => {
            store.set('loggedIn', true);
            store.remove('loggedInAd');
            console.log("you're logged in. yay!");
            props.history.push("/events?page=1");

        }).catch(error => {
            setLoaing(false)
            handleError(error);
        });
    };

    return (
        <div>
            <div className="text-center Typography-h4">
                <h4>Welcome to EMT</h4>
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
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: "Please input your Email!"
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Email"
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
                    <Form.Item style={{textAlign:'center'}}> 
                        <a href="/password/forgot">Forgot password?</a>
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
                    <span class="text-danger ">

                    </span>
                </Form>
            </div>
        </div>

    );
}

export default React.memo(Login);
