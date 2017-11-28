import React, {Component} from 'react';
import './map_detail.css';
class MapDetail extends Component {
    constructor(props) {
        super(props);
        let params = props.match.params;
        this.state = {
            address: decodeURIComponent(params.address)
        }
    }

    componentDidMount() {
        document.title='预约'
        let _this = this;
        let map = new window.AMap.Map(_this.refs.map, {
            resizeEnable: true
        })
        map.plugin('AMap.Geolocation', function () {
            let geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            window.AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            window.AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        function onComplete(data) {
            var str = ['定位成功'];
            str.push('经度：' + data.position.getLng());
            str.push('纬度：' + data.position.getLat());
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
            }//如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));

            //规划路线
            let oWalk = document.querySelector('.walk');
            let oPanel = document.querySelector('.bus');
            let oDriving = document.querySelector('.car');
            let longitude=str[1].substring(3,);
            let latitude=str[2].substring(3,)
            bus()
            function walk() {

                let map = new window.AMap.Map(_this.refs.map, {
                    resizeEnable: true,
                    center: [longitude, latitude],
                    zoom: 11
                });
                window.AMap.service('AMap.Walking', ()=> {
                        let walking = new window.AMap.Walking({
                            city: '北京市',
                            map: map,
                            panel: _this.refs.result
                        });
                        walking.search([{keyword: '三元桥', city: '北京'}, {
                            keyword: _this.state.address,
                            city: '北京'
                        }], (status, result)=> {
                        });
                    }
                );
            }

            function bus() {
                console.log(longitude)
                let map = new window.AMap.Map(_this.refs.map, {
                    resizeEnable: true,
                    center: [longitude, latitude],
                    zoom: 11
                });
                window.AMap.service("AMap.Transfer", ()=> {
                    var transOptions = {
                        map: map,
                        city: '北京市',
                        panel: _this.refs.panel,
                        policy: window.AMap.TransferPolicy.LEAST_TIME
                    };
                    var trans = new window.AMap.Transfer(transOptions);
                    trans.search([[longitude, latitude], {keyword: _this.state.address}], (status, result)=> {
                    });
                });
            }

            function car() {
                let map = new window.AMap.Map(_this.refs.map, {
                    resizeEnable: true,
                    center: [longitude, latitude],
                    zoom: 11
                });
                window.AMap.service('AMap.Driving', ()=> {
                    let driving = new window.AMap.Driving({
                        map: map,
                        panel: _this.refs.driving
                    });
                    driving.search([{keyword: '三元桥', city: '北京'}, {
                        keyword: _this.state.address,
                        city: "北京"
                    }], (status, result)=> {
                    });
                });
            }

            oWalk.addEventListener('click', ()=> {
                walk();
                _this.refs.driving.style.display = 'none';
                _this.refs.panel.style.display = 'none';
                _this.refs.result.style.display = 'block';
            }, false)
            oPanel.addEventListener('click', ()=> {
                bus()
                _this.refs.driving.style.display = 'none';
                _this.refs.panel.style.display = 'block';
                _this.refs.result.style.display = 'none';
            }, false)
            oDriving.addEventListener('click', ()=> {
                car()
                _this.refs.driving.style.display = 'block';
                _this.refs.panel.style.display = 'none';
                _this.refs.result.style.display = 'none';
            }, false)
        }

        //解析定位错误信息
        function onError(data) {
            //document.getElementById('tip').innerHTML = '定位失败';
        }

    }

    render() {
        return (
            <div>

                <div className="plans">
                    <ul>
                        <li className="car">驾车</li>
                        <li className="bus">公交</li>
                        <li className="walk">步行</li>
                    </ul>
                </div>
                <div ref="map" className="map"></div>
                <div className="panel" ref="panel"></div>
                <div className="result" ref="result"></div>
                <div className="driving" ref="driving"></div>
            </div>
        )
    }
}
export default MapDetail