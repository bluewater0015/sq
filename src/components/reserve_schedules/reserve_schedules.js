/**
 * Created by qinshiju on 2017/6/1.
 */
import React, {Component}from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import 'whatwg-fetch';
import './reserve_schedules.css';
import '../../scan/rem';
import Config from '../../common/config';
import Header from '../head_address/head_address';
import '../../common/anyway';
import MPConfig from '../../common/mp_config'
let oDate = new Date();
let nowYear = oDate.getFullYear();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
let hour = oDate.getHours();
class Schedules extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        let params = props.match.params;
        console.log(params)
        this.state = {
            timeList: [{on:true}],
            roomAddress: '',
            machineId: params.machineId,
            timeMonDay: ''
        }
    }

    componentDidMount() {
        MPConfig()
        this.setState({
            timeMonDay: nowMonth + '月' + nowDay + '日'
        });
        //禁止分享
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        document.title = '预约';
        let url = Config.api.reserveSchedules + "/" + this.state.machineId + "/currdate";
        let param = {
            timeRange: ''
        };
        //时间列表展示
        fetch(url, {method: 'GET', param, credentials: 'include', mode: 'cors'}).then((response)=> {
            return response.json()
        }).then((res)=> {
            console.log(res)
            if (res.length == 0) {
                alert("此包房不能预约");
                return false
            }
            this.setState({
                timeList: res,
                roomAddress:res[0].machine.address.formattedAddress
            });

            let pastOrder = document.querySelectorAll('.pastOrder');
            let aSpick = document.querySelectorAll('.skip');
            let aPatten = document.querySelectorAll('.patten');
            let aLink=document.querySelectorAll('a');
            let aNextTime=document.querySelectorAll('.nextTime');
            let oDate = new Date();
            let minu = oDate.getMinutes();
            let width = aSpick[0].offsetWidth;
            let fristTime = res[0].begin;
            let widthChangeTime = width / 60 * minu / 20;//当前时间所要改变的距离
            let fristWidthChange = width / 60 * fristTime / 20;//当前时间的开始时间begin所要改变的距离
            console.log(widthChangeTime)
            console.log(fristWidthChange)
            if (Number(widthChangeTime) > Number(fristWidthChange) || res[0].status == 1) {
                //当前时间的展示判断
                console.log(777)
                pastOrder[0].style.width = '5.5rem';
                aPatten[0].style.paddingLeft = '4rem';
                console.log(minu)
                if (Number(widthChangeTime) > Number(9) || res[0].status == 2) {
                    console.log(9999)
                    widthChangeTime = '12rem';
                    pastOrder[0].style.width = widthChangeTime;
                    if (pastOrder[0].style.width == '12rem') {
                        pastOrder[0].style.borderBottomRightRadius = '.875rem';
                        pastOrder[0].style.borderTopRightRadius = '.875rem';
                        aLink[0].style.width='0';
                        aNextTime[0].style.paddingLeft='13.45rem';
                        aSpick[0].style.width='0';
                    }
                }
            }
            if (res[0].status == 2) {
                pastOrder[0].style.width = '12rem';
                aPatten[0].style.paddingLeft = ((width / 20) / 20 - 0.8) + 'rem';
                pastOrder[0].style.borderBottomRightRadius = '.875rem';
                pastOrder[0].style.borderTopRightRadius = '.875rem';
                aLink[0].style.width='0';
                aNextTime[0].style.paddingLeft='13.45rem';
                aSpick[0].style.width='0';
            }
            //时间进度条的改变
            for (let i = 1; i < aSpick.length; i++) {
                if (res[i].status == 1) {
                    console.log(888)
                    console.log(minu)

                    pastOrder[i].style.width = '5.5rem';
                    aPatten[i].style.paddingLeft = '4rem';

                } else if (res[i].status == 2) {
                    pastOrder[i].style.width = '12.2rem';
                    aPatten[i].style.paddingLeft = ((width / 20) / 20 - 0.8) + 'rem';
                    pastOrder[i].style.borderBottomRightRadius = '.875rem';
                    pastOrder[i].style.borderTopRightRadius = '.875rem';
                    aLink[i].style.width='0';
                    aNextTime[i].style.paddingLeft='13.45rem';
                    aSpick[i].style.width='0';
                }
                if (res[res.length - 1].begin >= 40) {
                    pastOrder[res.length - 1].style.width = '12.2rem';
                    aPatten[res.length - 1].style.paddingLeft = ((width / 20) / 20 - 0.8) + 'rem';
                    pastOrder[res.length - 1].style.borderBottomRightRadius = '.875rem';
                    pastOrder[res.length - 1].style.borderTopRightRadius = '.875rem';
                    aLink[res.length-1].style.width='0';
                    aNextTime[res.length-1].style.paddingLeft='13.45rem';
                    aSpick[res.length-1].style.width='0';
                }
            }


        }).then((response)=> {
        })
    }

    //预约检查（max接口）
    check(time, index) {
        console.log(this.state.timeList[index].begin)
        console.log("当前时间列表的begin" + this.state.timeList[index].begin);
        let begin = this.state.timeList[index].begin == null ? this.state.timeList[index].begin = '0' : this.state.timeList[index].begin;
        let beginl = begin < 10 ? '0' + begin : begin;
        let timeRange = time;
        let strtime = nowYear + '-' + nowMonth + '-' + nowDay + ' ' + timeRange + ':' + beginl;
        let date = new Date(strtime.replace(/-/g, '/'));//时间转化为时间戳
        let beginTime = date.getTime();
        console.log(this.state.timeList)
        console.log(beginTime)
        let url = Config.api.max + '?machineId=' + this.state.machineId + '&timestamp=' + beginTime;
        fetch(url, {method: "GET", credentials: 'include'}).then((res)=> {
            return res.json();
        }).then((res)=> {
            console.log(res);
        })
    }

    show() {
        this.refs.prompt.style.display = 'none'
    }

    render() {
        const timeList = this.state.timeList;
        return (
            <div className="order">
                <div className="notTime" style={{display:timeList.length==0?'block':'none'}}>
                    <img src={require('./images/noOrder.png')} alt=""/>
                </div>
                <Header style={{height:"3.75rem",display:timeList[0].on?'none':''}}>
                    {this.state.roomAddress}
                </Header>

                <ul className="notes" style={{display:timeList[0].on?'none':''}}>
                    <li>
                        <span className="notesShow"></span>
                        <span>可预约</span>
                    </li>
                    <li>
                        <span className="notesShow"></span>
                        <span>已占用</span>
                    </li>
                </ul>
                <ul className="timeSlot" style={{display:timeList[0].on?'none':''}}>
                    {timeList.map((key, index)=> {
                        return <li key={index}>
                            <span className="pt">{key.timeRange}:00</span>
                            <Link
                                to={{pathname:'/reserve/schedules/pay_order/'+key.timeRange+'&'+this.state.machineId+'&'+key.begin+'&'+oDate.getTime()}}
                                onTouchStart={this.check.bind(this,key.timeRange,index)}>
                                <div className="skip">
                                    <span className="patten">预约</span>
                                </div>
                            </Link>
                            <span className="pastOrder"></span>
                            <span className="nextTime">{parseInt(key.timeRange) + 1 >= 24 ? '00' : parseInt(key.timeRange) + 1}:00</span>
                        </li>
                    })}
                </ul>
                <div className="prompt" ref="prompt" onTouchStart={this.show.bind(this)}>当前时间段已有人在预约</div>
            </div>
        )
    }
}
export default Schedules
