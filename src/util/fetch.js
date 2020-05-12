import Fetch, { setProxyConfig } from '@music/mosi-rn-util/es/fetch';
import RPC from '@music/mosi-rn-util/es/rpc';
import CACHE from '@music/mosi-rn-util/es/cache';
import { proxyConfig } from '@config/app.config';
import { CACHE_VERSION } from 'react-native-dotenv';

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
        // 是否缓存
        cache,
        // 强制刷新
        forceFetch,
        // 只从缓存中刷新
        forceCache,
        onCache
    } = options;
    // 是否需要缓存
    const cacheKey = `CACHE_FETCH_${url}`;
    if (cache && forceFetch !== true) {
        const cacheData = await CACHE.get(cacheKey);
        if (cacheData) {
            const {
                cacheVersion,
                cacheContent
            } = cacheData;
            // 版本一致，命中缓存回调
            if (cacheVersion === CACHE_VERSION && typeof onCache === 'function') {
                onCache(cacheContent);
                if (forceCache) {
                    return new Promise();
                }
            } else {
                CACHE.remove(cacheKey);
            }
        }
    }
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
    return Fetch(url, options).then((res) => {
        if (cache) {
            CACHE.set(cacheKey, {
                cacheVersion: CACHE_VERSION,
                cacheContent: res
            });
        }
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
