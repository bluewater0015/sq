/**
 * Created by qinshiju on 2017/5/31.
 */
import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import Config from '../common/config';
import Header from '../components/head_address/head_address';
import 'whatwg-fetch';
import './scan.css';
import './rem';
import '../common/anyway';
import MPConfig from '../common/mp_config';
let oDate = new Date();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomsContent: [],
            addressDetail: '',
            mid:''
        }
    }

    componentDidMount() {
        MPConfig()
        document.title = '预约';
       let mid=window.location.href.substring(window.location.href.indexOf('=')+1,);
        this.setState({
            mid:mid
        });
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        //本地
        // let url = Config.api.machines + "?cityCode=010&formattedAddress=" + encodeURIComponent("朝阳");
        // fetch(url, {method: 'GET', credentials: 'include'}).then((res)=> {
        //     return res.json()
        // }).then((res)=> {
        //     console.log(res)
        //     this.setState({
        //         roomsContent: res,
        //         addressDetail: res[0].machine.address,
        //     })
        //
        // });
        //测试2
        let _this=this;
        let map = new window.AMap.Map(_this.refs.map, {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function () {
            let geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonOffset: new window.AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);
            window.AMap.event.addListener(geolocation, 'error', onError);
        });
        function onComplete(data) {
            console.log(data)
            let citycode = data.addressComponent.citycode;
            let value=data.addressComponent.district;
            let url = Config.api.machines + "?cityCode="+citycode+"&formattedAddress=" + encodeURIComponent(value);
            console.log(url)
            fetch(url, {method: 'GET', credentials: 'include'}).then((res)=> {
                return res.json()
            }).then((res)=> {
                console.log(res);
                _this.setState({
                    roomsContent: res,
                    addressDetail: res[0].machine.address
                })
                console.log("测试数据")
            })

        }

        //解析定位错误信息
        function onError(data) {
            //document.getElementById('tip').innerHTML = '定位失败';
            console.log(data)
            alert("定位失败")
        }



    }
    render() {
        let rooms = this.state.roomsContent;
        let address = this.state.addressDetail;
        console.log(rooms)
        console.log(address)
        console.log(this.state.mid)
        return (
            <div className="order" >
                <div ref="map" className="map" style={{display:"none"}} ></div>
                <Header>
                    <p>{address.formattedAddress}</p>
                </Header>
                <ul className="orderList">
                    {rooms.map((key, index)=> {
                        console.log(key)
                        return <Link
                            to={{pathname:"/reserve/schedules/"+encodeURIComponent(address.formattedAddress)+'/'+key.machine.id+'/'+oDate.getTime()}}
                            key={index}>
                            <li style={{backgroundColor:key.machine.id==this.state.mid?'#f5f5f5':''}}>
                                <div
                                    style={{backgroundImage:key.machine.id==this.state.mid?`url(${require("./images/sina.png")})`:''}}>
                                    <span>{key.machine.indexInGroup}号包房</span>
                                    <span>{key.beginBefore >= 0 ? "空闲" : "演唱中"}</span>
                                    <span className="wait">{key.beginBefore >= 0? "无需等待" : "等待时长："}
                                        <span>{key.beginBefore >= 0 ? '' :  parseInt(key.beginBefore.toString().substring(1,))<10?'0'+parseInt(key.beginBefore.toString().substring(1,))+'分':parseInt(key.beginBefore.toString().substring(1,))+'分'}</span>
                            </span>
                                    <span className="btnOrder ">预约</span>
                                </div>
                            </li>
                        </Link>
                    })}
                </ul>
                <Link to={{pathname:"/reserve/search"}}>
                    <div className="seeAddress">
                        <span>没有空闲的包房？</span>
                        <span>查看附近的星糖miniKTV</span>
                    </div>
                </Link>
            </div>
        )
    }
}
export default Scan
