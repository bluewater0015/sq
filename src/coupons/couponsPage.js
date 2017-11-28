/**
 * Created by qinshiju on 2017/7/28.
 */
import React, {Component} from 'react';
import './couponsPage.css';
import 'whatwg-fetch';
import Config from '../common/config';

class MyCoupons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{}],
            pastData: [{}],
            closedData: [{}],
        }
    }

    componentDidMount() {
        document.title = '我的优惠券';
        document.body.style.backgroundColor = '#F7F7F5';
        //未使用的
        let url = Config.api.userPage + '?status=ACTIVE&useStatus=N';
        fetch(url, {method: "GET", credentials: 'same-origin'}).then((res) => {
            return res.json()
        }).then((res) => {
            console.log("可使用的"+res.data)
            if (res.result === 0) {
                this.setState({
                    data: res.data
                })
            }
        })
        //使用过的
        let pastURL = Config.api.userPage + '?status=ACTIVE&useStatus=Y';
        fetch(pastURL, {method: "GET", credentials: 'same-origin'}).then((res) => {
            return res.json()
        }).then((res) => {
            console.log(res)
            if (res.result == 0) {
                this.setState({
                    pastData: res.data,
                })
            }

        });
        //过期的
        let closedURL = Config.api.userPage + '?status=CLOSED&useStatus=N';
        fetch(closedURL, {method: 'GET', credentials: 'same-origin'}).then((res) => {
            return res.json()
        }).then((res) => {
            console.log(res)
            if (res.result == 0) {
                this.setState({
                    closedData: res.data,
                })
            }

        })
    }

    creativeTime(str) {
        if (str == '') {
            return false
        }
        let time = new Date(str)
        let Y,M,D,H,Minu;
        Y = time.getFullYear()
        M = time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1):time.getMonth()+1
        D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        H = time.getHours() <10?'0'+time.getHours():time.getHours();
        Minu = time.getMinutes() <10 ?'0'+time.getMinutes():time.getMinutes()
        return Y+"."+M+"."+D+" "+H+":"+Minu
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
            return "全部套餐通用"
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
    toExchange(){
        this.props.history.push('/coupons/exchange')
    }
    render() {
        let couponsData = this.state.data;
        return (
            <div className="wrap-coupons">{couponsData.length == 0 && this.state.pastData.length == 0 && this.state.closedData.length == 0 ?
                <div className="noRecording"><img src={require('./images/couponsBlank.png')} alt="无优惠券"/></div> :
                <div className="couponsList">
                    {couponsData.length == 0 ? '' : <div>
                        <div className="useTitle">
                            <i></i>
                            <span>可使用优惠券</span>
                            <i></i>
                        </div>
                        <ul className="notUsed">
                            {couponsData.map((useCoupon, index) => {
                                if (useCoupon.couponDTO != undefined) {
                                    return <li key={index}>
                                        <div className="coupon-title">{useCoupon.couponDTO.couponTypeString}</div>
                                        <div className="coupons-type">
                                            {useCoupon.couponDTO.discount === 0?                                            <p className='couple-sale-free'>免费欢唱</p>
                                                :                                            <p className='coupons-sale'>{useCoupon.couponDTO.discount}<span className="sale-name">折</span></p>
                                            }
                                        </div>
                                        <div className="timeAddress">
                                            <h1 className="coupons-exchange-title">{useCoupon.couponDTO.name}</h1>
                                            <p className="coupons-time">{this.creativeTime(useCoupon.beginTime)}-{this.creativeTime(useCoupon.endTime)}</p>
                                            {useCoupon.couponDTO.useUserType === 'ALLUSERS'?<p className="coupons-top">新客老客通用；</p>:<p className="coupons-top">限{useCoupon.couponDTO.useUserTypeString}:</p>}
                                            <p>{this.toSongType(useCoupon.couponDTO.couponOrderTypes)}；</p>
                                            {useCoupon.couponDTO.city === null?<p>全国通用；</p>:<p>限{useCoupon.couponDTO.city}{useCoupon.couponDTO.address?useCoupon.couponDTO.address:'全部点位'}</p>}
                                            {useCoupon.couponDTO.couponUseDates === null || this.toDateType(useCoupon.couponDTO.couponUseDates) === '通用'?<p>工作日休息日通用；</p>:<p>{this.toDateType(useCoupon.couponDTO.couponUseDates)}；</p>}
                                            <p>限{useCoupon.couponDTO.starHour === 0 ?'00':useCoupon.couponDTO.starHour}:00 - {useCoupon.couponDTO.endHour}:00</p>
                                        </div>
                                    </li>
                                }
                            })}
                        </ul>
                    </div>}
                    {this.state.pastData.length === 0 && this.state.closedData.length === 0 ? '' : <div>
                        <div className="useTitle useMgl">
                            <i></i>
                            <span>不可使用优惠券</span>
                            <i></i>
                        </div>
                        <div></div>
                        <ul className="notUsed pastUsed">
                            {this.state.pastData.map((useCoupon, index) => {
                                if (useCoupon.couponDTO !== undefined) {
                                    return <li key={index}>
                                        <div className="coupon-title">{useCoupon.couponDTO.couponTypeString}</div>
                                        <div className="coupons-type">
                                            {useCoupon.couponDTO.discount === 0?                                            <p className='couple-sale-free'>免费欢唱</p>
                                                :                                            <p className='coupons-sale'>{useCoupon.couponDTO.discount}<span className="sale-name">折</span></p>
                                            }
                                        </div>
                                        <div className="timeAddress notColor">
                                            <h1 className="coupons-exchange-title">{useCoupon.couponDTO.name}</h1>
                                            <p>{this.creativeTime(useCoupon.beginTime)}-{this.creativeTime(useCoupon.endTime)}</p>
                                            {useCoupon.couponDTO.useUserType === 'ALLUSERS'?<p className="coupons-top">新客老客通用；</p>:<p className="coupons-top">限{useCoupon.couponDTO.useUserTypeString}；</p>}
                                            <p>{this.toSongType(useCoupon.couponDTO.couponOrderTypes)}；</p>
                                            {useCoupon.couponDTO.city === null?<p>全国通用；</p>:<p>限{useCoupon.couponDTO.city}{useCoupon.couponDTO.address?useCoupon.couponDTO.address:'全部点位'}；</p>}
                                            {useCoupon.couponDTO.couponUseDates === null || this.toDateType(useCoupon.couponDTO.couponUseDates) === '通用'?<p>工作日休息日通用；</p>:<p>{this.toDateType(useCoupon.couponDTO.couponUseDates)}；</p>}
                                            <p>限{useCoupon.couponDTO.starHour === 0?'00':useCoupon.couponDTO.starHour}:00 - {useCoupon.couponDTO.endHour}:00</p>
                                        </div>
                                    </li>
                                }
                            })}
                            {this.state.closedData.map((useCoupon, index) => {
                                if (useCoupon.couponDTO != undefined) {
                                    return <li key={index}>
                                        <div className="coupon-title">{useCoupon.couponDTO.couponTypeString}</div>
                                        <div className="coupons-type">
                                            {useCoupon.couponDTO.discount === 0?                                            <p className='couple-sale-free'>免费欢唱</p>
                                                :                                            <p className='coupons-sale'>{useCoupon.couponDTO.discount}<span className="sale-name">折</span></p>
                                            }
                                        </div>
                                        <div className="timeAddress notColor">
                                            <h1 className="coupons-exchange-title">{useCoupon.couponDTO.name}</h1>
                                            <p>{this.creativeTime(useCoupon.beginTime)}-{this.creativeTime(useCoupon.endTime)}</p>
                                            {useCoupon.couponDTO.useUserType === 'ALLUSERS'?<p className="coupons-top">新客老客通用；</p>:<p className="coupons-top">{useCoupon.couponDTO.useUserTypeString}:</p>}
                                            <p>限{this.toSongType(useCoupon.couponDTO.couponOrderTypes)}；</p>
                                            {useCoupon.couponDTO.city === null?<p>全国通用；</p>:<p>限{useCoupon.couponDTO.city}{useCoupon.couponDTO.address?useCoupon.couponDTO.address:'全部点位'}；</p>}
                                            {useCoupon.couponDTO.couponUseDates === null?<p>工作日休息日通用；</p>:<p>{this.toDateType(useCoupon.couponDTO.couponUseDates)}；</p>}
                                            <p>限{useCoupon.couponDTO.starHour === 0?'00':useCoupon.couponDTO.starHour}:00 - {useCoupon.couponDTO.endHour}:00</p>
                                        </div>
                                    </li>
                                }
                            })}
                        </ul>
                    </div>}
                    <div className="coupons-exchange" onClick={this.toExchange.bind(this)}>我要兑换</div>
                </div>
            }
            </div>
        )
    }
}

export default MyCoupons
