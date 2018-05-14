/*
 * @Author: wzc0x0@gmail.com
 * @Date: 2018-01-02 09:40:21
 * @Feature: Global api interface configuration by npm script `-- params`
 */
const argv = require('yargs').argv

let api = {
    pro: {
        BASEURL: "https://qyd.001bank.com/ebp/v1/api/",
        FAURL: "https://qyd.001bank.com/thirdaccess/api/companyExtSign",
        CASHURL: "https://qyd.001bank.com/cash/v1/api/borrow/loanAgreement"
    },
    dev: {
        BASEURL: "http://192.168.188.72:8090/ebpborrow/v1/api/",
        FAURL: "http://192.168.188.72:8092/thirdaccess/api/companyExtSign",
        CASHURL: "http://192.168.188.72:8091/cash/v1/api/borrow/loanAgreement"
    },
    sit2: {
        BASEURL: "https://sit2.001bank.com/ebpborrow/v1/api/",
        FAURL: "https://sit2.001bank.com/ebpborrow/thirdaccess/api/companyExtSign",
        CASHURL: "https://sit2.001bank.com/cash/v1/api/borrow/loanAgreement"
    },
    uat2: {
        BASEURL: "https://uat2.001bank.com/ebpborrow/v1/api/",
        FAURL: "https://uat2.001bank.com/thirdaccess/api/companyExtSign",
        CASHURL: "https://uat2.001bank.com/cash/v1/api/borrow/loanAgreement"
    }
};

//handle all value to be "''" , I forget `Object.values()`, oh my god!
Object.keys(api).forEach(item => {
    Object.keys(api[item]).forEach(apis => {
        api[item][apis] = JSON.stringify(api[item][apis]);
    })
})

module.exports = argv.env ? api[argv.env] : api['dev']