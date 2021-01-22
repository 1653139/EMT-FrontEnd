import { getApiUrl } from '../network/api'
import ServerEndpoint from '../network/server-endpoint'

import {loadCurrentUser,loadAccessToken} from '../helpers/utils'
import UserManager from '../manager/user_manager'

import moment from 'moment';

const axios = require('axios').default;

export async function getGenralStats() {
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.generalStats)
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data

           return data
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export function processData(data)
{
    var obj = {
        opening: data.opening,
        onGoing: data.onGoing,
        ended: data.ended,
        distance: [['Events', 'Km']],
        activities: [['Events', 'Number of activities']],
        revenue: [['Events', 'VND']]
    }

    for (const i in data.stats)
    {
        obj.distance.push([data.stats[i].name,parseInt(data.stats[i].totalDistance/1000)])
        obj.activities.push([data.stats[i].name,data.stats[i].totalActivities])
        obj.revenue.push([data.stats[i].name,data.stats[i].revenue])
    }


    return obj;
}

export async function getEventStats(id) {
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.eventStats)}?id=${id}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data

           return data
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export function processEventStatsData(data)
{
    var obj = {
        total: data.totalUsers,
        active: data.activeUsers,
        inactive: data.inactiveUsers,
        distance: [[{ type: 'date', label: 'Day' }, 'Total km']],
        activities: [[{ type: 'date', label: 'Day' }, 'Total activities']],
        activeUsers: [[{ type: 'date', label: 'Day' }, 'Active users']]
    }

    for (const i in data.stats)
    {
        obj.distance.push([new Date(data.stats[i].startDate),parseInt(data.stats[i].totalDistance)/1000])
        obj.activities.push([new Date(data.stats[i].startDate),data.stats[i].totalActivities])
        obj.activeUsers.push([new Date(data.stats[i].startDate),data.stats[i].activeUsers])
    }


    return obj;
}
