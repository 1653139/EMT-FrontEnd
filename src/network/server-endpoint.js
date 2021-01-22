const ServerEndpoint = {
    managerLogin: "/managers/login",
    adminLogin: "/admins/login",
    createManager: "/admins/managers",
    changeProfile: "/managers/profile",
    changePassword: "/managers/profile/password",
    eventQuantity: "/events/quantity",
    allEvent: "/events",
    allSponsor: "/events/sponsors",
    allOrganization: "/organizations",
    allParticipant: "/events/participants",
    generalStats: "/events/stats",
    eventStats: "/events/details/stats",
    eventSearch: "/events/search",
    forgotPassword: "/managers/password/forgot",
    resetPassword: "/managers/password/reset"

    // Write your code here
    /*
        + How to import:
            ==> import ServerEndpoint from '../network/server-endpoint';
        + How to use:
            ==> let data = ServerEndpoint.pointLogin
    */
}

export default ServerEndpoint;