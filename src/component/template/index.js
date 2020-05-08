/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text
} from 'react-native';

import styles from './style';


class Template extends React.PureComponent {
    render() {
        const {
            style
        } = this.props;
        return (
            <View style={[styles.container, style]}>
                <Text>loading...</Text>
            </View>
        );
    }

    static propTypes = {
        style: PropTypes.object,
    }

    static defaultProps = {
        style: {},
    }
}

export default Template;
