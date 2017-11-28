/**
 * Created by qinshiju on 2017/7/23.
 */
import React, {Component} from 'react';
import 'whatwg-fetch';
import './inquiry_time.css';
import Config from '../common/config';
class InquiryTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mid: '',
            freeBusy: '',
            timePrice: [],
        }

    }

    componentDidMount() {
        document.title = '查询等待时长';
        let mid = window.location.href.substring(window.location.href.indexOf('=') + 1,);
        this.setState({
            machineId: mid
        });
        //空闲状态
        let url = Config.api.details + '/' + mid + '/current-conversation';
        fetch(url, {method: 'GET', credentials: 'include'}).then((res)=> {
            return res.json()
        }).then((res)=> {
            console.log(res);
            this.setState({
                freeBusy: res,
            });
        });
        //价格接口
        let urlPrice = Config.api.machines + '/' + mid+'/prices';
        fetch(urlPrice, {method: "GET"}).then((res)=> {
            return res.json();
        }).then((res)=> {
            this.setState({
                timePrice: res

            })
        });
    }
    render() {
        let freeBusy = this.state.freeBusy;
        let timePrice = this.state.timePrice;
        return (
            <div className="inquiry">
                <div className="icon">
                    <img src={require('./images/icon.png')} alt="icon"/>
                    <div>
                        <p className="roomStatus">
                            当前包房【<span>{freeBusy.currentStatus == 'BUSY'|| freeBusy.currentStatus=='WAIT'? '演唱中' : '空闲'}</span>】
                        </p>
                        <p className="behind">{freeBusy.currentStatus == 'BUSY'||freeBusy.currentStatus=='WAIT'?freeBusy.orderType=='SONG_1'?'只点了单曲套餐，很快结束哦~':freeBusy.beginBefore == null||freeBusy.beginBefore==0?'':'等待时长大约':'马上进入包房，扫码开唱吧～'}
                            <i>{freeBusy.beginBefore == null ? '' : freeBusy.beginBefore > 0 ? Math.abs(freeBusy.beginBefore) < 10 ? '0' + Math.abs(freeBusy.beginBefore) + '分钟' : Math.abs(freeBusy.beginBefore) + '分钟' : ''}</i>
                        </p>
                    </div>
                </div>
                <div className="showPrice">
                    <h1>欢唱价格</h1>
                    <div className="pricePackage">
                        <ul className="packageUl">
                            <li>欢唱一首</li>
                            <li>15分钟</li>
                            <li>30分钟</li>
                            <li>45分钟</li>
                            <li>60分钟</li>
                        </ul>
                        <ul className="priceUl">
                            {timePrice.map((val,index)=>{
                                return <li key={index}>
                                    {val.price.price/100}元
                                </li>
                            })}

                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <p>预约功能，敬请期待...</p>
                </div>
            </div>
        )
    }
}
export default InquiryTime;