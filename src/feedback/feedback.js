/**
 * Created by qinshiju on 2017/6/10.
 */
import React, {Component} from 'react';
import Config from '../common/config';
import 'whatwg-fetch';
import './feedback.css';
import '../common/anyway';
import MPConfig from '../common/mp_config';
import QueryString from 'query-string';
class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [{
                "itemName": "屏幕无反应，无法唱歌",
                "priority": 1
            }, {
                "itemName": "手机进不去，无法唱歌",
                "priority": 2
            }, {
                "itemName": "已付款，无法唱歌",
                "priority": 3
            }, {
                "itemName": "没有声音",
                "priority": 4
            }, {
                "itemName": "声音有问题",
                "priority": 5
            }, {
                "itemName": "温度不舒适",
                "priority": 6
            }, {
                "itemName": "画面卡顿",
                "priority": 7
            }, {
                "itemName": "画面不同步",
                "priority": 8
            }, {
                "itemName": "屏碎了",
                "priority": 9
            }, {
                "itemName": "黑屏花屏",
                "priority": 10
            }, {
                "itemName": "环境不干净",
                "priority": 11
            }, {
                "itemName": "空调漏水",
                "priority": 12
            }],
            content: '',
            itemName: [],
            tell: '',
            mid: ''
        }
    }

    componentDidMount() {
        MPConfig()
        let parsed=QueryString.parse(this.props.location.search);
        this.setState({
            mid:parsed.mid==undefined?'':parsed.mid
        });
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        document.title = '我要反馈';
        document.body.style.backgroundColor = '#FFFFFF';
        this.state.arr.forEach((value, index)=> {
            let aLi = document.querySelectorAll('.choices');
            let on = false;
            let id = value.priority;
            aLi[index].addEventListener('click', ()=> {
                if (!on) {
                    aLi[index].style.backgroundImage = `url(${require("./images/yellow.png")})`;
                    let jsonItem = {
                        "itemName": value.itemName,
                        "priority": value.priority
                    };
                    this.state.itemName.push(jsonItem)
                    on = true;
                } else {
                    aLi[index].style.backgroundImage = `url(${require("./images/gray.png")})`;
                    on = false;
                    let item = this.state.itemName;
                    item.forEach((value, index)=> {
                        if (value.priority == id)item.splice(index, 1)
                    })
                }
            }, false)
        })
    }

    submit() {
        let url = Config.api.feedback;
        let _this = this;
        let arrItem = this.state.itemName;
        let arrPri = [];

        arrItem.forEach(function (value, index) {
            arrPri.push(value.priority);
        });
        if (arrItem.length == 0) {
            alert('请选择要反馈的问题');
            return false
        }
        if (arrPri.indexOf(1) == -1 && arrPri.indexOf(2) == -1 && arrPri.indexOf(3) == -1) {
            _this.refs.mobilePhone.style.borderColor = '';
            let param = {
                "mobilePhone": this.refs.mobilePhone.value.replace(/\D+/g, ''),
                "machineId": this.state.mid,
                "content": this.refs.text.value,
                "items": this.state.itemName
            };
            fetch(url, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(param)
            }).then((res)=> {
                return res.json()
            }).then((res)=> {
                if(res.status==0){
                    window.location.href = '/feedback/repair';
                }else {
                    alert('提交失败');
                }
            });

        } else if ((arrPri.indexOf(1) != -1 || arrPri.indexOf(2) != -1 || arrPri.indexOf(3) != -1 )&& (/^1(3|4|5|7|8)\d{9}$/.test(_this.refs.mobilePhone.value))) {
            let param = {
                "mobilePhone": this.refs.mobilePhone.value.replace(/\D+/g, ''),
                "machineId": this.state.mid,
                "content": this.refs.text.value,
                "items": this.state.itemName
            };
            fetch(url, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(param)
            }).then((res)=> {
                return res.json()
            }).then((res)=> {
                if(res.status==0){
                    window.location.href = '/feedback/refund';
                }
            });

        } else {
            _this.refs.mobilePhone.placeholder = "*请填写正确的手机号";
            _this.refs.mobilePhone.focus();
            _this.refs.mobilePhone.style.borderColor = '#FF7C7C';
            document.body.scrollTop = 800;
            return false;
        }

    }

    render() {
        let arr = this.state.arr;
        return (
            <div>
                <section>
                    {arr.map((key, index)=> {
                        return <ul key={index} className="feedbackList">
                            <li className="choices">{key.itemName}</li>
                        </ul>
                    })}
                    <textarea name="详情描述" ref="text" classID="text" placeholder="详情描述"></textarea>
                    <textarea name="手机号" ref="mobilePhone" classID="textIpone" placeholder="手机号"></textarea>
                    <div className="service">
                        需要接入人工服务？请在服务号回复：0
                    </div>
                    <div className="service">
                        {/\/[o|r|d|e|r]/g.test(window.location.pathname) ? "需要联系退款？请进入我的订单提交反馈" : ''}

                    </div>
                    <div className="empty"></div>
                </section>
                <div className="backWhite">
                    <input type="submit" name="" value="提交" classID="submit" className="submit"
                           onClick={this.submit.bind(this)}/>
                </div>
            </div>
        )
    }
}
export default FeedBack;