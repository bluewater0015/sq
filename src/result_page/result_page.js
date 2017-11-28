
//摇签结果页面
import './result_page.css';
import React,{ Component } from 'react';
import signImg from './images/sign.png';
import randomImg from './images/dog.png';
import handImg from './images/hand.png';
import iconImg from './images/icon.png';
import 'whatwg-fetch';
import Config from '../common/config';
//import MpConfig from '../common/mp_config';

class ResultPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            imgurl: '',
            nickname: '',
        }
    }
    componentWillMount(){
        //MpConfig();
    }
    componentDidMount(){
        //this.MpConfig();
        //请求接口得到图片
        this.fetchData();
        
        this.setState({
            nickname: localStorage.getItem('nickname')
        })
         //微信分享事件
        
        //var tag = localStorage.getItem('tag');
        //alert(tag);
        // if(tag == 1){
        //     this.fetchData();
        //     localStorage.removeItem('tag');
        // } else {
        //     this.setState({
        //         imgurl: localStorage.getItem('src')
        //     })
        // }

        let urla = "/mp/jsapi/signature?url=" + encodeURIComponent(window.location.href);
        fetch(urla, {method: 'POST', credentials: 'same-origin'}).then((res) => {
            return res.json();
        }).then((res) => {
            //console.log('这个是mp_config' + JSON.stringify(res))
            let config = {
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'scanQRCode',
                    'showOptionMenu',
                ]
            };
            return config

        }).then((res) => {
            console.log('这个是mp_config' + JSON.stringify(res))
            window.wx.config(res);
            this.wxShare();
        });
    }
    
    //微信自定义分享
    wxShare() {
        console.log('wxShare');
        setTimeout(function(){
            window.wx.ready(() => {
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
    //得到图片的信息
    fetchData(){
        let url = Config.api.image;
        //console.info(url)
        fetch(url,{
            method:'GET',
            //credentials: 'same-origin',
        }).then(res =>{
            //console.log(res)
            return res.json()
        }).then(data =>{
            //console.log('data',data);
            //localStorage.setItem('src',data.imageUrl);
            this.setState({
                imgurl: data.imageUrl
            })
        })
    }
    //跳转到应用宝链接
    clickSkipEvent() {
        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.starcandy.wawaji";
    }
    render(){
        return (
            <div className="result_page">
                <div className="sign_box box_center">
                    <div className="sign">
                        <img src={ signImg } alt="" />
                    </div>
                </div>
                <div className="randomImg_box">
                    <div className="random_img">
                        <img src={ this.state.imgurl } alt="" />
                    </div>
                </div>
                <div className="press_box box_center">
                    <div className="box_center set_font font_size15">长按图片保存至相册</div>
                </div>
                <div className="signMessage_box"  onClick={()=> this.clickSkipEvent()}>
                    <div className="sign_message fx">
                        <div className="sign_nickname">
                            <div className="font_size12 nickname_content">
                                <span className="nickname font_weight">{ this.state.nickname }</span>
                                <span className="luck font_weight">的小确幸在哪里？</span>
                            </div>
                            <div className="click_show font_size12 font_weight">点击可见>></div>
                            <div className="store_account font_size12 font_weight">60币已存入您的账户</div>
                        </div>
                        <div className="sign_icon fx_end">
                            <div className="icon">
                                <div className="icon_container box_center">
                                    <div className="icon_box">
                                        <img src={ iconImg } alt="" />
                                    </div>
                                </div>
                                <div className="online font_size10 font_weight">
                                    线上轻松抓娃娃
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // render() {
    //     return(
    //         <div className="result_page" style={{background: '#f99'}}>
    //         </div>
    //     )
    // }
}
export default ResultPage