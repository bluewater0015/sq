/**
 * Created by qinshiju on 2017/7/26.
 */
import React, {Component} from 'react';
import 'whatwg-fetch';
import './voucher.css';
import Config from '../common/config';
import MPConfig from '../common/mp_config';

class Voucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            on: false,
            orderType: '',
            endTime: '',
            status: 500,
            description: '',
            id: 0,
            couponData: {}

        }
    }

    componentDidMount() {
        MPConfig()
        document.title = '领取优惠券';
        let nowURL = window.location.href;
        console.log(nowURL.indexOf('sid') != -1)
        var addURL = null;
        if (nowURL.indexOf('sid') != -1) {
            let couponId = nowURL.substring(nowURL.indexOf('=') + 1, nowURL.lastIndexOf('&'));
            let code = nowURL.substring(nowURL.lastIndexOf('=') + 1,);
            addURL = Config.api.userAdd + '/' + couponId + '/add?sid=' + code;
        } else {
            let couponId = nowURL.substring(nowURL.indexOf('=') + 1,);
            addURL = Config.api.userAdd + '/' + couponId + '/add';
        }
        console.log(addURL)
        fetch(addURL, {
            method: "PUT",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            credentials: 'same-origin',
        }).then((res)=> {
            this.setState({
                status: res.status
            });
            return res.json()
        }).then((res)=> {
            if (res.result === 0) {
                this.setState({
                    couponData:res.data
                })
            }
            if (res.message == "ERR:CHANNEL_COUPON_RECEIVED") {
                this.setState({
                    id: 1
                });
                return false
            } else if (res.message == "ERR:CHANNEL_COUPON_UNDER_STOCK") {
                this.setState({
                    id: 2
                });
                return false
            }

        });
    }

    creativeTime(time) {
        if (time == '') {
            return false
        }
        let date = new Date(time);
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        let H = date.getHours() <10?'0'+date.getHours():date.getHours();
        let Minu = date.getMinutes() <10 ?'0'+date.getMinutes():date.getMinutes()
        return Y + M + D+" "+H+":"+Minu
    }
    toSongType(songArray){
        if(songArray.indexOf('SONG_1')>-1){
            songArray[songArray.indexOf('SONG_1')]='欢唱一首'
        }
        if(songArray.indexOf('MIN_15')>-1){
            songArray[songArray.indexOf('MIN_15')]='15分钟'
        }
        if(songArray.indexOf('MIN_30')>-1){
            songArray[songArray.indexOf('MIN_30')]='30分钟'
        }
        if(songArray.indexOf('MIN_45')>-1){
            songArray[songArray.indexOf('MIN_45')]='45分钟'
        }
        if(songArray.indexOf('MIN_60')>-1){
            songArray[songArray.indexOf('MIN_60')]='60分钟'
        }
        if(songArray.indexOf('欢唱一首')>-1 && songArray.indexOf('15分钟')>-1 && songArray.indexOf('30分钟')>-1 && songArray.indexOf('45分钟')>-1 && songArray.indexOf('60分钟')>-1){
            return "全部套餐通用；"
        }else{
            return "限"+songArray.join(',')
        }
    }
    toDateType(dateArray){
        if(dateArray.indexOf('MONDAY')>-1){
            dateArray[dateArray.indexOf('MONDAY')]='星期一'
        }
        if(dateArray.indexOf('TUESDAY')>-1){
            dateArray[dateArray.indexOf('TUESDAY')]='星期二'
        }
        if(dateArray.indexOf('WEDNESDAY')>-1){
            dateArray[dateArray.indexOf('WEDNESDAY')]='星期三'
        }
        if(dateArray.indexOf('THURSDAY')>-1){
            dateArray[dateArray.indexOf('THURSDAY')]='星期四'
        }
        if(dateArray.indexOf('FRIDAY')>-1){
            dateArray[dateArray.indexOf('FRIDAY')]='星期五'
        }
        if(dateArray.indexOf('SATURDAY')>-1){
            dateArray[dateArray.indexOf('SATURDAY')]='星期六'
        }
        if(dateArray.indexOf('SUNDAY')>-1){
            dateArray[dateArray.indexOf('SUNDAY')]='星期天'
        }
        if(dateArray.indexOf('星期一')>-1 && dateArray.indexOf('星期二')>-1 && dateArray.indexOf('星期三')>-1 && dateArray.indexOf('星期四')>-1 && dateArray.indexOf('星期五')>-1 && dateArray.indexOf('星期六')>-1 && dateArray.indexOf('星期天')>-1){
            return '工作日休息日通用'
        }else {
            return "限"+dateArray.join(',')
        }

    }
    goUse() {
        this.setState({
            on: true
        });
        window.wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.status === 500 ||this.state.status === 404 ? <div className="fail">
                    <img src={require('./images/dyq.png')} alt="fail"/>
                    <p className="noText">很抱歉，您无法获得抵用券</p>
                    <p className="textItem">您领取该优惠劵的数量已达上限或时间以超出领取有效期</p>
                    <p className="textItem receive-fail">您可以直接扫描左下角二维码开启欢唱之旅哟～</p>
                    <p className="receive-fail-button receive-fail" onClick={this.goUse.bind(this)}>立即扫码欢唱</p>
                </div>:'' }
                <div className="receive" style={{display: this.state.status == 500 ||this.state.status === 404 ? 'none' : 'block'}}>
                    <div className="receive-coupons-title">
                        <p>恭喜您</p>
                        <p>获得星糖miniKTV欢唱抵用券</p>
                    </div>
                    {this.state.couponData.id ?<div className="notUsed voucherState received-coupons
">
                        <div className="coupon-vocher-title">{this.state.couponData.couponDTO.couponTypeString}</div>
                        <div className="coupons-type voucher-type">
                            {this.state.couponData.couponDTO.discount === 0?                                            <p className='couple-sale-free'>免费欢唱</p>
                                :                                            <p className='coupons-sale vocher-sale'>{this.state.couponData.couponDTO.discount}<span className="sale-name">折</span></p>
                            }
                        </div>
                        <div className="timeAddress vocher-address">
                            <h1 className="coupons-exchange-title">{this.state.couponData.couponDTO.name}</h1>
                            <p>{this.creativeTime(this.state.couponData.beginTime)}-{this.creativeTime(this.state.couponData.endTime)}</p>
                            {this.state.couponData.couponDTO.useUserType === 'ALLUSERS'?<p className="coupons-top">新客老客通用;</p>:                            <p className="coupons-top">限{this.state.couponData.couponDTO.useUserTypeString}:</p>
                            }
                            <p>{this.toSongType(this.state.couponData.couponDTO.couponOrderTypes)}</p>
                            {this.state.couponData.couponDTO.city === null?<p>全国通用；</p>:<p>限{this.state.couponData.couponDTO.city}{this.state.couponData.couponDTO.address?this.state.couponData.couponDTO.address:'全部点位'}；</p>}
                            {this.state.couponData.couponDTO.couponUseDates === null?<p>工作日休息日通用</p>:<p>{this.toDateType(this.state.couponData.couponDTO.couponUseDates)}；</p>}
                            <p>限{this.state.couponData.couponDTO.starHour === 0?'00':this.state.couponData.couponDTO.starHour}:00 - {this.state.couponData.couponDTO.endHour}:00</p>
                        </div>
                    </div>:''}
                    <div className="goUse" onTouchStart={this.goUse.bind(this)} style={{
                        backgroundColor: this.state.on ? '#e04346' : '', color: this.state.on ? '#ffc9ca' : ''
                    }}>立即扫码欢唱
                    </div>
                    <ul className="sup">
                        <li className="li_pdb">1.点击"去使用"会跳转到微信二维码扫描界面，请扫描星糖mimiKTV屏幕左下角的二维码。</li>
                        <li className="li_pdb">2.每个人只能领取1次唱歌优惠劵，重复领取无效。</li>
                        <li>3.最终解释权归星糖miniKTV所有</li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default Voucher

