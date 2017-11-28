/**
 * Created by qinshiju on 2017/5/31.
 */
import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import 'whatwg-fetch';
import './rooms.css';
import '../scan/rem';
import Config from '../common/config';
import Header from '../components/head_address/head_address';
import MPConfig from '../common/mp_config';
let oDate=new Date();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
class Rooms extends Component{
    constructor(props){
        super(props);
        let params=props.match.params;
        this.state={
            res:[],
            roomAddress:'',
            cityCode:decodeURIComponent(params.cityCode),
            timeMonDay:''
        };
    }
    componentDidMount(){
        MPConfig();
        document.title='预约';
        this.setState({
            timeMonDay:nowMonth+'月'+nowDay+'日'
        });
        window.wx.ready(()=> {
            window.wx.hideOptionMenu()
        });
        let addressLocal=localStorage.getItem('address');
        this.setState({
            roomAddress:decodeURIComponent(addressLocal)
        });
        let url=Config.api.machines+"?cityCode="+this.state.cityCode+'&formattedAddress='+addressLocal;
        fetch(url,{method:'GET',credentials:'include'}).then((res)=>{
           return res.json();
        }).then((res)=>{
            console.log(res)
            this.setState({
                res:res,
            })
        })
    }
    render(){
        const resList=this.state.res;
        return (
            <div className="order">
               <Header>
                   <p>{this.state.roomAddress}</p>
               </Header>
                <ul className="orderLists">
                    {resList.map((key,index)=>{
                        return <Link to={{pathname:'/reserve/schedules&'+key.machine.id+'&'+oDate.getTime()}} key={index}>
                            <li>
                                <div>
                                    <span>{key.machine.indexInGroup}号包房</span>
                                    <span className="btnOrder ">预约</span>
                                </div>
                            </li>
                        </Link>
                    })}
                </ul>
            </div>
        )
    }
}
export default Rooms
