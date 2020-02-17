//The MIT License (MIT)
//
//Copyright (c) 2020 INTUZ
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { Component } from 'react';
import {
    Text,
    View,
    SafeAreaView,
} from 'react-native';

import styles from './styles'

import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation'

import OnboardingScreens from '../../components/OnboardingScreens/OnboardingScreens'

class OnBoardingViewController extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            pageIndex: null,
        };
    }

    componentDidMount() {
    }

    async onSkipBtnPressed() {
        try {
            await AsyncStorage.setItem('showOnBoardingScreen', false.toString())
        } catch (e) {
            // saving error
        }
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    async onDoneBtnPressed() {
        try {
            await AsyncStorage.setItem('showOnBoardingScreen', false.toString())
        } catch (e) {
            // saving error
        }
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeAreaView}>
                    <OnboardingScreens 
                        onSkipClick={this.onSkipBtnPressed.bind(this)}
                        onDoneClick={this.onDoneBtnPressed.bind(this)}
                        showDoneBtn={true}
                        showSkipBtn={true}
                        >
                        {/* First screen */}
                        <View style={[styles.slide, { backgroundColor: '#C04DEE' }]}>
                            <Text style={styles.header}>Onboarding1</Text>
                            <Text style={styles.text}>Subtitile1</Text>
                        </View>
                        {/* Second screen */}
                        <View style={[styles.slide, { backgroundColor: '#4AAFEE' }]}>
                            <Text style={styles.header}>Onboarding2</Text>
                            <Text style={styles.text}>Subtitile1</Text>
                        </View>
                        {/* Third screen */}
                        <View style={[styles.slide, { backgroundColor: '#FC515B' }]}>
                            <Text style={styles.header}>Onboarding3</Text>
                            <Text style={styles.text}>Subtitile1</Text>
                        </View>
                    </OnboardingScreens>
                </SafeAreaView>
            </View>
        );
    }
}

export default OnBoardingViewController