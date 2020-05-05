import Home from '@container/home';
import Detail from '@container/detail';

import {
    NativeModules
} from 'react-native';


// 页面跳转使用 this.props.navigation.navigate(`${name}`)
const RouteConfig = {
    home: {
        screen: Home,
        path: '',
    },
    detail: {
        screen: Detail
    }
};

function InitConfig(route = '') {
    const pageName = NativeModules.NERCTAppContextModule
        && NativeModules.NERCTAppContextModule.pageName;
    return {
        initialRouteName: pageName || route,
        headerLayoutPreset: 'center',
        headerMode: 'none'
    };
}

export {
    RouteConfig,
    InitConfig
};
