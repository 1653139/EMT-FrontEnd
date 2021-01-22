import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";
import { Row, Col } from 'antd';

const DonutChart = ({ data, options }) => {
    return <>
        <Chart
            width="100%"
            height="50vh"
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={options}
        />
    </>
};

export default DonutChart;