
import Alert from '@util/alert';
import { IS_IOS } from '@util/env';
import { NativeModules } from 'react-native';

const { ImagePicker } = NativeModules;

export default (param) => {
    if (!ImagePicker) {
        Alert('找不到对应模块');
        return '';
    }
    if (IS_IOS) {
        return new Promise((resolve) => {
            ImagePicker.showImagePicker(param, (response) => {
                let res;
                try {
                    res = JSON.parse(response);
                    if (res.success === 1) {
                        if (!res.didCancel) {
                            resolve(res);
                        }
                    } else {
                        alert('上传失败，请重试');
                    }
                } catch (e) {
                    alert('上传失败，请重试');
                }
            });
        });
    }
    return ImagePicker.showImagePicker(param)
        // eslint-disable-next-line consistent-return
        .then((response) => {
            let res;
            try {
                res = JSON.parse(response);
                if (res.success) {
                    return res;
                }
                Alert('上传失败，请重试');
            } catch (e) {
                Alert('上传失败，请重试');
            }
        })
        .catch(() => {
            Alert('上传失败，请重试');
        });
};
