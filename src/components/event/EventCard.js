import React, { useEffect, useState } from 'react';

import { useHistory } from "react-router-dom";
import { Card } from 'antd';
import {formatTime} from '../../helpers/utils'
import './card.css';
import moment from 'moment';

import { EditOutlined, EyeOutlined, DeleteOutlined, FieldTimeOutlined, DollarCircleOutlined, TrophyOutlined } from '@ant-design/icons';
const { Meta } = Card;

export const EventCard =({ id, name, description, banner, fee, distance, startDate, endDate }) => {
    
    const history = useHistory();
    function onEventCardClick() {
        history.push(`/events/view?id=${id}`);
    }
    return (
        <Card
            onClick = {onEventCardClick}
            hoverable
            style={{ width: 340 }}
            cover={
                <img alt="example" width="340px" height="178px" src={banner} />}
        >
            <Meta
                title={name}
                description = {
                    <div className="description">
                        {description}
                    </div>
                }
            />
            <div style={{marginTop: "10px"}}>
                <FieldTimeOutlined /><b style={{width: "20px"}}> Start at :</b> {`${moment.utc(startDate).format("YYYY-MM-DD HH:mm:ss")}`}
                <p><FieldTimeOutlined /><b style={{width: "20px"}}> End at:</b> {`${moment.utc(endDate).format("YYYY-MM-DD HH:mm:ss")}`}</p>
                <p><TrophyOutlined />{` ${distance} km`}<span style={{ float: 'right' }}><DollarCircleOutlined />{` ${fee} VNĐ`}</span></p>

            </div>
        </Card>
    );
};