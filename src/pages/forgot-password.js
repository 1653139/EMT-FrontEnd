import React , { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import { Form, Input, Button, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {forgotPassword} from '../network/client'



const ForgotPassword = () => {
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

    const onFinish = async (values) => {
        setLoading(true)
        console.log('Received values of form: ', values);
        await forgotPassword(values.Email)
        .then(res=>{
            Modal.success({
                title: "An email has been sent to your email!"
            });
            setLoading(false)
        })
        .catch(err=>{
            handleError(err,forgotPassword(values.Email))
            setLoading(false)
        })
    };

    return (
        <div style={{height:'100%'}}>
            <div className="jss4 Typography-h4">
                <h4 >Reset Password</h4>
            </div>
            <div className="jss35 MuiTypography-subtitle1-16">
                <h6>Enter the email address associated with your EMT account and we’ll send you a reset link.</h6>
            </div>
            <div className="center">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoading}>
                            SEND RESET LINK
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default React.memo(ForgotPassword);