/* eslint-disable no-unused-expressions */
import mnb from '@music/mnb-rn';
// import alert from './alert';

import {
    NativeModules,
    BackHandler
} from 'react-native';

import {
    IS_IOS
} from './env';

let {
    NMNavigator
} = NativeModules;

NMNavigator = NMNavigator || {};


const registedMethod = new Set();

export const regist = (schema, name) => {
    if (!registedMethod.has(name)) {
        mnb.addMethod({
            schema,
            name
        });
        registedMethod.add(name);
    }
};

export const call = (name, param) => {
    if (mnb[name]) {
        return mnb[name](param);
    }
    mnb.showToast({
        text: '没有对应模块'
    });
    return Promise.reject;
};

// 内置
regist('moyi.imagePicker.show', 'showImagePicker');

regist('page.info', 'getPageInfo');

regist('record.start', 'startRecord');
regist('record.end', 'stopRecord');
regist('record.upload', 'uploadRecord');
regist('record.playStart', 'startPlay');
regist('record.playEnd', 'stopPlay');

regist('event.post', 'postNotification');
regist('event.on', 'listenNotification');

regist('prompt.alert', 'promptAlert');

const output = {
    regist,
    call,
    // 获取导航条高度
    getPageInfo: () => call('getPageInfo'),
    // 图片选择
    showImagePicker: param => call('showImagePicker', param),
    // 录音相关
    startRecord: param => call('startRecord', param),
    stopRecord: param => call('stopRecord', param),
    uploadRecord: param => call('uploadRecord', param),
    startPlay: param => call('startPlay', param),
    stopPlay: param => call('stopPlay', param),
    postNotification: param => call('postNotification', param),
    listenNotification: param => call('listenNotification', param),
    confirm: ({ title, message, okText }) => call('promptAlert', {
        title,
        message,
        cancel: '取消',
        buttons: [okText || '确定']
    }).then(res => new Promise((resolve) => {
        if (res.button === (okText || '确定')) {
            resolve(res);
        }
    }))
};

const buildin = [
    'on',
    'checkSupport',
    'setClipboardContent',
    'getClipboardContent',
    'getNetWork',
    'showToast',
    'hideToast',
    'fetch'
];

buildin.forEach((key) => {
    output[key] = mnb[key];
});

const exitApp = () => {
    if (IS_IOS) {
        NMNavigator.nativePop && NMNavigator.nativePop();
    } else {
        BackHandler && BackHandler.exitApp();
    }
};

output.exitApp = exitApp;


export default output;
