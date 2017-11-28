import React, {Component} from 'react';
import 'whatwg-fetch';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import ReactConfirmAlert, {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Config from '../common/config';
import './portfolios.css';
import './rem';
import MPConfig from '../common/mp_config';
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songlist: [{}],
            name: '',
            headImgUrl: '',
            time: [],
            bgOn: false,
            scrollTop:''
        }
    }

    componentDidMount() {
        MPConfig()
        document.title = '我的录音';
        document.body.style.background = '#f5f5f5';
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });

        let _this = this;
        _this.refs.orderLoad.style.display = 'block';
        setTimeout(function () {
            _this.refs.orderLoad.style.display = 'none';
        }, 300);

        let url = Config.api.me;
        fetch(url, {method: "GET", credentials: 'same-origin'}).then((res)=> {
            return res.json()
        }).then((response)=> {
            this.setState({
                name: response.nickname,
                headImgUrl: response.headImgUrl
            });


            let url = Config.api.portfolio;
            let param = {
                songName: '',
                songSingers: '',
                songMusicFileName: ''
            };
            return fetch(url, {method: "GET", param, credentials: 'include'})

        }).then((res)=> {
            return res.json()
        }).then((res)=> {
            var _this = this;
            _this.setState({
                songlist: res
            });
        });

    }

    deleteSong(key, id, index,e) {
        let scrollTop_ = document.body.scrollTop
        document.querySelector('body').style.overflow='hidden';
        document.querySelector('body').style.overflow='hidden';
        document.querySelector('html').style.overflow='hidden';
        document.querySelector('html').style.position='fixed';
        document.querySelector('html').style.top=-document.body.scrollTop+'px';
        function forbidScroll(e) {
            e.preventDefault && e.preventDefault();
            e.returnValue = false;
            e.stopPropagation && e.stopPropagation();
            return false;
        }

        var _this = this;
        let aDelete = document.querySelectorAll('.delete');
        aDelete[index].style.backgroundImage = `url(${require("./images/delete2.png")})`;
        window.addEventListener('touchmove',forbidScroll,false)
        confirmAlert({
            title: '确定删除歌曲吗？',                        // Title dialog
            message: '',                                   // Message dialog
            confirmLabel: '确认',                           // Text button confirm
            cancelLabel: '取消',                             // Text button cancel
            onConfirm: () => {
                document.body.scrollTop = scrollTop_;
                document.querySelector('body').style.overflow='initial';
                document.querySelector('html').style.overflow='initial';
                document.querySelector('html').style.position='static';
                window.removeEventListener('touchmove',forbidScroll,false);
                aDelete[index].style.backgroundImage = `url(${require("./images/delete1.png")})`;
                let song = _this.state.songlist;
                let url = Config.api.portfolio + '/' + id;
                fetch(url, {method: "DELETE", credentials: 'include'}).then((res)=> {
                    song.splice(index, 1);
                    _this.setState({
                        songlist: song
                    })
                });
            },
            onCancel: () => {
                document.body.scrollTop = scrollTop_;
                document.querySelector('body').style.overflow='initial';
                document.querySelector('html').style.overflow='initial';
                document.querySelector('html').style.position='static';
                aDelete[index].style.backgroundImage = `url(${require("./images/delete1.png")})`;
                window.removeEventListener('touchmove',forbidScroll,false)
            },
        });


    }

    creativeTime(time) {
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return Y + M + D + h + m
    }

    bgStyle(index) {
        this.setState({
            bgOn: true
        })
    }
    linkDetail(keyId){
        window.location.href="/portfolios/detail/" + keyId
    }
    render() {
        var _this = this;
        const songList = _this.state.songlist;
        return (
            <div className="portfolios">
                <div className="orderLoading" ref="orderLoad"></div>
                {songList.map((key, index) => {
                    if (key.song != undefined) {
                        return <div key={index} className="List" ref="wrapInfo"
                                    onTouchStart={_this.bgStyle.bind(this, index)}
                                    style={{backgroundColor: _this.state.bgOn}}>
                            <div onClick={this.linkDetail.bind(this,key.id)}>
                                <div className="wrap_info">
                                    <div className="songNames">{key.song.name}</div>
                                    <div className="singer">
                                        {key.song.singers}

                                    </div>
                                    <div className="time">
                                        演唱时间：<span >{_this.creativeTime(key.createDate)}</span>
                                    </div>
                                    <div className="border"></div>
                                </div>
                            </div>

                            <div className="delete" ref="delete"
                                 onClick={_this.deleteSong.bind(this, key, key.id, index)}>
                            </div>
                        </div>
                    }
                })}

                <div className="noRecording" style={{display: songList.length == 0 ? 'block' : 'none'}}><img
                    src={require("./images/noRecording.png")} alt="暂无录音"/>
                </div>

            </div>
        )


    }
}
export default  Index;