import { getApiUrl } from '../network/api'
import ServerEndpoint from '../network/server-endpoint'
import {loadCurrentUser,loadAccessToken} from '../helpers/utils'
import UserManager from '../manager/user_manager'

const axios = require('axios').default;

// export async function getAnyData () {
//     let apiUrl = "<Write your code here>"
//     let finalResult = await axios.get(apiUrl)
//     .then(result => {
//         let data = result.data.data
//         // Write your code here
//         return data;
//     });
//     return finalResult;
// }

export var currentEventParticipants = []

export async function getEventQuantity(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.eventQuantity)}?`
    for (const p in params) {
        apiUrl += `${p}=${params[p]}&`
    }
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function getAllEvent(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.allEvent)}?`
    for (const p in params) {
        apiUrl += `${p}=${params[p]}&`
    }
    apiUrl.slice(0, -1)
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function searchAllEvent(key) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.eventSearch)}?key=${key}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function createEvent(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allEvent)

    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function getEventDetail(id) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.allEvent)}?id=${id}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function getEventParticipants(id) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.allParticipant)}?id=${id}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            data == null ? currentEventParticipants = [] : currentEventParticipants = [...data]
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function getEventOrganization(id) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = `${getApiUrl(ServerEndpoint.allOrganization)}?id=${id}`
    let finalResult = await axios.get(apiUrl, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function updateEvent(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allEvent)
    let finalResult = await axios.put(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function updateEventSponsor(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allSponsor)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function deleteSponsor(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allSponsor)
    let finalResult = await axios.delete(apiUrl, { data: params, headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function updateParticipant(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allParticipant)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function deleteParticipant(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allParticipant)
    let finalResult = await axios.delete(apiUrl, { data: params, headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}

export async function deleteEvent(params) {
    loadCurrentUser()
    const headers = {
        "Authorization": `Bearer ${loadAccessToken()}`,
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.allEvent)
    let finalResult = await axios.delete(apiUrl, { data: params, headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(err => {
            throw err
        });

    return finalResult;
}