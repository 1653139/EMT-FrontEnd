import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from "react-router-dom";
import store from 'store';
import { useHistory, useLocation } from "react-router-dom";

import {
    TrophyOutlined,
    PieChartOutlined,
    PoweroffOutlined,
    UserOutlined,
    FormOutlined,
    EyeOutlined,
    KeyOutlined
} from "@ant-design/icons";
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
    const history = useHistory();
    let location = useLocation();
    function handleLogout() {
        store.remove('loggedIn');
        history.push("/login");
        console.log('you have been logged out. boo!');
    }
    function handleLogoutAd() {
        store.remove('loggedInAd');
        history.push("/admin/login");
        console.log('you have been logged out. boo!');
    }
    function currentMenuKey(key) {
        if (location.pathname.search(key) >= 0) {
            return location.pathname;
        } else {
            return key
        }
    }
    return <>
        <Layout style={{ minHeight: "100vh" }}>
            {props.isAdmin ?
                (
                    <>
                        <Sider
                            style={{
                                overflow: 'auto',
                                height: '100vh',
                                position: 'fixed',
                                left: 0,
                            }}>
                            <div className="logo TypographyLogo">EMT-ADMIN</div>
                            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                                <Menu.Item key="1" icon={<UserOutlined />}>
                                    <Link to="/admin/dashboard" className="nav-link">Create managers</Link>
                                </Menu.Item>
                                <Menu.Item key="2" icon={<PoweroffOutlined />} name="logout" onClick={handleLogoutAd}>
                                    Logout
                            </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="site-layout">
                            <Content style={{ margin: "16px 16px" }}>
                                <div
                                    className="site-layout-background"
                                    style={{ padding: 24, minHeight: 360 }}
                                >
                                    {props.children}
                                </div>
                            </Content>
                            <Footer style={{ textAlign: "center" }}>
                                Powered by USRUN @ 2020
                        </Footer>
                        </Layout>
                    </>

                ) : (
                    <>
                        <Sider style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                        }}>
                            <div className="logo TypographyLogo">EMT</div>
                            <Menu theme="dark" defaultOpenKeys={['sub1', 'sub2']} defaultSelectedKeys={["/events"]} selectedKeys={[location.pathname]} inlineCollapsed={false} mode="inline">
                                <SubMenu key="sub1" icon={<TrophyOutlined />} title="Events">
                                    <Menu.Item key={currentMenuKey('/events')} icon={<EyeOutlined />}>
                                        <Link to="/events?page=1" >View Events</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/event-create" icon={<FormOutlined />}>
                                        <Link to="/event-create" >Create Events</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" icon={<UserOutlined />} title="Profile">
                                    <Menu.Item key="/profile" icon={<EyeOutlined />}>
                                        <Link to="/profile" >View Profile</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/profile/edit" icon={<FormOutlined />}>
                                        <Link to="/profile/edit" >Update Profile</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/profile/changepassword" icon={<KeyOutlined />}>
                                        <Link to="/profile/changepassword" >Change Password</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <Menu.Item key={currentMenuKey('/stats')} icon={<PieChartOutlined />}>
                                    <Link to="/stats" >Stats</Link>
                                </Menu.Item>
                                <Menu.Item key="4" icon={<PoweroffOutlined />} name="logout" onClick={handleLogout}>
                                    Logout
                            </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="site-layout" style={{ marginLeft: 200 }}>
                            <Content style={{ margin: "16px 16px" }}>
                                <div
                                    className="site-layout-background"
                                    style={{ padding: 24, minHeight: 360 }}
                                >
                                    {props.children}
                                </div>
                            </Content>
                            <Footer style={{ textAlign: "center" }}>
                                Powered by USRUN @ 2020
                        </Footer>
                        </Layout>
                    </>
                )}
        </Layout >

    </>
};

export default MainLayout;