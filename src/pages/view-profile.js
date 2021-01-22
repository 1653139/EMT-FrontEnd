import React from 'react';
import ReactDOM from 'react-dom';
import '../custom-antd.css';
import { Descriptions, Button, Avatar, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import MainLayout from '../layout';
import { useHistory } from "react-router-dom";
import UserManager from '../manager/user_manager';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../helpers/isLoggedIn';
import { responseCode } from '../helpers/define'

const Profile = () => {
    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))

    const history = useHistory();

    if (!isLoggedIn()) {
        return history.push('/login')
    }

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

    const currentUser = UserManager.currentUser;
    const gender = currentUser.gender;
    const avatar = currentUser.avatar;
    function handleClick() {
        history.push("/profile/edit");
    }

    return <>
        <MainLayout >
            <div className="text-center ">

            </div>

            {
                <div className="center">
                    <Avatar size={200} style={{ verticalAlign: 'middle' }}  >
                        <div>
                            {
                                (avatar != "" && avatar != null) ?
                                    <img src={currentUser.avatar} style={{ width: '210px' }, { height: '210px' }} />
                                    : <Avatar size={200} icon={<UserOutlined />}></Avatar>
                            }

                        </div>
                    </Avatar>
                </div>
            }

            <Descriptions style={{ textAlign: 'center' }} column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                <Descriptions.Item label="Display Name" >{currentUser.name}</Descriptions.Item>
                <Descriptions.Item label="Email" >{currentUser.email}</Descriptions.Item>
                <Descriptions.Item label="Day of Birth" >{currentUser.DOB}{currentUser.dob}</Descriptions.Item>
                {gender == 0 &&
                    <Descriptions.Item label="Gender" >Male</Descriptions.Item>
                }
                {gender == 1 &&
                    <Descriptions.Item label="Gender" >Female</Descriptions.Item>
                }

            </Descriptions>,
            <div className="center" >
                <Button type="primary" onClick={handleClick} >UPDATE PROFILE</Button>
            </div>
        </MainLayout>
    </>
};

export default React.memo(Profile);