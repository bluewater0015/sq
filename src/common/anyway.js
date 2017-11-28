/**
 * Created by qinshiju on 2017/7/22.
 */
function hengshuping() {
    if (window.orientation == 90 || window.orientation == -90) {
        window.location.href=window.location.href;
    } else {
        window.location.href=window.location.href;
    }
}

window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
