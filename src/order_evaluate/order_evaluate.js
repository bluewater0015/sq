import React, {Component} from 'react'
import 'whatwg-fetch'
import MPConfig from '../common/mp_config'
import config from '../common/config'
import './order_evaluate.css'

class orderEvaluate extends Component {
    constructor(props) {
        super(props)
        let currentUrl = window.location.href
        console.log(currentUrl.indexOf('='))
        let currentId;
        if(currentUrl.indexOf('=')>-1) {
            currentId = currentUrl.substring(currentUrl.indexOf('=') + 1, currentUrl.length)
        }else{
            currentId = null
        }
        this.state = {
            orderType: '',
            orderPrice: '',
            orderTime: '',
            orderAddress: '',
            satisfy:0,     //0 代表刚进来 1 代表满意 2 代表不满意
            alreayComment:false,
            noComment:true,
            content:["订单异常结束","无法点歌","卫生差","耳机话筒损坏","录音有问题","音效差","歌不全"],
            selectContent:[],
            selectContentText:[],
            currentId:currentId,
            orderId:null,
            isRefund:true,
            submitFail:false
        }
    }

    componentDidMount() {
        MPConfig()
        document.title = '订单评价'
        let Id = this.state.currentId
        let url ='/mp/wepay/'+Id;
        fetch(url,{method:'GET',credentials:'same-origin'}).then((res)=>{
            if(res.status !== 200){
                console.log("出现错误")
            }else {
                return res.json()
            }
        }).then((res)=>{
            console.log(res)
            this.setState({
                orderType:res.orderType,
                orderAddress:res.address,
                orderPrice:res.payFee,
                orderTime:res.createdTime,
                alreayComment:res.isEvaluate,
                orderId:res.id,
                isRefund:res.isRefund,
                noComment:false
            })
        })
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
    }
    submitEvaluate(orderPrice){
        if(this.state.satisfy === 0 || this.state.noComment ){
            if(this.state.noComment){
                this.setState({alreayComment:true})
            }
            return false
        }
        let url = config.api.evaluation
        let submitParam = {id:this.state.orderId,isSatisfy:this.state.satisfy === 1?true:false,content:this.state.satisfy === 1?this.state.enjoyValue:this.state.noenjoyValue,evaluateTag:this.state.selectContentText.join('、')}
        fetch(url,{method:'POST',headers:{"Content-Type":'application/json'},credentials:'same-origin',body:JSON.stringify(submitParam)}).then((res)=>{
            if(res.status === 200){
                this.props.history.push('/order/evaluatesuccess?satisfy='+this.state.satisfy+"&price="+orderPrice+"&isRefund="+this.state.isRefund+"&Id="+this.state.orderId)
            }else {
                this.setState({submitFail:true})
            }
        })
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
    enjoyChange(e){
        this.setState({enjoyValue:e.target.value})
    }
    noEnjoyChange(e){
        this.setState({noenjoyValue:e.target.value})
    }
    cancelToast(){
        this.setState({alreayComment:false,noComment:true})
    }
    render() {
        const {orderAddress, orderPrice, orderTime, orderType,satisfy,alreayComment,content,selectContent,noComment,submitFail} = this.state
        var main;
        if(satisfy === 2){
            main = <div className="evaluate-tab">
                <p>请选择不满意的原因：</p>
                <div className="evaluate-tab-detail">
                    {
                        content.map((content,index)=>{
                            return  <span key={index} onClick={this.contentClick.bind(this,index,content)} className={selectContent.indexOf(index)>-1?'evaluate-active':''}>{content}</span>
                        })
                    }
                </div>
                <div>
                    <textarea placeholder="请您详细描述遇到的问题，以便小糖为您尽快处理(最多140个字哦)" value={this.state.noenjoyValue} onChange={this.noEnjoyChange.bind(this)} maxLength="140"></textarea>
                </div>
            </div>
        }else if(satisfy === 1){
            main = <div className="evaluate-tab">
                <p>您认为星糖需要优化的地方：</p>
                <div>
                    <textarea placeholder="您的宝贵建议，小糖会悉心听取(最多140个字哦)" value={this.state.enjoyValue} onChange={this.enjoyChange.bind(this)} maxLength="140"></textarea>
                </div>
            </div>
        }else{
            main = <div></div>
        }
        return (
            <div className='evaluate'>
                <div className='evaluate-head'>
                    <div>
                        <div><span>套餐：</span><span>{orderType}</span></div>
                        <div><span>价格：</span><span>¥{orderPrice}</span></div>
                        <div><span>时间：</span><span>{orderTime}</span></div>
                        <div><span>点位：</span><span>{orderAddress}</span></div>
                    </div>
                </div>
                <div className="evaluate-enjoy center">
                    <p className="evaluate-title">您可对本次演唱体验进行评价</p>
                    <span>满意度：</span><span className={satisfy === 1?"evaluate-enjoy-btn evaluate-active":"evaluate-enjoy-btn"} onClick={(e)=>this.setState({satisfy:1})}>满意</span><span className={satisfy === 2?"evaluate-enjoy-btn evaluate-active":"evaluate-enjoy-btn"} onClick={(e)=>this.setState({satisfy:2})}>不满意</span></div>
                {main}
                <div className={satisfy === 0 ||alreayComment || noComment ?'blank-content':'center'}>
                    <button onClick={this.submitEvaluate.bind(this,orderPrice)}>提交</button>
                </div>
                {
                    alreayComment || submitFail? <div className="evaluate-norepeat">
                        <p>{submitFail?"提交失败":"已收到您的评价，请不要重复提交哦~"}</p>
                        <div className='center'><button onClick={this.cancelToast.bind(this)}>关闭</button></div>
                    </div>:''
                }

            </div>
        )
    }

}

export default orderEvaluate