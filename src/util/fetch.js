import Fetch, { setProxyConfig } from '@music/mosi-rn-util/es/fetch';
import RPC from '@music/mosi-rn-util/es/rpc';
import { proxyConfig } from '@config/app.config';

setProxyConfig(proxyConfig);

let loadingCount = 0;
let showLoading = false;
const loadingTimeout = 3000;
let loadingTimer;

const wrapFetch = async (url, options = {}) => {
    if (!url) {
        throw new Error('url can not be null');
    }

    const {
        loading,
        error,
    } = options;
    if (loading === true) {
        if (loadingCount <= 0) {
            RPC.showLoading();
            showLoading = true;
            clearTimeout(loadingTimer);
            loadingTimer = setTimeout(() => {
                RPC.hideLoading();
            }, loadingTimeout);
        }
        loadingCount++;
    }
    // eslint-disable-next-line arrow-body-style
    return Fetch(url, options).then((res) => {
        return res;
    }).catch((err) => {
        if (error !== false) {
            RPC.showToast({
                text: typeof err === 'string' ? err : err.message || '网络繁忙，请重试',
                duratin: 1
            });
        }
        throw err;
    }).finally(() => {
        loadingCount--;
        clearTimeout(loadingTimer);
        if (loadingCount <= 0 && showLoading) {
            showLoading = false;
            RPC.hideLoading();
        }
    });
};
wrapFetch.post = (url, options = {}) => {
    // eslint-disable-next-line no-param-reassign
    options.method = 'post';
    return wrapFetch(url, options);
};

export default wrapFetch;
