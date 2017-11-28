import React,{Component} from 'react';
import './refund.css'
class Refund extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        document.title=/_[r|e|f|u|n|d]/g.test(window.location.pathname) ? "我要退款" : '我要反馈';

    }
    render(){
        return(
            <div className="remind">
                <p className="head"> {/_[r|e|f|u|n|d]/g.test(window.location.pathname) ? "您的需求现已被受理" : '星糖将火速处理！'}</p>
                <p className="cont">{/_[r|e|f|u|n|d]/g.test(window.location.pathname) ? "————我们将在48小时内退款" : '我们将在48小时内确认并'}<span>{/_[r|e|f|u|n|d]/g.test(window.location.pathname) ? "" : '全额退款'}</span></p>
                <div className="plt">
                    <p>如希望咨询处理进度</p>
                    <p className="pdt">请在服务号回复"0"</p>
                    <p className="pdt">星糖将帮您解答</p>
                </div>
            </div>
        )
    }
}
export default Refund;