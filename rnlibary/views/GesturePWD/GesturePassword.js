'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    ART,
    Text,
    View,
    PanResponder,
    ToastAndroid,
} from 'react-native';

const {
    Surface,
    Shape,
    Group,
    Path,
    ClippingRectangle,
    LinearGradient,
    RadialGradient,
    Pattern,
    Transform
} = ART;

let itemMargin = 30;
let itemRadius = 15;

// import PropTypes from 'prop-types';


// const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

/**
 * getPWD 手势完成后，回调返回密码[0,1,2,3,4,5,6,7,8]9个数字
 * width height: 键盘长宽
 * jambin 2018/03/06 PM
 */
class GesturePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            circle: [],  //密码点
            linesPoints: [], //手势线条
        };

        this.artWidth = this.props.width?this.props.width:300;
        this.artHeight = this.props.height?this.props.height:300;
        this.circlePoints = this._initCircle(this.artWidth, this.artHeight);
    }

    _toast(msg) {
        ToastAndroid.show("-->" + msg, ToastAndroid.SHORT);
    }
    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => { },
            onPanResponderMove: (evt, gestureState) => {
                this._makeLines(evt.nativeEvent.changedTouches[0].locationX, evt.nativeEvent.changedTouches[0].locationY);
            },
            onPanResponderRelease: (evt, gestureState) => {
                // this._toast("release");
            },

            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderReject: () => { },
            onPanResponderStart: (evt, gestureState) => {
                this.setState({ linesPoints: [] });
            },
            onPanResponderEnd: (evt, gestureState) => {
                this._makeLines(evt.nativeEvent.changedTouches[0].locationX, evt.nativeEvent.changedTouches[0].locationY, true);
                this._makePWD();
            },
            onPanResponderTerminationRequest: () => true,

        });
    }

    render() {
        return (
            <View {...this.panResponder.panHandlers} >
                    {/*<Text>{JSON.stringify(this.pwdNumber)}</Text>*/}
                    <Surface width={this.artWidth} height={this.artHeight} style={{ backgroundColor: '#999999' }}>

                        <Shape
                            d={this._renderLines()}
                            stroke="#0000FF"
                            strokeWidth={10}
                        />

                        {this._renderCircle(this.artWidth, this.artHeight)}
                    </Surface></View>
        );
    }

    reset(){
        this.setState({points: [], linesPoints:[]});
    }

    _makePWD() {
        let pwdNumber = this.state.linesPoints.reduce((pre, next) => {
            let isFind = this.circlePoints.findIndex((item, index) => {
                if (item.x <= next.x
                    && item.x + item.width >= next.x
                    && item.y <= next.y
                    && item.y + item.width >= next.y) {
                    return true;
                }
            });
            if (-1 < isFind && pre[pre.length - 1] != isFind) {
                pre.push(isFind);
            }
            return pre;
        }, [-1]);
        pwdNumber.shift();
        this.props.getPWD?this.props.getPWD(pwdNumber):null;
        
        return pwdNumber;
    }

    _renderLines() {
        let path = new Path();
        if (this.state.linesPoints.length <= 1) {
            return path;
        }
        let pointStart = this.state.linesPoints[0];
        path.moveTo(pointStart.x, pointStart.y);

        return this.state.linesPoints.reduce((pre, next) => {
            pre.lineTo(next.x, next.y);
            return pre;
        }, path);
    }

    _makeLines(x1, y1, flag) {
        let containerPoint = this.circlePoints.filter((item, index) => {
            if (item.x <= x1 && item.x + item.width >= x1 && item.y <= y1 && item.y + item.width >= y1) {
                return true;
            }
            return false;
        });
        let points = this.state.linesPoints;

        points.pop();
        if (containerPoint && containerPoint.length >= 1) {
            // this._toast("_isContainer" + JSON.stringify(containerPoint));
            let centerX = containerPoint[0].x;// + containerPoint[0].width / 2;
            let centerY = containerPoint[0].y + (containerPoint[0].width - itemMargin) / 2;
            points.push({ x: centerX, y: centerY });
        }

        if (!flag) {
            points.push({ x: x1, y: y1 });
        }

        this.setState({ linesPoints: points });
    }

    _initCircle(width, height) {
        let rwidth = itemRadius + itemMargin * 2;
        let startX = (width - 3 * rwidth) / 2;
        let startY = (height - 3 * rwidth) / 2;
        return [0, 1, 2, 3, 4, 5, 6, 7, 8].reduce((pre, value) => {

            let x = (startX + rwidth / 2 + rwidth * (value % 3));
            let y = startY + (Math.trunc(value / 3)) * rwidth + itemMargin;
            // this._toast("end"+startY+"-" + rwidth + "-"+margin);
            pre.push({ x: x, y: y, radius: itemRadius, width: itemRadius * 2 + itemMargin });
            return pre;
        }, []);
    }
    _renderCircle() {
        return this.circlePoints.map((item, index) => {
            let isFind = this.state.linesPoints.findIndex((value, i) => {
                if (item.x <= value.x && item.x + item.width >= value.x && item.y <= value.y && item.y + item.width >= value.y) {
                    return true;
                }
            });

            return (<Shape
                key={index}
                d={new Path().moveTo(item.x, item.y)
                    .arc(0, item.radius * 2, item.radius)
                    .arc(0, -item.radius * 2, item.radius)}
                stroke={-1 == isFind ? "#CCCCCC" : "#CCCCCC"}
                strokeWidth={10}
                fill={-1 == isFind ? "#C5C1AA" : "#0000FF"}
            />);
        });
    }

};


export default GesturePassword;
