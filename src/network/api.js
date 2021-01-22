export function getApiUrl(endpoint) {
    const domain = "https://w9d8v1gxka.execute-api.us-east-2.amazonaws.com";
    //const version = "v1";
    const version = "";
    if (endpoint == null || endpoint.length == 0) {
        return null;
    }
    if (endpoint.startsWith('http')) {
        return endpoint;
    }
    return `${domain}/dev${version}${endpoint}`;

    /*
        + How to import:
            ==> import {getApiUrl} from '../network/api';
        + How to use (Don't forget importing the ServerEndpoint):
            ==> let data = getApiUrl(ServerEndpoint.pointLogin)
    */
}