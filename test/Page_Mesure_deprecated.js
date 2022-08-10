// HTML
// <div className="test-container" id="test-container">
//     <img src="test/fauteul_face.jpg"
//          onClick="addCircleDiv(event)"
//          draggable="false"
//          style="max-width: 300x; max-height: 200px;">
// </div>

// <link rel="stylesheet" href="vendor/magnificent/css/mag.css">
// <link rel="stylesheet" href="vendor/magnificent/theme/default.css">
// <link rel="stylesheet" href="css/magnificent-index.css">

// <script src="vendor/jquery-bridget/jquery.bridget.js"></script>
// <script src="vendor/jquery-mousewheel/jquery.mousewheel.js"></script>
// <script src="vendor/magnificent/js/mag.js"></script>
// <script src="vendor/magnificent/js/mag-jquery.js"></script>


dotn=1;
// 取图片鼠标点击位置
function addCircleDiv(e) {
    console.log(e);
    // var xPage = (navigator.appName == 'Netscape') ? e.pageX : event.x + document.body.scrollLeft;
    // var yPage = (navigator.appName == 'Netscape') ? e.pageY : event.y + document.body.scrollTop;
    // imgEl = document.getElementById(e.id);
    // img_x = locationLeft(imgEl);
    // img_y = locationTop(imgEl);
    // var xPos = xPage - img_x;
    // var yPos = yPage - img_y;

    // 当前点击位置
    // var hotspot = {x: e.x, y: e.y};
    // addHotspot(hotspot);

    var src = 'test/black-circle.png';
    x = e.layerX;
    y = e.layerY;
    console.log(x,y)
    console.log((e.layerX-e.target.parentElement.offsetLeft)/e.target.offsetWidth*e.target.naturalWidth,(e.layerY-e.target.parentElement.offsetTop)/e.target.offsetHeight*e.target.naturalHeight)

    // imgEle = '<img ' + ' src="' + src + '"  style="top: '
    //     + y + 'px; left: ' + x + 'px; position: absolute; cursor: pointer;"'
    //     + ')" />';
    //
    // nimg = document.createElement('img')
    // nimg.src = src;
    // nimg.style.cssText = 'top: ' + y + 'px; left: ' + x + 'px; position: absolute; cursor: pointer;'
    // nimg.draggable = true
    // nimg.id = "dot"+dotn
    // nimg.ondragend = dragdotstart;

    circle = document.createElement('div')
    circle.className = "circle"
    circle.style.cssText = 'top: ' + (y-5) + 'px; left: ' + (x-5) + 'px; position: absolute; cursor: pointer;'
    circle.draggable = true
    circle.ondragstart = dragCircleDivStart;
    circle.ondragend = dragCircleDivEnd;
    circle.ondrag = dragCircleDiv;
    circle.oncontextmenu = deleteCircleDiv;
    circle.id = "dot"+dotn
    // circle.offsetTop = e.target.offsetTop
    // circle.offsetLeft = e.target.offsetLeft

    document.getElementById(e.target.parentElement.id).appendChild(circle);
    // document.getElementById("dot"+dotn).addEventListener('dragover',dragdot);
    dotn++


    addCircle(layer,x,y);
}

function deleteCircleDiv(e){
    // console.log("onclick")
    // console.log(e)
    if (e.button == 2){
        // document.getElementById(e.target.id).remove();
        this.remove();
        return false;
    }
}

function dragCircleDiv(e) {
    // console.log(e)

    const cx = e.clientX;
    const cy = e.clientY;
    // console.log(cx,cy)
    // console.log(e.target.offsetLeft,e.target.offsetTop)
    /** 相减即可得到相对于父元素移动的位置 */
    if (cx != 0 && cy != 0){
        dx = cx - deltaLeft
        dy = cy - deltaTop
        // console.log(dx,dy)
    }


    // /** 防止超出父元素范围 */
    // if (dx < 0) dx = 0
    // if (dy < 0) dy = 0
    // if (dx > 500) dx = 500
    // if (dy > 300) dy = 300

    dot = document.getElementById(e.target.id)
    // dot.style.cssText = 'top: ' + dy + 'px; left: ' + dx + 'px; position: absolute; cursor: pointer;'
    dot.setAttribute('style', `top: ${dy}px; left: ${dx}px; position: absolute; cursor: pointer;`)


}

function dragCircleDivStart(e) {
    // move = 1;
    // console.log(e)
    // console.log(e.clientX,e.clientY)
    // console.log(e.target.offsetLeft,e.target.offsetTop)

    // deltaLeft = e.clientX-e.target.offsetLeft;
    // deltaTop = e.clientY-e.target.offsetTop;

    // console.log(deltaLeft,deltaTop)

    // console.log("drag")
    // // console.log(event)
    // console.log(e)
    // // document.getElementById(id).visible=false
    // startLayerX = e.layerX
    // startLayerY = e.layerY
    // console.log(startLayerX,startLayerY)
}

function dragCircleDivEnd(e) {
    // move = 0;

    // const cx = e.clientX;
    // const cy = e.clientY;
    // console.log(cx,cy)
    // /** 相减即可得到相对于父元素移动的位置 */
    // let dx = cx - deltaLeft
    // let dy = cy - deltaTop
    // console.log(dx,dy)
    //
    // dot = document.getElementById(e.srcElement.id)
    // // dot.style.cssText = 'top: ' + dy + 'px; left: ' + dx + 'px; position: absolute; cursor: pointer;'
    // dot.setAttribute('style', `top: ${dy}px; left: ${dx}px; position: absolute; cursor: pointer;`)


    // dot = document.getElementById(e.srcElement.id)
    // console.log(dot)
    // endLayerX = e.layerX
    // endLayerY = e.layerY
    // dot.style.cssText = 'top: ' + (y-5) + 'px; left: ' + (x-5) + 'px; position: absolute; cursor: pointer;'
    // console.log("dragEnd")
    // // console.log(event)
    // console.log(e)
    // // document.getElementById(id).visible=false
}

// 找到元素的屏幕位置
function locationLeft(element) {
    var offsetTotal = element.offsetLeft;
    var scrollTotal = 0; // element.scrollLeft but we dont want to deal with scrolling - already in page coords
    if (element.tagName != "BODY") {
        if (element.offsetParent != null)
            return offsetTotal + scrollTotal + locationLeft(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
}

// 找到元素的屏幕位置
function locationTop(element) {
    var offsetTotal = element.offsetTop;
    var scrollTotal = 0; // element.scrollTop but we dont want to deal with scrolling - already in page coords
    if (element.tagName != "BODY") {
        if (element.offsetParent != null)
            return offsetTotal + scrollTotal + locationTop(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
}

// 添加自定义内容
function addHotspot(hotspot) {
    var x = hotspot.x - 12;
    var y = hotspot.y - 12;
    var src = 'test/black-circle.png';

    imgEle = '<img ' + ' src="' + src + '"  style="top: '
        + y + 'px; left: ' + x + 'px; position: absolute; cursor: pointer;"'
        + ')" />';
    $('.container').append(imgEle);
}

// var instance = panzoom(document.getElementById('test-container'));

// instance.on('panstart', function(e) {
//     console.log('Fired when pan is just started ', e);
//     // Note: e === instance.
// });
//
// instance.on('pan', function(e) {
//     console.log('Fired when the scene is being panned', e);
// });
//
// instance.on('panend', function(e) {
//     console.log('Fired when pan ended', e);
// });
//
// instance.on('zoom', function(e) {
//     console.log('Fired when scene is zoomed', e);
// });
//
// instance.on('transform', function(e) {
//     // This event will be called along with events above.
//     console.log('Fired when any transformation has happened', e);
// });


let $host = $('[mag-thumb="inner"]');
$host.mag();

let $host2 = $('[mag-thumb="inner-inline"]');
$host2.mag();

let $host3 = $('[mag-thumb="outer"]');
$host3.mag({
    mode: 'outer',
    ratio: 1 / 1.6
});