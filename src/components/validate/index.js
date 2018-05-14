export default [{
    path: '/enterpriseAuth',
    redirect: '/enterpriseAuth/fillInForm',
    children: [{
            path: 'fillInForm',
            component: () =>
                import ('./fillInForm')
        },
        {
            path: 'openAccount',
            component: () =>
                import ('./openAccount')
        },
        {
            path: 'applyForLoan',
            component: () =>
                import ('./applyForLoan')
        },
        {
            path: 'returnPage',
            component: () =>
                import ('./returnPage')
        }
    ],
    component: () =>
        import ('./enterpriseAuth')
}]