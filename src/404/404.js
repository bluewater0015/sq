/**
 * Created by qinshiju on 2017/6/10.
 */
import React,{Component} from 'react';
import './404.css'
class NoFound extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        document.title='星糖miniKTV'
    }
    render(){
        return (
            <div className="center">
                <img src={require('./images/404.png')} className="img" />
            </div>
        )
    }
}
export default NoFound