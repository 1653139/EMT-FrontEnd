import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import { Form, Input, Button, Modal } from 'antd';
import MainLayout from '../layout';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import queryString from 'query-string'
import { useHistory } from "react-router-dom";
import {resetPassword} from '../network/client'
import React , { useEffect, useState }from 'react';

const RecoverPassword = () => {
    const history = useHistory();

    const [isLoading, setLoading] = useState(false);
    function handleError(error, tryAgainFunction) {
        if (error.response) {
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

    console.log(queryString.parse(history.location.search).token)

    const goToLogin = ()=>{
        history.push('/login')
    }
    
    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        var params = {
            token: queryString.parse(history.location.search).token,
            password: values.newPassword
        }
        setLoading(true)
        await resetPassword(params)
        .then(res=>{
            Modal.success({
                title: "Successfully changed password. Redirect to login!",
                onOk: goToLogin
            });
            setLoading(false)
        })
        .catch(err=>{
            handleError(err,resetPassword(params))
            setLoading(false)
        })
    };


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
    return (
        <div>
        <div className="jss4 Typography-h4">
                <h4 >Change your new password</h4>
            </div>
        <div className="text-center Typography-h4">

        </div>
        <Form
            {...formItemLayout}

            name="changpassword"
            onFinish={onFinish}
            initialValues={{

            }}
            scrollToFirstError
        >
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
                <Button type="primary" htmlType="submit" loading={isLoading}>CHANGE PASSWORD</Button>
            </Form.Item>
        </Form>
    </div>
    );
}

export default React.memo(RecoverPassword);
