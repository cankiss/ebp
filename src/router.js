import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from './store'
import validate from '@/components/validate'
import mine from '@/components/mine'
import loginRegister from '@/components/loginRegister'
import notFound from '@/components/404'

Vue.use(Router)

const needLogin = value =>
    value.map(item => Object.assign(item, { meta: { requiresAuth: true } }));

const router = new Router({
    routes: [...needLogin(validate), ...loginRegister, ...needLogin(mine),
        {
            path: '*',
            component: notFound
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!sessionStorage.getItem("user_id")) {
            store.commit("updataLoginStatus", { isLogin: true });
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            store.commit("updataLoginStatus", { isLogin: false });
            next();
        }
    } else {
        store.commit("updataLoginStatus", { isLogin: true });
        next()
    }

})

router.afterEach((to, form, next) => {
    iView.LoadingBar.finish();
})

export default router