/**
 * Created by qinshiju on 2017/6/2.
 */
import React, {Component}from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import 'whatwg-fetch';
import './search.css';
import '../scan/rem';
import Config from '../common/config';
import MPConfig from '../common/mp_config';
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressMock: [],
            on: false
        }
    }

    componentDidMount() {
        MPConfig();
        localStorage.clear();
        document.title = '预约';
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
    }

    //地址定位与搜索
    showChange() {
        let value = this.refs.text.value;
        let _this = this;
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        let content = reg.test(value);
        if (content) {
            if (!this.state.on) {
                this.refs.loading.style.display = 'block'
            }
            //本地
            // setTimeout(function () {
            //     let url=Config.api.machines+"?cityCode=010&formattedAddress="+encodeURIComponent(value)
            //     fetch(url, {method: 'GET', credentials: 'include'}).then((res)=> {
            //         return res.json()
            //     }).then((res)=> {
            //         console.log(res);
            //         if(res.length==0){
            //             alert("无包房可约")
            //         }else {
            //             _this.setState({
            //                 addressMock: res,
            //                 on: true
            //             })
            //             localStorage.setItem('address',encodeURIComponent(res[0].machine.address.formattedAddress))
            //         }
            //     });
            // }, 1000);
            // 测试
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
                console.log(data);
                let citycode = data.addressComponent.citycode;
                let url = Config.api.machines + "?cityCode="+citycode+"&formattedAddress=" + encodeURIComponent(value);
                fetch(url, {method: 'GET', credentials: 'include'}).then((res)=> {
                    return res.json()
                }).then((res)=> {
                    console.log(res);
                    _this.setState({
                        addressMock: res,
                        on:true
                    })
                    localStorage.setItem('address',encodeURIComponent(res[0].machine.address.formattedAddress))
                })
            }

            //解析定位错误信息
            function onError(data) {
                alert("定位失败")
            }
        }

        if (!value) {
            this.setState({
                addressMock: []
            })
            this.refs.loading.style.display = 'none'
        }
    }

    //取消搜索框的内容
    deleteValue() {
        this.refs.text.value = '';
        if (!this.refs.text.value) {
            this.setState({
                addressMock: [],
                on: false
            })
        }
        this.refs.loading.style.display = 'none'

    }

    render() {
        console.log(this.state.addressMock);
        return (
            <div className="seachAddress">
                <div className="seach">
                    <div ref="map" className="map" style={{display:"none"}}></div>
                    <input type="text" placeholder="搜索" ref="text" onInput={this.showChange.bind(this)}/>

                    <span onTouchStart={this.deleteValue.bind(this)}>取消</span>
                </div>
                <div className="loading" ref="loading" style={{display:this.state.on?'none':''}}>
                    正在加载......
                </div>
                <ul className="addressList">
                    {this.state.addressMock.map((key, index)=> {
                        return <Link
                            to={{pathname:'/reserve/rooms&'+encodeURIComponent(key.machine.address.cityCode)}}
                            key={index}>
                            <li className="clearFix">
                                <div className="content fl">
                                    <p>{key.machine.address.formattedAddress}</p>
                                    <p>{key.machine.address.address}</p>
                                </div>
                                <div className="btnOrders fr">
                                    <span>预约</span>
                                    <span>> 100m</span>
                                </div>
                            </li>
                        </Link>
                    })}
                </ul>
            </div>
        )
    }

}
export default Search