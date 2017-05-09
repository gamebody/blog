# zepto源码分析

## ajax.js
```js
(function($){
  function ajax(method, url, success){

    // 创建一个XMLHttpRequest实例
    var r = new XMLHttpRequest();

    // 监听onreadystatechange事件
    r.onreadystatechange = function(){
      if(r.readyState==4 && (r.status==200 || r.status==0))
        success(r.responseText);
    };

    // 参数为请求的方法，比如'get','post'等，请求的url，是否发送异步请求的布尔值。
    r.open(method,url,true);

    // 这个请求头表示是否为ajax一部请求，为null的话就是传统的同步请求
    r.setRequestHeader('X-Requested-With','XMLHttpRequest');

    // send方法接受的是作为请求体发送的数据，为null时表示不需要传送数据
    r.send(null);
  }

  $.get = function(url, success){ ajax('GET', url, success); };
  $.post = function(url, success){ ajax('POST', url, success); };
  $.getJSON = function(url, success){
    $.get(url, function(json){ success(JSON.parse(json)) });
  };
})(Zepto);
```
### 请求和响应的状态码
0. 为初始化，尚未调用open()方法
1. 启动，已经调用了open()方法
2. 发送。调用了open()方法，但是未收到响应
3. 接受。已经接受到部分相应的数据
4. 完成。已经接收到全部的相应数据，而且可以在客户端使用了

## touch.js

```js
(function($){
  var d = document, touch={}, touchTimeout;
  
  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }
  // 当手指触摸屏幕时触发
  d.ontouchstart = function(e) {
    var now = Date.now(), delta = now-(touch.last || now);
    touch.target = parentIfText(e.touches[0].target);
    touchTimeout && clearTimeout(touchTimeout);
    touch.x1 = e.touches[0].pageX;
    if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
    touch.last = now;
  }

  // 当手指在屏幕上滑动时连续触发
  d.ontouchmove = function(e) { touch.x2 = e.touches[0].pageX }
  
  // 当手指从屏幕上移开时触发
  d.ontouchend = function(e) {
    if (touch.isDoubleTap) {
      $(touch.target).trigger('doubleTap');
      touch = {};
    } else if (touch.x2 > 0) {
      Math.abs(touch.x1-touch.x2)>30 && $(touch.target).trigger('swipe');
      touch.x1 = touch.x2 = touch.last = 0;
    } else if ('last' in touch) {
      touchTimeout = setTimeout(function(){
        touchTimeout = null;
        $(touch.target).trigger('tap')
        touch = {};
      }, 250);
    }
  }
  
  // 当系统停止跟踪触摸时触发
  d.ontouchcancel = function(){ touch={} };
  
  ['swipe', 'doubleTap', 'tap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
```