/**
 * Created by qinshiju on 2017/6/1.
 */
import React, {Component}from 'react';
import Picker from 'react-mobile-picker';
import 'whatwg-fetch';
import 'whatwg-fetch-timeout';
import './reserve_order.css';
import '../../scan/rem';
import Config from '../../common/config';
import ConfigWap from '../../common/config_wap';
import Header from '../head_address/head_address';
import '../../common/anyway';
import ReactConfirmAlert, {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import MPConfig from '../../common/mp_config';
let oDate = new Date();
let nowYear = oDate.getFullYear();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
let hour = oDate.getHours();
let min = oDate.getMinutes() < 10 ? '0' + oDate.getMinutes() : oDate.getMinutes();
class PayOrder extends Component {
    constructor(props) {
        super(props);
        let params = this.props.match.params;
        console.log(params)
        this.state = {
            timeMonDay: '',
            begin: params.begin,
            end: params.end,
            machineId: params.machineId,
            roomAddress: '',
            timeRange: params.timeRange,
            beginTime: '',
            duration: '',
            timePrice: [],
            time: '0',
            price: '00',
            originalPrice: '00',
            valueGroups: {
                name: '',
                secondName: hour + ':00',
            },
            optionGroups: {
                secondName: [
                    hour + ':00',
                    hour + ':10',
                    hour + ':20',
                    hour + ':30',
                    hour + ':40',
                    hour + ':50']
            },
            resTime: {},
            on: false
        };
    }

    componentWillMount() {


    }

    componentDidMount() {
        MPConfig()
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        let url = Config.api.reserveSchedules + "/" + this.state.machineId + "/currdate";

        fetch(url,{method:'GET',credentials: 'same-origin'}).then((res)=>{return res.json()}).then((res)=>{
            console.log(res);
            this.setState({
                roomAddress:res[0].machine.address.formattedAddress
            })
        })


        let urlH = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.lastIndexOf('/') + 3);
        console.log(urlH+'>'+this.state.timeRange)
        if (!urlH == this.state.timeRange) {
            window.location.reload()
        }
        let begin = this.state.begin == 'null' ? this.state.begin = '0' : this.state.begin;
        console.log(begin)
        let strtime2 = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + this.state.timeRange + ':' + begin;
        let date = new Date(strtime2.replace(/-/g, '/'));//时间转化为时间戳
        let beginTime = date.getTime();
        console.log(beginTime + '/' + this.state.machineId)
        let urlMax = Config.api.max + '?machineId=' + this.state.machineId + '&timestamp=' + beginTime;
        console.log(urlMax)
        fetch(urlMax, {method: 'GET'}).then((res)=> {
            return res.json()
        }).then((res)=> {
            console.log(res)
            this.setState({
                resTime: res
            })

            document.title = '预约';
            let timeRtss = this.state.resTime;
            console.log(timeRtss)
            let timeRange = this.state.timeRange;
            let strtime = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + timeRange + ':00';
            // let date = new Date(strtime.replace(/-/g, '/'));//时间转化为时间戳
            this.setState({
                timeMonDay: nowMonth + '月' + nowDay + '日'
            });
            hour = timeRange;
            let secondName3 = [
                hour + ':00',
                hour + ':10',
                hour + ':20',
                hour + ':30',
                hour + ':40',
                hour + ':50'
            ];
            this.setState({
                valueGroups: {
                    secondName: hour + ':00',
                },
                optionGroups: {
                    secondName: secondName3
                }
            });
            //从何时开始预约
            let beginM = this.state.begin.substring(0, 1);//开始的时间
            let beginMl = this.state.begin.substring(1,) ? this.state.begin.substring(1,) : '0';
            console.log(beginMl + '／' + this.state.begin + '/' + beginM)
            let n = 5 - parseInt(beginM);
            let resluts = [];
            console.log(hour);
            console.log(this.state.valueGroups.secondName.substring(0, 2));
            console.log(timeRtss.rts + '/'+timeRtss.beginMin);
            let changeMin = beginM.toString().substring(0, 1);
            console.log(changeMin);
            console.log( timeRtss.rts==null);
            if(timeRtss.rts==null){
                this.refs.submit.disabled=true;
                this.refs.submit.style.backgroundColor="#cccccc";
            }
            let r=timeRtss.rts==null?timeRtss.rts=Number('0'):timeRtss.rts;
            console.log(r)
            let k = parseInt(r.toString().substring(0, 1));

            //当前时间段的判断
            if (hour == oDate.getHours()) {
                console.log(min + '/' + oDate.getHours() + '／' + beginM);
                if (parseInt(this.state.begin) > parseInt(min)) {
                    let m = Math.abs(5 - parseInt(changeMin));
                    for (let i = 0; i < m; i++) {
                        let showTime = hour + ':' + (parseInt(changeMin) + i) + '0';
                        resluts.push(showTime);
                    }
                    console.log(resluts)
                    this.setState({
                        optionGroups: {
                            secondName: resluts
                        }
                    })
                } else {
                    let changeMin = typeof min == 'string' ? min.substring(0, 1) : min.toString().substring(0, 1);
                    let m = Math.abs(5 - parseInt(changeMin));
                    console.log(changeMin + '/' + m)
                    for (let i = 0; i < m; i++) {
                        let showTime = hour + ':' + (parseInt(changeMin) + 1 + i) + '0';
                        if ((parseInt(changeMin) + 1 + i) < 6) {
                            resluts.push(showTime);
                        }
                    }
                    console.log(resluts)
                    this.setState({
                        optionGroups: {
                            secondName: resluts
                        }
                    })
                }
            } else {
                if (isNaN(n)) {
                    n = 6;
                    for (let i = 0; i < n; i++) {
                        let showTime = hour + ':' + i + '0';
                        resluts.push(showTime)
                    }
                    console.log('我是isNaN的' + n)
                    this.setState({
                        optionGroups: {
                            secondName: resluts
                        }
                    })
                } else {
                    if (!timeRtss.rts + timeRtss.beginMin < timeRtss.rts) {

                        for (let i = 0; i < k; i++) {
                            console.log(k);
                            let showTime = hour + ':' + (parseInt(changeMin) + i) + '0';
                            if ((parseInt(changeMin) + i) < 6) {
                                resluts.push(showTime);
                            }
                        }
                        this.setState({
                            optionGroups: {
                                secondName: resluts
                            }
                        })

                    } else {
                        if (beginMl == '0' || beginMl == null) {
                            n = 6 - parseInt(beginM);
                            console.log('我是==0的' + beginMl + '/' + n)
                            for (let i = 0; i < n; i++) {
                                let showTime = hour + ':' + (parseInt(beginM) + i) + '0';
                                resluts.push(showTime);
                            }

                            this.setState({
                                optionGroups: {
                                    secondName: resluts
                                }
                            })
                        }
                    }
                }
            }
            console.log('showTime' + resluts)

            //价格接口的调取
            let urlPrice = Config.api.prices + '?machineId=' + this.state.machineId;
            fetch(urlPrice, {method: "GET", credentials: 'include', mode: 'cors'}).then((res)=> {
                return res.json();
            }).then((res)=> {
                let timeRts = timeRtss.rts;
                for (let i = 0; i < res.length; i++) {
                    let timePrices = (res[i].description).substring(0, 2);
                    parseInt(timePrices) <= parseInt(timeRts) ? res[i].control = true : res[i].control = false;
                }
                ;
                this.setState({
                    timePrice: res
                })
            });

        });
    }

    //点击选择套餐
    priceColor(total, index, time, originalPrice, control) {
        let aLi = document.querySelectorAll('.pricesList li');
        // 判断预约套餐
        if (!control) {
            return false
        }
        // 点击选择套餐
        for (let i = 0; i < aLi.length; i++) {

            for (let j = 0; j < aLi.length; j++) {
                aLi[j].className = '';
            }
            aLi[index].className = 'active';

            this.setState({
                price: total,
                time: time,
                originalPrice: originalPrice,
                on: true
            })
        }
    }

//提交预约
    handleSubmit() {
        document.body.style.overflow='hidden';
        confirmAlert({
            title: '确定提交订单吗？',                        // Title dialog
            message: '',                                   // Message dialog
            confirmLabel: '确认',                           // Text button confirm
            cancelLabel: '取消',                             // Text button cancel
            onConfirm: () => {
                document.body.style.overflow='';
                let strtime = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + this.state.valueGroups.secondName;
                let date = new Date(strtime.replace(/-/g, '/'));//时间转化为时间戳
                let beginTime = date.getTime();
                this.setState({
                    beginTime: beginTime
                });
                console.log("我是提交的预约的时间" + beginTime)

                if (this.state.time == '0') {
                    alert("请选择时长")
                    //this.refs.submit.style.backgroundColor='#ffce00';
                } else {
                    this.refs.orderLoading.style.display = 'block';
                    let urlSub = Config.api.reserveOrders + '/' + this.state.machineId;
                    let param = {
                        "beginTime": beginTime,
                        "duration": parseInt(this.state.time),
                        "machine": {"id": this.state.machineId},
                        "price": {
                            "price": this.state.price,
                            "originalPrice": this.state.originalPrice
                        }
                    };
                    //提交接口的调取

                    fetch(urlSub, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                        body: JSON.stringify(param)
                    }).then((res)=> {
                        console.log(res)
                        return res.json()
                    }).then((res)=> {
                        this.refs.submit.style.background = '#cccccc';
                        this.refs.submit.disabled = true;
                        this.refs.submit.value = '正在提交';
                        console.log(res);

                        if (res.status == 500 || res.message ==
                            "ERR:RESERVE_FAILED"||res.message=="ERR:RESERVE_OUT_OF_RANGE") {
                            this.refs.orderLoading.style.display = 'none';
                            alert("此时段已被预约，请刷新页面重新预约")
                            return false
                        }

                        //微信支付接口的调取
                        let pack = res.unifiedOrder.package.substring(res.unifiedOrder.package.indexOf('=') + 1,res.unifiedOrder.package.length);
                        console.log(res.payed)
                        if (res.payed) {
                            console.log(pack)
                            let url = Config.api.wepay + '/' + pack;
                            console.log('我是pack' + url)
                            fetch(url, {method: 'GET'}).then((res)=> {
                                return res.json()
                            }).then((res)=> {
                                console.log(res)
                                let data = {
                                    beginTime: res.beginTime,
                                    endTime: res.endTime,
                                    address: res.machine.address.formattedAddress,
                                    indexInGroup: res.machine.indexInGroup,
                                    duration: res.duration
                                };
                                console.log(this.refs.orderLoading)
                                this.refs.orderLoading.style.display = 'none';
                                window.location.href = '/reserve/pay_success/'+pack;
                            })
                        } else {
                            console.log('微信支付' + this.refs.orderLoading);
                            console.log(pack)
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
                                                            n++
                                                            console.log(n)
                                                        } else {
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

                                    alert("支付未完成!");
                                    _this.refs.orderLoading.style.display = 'none';
                                    window.location.href='/reserve/order';
                                },
                                fail:function (resp) {
                                     console.log(resp)
                                    alert("支付失败")
                                    _this.refs.orderLoading.style.display = 'none';
                                    window.location.href='/reserve/order';
                                }
                            });
                        }
                    })
                }
            },
            onCancel: () => {
                document.body.style.overflow='';
            },
        });

    }

    // 时间轴
    handleChange = (name, value) => {
        this.setState(({valueGroups}) => ({
            valueGroups: {
                ...valueGroups,
                [name]: value
            }
        }));
    };

    render() {
        console.log(this.state.valueGroups.secondName);
        const {optionGroups, valueGroups} = this.state;
        const timePrice = this.state.timePrice;
        let min = Number(this.state.time);
        let h = parseInt(this.state.valueGroups.secondName.substring(0, 2));//截取小时时间
        let m = parseInt(this.state.valueGroups.secondName.substring(3,)) + min;//截取分钟时间
        let mi = m % 60;
        return (
            <div className="order">
                <Header>
                    <p>{this.state.roomAddress}</p>
                </Header>
                <div className="startTime">
                    <h1>起始时间</h1>
                    <div className="picker">
                        <Picker
                            valueGroups={valueGroups}
                            optionGroups={optionGroups}
                            onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className="priceTime">
                    <h2>预约时长</h2>
                    <ul className="pricesList">
                        {timePrice.map((value, index)=> {
                            let time = value.key.substring(4,);
                            return <li key={index}
                                       onTouchStart={this.priceColor.bind(this,value.price.price,index,time,value.price.originalPrice,value.control)}
                                       style={{backgroundColor:value.control?'':'#cccccc'}}>
                                <p ref="clock">{time}分钟</p>
                                <p>¥{(value.price.originalPrice)/100}元</p>
                                <p className="unitPrice">¥{(value.price.price) / 100}元</p>
                            </li>
                        })}
                    </ul>
                    <p className="show">
                        您预约的演唱时间为：{this.state.valueGroups.secondName}——
                        <span className="showOrderTime"
                              style={{display:this.state.on?'inline-block':'none'}}>{m >= 60 ? (h + 1) >= 24 ? '00' : h + 1 : h}:{m >= 60 ? mi < 10 ? '0' + mi : mi : m < 10 ? '0' + m : m}</span>
                    </p>
                </div>
                <div className="submitOrder clearFix">
                    <span className="fl">合计：¥{(this.state.price) / 100}元</span>
                    <input type="submit" value={'提交订单'} onClick={this.handleSubmit.bind(this)} className="fr"
                           ref="submit"/>
                </div>
                <div className="orderLoading" ref="orderLoading"></div>
            </div>
        )
    }
}
export default PayOrder

