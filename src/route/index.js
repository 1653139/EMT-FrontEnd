
import Login from '../pages/login';
import LoginAdmin from '../pages/admin-login';
import Profile from '../pages/view-profile';
import EditProfile from '../pages/edit-profile';
import Registration from '../pages/create-users';
import CreateEvents from '../pages/create-events';
import Stats from '../pages/stats';
import StatsDetail from '../pages/event-stats';
import EventDetails from '../pages/view-event';
import ErrorPage from '../pages/errorpage';
import Events from '../pages/events';
import ChangePassword from '../pages/change-password';
import ForgotPassword from '../pages/forgot-password'
import RecoverPassword from '../pages/recover-password'

const appRoutes = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/admin/login',
        component: LoginAdmin,
    },
    {
        path: '/admin/dashboard',
        component: Registration,
    },
    {
        path: '/profile',
        component: Profile,
    },
    {
        path: '/profile/edit',
        component: EditProfile,
    },
    {
        path: '/profile/changepassword',
        component: ChangePassword,
    },
    {
        path: '/events',
        component: Events,
    },
    {
        path: '/event-create',
        component: CreateEvents,
    },
    {
        path: '/stats',
        component: Stats,
    },
    {
        path: '/events/view',
        component: EventDetails,
    },
    {
        path: '/stats/view',
        component: StatsDetail,
    },
    {
        path: '/password/forgot',
        component: ForgotPassword,
    },
    {
        path: '/password/reset',
        component: RecoverPassword,
    },
    {
        component: ErrorPage,
    },

];

export default appRoutes;
