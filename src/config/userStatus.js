/*
 * @Author: wzc0x0@gmail.com
 * @Date: 2018-01-02 21:12:01
 * @Feature:Get userStatus from ajax
 */
import { _post } from '@/config/ajax'

const getUserStatus = userId => {
    return new Promise((resolve, reject) => {
        _post("deposit/selectUserStatus", { userId }).then(({ model }) => {
            let { enterpriseStatus, openAccountStatus, bankCardStatus, isLianlianUser, isPassword } = model,
            status = -1; //新用户资料审核失败
            if (enterpriseStatus === null) status = 0; //新用户
            if (enterpriseStatus === 0) status = 1; // 提交资料审核中
            if (enterpriseStatus === 1 && openAccountStatus === 2) status = 2; // 资料提交审核通过没实名
            if (enterpriseStatus === 1 && openAccountStatus === 1 && bankCardStatus === 2) status = 3; // 没绑卡
            if (enterpriseStatus === 1 && openAccountStatus === 1 && bankCardStatus === 1) status = 4; // 绑卡了
            resolve({ status, isLianlianUser, isPassword });
        }).catch(({ msg }) => reject(msg))
    })
}

export default getUserStatus