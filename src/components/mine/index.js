import account from "./account/account.vue"; //账户总览
import transrecord from "./transrecord/transrecord.vue"; //交易记录
import loan from "./loan/loan.vue"; //我的借款
import enterInform from "./enterInform/enterInform.vue"; //企业资料
import credit from "./recharge/credit.vue"; //企业充值
import rechargeSuccess from "./recharge/rechargeSuccess"; //充值成功
import reflect from "./recharge/reflect.vue"; //企业提现

export default [{
        path: '/mine',
        component: () =>
            import ('./mine.vue'),
        redirect: '/mine/account',
        children: [
            { name: 'account', path: 'account', component: account },
            { name: 'transrecord', path: 'transrecord', component: transrecord },
            { name: 'loan', path: 'loan', component: loan },
            { name: 'enterInform', path: 'enterInform', component: enterInform }
        ]
    },
    {
        path: '/recharge',
        component: () =>
            import ('./recharge/recharge.vue'),
        redirect: '/recharge/credit',
        children: [
            { name: 'credit', path: 'credit', component: credit },
            { name: 'rechargeSuccess', path: 'rechargeSuccess', component: rechargeSuccess },
            { name: 'reflect', path: 'reflect', component: reflect }
        ]
    },
    {
        path: '/mine/payPwdReset',
        component: () =>
            import ('./payPwdReset/payPwdReset.vue')
    }
]