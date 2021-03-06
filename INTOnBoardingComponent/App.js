//The MIT License (MIT)
//
//Copyright (c) 2020 INTUZ
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { Component } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import OnBoardingViewController from "./app/routes/OnBoardingViewController";
import LoginViewController from "./app/routes/LoginViewController";

const OnBoardingNavigator =
  createStackNavigator({
    OnBoarding: OnBoardingViewController,
    Login: LoginViewController,
  })

const AuthNavigator =
  createStackNavigator({
    Login: LoginViewController,
  })

const OnBoardingContainer = createAppContainer(OnBoardingNavigator)
const AuthContainer = createAppContainer(AuthNavigator)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showOnBoardingScreen: true,
    }
  }

  componentDidMount() {
    this.checkOnBoarding()
  }

  async checkOnBoarding() {
    try {
      const value = await AsyncStorage.getItem('showOnBoardingScreen')
      if (value !== null) {
        this.setState({
          showOnBoardingScreen: value
        })
      }
    } catch (e) {
      // error reading value
    }
  }

  render() {
    if (this.state.showOnBoardingScreen == true) {
      return (
        <OnBoardingContainer />
      )
    }
    else {
      return (
        <AuthContainer />
      )
    }
  }
};

export default App;