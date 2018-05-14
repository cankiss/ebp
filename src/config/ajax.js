/*
 * @Author: wzc0x0@gmail.com
 * @Date: 2017-12-21 20:55:34
 * @Feature: Package ajax function by axios
 */
import axios from "axios";
import qs from "qs";
import iView from 'iview'
import store from '@/store'

const jsonChange = data => Object.prototype.toString.call(data).toLowerCase() === "[object object]" ? data : JSON.parse(data)

axios.defaults.baseURL = BASEURL
axios.defaults.timeout = '0'

axios.interceptors.request.use(config => {
    iView.LoadingBar.start();
    store.commit("updataButtonStatus", { isLoading: true });
    return config
})

axios.interceptors.response.use(response => {
    iView.LoadingBar.finish();
    store.commit("updataButtonStatus", { isLoading: false });
    return jsonChange(response.data).code === '200' ?
        jsonChange(response.data) : Promise.reject(jsonChange(response.data))

}, error => {
    iView.LoadingBar.error();
    store.commit("updataButtonStatus", { isLoading: false });
    iView.Message.error('未知错误');
    return Promise.reject(error)
})

export const _post = (url, data) => axios.post(url, qs.stringify(data))
export const _mine = (url, data) => {
    data ? Object.assign(data, { userId: sessionStorage.getItem('user_id') }) : data = { userId: sessionStorage.getItem('user_id') }
    return axios.post(url, qs.stringify(data))
}
export default axios