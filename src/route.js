/**
 * Created by swallow on 2017/5/20.
 */
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import Scan from './scan/scan';
import Schedules from './components/reserve_schedules/reserve_schedules';

import ScanSchedules from './components/scan_schedules/scan_schedules';

import PayOrder from './components/reserve_order/reserve_order';
import Search from './search/search';
import Rooms from './rooms/rooms';
import MapDetail from './components/map_detail/map_detail';
import PaySuccess from './components/pay_success/pay_success';
import MyOrder from './my_order/my_order';
import UpgradeWechat from './upgrade_wechat/upgrade_wechat';
import FeedbackRefund from './feedback_refund/feedback_refund';


import Detail from './portfolios_detail/portfolios_detail';
import Portfolios from './portfolios/portfolios';
import Feedback from './feedback/feedback';
import Repair from './feedback/repair/repair';
import Refund from './feedback/refund/refund';
import NoFound from './404/404';
import 'whatwg-fetch';
import InquiryTime from './inquiry_time/inquiry_time';
import Voucher from './coupons_voucher/voucher';
import MyCoupons from './coupons/couponsPage';
import RefundOrder from './refund_order/refund_order'
import Exchange from './exchange/exchange'
import Config from './common/config';
import joinUs from './join_us/join_us';

import LuckSign from './luck_sign/luck_sign';
import WavePage from './wave_page/wave_page';
import ResultPage from './result_page/result_page';

import orderEvaluate from './order_evaluate/order_evaluate'
import evaluateSuccess from './evaluate_success/evaluate_success'

function MeRedirect() {
    let url = Config.api.me;
    fetch(url, {method: 'GET', credentials: 'same-origin',}).then((res) => {
        if (res.status != 200) {
            let currentUrl = window.location.href;
            window.location.href = Config.api.login + '?redirectUrl=' + currentUrl
        }
        return res.json()
    }).then((res) => {
        console.log(res)
    });

}

MeRedirect();
const Routes = (props) => (
    <Router {...props} >
        <div>
            <Switch>
                {/*优惠券列表*/}
                <Route exact path="/coupons_page" component={MyCoupons}/>
                {/*抵用券页面*/}
                <Route exact path='/coupons' component={Voucher}/>
                {/*价格展示页面*/}
                <Route exact path="/inquiry_time" component={InquiryTime}/>
                {/*我要退款页面*/}
                <Route exact path="/feedback_refund" component={FeedbackRefund}/>
                <Route path="/feedback_refund/refund" component={Refund}/>
                {/*提示升级页面*/}
                <Route exact path="/upgrade_wechat" component={UpgradeWechat}/>
                {/*支付成共与订单页面*/}
                <Route exact path="/reserve/pay_success/:pack" component={PaySuccess}/>
                <Route exact path="/reserve/order" component={MyOrder}/>
                <Route exact path="/order/feedback" component={Feedback}/>
                {/*第一版扫码进入预约页面*/}
                <Route exact path="/reserve/scan" component={Scan}/>

                <Route path="/schedules_stage/map_detail" component={MapDetail}/>
                {/*预约搜索页面*/}
                <Route exact path="/reserve/search" component={Search}/>
                <Route exact path="/reserve/rooms&:cityCode" component={Rooms}/>
                <Route path="/map_detail/:address" component={MapDetail}/>
                {/*预约时段与选择时长公共页面*/}
                <Route exact path="/reserve/schedules&:machineId&:random" component={Schedules}
                       ignoreScrollBehavior={true}/>
                <Route path="/reserve/schedules/pay_order/:timeRange&:machineId&:begin&:time"
                       component={PayOrder} ignoreScrollBehavior={true}/>

                {/*暂定扫码进入预约时段页面*/}
                <Route exact path="/reserve/scan_schedules" component={ScanSchedules}/>

                {/*录音与反馈页面*/}
                <Route exact path="/portfolios" component={Portfolios}/>
                <Route exact path="/portfolios/detail/:id" component={Detail}/>

                <Route exact path="/feedback" component={Feedback}/>
                <Route path="/feedback/repair" component={Repair}/>
                <Route path="/feedback/refund" component={Refund}/>
                <Route path="/refund/order" component={RefundOrder}/>
                <Route path="/coupons/exchange" component={Exchange}/>
                {/*扫码进入加盟页面*/}
                <Route path="/joinus/joinus" component={ joinUs }/>
                {/*订单评价页面*/}
                <Route path="/order/evaluation" component={ orderEvaluate }/>
                <Route path="/order/evaluatesuccess" component={ evaluateSuccess }/>

                {/*丧签首页*/}
                <Route path="/campaign/lucksign" component={ LuckSign }/>
                {/*摇签页面*/}
                <Route path="/wavePage/wavePage" component={ WavePage }/>
                {/*摇签结果页面*/}
                <Route path="/resultPage/resultPage" component={ ResultPage }/>
                <Route component={NoFound}/>
            </Switch>

        </div>
    </Router>
);
export default Routes

