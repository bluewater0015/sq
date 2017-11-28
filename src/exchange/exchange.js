import React, {Component} from 'react'
import Config from '../common/config'
import 'whatwg-fetch'
import './exchange.css'

class Exchange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            code: ''
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        document.title = '优惠劵'
    }

    openModal() {
        let that = this
        let couponId = that.state.code.replace(/(^\s*)|(\s*$)/g, "");
        let addURL = Config.api.userAdd + '/' + couponId + '/addCode';
        fetch(addURL, {method: 'PUT', credentials: 'include'}).then((res) => {
            if (res.status === 200) {
                that.setState({modalIsOpen: true, exchange: true})
            } else {
                that.setState({modalIsOpen: true, exchange: false});
            }
        }).catch((err) => {
            console.info('coupons-exchange', err)
        })
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    exchangeCode(e) {
        this.setState({
            code: e.target.value
        })
    }

    render() {
        const {code, exchange} = this.state
        return (
            <div className="wrap-exchange">
                <div>
                    <img src={require('./images/exchange.png')} alt="兑换码图片" className="exchange-img"/>
                </div>
                <div className="exchange-code">兑换码</div>
                <div><input type="text" placeholder="请输入您的兑换码" value={code} onChange={this.exchangeCode.bind(this)}/>
                </div>
                <div>
                    <button onClick={this.openModal}>兑换</button>
                </div>
                {this.state.modalIsOpen?
                    <div>
                <div className="mask"></div>
                <div className="exchange-status-img" style={exchange?{'backgroundImage':`url(${require("./images/exchange_success.png")})`}:{'backgroundImage':`url(${require("./images/exchange_fail.png")})`}}>
                    {exchange ? <div><h1 className="exchange-title">兑换成功</h1>
                        <div className="modal-content">请到我的优惠劵中查看</div></div>: <div><h1 className="exchange-title">兑换失败</h1>
                        <div className="modal-content">无效的兑换码或已超出兑换时间</div></div>}
                </div>
                        <img src={require('./images/close.png')} onClick={this.closeModal} className="exchange-close"/></div>:''}
            </div>
        )
    }
}

export default Exchange