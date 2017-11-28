import './text.css';
import React,{ Component } from 'react';
export default class Text extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        return (
            <p className="text_tips center">
                {this.props.tips}
            </p>

        )
    }
}