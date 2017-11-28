/**
 * Created by qinshiju on 2017/7/21.
 */
import React,{Component} from 'react';
let oDate = new Date();
let nowYear = oDate.getFullYear();
let nowMonth = oDate.getMonth() + 1;
let nowDay = oDate.getDate();
let hour = oDate.getHours();
class HeadAddress extends Component{
    constructor(props){
        super(props)
        console.log(props)
    }
    componentDidMount(){

    }
    render(){
        return (
            <div className="address clearFix">
                <div className="fl">
                    <p>{this.props.children}</p>
                    <p></p>
                </div>
                <div className="path fr">
                    <p style={{paddingTop:'0.2rem'}}>{nowMonth + '月' + nowDay + '日'}</p>
                    <span></span>
                </div>
            </div>
        )
    }
}
export default HeadAddress