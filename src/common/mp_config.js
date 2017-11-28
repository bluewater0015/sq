/**
 * Created by qinshiju on 2017/8/3.
 */
import React from 'react';
import 'whatwg-fetch';
function MpConfig(){
    let urla = "/mp/jsapi/signature?url=" + encodeURIComponent(window.location.href);
    fetch(urla, {method: 'POST', credentials: 'same-origin', mode: 'cors'}).then((res)=> {
        return res.json();
    }).then((res)=> {
        let config = {
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'scanQRCode',
                'checkJsApi',
                'hideOptionMenu',
                'hideMenuItems'
            ]
        };
        return config

    }).then((res)=> {
        window.wx.config(res)
    });
};
export default MpConfig