import React,{Component} from 'react'
import enjoy from './images/enjoy.png'
import noenjoy from './images/noenjoy.png'
import {Link} from 'react-router-dom'
import MPConfig from '../common/mp_config'
import './evaluate_success.css'

class evaluateSuccess extends Component{
    constructor(props){
        super(props)
        console.log(this.getQueryVariable("satisfy"))
        const selectSatisfy = this.getQueryVariable("satisfy")?this.getQueryVariable("satisfy"):1
        const selectPrice = this.getQueryVariable("price")?this.getQueryVariable("price"):0
        const selectIsRefund = this.getQueryVariable("isRefund")?this.getQueryVariable("isRefund"):true
        const selectConversationId = this.getQueryVariable("Id")?this.getQueryVariable("conversationId"):null
        this.state = {satisfy:parseInt(selectSatisfy),price:parseFloat(selectPrice),isRefund:selectIsRefund,conversationId:parseInt(selectConversationId)}
    }
    componentDidMount(){
        MPConfig()
        document.title = '评价完成'
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
    }
    /*获取url的参数*/
    getQueryVariable(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    render(){
        const {satisfy,price,isRefund,conversationId} = this.state
        return(
            <div className='evaluate-success'>
               <div>
                   <div className='evaluate-head'>
                       {satisfy === 1?<img src={enjoy} className="evaluate-enjoy"/>:<img src={noenjoy} className="evaluate-noenjoy"/>}
                   </div>
               </div>
                {
                    satisfy === 1?<div>
                        <p className="evaluate-font">感谢您的评价</p>
                        <p>祝您生活愉快，欢迎再来哟</p>
                    </div>:<div><div>
                            <p className="evaluate-font">感谢评价</p>
                            <p>很抱歉给您带来不好的体验,</p>
                            <p className="evaluate-font">小糖会努力改进的</p>
                        </div>
                        {price !== 0 && isRefund === 'true' ?<div className="center"><Link to={{pathname: '/feedback_refund',search: '?conversationId='+conversationId}}><button>我要退款</button></Link></div>:''}
                    </div>
                }
            </div>
        )
    }
}
export default evaluateSuccess