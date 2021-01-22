import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../whole-app-style.css';
import { useHistory } from "react-router-dom";


import { Result, Button } from 'antd';
const ErrorPage = () => {
    const history = useHistory();
    function handleClick() {
        history.push("/");
    }

    return <>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={handleClick}>Back Home</Button>}
        />
    </>

}
export default React.memo(ErrorPage);