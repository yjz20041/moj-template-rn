import RPC from './rpc';
import { proxyConfig } from '../config/app.config.js';

const Fetch = (url, opt = {}) => {
    const optHeaders = opt.headers || {};
    const defaultOpt = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            ...optHeaders
        },
        method: 'get',
        credentials: 'include',
    };
    const optWithoutHead = opt;
    delete optWithoutHead.headers;
    const nextOpt = {
        ...defaultOpt,
        ...optWithoutHead
    };
    nextOpt.method = nextOpt.method.toUpperCase();
    // 开发环境下作转发
    if (process.env.NODE_ENV === 'development') {
        const match = proxyConfig.find(item => item.context
            .find(item2 => url.indexOf(item2) === 0));
        if (match) {
            const {
                target,
                cookie
            } = match;
            // eslint-disable-next-line no-param-reassign
            url = target + url;
            if (cookie) {
                nextOpt.headers.cookie = cookie;
            }
        }
    }
    return fetch(url, nextOpt).then(ret => ret.json()).then((res) => {
        const {
            code
        } = res;
        if (code !== 200 && nextOpt.noError !== true) {
            RPC.showToast({
                text: '网络繁忙，请重试'
            });
            throw res;
        }
        return res;
    }).catch((e) => {
        if (nextOpt.noError !== true) {
            RPC.showToast({
                text: '网络繁忙，请重试'
            });
        }
        throw e;
    });
};

Fetch.post = (url, options = {}) => {
    const { data = {} } = options;
    const body = Object.keys(data)
        .filter(key => data[key] !== undefined)
        .map(
            key => `${key}=${
                typeof data[key] === 'object'
                    ? encodeURIComponent(JSON.stringify(data[key]))
                    : encodeURIComponent(data[key])
            }`,
        )
        .join('&');
    const nextOpt = options;
    nextOpt.method = 'post';
    nextOpt.body = body;
    return Fetch(url, nextOpt);
};

export default Fetch;
