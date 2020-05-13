import {
    CACHE_KEY
} from '@util/constant';
import Cache from '@music/mosi-rn-util/es/cache';
import RPC from '@music/mosi-rn-util/es/rpc';
import { CACHE_VERSION } from 'react-native-dotenv';

let uid;
const get = async (key) => {
    if (!uid) {
        const userInfo = await RPC.getUserInfo();
        uid = userInfo.uid;
    }
    const cacheKey = `${uid}_${key}`;
    const data = await Cache.get(cacheKey);
    if (data && data.version === CACHE_VERSION) {
        return Promise.resolve(data.content);
    }
    Cache.remove(cacheKey);
    return Promise.resolve();
};

const set = async (key, data) => {
    if (!uid) {
        const userInfo = await RPC.getUserInfo();
        uid = userInfo.uid;
    }
    const cacheKey = `${uid}_${key}`;
    return Cache.set(cacheKey, {
        version: CACHE_VERSION,
        content: data
    });
};

const getUserDataCache = () => get(CACHE_KEY.USER_INFO);
const setUserDataCache = data => set(CACHE_KEY.USER_INFO, data);

export default {
    getUserDataCache,
    setUserDataCache
};
