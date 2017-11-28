/**
 * Created by qinshiju on 2017/6/23.
 */
import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import Config from '../common/config';
import ConfigWap from '../common/config_wap';
import 'whatwg-fetch';
import './my_order.css';
import '../common/anyway';
import MPConfig from '../common/mp_config';
let oDate = new Date();
let nowYear = oDate.getFullYear();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
let hour = oDate.getHours();
class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            status: [
                {
                    status: 1,
                    uesStatus: 1 ,
                    content: '已完成',
                }, {
                    status: 1,
                    uesStatus: 0,
                    content: '预定中'
                }, {
                    status: 0,
                    uesStatus: 0,
                    content: '未完成支付'
                },{
                    status:3,
                    uesStatus: 0,
                    content:'超时未支付'
                }
            ],
            content: [],
            orderStatus:''
        }
    }

    componentDidMount() {
        MPConfig();
        document.body.style.backgroundColor = "#f5f5f5";
        document.title = '我的订单';
        //订单展示接口调取
        let urlEnd = Config.api.orderView + '?begin=' + oDate.getTime();
        console.log(urlEnd);
        fetch(urlEnd, {method: 'GET', credentials: 'same-origin'}).then((res)=> {
            return res.json()
        }).then((res)=> {
            console.log(res);
            this.setState({
                orderList: res.data
            });
        });
        //上拉加载
        function getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            }
            else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        }

        //获取当前可视范围的高度
        function getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            }
            else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        }

        //获取文档完整的高度
        function getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }

        let _this = this;
        //监听上拉加载
        window.addEventListener("scroll", function () {

            if (getScrollTop() + getClientHeight() >= getScrollHeight()) {
                let createdTime = _this.state.orderList[_this.state.orderList.length - 1].createdTime;
                //上拉条件符合是调取接口获取数据
                let urlBegin = Config.api.orderView + '?begin=' + createdTime;
                _this.refs.loading.style.display = "block";
                setTimeout(function () {
                    _this.refs.loading.style.display = 'none';
                }, 1000);
                fetch(urlBegin, {method: 'GET', credentials: 'same-origin', timeout: 1000}).then((res)=> {
                    return res.json()
                }).then((res)=> {
                    console.log(res);
                    if (res.data == '') {
                        _this.refs.loading.innerHTML = '已经加载全部';
                        setTimeout(function () {
                            _this.refs.loading.style.display = 'none';
                        }, 1000);
                        return
                    }
                    let newOrderList = _this.state.orderList.concat(res.data)
                    console.log(newOrderList);
                    _this.setState({
                        orderList: newOrderList
                    })
                })
            }
        }, false);
        function hengshuping() {
            if (window.orientation == 90 || window.orientation == -90) {
                window.location.href=window.location.href;
            } else {
                window.location.href=window.location.href;
            }
        }

        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
    }

    //时间戳的转换，也就是是展示的预约时间
    timeChange(time) {
        let date = new Date(time);
        let Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        return Y + M + D + h + m;
    }

    //完成状态的判断
    orderState(data, uesData) {
        console.log(data)
        console.log(uesData)
        let _this = this;
        let value = [];

        _this.state.status.forEach((val, index)=> {
            console.log(val.content);
            if (data == val.status && uesData == val.uesStatus) {
                // console.log(val.usuesStatus)
                value = val.content
            }

        });
        return value
    }
    unpaid(key,index){
       console.log( key.id)
        let url=Config.api.reserveOrders+'/'+key.id+'/wepay';
        fetch(url,{method:'PUT',credentials: 'same-origin'}).then((res)=>{
            return res.json()
        }).then((res)=>{
            console.log(res)
            let pack = res.unifiedOrder.package.substring(res.unifiedOrder.package.indexOf('=') + 1,res.unifiedOrder.package.length);
            if(!res.payed){
                console.log('微信支付' + this.refs.orderLoading);
                let _this = this
                window.wx.chooseWXPay({
                    timestamp: res.unifiedOrder.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: res.unifiedOrder.nonceStr, // 支付签名随机串，不长于 32 位
                    package: res.unifiedOrder.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: res.unifiedOrder.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: res.unifiedOrder.paySign, // 支付签名
                    success: function (resp) {
                        console.log(resp)
                        let status=resp.errMsg.substring(resp.errMsg.indexOf(':')+1,resp.errMsg.length)
                        // 成功之后进行轮循

                        if(status == ConfigWap.status.ok ) {
                            let url = Config.api.wepay + '/' + res.unifiedOrder.package.substring(res.unifiedOrder.package.indexOf('=') + 1,res.unifiedOrder.package.length);
                            console.log(url)
                            // 支付成功后的回调函数
                            fetch(url, {method: 'GET'}).then((res)=> {
                                return res.json()
                            }).then((res)=> {
                                console.log(res)
                                if (res.status == 0) {
                                    let n = 0;
                                    let timer = setTimeout(function () {
                                        let _this = this;
                                        let url = Config.api.wepay + '/' + res.unifiedOrder.package.substring(res.unifiedOrder.package.indexOf('=') + 1,res.unifiedOrder.package.length);
                                        fetch(url, {method: 'GET'}).then((res)=> {
                                            return res.json()
                                        }).then((res)=> {
                                            if (res.status == 0) {
                                                if (n == 10) {
                                                    alert("支付失败");
                                                    return false
                                                }
                                                timer;
                                                n++;
                                                console.log(n)
                                            } else {
                                                let data = {
                                                    beginTime: res.beginTime,
                                                    endTime: res.endTime,
                                                    address: res.machine.address.formattedAddress,
                                                    indexInGroup: res.machine.indexInGroup,
                                                    duration: res.duration
                                                };
                                                localStorage.setItem('res', JSON.stringify(data));
                                                window.location.href = '/reserve/pay_success/'+pack;
                                                _this.refs.orderLoading.style.display = 'none';
                                            }
                                        })
                                    }, 60000)
                                } else if (res.status == 1) {
                                    let data = {
                                        beginTime: res.beginTime,
                                        endTime: res.endTime,
                                        address: res.machine.address.formattedAddress,
                                        indexInGroup: res.machine.indexInGroup,
                                        duration: res.duration
                                    };

                                    window.location.href = '/reserve/pay_success/'+pack;
                                    _this.refs.orderLoading.style.display = 'none';
                                }
                            })
                        }
                    },
                    cancel:function (resp) {
                        console.log(resp)
                        alert("支付失败!");
                    },
                    fail:function (resp) {
                        console.log(resp)
                        alert("支付失败!");
                    }
                });
            }
        })
    }
    render() {
        return (
            <div className="myOrder">
                {this.state.orderList ? this.state.orderList.map((key, index)=> {
                    return <div className="myOrderList" key={index}>
                        <div className="myOrderAddress clearFix">
                            <span className="primary fl">{key.machine.address.formattedAddress}</span>
                            <span className="refund fr">{
                                this.orderState(key.status, key.useStatus)}</span>
                        </div>
                        <div>
                            <div className="payDetail orderDetail">
                                <p className="slot clearFix">
                                    <span
                                        className="fl">预约时段：{this.timeChange(key.beginTime)}—{this.timeChange(key.endTime).substring(this.timeChange(key.endTime).indexOf(' ') + 1,)}</span>
                                    <span className="unitPrice fr">¥{key.price.price / 100}</span>
                                </p>
                                <p className="songAddress distance">
                                    包房地址：{key.machine.address.address}
                                </p>
                                <p className="songRoom orderRoom">
                                    包房号码：{key.machine.indexInGroup}号
                                </p>
                                <p className="orderNumber clearFix">
                                    <span
                                        className="fl">订单号：{key.wepayId ? key.wepayId.substring(7,) : key.wepayId}</span>
                                    <span className="orderNewTime fr">{this.timeChange(key.createdTime)}</span>
                                </p>
                            </div>
                            <div className="btnFeedback">

                                <Link to={{pathname:'/order/feedback'}}>
                                    <div className="myOrderBtn myOrderFeedback" style={{marginLeft:key.status==0?"9rem/* 360px */":"14rem/* 560px */"}}>
                                        我要反馈
                                    </div>
                                </Link>
                                <div className="myOrderBtn myOrderPay" style={{display:key.status==0?'block':'none'}} onClick={this.unpaid.bind(this,key,index)}>
                                    支付
                                </div>
                            </div>
                        </div>
                    </div>
                }) : '暂时没有订单.....'}
                <div className="loading" ref="loading">
                    正在加载......
                </div>
            </div>
        )
    }
}
export default MyOrder