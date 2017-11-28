/**
 * Created by qinshiju on 2017/6/23.
 */
import React,{Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import 'whatwg-fetch';
import './pay_success.css';
import Config from '../../common/config';
import '../../common/anyway';
import MPConfig from '../../common/mp_config'

class PaySuccess extends Component{
    constructor(props){
        super(props);
        console.log(this.props)
        this.state={
            pack:this.props.match.params.pack,
            successList:{}
        }
    }
    componentDidMount(){
        MPConfig()
        document.body.style.backgroundColor='#f5f5f5';
        document.title='支付成功';
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        let url = Config.api.wepay + '/' + this.state.pack;
        console.log(url)
        fetch(url,{method:'GET'}).then((res)=>{return res.json()}).then((res)=>{
            console.log(res)
            let retrievedObject = {
                beginTime: res.beginTime,
                endTime: res.endTime,
                address: res.machine.address.formattedAddress,
                indexInGroup: res.machine.indexInGroup,
                duration: res.duration
            };
            this.setState({
                successList:retrievedObject
            })

        });
    }
    //展示预约的时间段
    timeChange(time) {
        let date = new Date(time);
        let Y = (isNaN(date.getFullYear())?'':date.getFullYear() )+ '-',
            M = (isNaN(date.getMonth())?'':  (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)) + '-',
            D = (isNaN(date.getDate())?'':date.getDate())  + ' ',
            h = date.getHours() + ':',
            m = isNaN(date.getMinutes())?'': date.getMinutes() < 10? '0' + date.getMinutes() : date.getMinutes();
            let hl=m>55?isNaN(date.getHours())?'': date.getHours()+1+':':isNaN(date.getHours())?'':date.getHours()+':';
            let ml=m>55?'00':m;

        return Y + M + D +hl +ml;
    }
    render(){
        let value=this.state.successList;
        console.log(parseInt(value.endTime)+parseInt(6000))
        return(
            <div className="paySuccess">
                <div className="payImg">
                    <p className="payText">支付成功</p>
                    <p className="payContent">到达预定包房，微信扫描屏幕二维码，开始欢唱之旅</p>
                </div>
                <div className="payTime">
                    <span>您已成功预约<i>{value.duration}</i>分钟时长</span>
                </div>
                <div className="payDetail">
                    <p className="slot">
                        预约时段：{this.timeChange(value.beginTime)}—{this.timeChange(value.endTime).substring(this.timeChange(value.endTime).indexOf(' ') + 1,)}
                    </p>
                    <p className="songAddress">
                        包房地址：{value.address}
                    </p>
                    <p className="songRoom">
                        包房号码：{value.indexInGroup}号
                    </p>
                </div>
                <div className="remakes">
                    *无法退款
                </div>
            </div>
        )
    }
}
export default PaySuccess