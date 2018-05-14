export default [{
        path: "/",
        redirect: "/login",
        children: [{
                path: "login",
                component: () =>
                    import ("./login")
            },
            {
                path: "register",
                component: () =>
                    import ("./register")
            }
        ],
        component: () =>
            import ("./loginRegister")
    },
    {
        path: "/resetPwd",
        component: () =>
            import ("./resetPwd")
    }
];