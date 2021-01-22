import { getApiUrl } from '../network/api'
import ServerEndpoint from '../network/server-endpoint'

import UserManager from '../manager/user_manager'

import {loadCurrentUser,loadAccessToken} from '../helpers/utils'
const axios = require('axios').default;


export var currentEventSponsor = [];

export async function getAllSponsor() {
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allSponsor)
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function getEventSponsor(id){
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.allSponsor)}?id=${id}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            data==null? currentEventSponsor = []: currentEventSponsor = [...data]
            
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;

}
