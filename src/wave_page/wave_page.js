
//摇签页
import React,{Component} from 'react';
import './wave_page.css';
import backImage from './images/sang.png';
//import waveSignImage from './images/sangqian.png';
import waveSignImageGif from './images/sangqian1.gif';
import MpConfig from '../common/mp_config';

//import ConfigAddress from '../common/config_address';
// const bacgroundImage = {
//     backgroundSize: '100% 100%',
//     backgroundImage: 'url(' + backImage + ')'
// }

class WavePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            height: 0,
            waveSignImageGif: waveSignImageGif,
        }
    }
    
    componentWillMount(){
        MpConfig();
    }
    componentDidMount(){
        //微信分享事件
        this.wxShare();
        //监听手机摇动事件
        //this.listenerEvent();
        //添加自动摇一摇
        setTimeout(function(){
            window.location.href = '/resultPage/resultPage';
        },2000);
    }
    //微信自定义分享
    wxShare() {
        setTimeout(function(){
            //通过ready接口处理成功验证
            window.wx.ready(() => {
                //判断当前客户端版本是否支持指定js接口
                window.wx.checkJsApi({
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        console.log(JSON.stringify(res))
                    }
                });
                window.wx.showOptionMenu();
                //let urlWx = ConfigAddress.url.mpPortfolioDetail;
                //测试
                let urlWx = 'http://stage.starcandy.cn/campaign/lucksign';
                //线上
                //let urlWx = 'http://mp.starcandy.cn/campaign/lucksign';
                //分享到朋友圈
                window.wx.onMenuShareTimeline({
                    title: '送你一签，以毒攻毒', // 分享标题
                    link: urlWx,
                    imgUrl: 'http://media.starcandy.cn/advertisement/dbec57b2585399bc6ca537b54c49c5ba',
                    success: function (res) {
                        console.log(res)
                    },
                    cancel: function () {
                    }
                });
                //分享给朋友
                window.wx.onMenuShareAppMessage({
                    title: '送你一签，以毒攻毒',
                    desc: '喝不下的毒鸡汤，分你一碗\n点击查阅',
                    link: urlWx,
                    imgUrl: 'http://media.starcandy.cn/advertisement/dbec57b2585399bc6ca537b54c49c5ba',
                    type: 'link',
                    dataUrl: '',
                    success: function (res) {
                        console.log(res)
                    },
                    cancel: function () {
                    }
                });
            }); 
        },0)
    }
    
    //监听摇一摇事件
    listenerEvent() {
        //console.log('this',this);
        var _this = this;
        // 首先，定义一个摇动的阀值
        var SHAKE_THRESHOLD = 2000;
        // 定义一个变量保存上次更新的时间
        var last_update = 0;
        // 紧接着定义x、y、z记录三个轴的数据以及上一次出发的时间
        var x =0;
        var y =0;
        var z =0;
        var last_x =0;
        var last_y =0;
        var last_z =0;
        //判断移动浏览器是否支持运动传感器事件
        var tag = 0;
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion',function(eventData) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();

                if ((curTime - last_update) > 100) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                    if (speed > SHAKE_THRESHOLD) {
                        ++tag;
                        //清除定时器
                        //clearInterval(_this.timer);
                        //如何在这里拿到组件的this
                        //console.log('_this',_this);
                        //判断是否是第一次，如果是第一次的话,图片换成摇一摇图片，1s之后跳转到下一个页面
                        if( tag == 1) {
                            _this.setState({
                                waveSignImage: waveSignImageGif
                            },()=>{
                                setTimeout(function(){
                                    _this.props.history.push('/resultPage/resultPage');
                                },2000)
                            })
                        }
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }, false);
        } else {
            alert('对不起，您的手机不支持');
        }
    }
    // imgClickEvent() {
    //     //this.props.history.push('/resultPage/resultPage');
    //     window.location.href = '/resultPage/resultPage';
    // }

    render(){
        return (
            <div className="wavePage">
                <img src={ backImage } alt="" />
                <div className="wave_sign">
                    <div className="wave_img">
                        <img src={ this.state.waveSignImageGif } />
                    </div>
                </div>
            </div>
        )
    }

    // render() {
    //     return(
    //         <div className="wave" style={{ background: '#f99'}}>
    //             123
    //         </div>
    //     )
    // }
    

}
export default WavePage





