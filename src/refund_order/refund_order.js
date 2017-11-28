import React, {Component} from 'react';
import {
    Link
} from 'react-router-dom';
import Config from '../common/config';
import 'whatwg-fetch';
import '../common/anyway';
import MPConfig from '../common/mp_config';
import './refund_order.css';

class RefundOrder extends Component {
    constructor(props) {
        super(props);
        /*Moke Date*/
        this.state = {
            orderList:[],
            disbaled:false
        }
    }
    componentDidMount() {
        MPConfig();
        document.body.style.backgroundColor = "#f5f5f5";
        document.title = '我的订单';
        //订单展示接口调取
        let urlEnd = Config.api.wepayOrder;
        fetch(urlEnd, {
            method: 'GET',
            credentials: 'same-origin'
        }).then((res) => {
            return res.json()
        }).then((orderList) => {
            this.setState({
                orderList: orderList
            });
        })
        window.wx.hideMenuItems({
            menuList: ["menuItem:share:qq"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
    }

    //时间戳的转换，也就是是展示的预约时间
    timeChange(time) {
        let date = new Date(time);
        let Y = date.getFullYear() + '-',
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
            D = date.getDate() + ' ',
            h = date.getHours() + ':',
            m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        return Y + M + D + h + m;
    }
    renderRefundButton(refundStatus,id) {
        if (refundStatus === 0) {
            return (
                <Link to={{pathname: '/feedback_refund',search: '?conversationId='+id}}>
                    <div className="myOrderBtn">
                        我要退款
                    </div>
                </Link>
            )
        } else if (refundStatus === 1) {
            return (
                <span className="refundStatus inRefund">退款中</span>
            )
        } else if (refundStatus === 2) {
            return (<span className="refundStatus successRefund">退款成功</span>)
        } else if (refundStatus === 3) {
            return (<span className="refundStatus">拒绝退款</span>)
        } else {
            return (<span className="refundStatus">过期</span>)
        }
    }
    toEvaluate(Id){
        if(!this.state.disbaled){
            this.props.history.push('/order/evaluation?Id='+Id)
        }else{
            return false
        }
    }
    evaluateButton(id,isEvaluate){
        if(!isEvaluate){
            return (<span className="evaluate-button" onClick={this.toEvaluate.bind(this,id)}>我要评价</span>)
        }else{
            return (<span className="successRefund refundStatus">已评价</span>)
        }
    }
    render() {
        return (
            <div className="myOrder">
                {this.state.orderList? this.state.orderList.map((key, index) => {
                    return <div className="myOrderList" key={index}>
                        <div className="myOrderAddress clearFix">
                            <span className="primary fl">{key.address}</span>
                            <span className="refund fr">支付成功</span>
                        </div>
                        <div>
                            <div className="payDetail orderDetail">
                                <p className="slot clearFix">
                                    <span
                                        className="fl">包房地址：{key.formattedAddress}</span>
                                    <span className="unitPrice fr">¥{key.pay / 100}</span>
                                </p>
                                <p className="songAddress distance">
                                    包房号码：{key.indexInGroup}号
                                </p>
                                {/*<p className="songRoom orderRoom">*/}
                                    {/*欢唱时段：{key.orderType}*/}
                                {/*</p>*/}
                                <p className="orderNumber clearFix">
                                    <span
                                        className="fl"></span>
                                    <span className="orderNewTime fr">{this.timeChange(key.payTime)}</span>
                                </p>
                            </div>
                            <div className="btnFeedback refundButton">
                                {key.pay !== 0?this.renderRefundButton(key.refundStatus,key.id):''}
                                {this.evaluateButton(key.id,key.isEvaluate)}
                            </div>
                        </div>
                    </div>
                }) : '暂时没有订单.....'}
                <div className="loading" ref="loading">
                    正在加载......
                </div>
            </div>
        )
    }
}

export default RefundOrder