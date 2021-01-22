import { getApiUrl } from '../network/api'
import ServerEndpoint from '../network/server-endpoint'
import UserManager from '../manager/user_manager'
import { message, Modal } from 'antd';
import { Redirect } from 'react-router-dom';


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



export async function managerLogin(params) {
    const headers = {
        "Access-Control-Allow-Origin": "http://1653057-1653072-1653139-emt.s3-website.us-east-2.amazonaws.com",
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.managerLogin)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            UserManager.accessToken = result.data.data.accessToken
            UserManager.currentUser = result.data.data.accountInfo
            console.log(UserManager.currentUser)
            localStorage.setItem("accessToken", UserManager.accessToken)
            localStorage.setItem("currentUser", JSON.stringify(UserManager.currentUser))
            console.log(localStorage.getItem("currentUser", UserManager.currentUser))
            console.log(data)
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function adminLogin(params) {
    const headers = {
        "Access-Control-Allow-Origin": "http://1653057-1653072-1653139-emt.s3-website.us-east-2.amazonaws.com",
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.adminLogin)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            UserManager.accessToken = result.data.data.accessToken
            UserManager.currentUser = result.data.data.accountInfo
            localStorage.setItem("accessToken", UserManager.accessToken)
            localStorage.setItem("currentUser", JSON.stringify(UserManager.currentUser))
            console.log(localStorage.getItem("currentUser", UserManager.currentUser))
            console.log(data)
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function createManagers(params) {
    const headers = {
        "Authorization": `Bearer ${UserManager.accessToken}`,
        "Access-Control-Allow-Origin": "http://1653057-1653072-1653139-emt.s3-website.us-east-2.amazonaws.com",
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.createManager)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            localStorage.setItem("accessToken", UserManager.accessToken)
            localStorage.setItem("currentUser", JSON.stringify(UserManager.currentUser))
            console.log(localStorage.getItem("currentUser", UserManager.currentUser))
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function changePassword(params) {
    const headers = {
        "Authorization": `Bearer ${UserManager.accessToken}`,
        "Access-Control-Allow-Origin": "http://1653057-1653072-1653139-emt.s3-website.us-east-2.amazonaws.com",
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.changePassword)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function forgotPassword(email) {
    const headers = {
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.forgotPassword)
    var params = {email: email}
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function resetPassword(params) {
    const headers = {
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.resetPassword)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}

export async function updateProfile(params) {
    const headers = {
        "Authorization": `Bearer ${UserManager.accessToken}`,
        "Access-Control-Allow-Origin": "http://1653057-1653072-1653139-emt.s3-website.us-east-2.amazonaws.com",
        'Content-Type': 'application/json'
    }
    let apiUrl = getApiUrl(ServerEndpoint.changeProfile)
    let finalResult = await axios.post(apiUrl, params, { headers: headers })
        .then(result => {
            let data = result.data.data
            UserManager.currentUser = params
            localStorage.setItem("accessToken", UserManager.accessToken)
            localStorage.setItem("currentUser", JSON.stringify(UserManager.currentUser))
            console.log(result)
            return data;
        }).catch(error => {
            throw error
        });

    return finalResult;
}