
//丧签首页
import React,{Component} from 'react';
import './luck_sign.css';
import Config from '../common/config';

import backImage from './images/luckImage.png';
import nicknameImage from './images/nickname.png';
import confirmImage from './images/confirm.png';
import iconImage from './images/icon.png';
//import ConfigAddress from '../common/config_address';
import MpConfig from '../common/mp_config';

const bacgroundImage = {
    backgroundSize: '100% 100%',
    backgroundImage: 'url(' + backImage + ')'
}

class LuckSign extends Component{
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            height: 0,
            isShowNickImage: true,
            nickname_tips: false,
            //autofocus: '',
        }
    }
   
    componentWillMount(){
        MpConfig();
    }
    componentDidMount(){
        // MpConfig();
        /*正式环境上的百度统计*/
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?303e83ab627ff15a5d6a395c028924a1";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
        //微信自定义分享
        this.wxShare();
    }

    //微信自定义分享
    wxShare() {
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
    //校验用户昵称
    nickNameEvent() {
        //console.log(this.textInput);
        //this.textInput.focus();
        this.setState({
            isShowNickImage: false,
            //autofocus: 'autofocus',
        })

    }
    checkNickNameEvent(e) {
        //console.log('checkNickNameEvent');
        //console.log(e.target.value);

        //没有判断一个汉字为两个字符
        // this.setState({
        //     nickname: e.target.value,
        // },()=>{
        //     var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,12}$/;
        //     if(!(reg.test(this.state.nickname))){
        //         console.log('请输入正确的用户昵称');
        //         this.setState({
        //             nickname_tips: true
        //         })
        //     }else{
        //         this.setState({
        //             nickname_tips: false
        //         })
        //     }
        // })


        this.setState({
            nickname: e.target.value,
        },()=>{
            var nickname = this.state.nickname;
            var result = this.getByteLen(nickname);
            //console.log('result',result);
            if(result > 12){
                console.log('请输入正确的用户昵称');
                this.setState({
                    nickname_tips: true
                })
            }else{
                this.setState({
                    nickname_tips: false
                })
            }
        })
    }
    nickNameChange(e) {
        //console.log('nickNameChange',e.target.value);
    }
    //点击确定跳转到下一个页面
    confirmEvent() {
        console.log('确定');
        if(this.state.nickname && !this.state.nickname_tips) {

            //let url = Config.api.luckSign + "?scanActivityType=SANGQIAN";
            let url = Config.api.luckSign;
            //console.log('url',url);
            // let param = {
            //     'scanActivityType': 'SANGQIAN',
            // }
            var str = 'scanActivityType=SANGQIAN'
            fetch(url,{
                method:'PUT',
                credentials: 'same-origin',
                headers: {
                    //'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: str
            }).then(res =>{
                console.log(res)
                //return res.json()
            }).then(data =>{
                console.log('data',data);
            })
            localStorage.setItem('nickname',this.state.nickname);
            //this.props.history.push('/wavePage/wavePage');
            window.location.href = '/wavePage/wavePage';
        }else {
            this.setState({
                nickname_tips: true
            })
        }
    }
    /*公共函数*/
    //判断汉字还是字符，得到长度
    getByteLen(val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var length = val.charCodeAt(i);
            if(length>=0&&length<=128){
                len += 1;
            }else{
                len += 2;
            }
        }
        return len;
    }
    render() {
        return(
            <div className="lucksign">
                <div className="lucksign_box" style={ bacgroundImage }>
                    <div className="lucksign_nickname">
                        <div className="nickname_box box_center">
                            <div className="nickname_content box_center" onClick={ (e)=>this.nickNameEvent(e)}>
                                {
                                    this.state.isShowNickImage?
                                    <div className="nicknameImage_box">
                                        <img src={nicknameImage} alt="" />
                                    </div>
                                    :<input className="nickInput"
                                    type="text"
                                    onBlur={ this.checkNickNameEvent.bind(this)}
                                    onChange={ this.nickNameChange.bind(this)}
                                    autoFocus
                                    />
                                }
                            </div>
                        </div>
                        <div className="nickname_tips box_center">
                            {
                                this.state.nickname_tips ?
                                <div className="color_red box_center font_size12">用户昵称不能超过12个字符</div>:''
                            }
                        </div>
                        <div className="confirm_box box_center">
                            <div onClick={ ()=>this.confirmEvent()}>
                                <div className="confirm">
                                    <img src={ confirmImage } alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default LuckSign