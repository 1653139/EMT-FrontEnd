import {useEffect, useRef} from 'react';
import UserManager from '../manager/user_manager'

export function formatTime(time) {
    var date = new Date(time);
    var dd = date.getDate();
    if (dd<10) dd='0'+dd;
    var MM = date.getMonth()+1
    if (MM<10) MM='0'+MM;
    var h = date.getHours();
    if (h<10) h='0'+h;
    var m = date.getMinutes();
    if (m<10) m='0'+m;
    var s = date.getSeconds();
    if (s<10) s='0'+s;
    var re = date.getFullYear()+'-' + MM + '-'+dd + ' ' + h + ":" + m + ":" + s;
    return re;
}

var removeDiacritics = require('diacritics').remove;

export function searchSponsor(name, listSponsor){
    var re = []
    for (const s in listSponsor)
       {
        if (removeDiacritics(listSponsor[s].name).toLowerCase().includes(removeDiacritics(name).toLowerCase()))
        {
            re.push(listSponsor[s])
        } 
       }
    console.log(re)
    return re   
}

export function searchOrganization(name, listOrganization){
    var re = []
    for (const o in listOrganization)
        if (removeDiacritics(listOrganization[o].name).toLowerCase().includes(removeDiacritics(name).toLowerCase()))
            {
                re.push(listOrganization[o])
            } 
            
    return re   
}

export function searchUser(email, listUser){
    var re = []
    for (const u in listUser)
        if (listUser[u].email.toLowerCase().includes(email.toLowerCase()))
            {
                re.push(listUser[u])
            } 
    return re   
}

export function loadCurrentUser() {  

    UserManager.accessToken = localStorage.getItem("accessToken")
    UserManager.currentUser = JSON.parse(localStorage.getItem("currentUser"))
}

export function loadAccessToken() {  

    return localStorage.getItem("accessToken")

}


