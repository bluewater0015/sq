/**
 * Created by swallow on 2017/5/20.
 */
import React, {Component} from 'react';
import Config from '../common/config';
import 'whatwg-fetch';
import './portfolios_detail.css';
import '../portfolios/rem';
import ConfigAddress from '../common/config_address';
// import MPConfig from '../common/mp_config';
var progressTimer = null, timer = null, currentTime = 0;

class Detail extends Component {
    constructor(props) {
        super(props)
        let params = this.props.match.params;
        this.state = {
            id: params.id,
            songName: '',
            singer: '',
            musicFileUrl: '',
            on: true,
            hadTimer: '00:00',
            allTimer: '00:00',
            headImgUrl: ''
        };
    }

    componentDidMount() {

        let urla = "/mp/jsapi/signature?url=" + encodeURIComponent(window.location.href);
        fetch(urla, {method: 'POST', credentials: 'same-origin'}).then((res) => {
            return res.json();
        }).then((res) => {
            console.log('这个是mp_config' + JSON.stringify(res))
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
            window.wx.config(res)
        });
        if (window.location.href.indexOf('detail') === -1) {
            window.location.href = ConfigAddress.url.mpPortfolioDetail + this.state.id
        }
        if (window.location.href.indexOf('singlemessage') !== -1) {
            document.title = '星糖miniKTV';
        }else{
            document.title = '我的录音';
        }

        let url = Config.api.portfolio + '/' + this.state.id;
        fetch(url, {method: 'GET', credentials: 'same-origin'}).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response)
            var _this = this;
            let musicUrl = response.url;
            let originalUrl = response.originalUrl
            _this.setState({
                songName: response.song.name,
                singer: response.nickname,
                headImgUrl: response.headImgUrl,
                musicFileUrl: musicUrl ? musicUrl : originalUrl

            });
            console.log(musicUrl)
            //自定义分享
            setTimeout(function () {
                window.wx.ready(() => {
                    window.wx.checkJsApi({
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function (res) {
                            console.log(JSON.stringify(res))
                        }
                    });
                    window.wx.showOptionMenu();
                    let urlWx = ConfigAddress.url.mpPortfolioDetail + _this.state.id;
                    //分享到朋友圈
                    window.wx.onMenuShareTimeline({
                        title: response.song.name + '-我在星糖miniKTV唱了一首歌，快来听听我唱的怎么样', // 分享标题
                        link: urlWx,
                        imgUrl: response.headImgUrl,
                        success: function (res) {
                            console.log(res)
                        },
                        cancel: function () {
                        }
                    });
                    //分享给朋友
                    window.wx.onMenuShareAppMessage({
                        title: response.song.name,
                        desc: '我在星糖miniKTV唱了一首歌，快来听听我唱的怎么样',
                        link: urlWx,
                        imgUrl: response.headImgUrl,
                        type: 'link',
                        dataUrl: '',
                        success: function (res) {
                            console.log(res)
                        },
                        cancel: function () {
                        }
                    });

                });
            }, 0)
            // 自定义分享结束
        }).then((response) => {

        });

        //横竖屏
        function hengshuping() {
            let oBack = document.querySelector('.backColor');
            if (window.orientation == 90 || window.orientation == -90) {
                oBack.style.height = '28.75rem'

            } else {
                oBack.style.height = '';

            }
        }

        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping(), false);
        //横竖屏结束
    }

    // 按钮播放暂停
    playPause() {
        if (this.state.on) {
            // this.refs.myAudio.load()
            this.refs.myAudio.play();
            progressTimer = setInterval(this.progress.bind(this), 1000);
            timer = setInterval(this.time.bind(this), 1000);
            this.setState({
                on: false
            });
        } else {
            this.refs.myAudio.pause();
            clearInterval(progressTimer);
            clearInterval(timer);
            this.setState({
                on: true
            })
        }
    }

    // 进度条
    progress() {
        let scale = document.querySelector('html').style.fontSize.substring(0, document.querySelector('html').style.fontSize.indexOf('px'))
        let cuT = this.refs.myAudio.currentTime,
            toT = this.refs.myAudio.duration;
        let oToTalWidth = (this.refs.oToTal.offsetWidth - 10) / scale;
        let progress = (cuT / toT) * oToTalWidth;
        if (progress > 14.25) progress = 14.25;
        else progress < 0 ? progress = 0 : progress;
        this.setState({
            x: progress + 'rem',
            xW: progress + 'rem',
        })
    }

    // 时间显示的处理
    cutTime(time) {
        let value = (time > 10 ? time + '' : '0' + time).substring(0, 2);
        return isNaN(value) ? '00' : value
    }

    // 秒转分
    secondToMin(time) {
        return this.cutTime(time / 60) + ':' + this.cutTime(time % 60);
    }

    // 播放时间显示
    time() {
        let allTime = this.refs.myAudio.duration,
            hadTime = this.refs.myAudio.currentTime;
        this.setState({
            hadTimer: this.secondToMin(hadTime),
            allTimer: this.secondToMin(allTime)
        })
    }

    //拖动进度条
    dragMove(ev) {
        let x = (ev.touches[0].pageX - 18) / 25;
        let xW = (ev.touches[0].pageX - 20) / 26;
        if (x > 14.25 || xW > 14.25) {
            x = 14.25;
            xW = 14.25
        } else if (x < 0 || xW < 0) {
            x = 0;
            xW = 0;
        } else {
            x;
            xW
        }
        this.setState({
            x: x + 'rem',
            xW: xW + 'rem'
        })
    }

    //结束拖动
    dragEnd(ev) {
        let scale = document.querySelector('html').style.fontSize.substring(0, document.querySelector('html').style.fontSize.indexOf('px'))
        let dragPaddingLeft = this.state.x;
        let changeLeft = dragPaddingLeft.replace("rem", "");
        let currentTime = (changeLeft / (this.refs.oToTal.offsetWidth / scale)) * this.refs.myAudio.duration;
        this.refs.myAudio.currentTime = currentTime;
        this.time()
    }

    // 监听播放结束与暂停
    playEnd() {
        clearInterval(timer);
        clearInterval(progressTimer);
        this.setState({on: true});
    }

    render() {
        let bgStyle = {
            backgroundImage: `url(${this.state.headImgUrl})`,
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(.375rem)",
            zIndex: -1,
            position: "relative"
        }
        return (
            <div>
                <div className="backColor" ref="backColor"></div>
                <div className="wrap">
                    <audio src={this.state.musicFileUrl} ref="myAudio" onEnded={this.playEnd.bind(this)}
                           onLoadedMetadata={this.time.bind(this)} preload="auto"
                           onPause={this.playEnd.bind(this)}></audio>
                    <div className="songName">
                        <span>{this.state.songName}</span>
                        <div className="singerName"><span>{this.state.singer}</span></div>
                    </div>
                    <div>
                        <img src={require('./images/DISK@2x.png')} alt="" className="meImg"
                             style={{WebkitAnimationPlayState: this.state.on ? 'paused' : 'running'}}/>
                        <img className="headImg" src={this.state.headImgUrl} alt=""/>
                        <section className="operate">
                            <div className="start" onClick={this.playPause.bind(this)}>
                                <img src={this.state.on ? require('./images/stop.png') : require('./images/play.png')}
                                     alt="stop/play" className="start-img"/>
                            </div>
                        </section>
                    </div>

                    <section className="play">
                        <div className="total" ref="oToTal">
                            <div className="had-play" style={{width: this.state.x}}>
                                <div className="bar" style={{left: this.state.xW}}
                                     onTouchMove={this.dragMove.bind(this)}
                                     onTouchEnd={this.dragEnd.bind(this)}>
                                    <div className="opcity"></div>
                                </div>
                            </div>
                        </div>
                        <div className="pro-time clearFix">
                            <span className="fl">{this.state.hadTimer}</span>
                            <span className="fr">{this.state.allTimer}</span>
                        </div>
                    </section>
                </div>
                <div style={bgStyle}></div>
            </div>
        )


    }
}

export default Detail;

