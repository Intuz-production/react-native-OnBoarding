//The MIT License (MIT)
//
//Copyright (c) 2020 INTUZ
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('window');

const isiPhoneX = (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (
        height === 812 || width === 812 ||//iPhone X
        height === 896 || width === 896//iPhone XR
    )
);

export default class OnboardingScreens extends Component {

    // Props for ScrollView component
    static defaultProps = {
        // Arrange screens horizontally
        horizontal: true,
        // Scroll exactly to the next screen, instead of continous scrolling
        pagingEnabled: true,
        // Hide all scroll indicators
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        // Do not bounce when the end is reached
        bounces: false,
        // Do not scroll to top when the status bar is tapped
        scrollsToTop: false,
        // Remove offscreen child views
        removeClippedSubviews: true,
        // Do not adjust content behind nav-, tab- or toolbars automatically
        automaticallyAdjustContentInsets: false,
        // Fisrt is screen is active
        index: 0
    };

    state = this.initState(this.props);

    /**
     * Initialize the state
     */
    initState(props) {

        // Get the total number of slides passed as children
        const total = props.children ? props.children.length || 1 : 0,
            // Current index
            index = total > 1 ? Math.min(props.index, total - 1) : 0,
            // Current offset
            offset = width * index;

        const state = {
            total,
            index,
            offset,
            width,
            height,
        };

        // Component internals as a class property,
        // and not state to avoid component re-renders when updated
        this.internals = {
            isScrolling: false,
            offset
        };

        return state;
    }

    /**
     * Scroll begin handler
     * @param {object} e native event
     */
    onScrollBegin = e => {
        // Update internal isScrolling state
        this.internals.isScrolling = true;
    }

    /**
     * Scroll end handler
     * @param {object} e native event
     */
    onScrollEnd = e => {
        // Update internal isScrolling state
        this.internals.isScrolling = false;

        // Update index
        this.updateIndex(e.nativeEvent.contentOffset
            ? e.nativeEvent.contentOffset.x
            // When scrolled with .scrollTo() on Android there is no contentOffset
            : e.nativeEvent.position * this.state.width
        );
    }

    /*
     * Drag end handler
     * @param {object} e native event
     */
    onScrollEndDrag = e => {
        const { contentOffset: { x: newOffset } } = e.nativeEvent,
            { children } = this.props,
            { index } = this.state,
            { offset } = this.internals;

        // Update internal isScrolling state
        // if swiped right on the last slide
        // or left on the first one
        if (offset === newOffset &&
            (index === 0 || index === children.length - 1)) {
            this.internals.isScrolling = false;
        }
    }

    /**
     * Update index after scroll
     * @param {object} offset content offset
     */
    updateIndex = (offset) => {
        const state = this.state,
            diff = offset - this.internals.offset,
            step = state.width;
        let index = state.index;

        // Do nothing if offset didn't change
        if (!diff) {
            return;
        }

        // Make sure index is always an integer
        index = parseInt(index + Math.round(diff / step), 10);

        // Update internal offset
        this.internals.offset = offset;
        // Update index in the state
        this.setState({
            index
        });
    }

    /**
     * Swipe one slide forward
     */
    swipe = () => {
        // Ignore if already scrolling or if there is less than 2 slides
        if (this.internals.isScrolling || this.state.total < 2) {
            return;
        }

        const state = this.state,
            diff = this.state.index + 1,
            x = diff * state.width,
            y = 0;

        // Call scrollTo on scrollView component to perform the swipe
        this.scrollView && this.scrollView.scrollTo({ x, y, animated: true });

        // Update internal scroll state
        this.internals.isScrolling = true;

        // Trigger onScrollEnd manually on android
        if (Platform.OS === 'android') {
            setImmediate(() => {
                this.onScrollEnd({
                    nativeEvent: {
                        position: diff
                    }
                });
            });
        }
    }

    /**
     * Render ScrollView component
     * @param {array} slides to swipe through
     */
    renderScrollView = pages => {
        return (
            <ScrollView ref={component => { this.scrollView = component; }}
                {...this.props}
                contentContainerStyle={[styles.wrapper, this.props.style]}
                onScrollBeginDrag={this.onScrollBegin}
                onMomentumScrollEnd={this.onScrollEnd}
                onScrollEndDrag={this.onScrollEndDrag}
            >
                {pages.map((page, i) =>
                    // Render each slide inside a View
                    <View style={[styles.fullScreen, styles.slide]} key={i}>
                        {page}
                    </View>
                )}
            </ScrollView>
        );
    }

    /**
     * Render pagination indicators
     */
    renderPagination = () => {
        if (this.state.total <= 1) {
            return null;
        }

        const ActiveDot = <View style={[styles.dot, styles.activeDot]} />,
            Dot = <View style={styles.dot} />;

        let dots = [];

        for (let key = 0; key < this.state.total; key++) {
            dots.push(key === this.state.index
                // Active dot
                ? React.cloneElement(ActiveDot, { key })
                // Other dots
                : React.cloneElement(Dot, { key })
            );
        }

        return (
            <View
                pointerEvents="none"
                style={[styles.pagination, styles.fullScreen]}
            >
                {dots}
            </View>
        );
    }

    onSkipPressed = () => {
        this.props.onSkipClick();
    }

    onDonePressed = () => {
        this.props.onDoneClick();
    }

    renderButton = () => {
        const lastScreen = this.state.index === this.state.total - 1;
        return (
            <View pointerEvents="box-none" style={styles.buttonWrapper}>
                {lastScreen
                    ?
                    this.props.showDoneBtn ?
                        <TouchableOpacity style={styles.doneBtnContainer} activeOpacity={1} onPress={() => this.onDonePressed()}>
                            <Text style={styles.doneTxt}>DONE</Text>
                        </TouchableOpacity>
                        : null
                    :
                    <View style={styles.subButtonWrapper}>
                        {this.props.showSkipBtn ?
                            <TouchableOpacity activeOpacity={1} onPress={() => this.onSkipPressed()}>
                                <Text style={styles.skipTxt}>SKIP</Text>
                            </TouchableOpacity>
                            : <View />}
                        <TouchableOpacity activeOpacity={1} onPress={() => this.swipe()}>
                            <Text style={styles.nextTxt}>NEXT</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    /**
     * Render the component
     */
    render = ({ children } = this.props) => {
        return (
            <View style={[styles.container, styles.fullScreen]}>
                {/* Render screens */}
                {this.renderScrollView(children)}
                {/* Render Continue or Done button */}
                {this.renderButton()}
                {/* Render pagination */}
                {this.renderPagination()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // Set width and height to the screen size
    fullScreen: {
        width: width,
        height: height
    },
    // Main container
    container: {
        backgroundColor: 'transparent',
        position: 'relative'
    },
    // Slide
    slide: {
        backgroundColor: 'transparent'
    },
    // Pagination indicators
    pagination: {
        position: 'absolute',
        bottom: isiPhoneX ? 110 : 50,
        left: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: 'transparent'
    },
    // Pagination dot
    dot: {
        backgroundColor: 'rgba(0,0,0,.25)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    // Active dot
    activeDot: {
        backgroundColor: '#FFFFFF',
    },
    // Button wrapper
    buttonWrapper: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: 'transparent',
    },
    subButtonWrapper: {
        bottom: isiPhoneX ? 110 : 50,
        width: width,
        position: 'absolute',
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    doneBtnContainer: {
        alignSelf: 'flex-end',
        bottom: isiPhoneX ? 110 : 50,
        position: 'absolute',
        paddingHorizontal: 10,
    },
    doneTxt: {

    },
    skipTxt: {

    },
    nextTxt: {

    },
});