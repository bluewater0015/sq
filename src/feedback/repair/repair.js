/**
 * Created by qinshiju on 2017/6/10.
 */
import React,{Component} from 'react';
import './repair.css'
class Repair extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        document.title='我要反馈'
    }
    render(){
        return(
            <div className="repail">
                <p>星糖感谢您的反馈</p>
                <p>您所提到的问题</p>
                <p>将有维修小哥火速赶来处理～</p>
            </div>
        )
    }
}
export default Repair