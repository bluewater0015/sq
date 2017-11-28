/**
 * Created by qinshiju on 2017/7/3.
 */
import React, {Component} from 'react';

import './upgrade_wechat.css'
class UpgradeWechat extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        document.title="星糖miniKTV";
    }
    render(){
        return(
            <div className="center">
                <img src={require('./images/fail.png')} className="upgradeImg" />
            </div>
        )
    }


}
export default UpgradeWechat