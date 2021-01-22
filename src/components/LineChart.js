import React, { useEffect, useState } from 'react';
import Chart from "react-google-charts";

const LineChart = ({ data, options }) => {
    return <>
        <Chart
            chartType="LineChart"
            width="100%"
            height="50vh"
            data={data}
            options={options}
        />
    </>
};

export default LineChart;