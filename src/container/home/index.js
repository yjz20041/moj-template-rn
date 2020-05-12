/* eslint-disable react/prop-types */
import React from 'react';
import {
    Text,
    Button
} from 'react-native';
import { PropTypes } from 'prop-types';
import { connectByModule } from '@redux/store';
import PageContainer from '@music/mosi-rn-component/es/page-container';

@connectByModule('home', state => ({
    saidWords: state.home.saidWords
}))
class Home extends React.PureComponent {
    onExit = () => {}

    render() {
        const {
            saidWords
        } = this.props;
        const topBarProp = {
            title: '首页',
            onExit: this.onExit
        };
        return (
            <PageContainer topBarProp={topBarProp}>
                <Text>home2</Text>
                <Button
                    onPress={() => this.props.navigation.navigate('detail')}
                    title="go to detail" />
                <Button
                    onPress={() => this.props.actions.say('hello')}
                    title="dispatch action" />
                <Text>{saidWords}</Text>
            </PageContainer>
        );
    }
}
Home.propTypes = {
    saidWords: PropTypes.string
};
Home.defaultProps = {
    saidWords: ''
};

export default Home;
