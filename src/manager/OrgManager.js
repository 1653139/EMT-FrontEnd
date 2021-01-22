import { getApiUrl } from '../network/api'
import ServerEndpoint from '../network/server-endpoint'

import {loadCurrentUser,loadAccessToken} from '../helpers/utils'
import UserManager from '../manager/user_manager'

const axios = require('axios').default;


export async function getAllOrg() {
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allOrganization)
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}
