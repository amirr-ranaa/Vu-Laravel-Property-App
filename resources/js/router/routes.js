function page(path) {
    return () => import(/* webpackChunkName: '' */ `~/pages/${path}`).then(
        m => m.default || m)
}

import UserList from "~/pages/user/UserList";
import UserDashboard from "../pages/user/UserDashboard";

export default [
    {
        path: '/',
        name: 'login-main',
        component: page('auth/Login'),
        meta: {login: true, meta_title: 'User Login'},
        props: true,
    },
    {
        path: '/login',
        name: 'login',
        component: page('auth/Login'),
        meta: {login: true, meta_title: 'User Login'},
        props: true,
    },
    {
        path: '/signup',
        name: 'register',
        component: page('auth/Register'),
        meta: {login: true, meta_title: 'User Registration'},
        props: true,
    },
    {
        path: '/forgot/password',
        name: 'forgot-password',
        component: page('auth/ForgotPassword'),
        meta: {login: true, meta_title: 'Forgot Password'},
        props: true,
    },
    {
        path: '/reset/password:encodedToken',
        name: 'reset-password',
        component: page('auth/ResetPassword'),
        meta: {login: true, meta_title: 'Reset Password'},
        props: ({params}) =>  ({encodedToken: params.encodedToken || ''}),
    },
    {
        name: 'user-dashboard',
        path: '/dashboard',
        meta: {public: false, meta_title: 'User Dashboard'},
        component: UserDashboard,
    },
    {
        name: 'user-list',
        path: '/user/list',
        meta: {public: false, meta_title: 'User List'},
        component: UserList,
    },

    {
        path: '/logout',
        name: 'logout',
        meta: {logout: true, meta_title: 'Logout'},
        component: page('auth/Logout')
    },
];
