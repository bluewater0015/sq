/**
 * Created by qinshiju on 2017/7/8.
 */
import React, {Component} from 'react';
import 'whatwg-fetch';
import Config from '../common/config';
import './feedback_refund.css';
import '../common/anyway';
import MPConfig from '../common/mp_config'
import QueryString from 'query-string';

let timer = null;

class feedbackRefund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mid: '',
        }
        if(props.location.search && props.location.search.length>0){
            let conversationId =  props.location.search.substring(props.location.search.indexOf('=')+1,props.location.search.length)
            this.state={conversationId:conversationId,refundContent:["订单异常结束","无法点歌","卫生差","耳机话筒损坏","录音有问题","音效差","歌不全"],textareaValue:'',mobile:'',selectContent:[],selectContentText:[],checkResult:true,isRefund:true,refundResult:false,isSubmit:false}
        }else{
            let conversationId = null
            this.state={conversationId:conversationId,refundContent:["订单异常结束","无法点歌","卫生差","耳机话筒损坏","录音有问题","音效差","歌不全"],textareaValue:'',mobile:'',selectContent:[],selectContentText:[],checkResult:true,isRefund:true,refundResult:false,isSubmit:false}
        }
    }
    componentWillMount(){
        /*我要退款之前去排查这个接口有没有正在申请退款*/
        let url ='/mp/feedback/'+this.state.conversationId+'/refund'
        setTimeout(()=>{
            fetch(url,{method:'GET',credentials:'same-origin'}).then((res)=>{
                    return res.json()
            }).then((res)=>{
                this.setState({isRefund:res,refundResult:res})
            })
        },1000)
    }
    componentDidMount() {
        MPConfig()
        document.title = '我要退款';
        timer = setTimeout(function () {
            window.wx.ready(() => {
                window.wx.hideOptionMenu()
            });
        }, 500);
        let parsed=QueryString.parse(this.props.location.search);
        this.setState({
            mid:parsed.mid==undefined?'':parsed.mid
        })
    }

    componentWillUnmount() {
        clearInterval(timer)
    }

    submit() {
        if(!this.state.refundResult || this.state.isSubmit){
            this.setState({isRefund:false})
            return;
        }
        let url = Config.api.feedback;
        var reg = /^1[34578]\d{9}$/; //手机号正则校验
        if (this.state.textareaValue !== '' && this.state.selectContentText.length !== 0 && (reg.test(this.state.mobile))) {
            let param = {
                "mobilePhone": this.state.mobile,
                "content": this.state.textareaValue,
                "machineId": this.state.mid,
                "items": [],
                "type": 1,
                "evaluateTag":this.state.selectContentText.join('、'),
                "orderId":this.state.conversationId
            };
            this.setState({isSubmit:true})
            fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(param)
            }).then((res) => {
                if(res.status === 200){
                    return res.json()
                }else{
                    alert("提交失败")
                }
            }).then((res) => {
                window.location.href = '/feedback_refund/refund';
            });
        } else {
            this.setState({checkResult:false})
        }

    }
    contentClick(index,content){
        const selectContent = this.state.selectContent
        const selectContentText = this.state.selectContentText
        if(selectContent.length === 0){
            selectContent.push(index)
            selectContentText.push(content)
            this.setState({selectContent:selectContent,selectContentText:selectContentText})
        }else{
            const selectIndex = selectContent.indexOf(index)
            if(selectIndex>-1){
                selectContent.splice(selectIndex,1)
                selectContentText.splice(selectIndex,1)
            }else{
                selectContentText.push(content)
                selectContent.push(index)
            }
            this.setState({selectContent:selectContent,selectContentText:selectContentText})
        }
    }
    mobileChange(e){
        this.setState({mobile:e.target.value})
    }
    textChange(e){
        this.setState({textareaValue:e.target.value})
    }
    cancelToast(){
        this.setState({checkResult:true})
    }
    cancelRefund(){
        this.setState({isRefund:true})
    }
    render() {
        const {refundContent,mobile,textareaValue,selectContent,checkResult,isRefund} = this.state
        return (
            <div className="feed-refund">
               <div className="refund-wrap-input"><input type='text' name="手机号" placeholder="请输入您的手机号" value={mobile} onChange={this.mobileChange.bind(this)}/></div>
               <div className="feed-wrap-content">
                   <p>请选择退款原因</p>
                   <div className="evaluate-tab-detail">
                       {
                           refundContent.map((content,index)=>{
                               return  <span key={index} onClick={this.contentClick.bind(this,index,content)} className={selectContent.indexOf(index)>-1?'evaluate-active':''}>{content}</span>
                           })
                       }
                   </div>
                <div>
                    <textarea placeholder="请您详细描述遇到的问题，以便小糖为您尽快处理(最多140个字)" value={textareaValue} onChange={this.textChange.bind(this)} maxLength="140"></textarea>
                </div>
                <div className="center"><button onClick={this.submit.bind(this)}>提交</button></div>
               </div>
                {
                    checkResult?'': <div className="evaluate-norepeat">
                        <p className="refund-toast">请输入正确的手机号并填写退款原因</p>
                        <div className='center refund-toast-button'>
                            <button onClick={this.cancelToast.bind(this)}>关闭</button>
                        </div>
                    </div>
                }
                {
                    isRefund?'': <div className="evaluate-norepeat">
                        <p className="refund-toast">您已提交退款申请，请不要重复提交哦~</p>
                        <div className='center refund-toast-button'>
                            <button onClick={this.cancelRefund.bind(this)}>关闭</button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default feedbackRefund