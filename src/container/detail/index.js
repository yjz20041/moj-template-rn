import React from 'react';
import {
    View,
    Text
} from 'react-native';

import PageContainer from '@music/mosi-rn-component/es/page-container';

// eslint-disable-next-line react/prefer-stateless-function
class Detail extends React.PureComponent {
    render() {
        const topBarProp = {
            title: '详情页'
        };
        return (
            <PageContainer topBarProp={topBarProp}>
                <Text>detail</Text>
            </PageContainer>
        );
    }
}

export default Detail;
