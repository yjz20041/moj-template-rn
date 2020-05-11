import Fetch, { setProxyConfig } from '@music/mosi-rn-util/es/fetch';
import RPC from '@music/mosi-rn-util/es/rpc';
import { proxyConfig } from '@config/app.config';

setProxyConfig(proxyConfig);

let loadingCount = 0;
const loadingTimeout = 5000;
let loadingTimer;

const wrapFetch = (url, options = {}) => {
    // loading和error的通用逻辑
    const {
        loading,
        error
    } = options;
    if (loading === true) {
        if (loadingCount <= 0) {
            RPC.showLoading();
            clearTimeout(loadingTimer);
            loadingTimer = setTimeout(() => {
                RPC.hideLoading();
            }, loadingTimeout);
        }
        loadingCount++;
    }
    return Fetch(url, options).catch(() => {
        if (error === true) {
            RPC.showToast({
                text: '网络繁忙，请重试',
                duratin: 1
            });
        }
    }).finally(() => {
        if (loading === true) {
            loadingCount--;
            if (loadingCount <= 0) {
                clearTimeout(loadingTimer);
                RPC.hideLoading();
            }
        }
    });
};
wrapFetch.post = (url, options = {}) => {
    // eslint-disable-next-line no-param-reassign
    options.method = 'post';
    return wrapFetch(url, options);
};

export default wrapFetch;