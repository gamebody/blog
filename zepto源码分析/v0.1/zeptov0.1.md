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


```js
var Zepto = (function() {
  var slice=[].slice, d=document,
    ADJ_OPS={append: 'beforeEnd', prepend: 'afterBegin', before: 'beforeBegin', after: 'afterEnd'},
    e, k, css;

  // fix for iOS 3.2
  if(String.prototype.trim === void 0)
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  // document.querySelectorAll(selector)获取匹配selector的NodeList
  function $$(el, selector){ return slice.call(el.querySelectorAll(selector)) }
  function classRE(name){ return new RegExp("(^|\\s)"+name+"(\\s|$)") }

  // 过滤掉空的或者没有定义的element
  function compact(array){ return array.filter(function(el){ return el !== void 0 && el !== null }) }
  

  function $(_, context){
    if(context !== void 0) return $(context).find(_);
    function fn(_){ return fn.dom.forEach(_), fn } // 在方法中为this
    fn.dom = compact((typeof _ == 'function' && 'dom' in _) ? 
      _.dom : (_ instanceof Array ? _ : (_ instanceof Element ? [_] : $$(d, fn.selector = _))));
    $.extend(fn, $.fn);
    return fn;
  }
  
  // 继承属性
  $.extend = function(target, src){ for(k in src) target[k] = src[k] }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }

  $.fn = {
    compact: function(){ this.dom=compact(this.dom); return this },

    // 根据角标获取dom，不输入角标获取全部
    get: function(idx){ return idx === void 0 ? this.dom : this.dom[idx] },

    // 移除所有的element
    remove: function(){
      return this(function(el){ el.parentNode.removeChild(el) });
    },

    // 对所有的element，使用callback方法
    each: function(callback){ return this(callback) },

    // 过滤dom
    filter: function(selector){
      return $(this.dom.filter(function(el){ return $$(el.parentNode, selector).indexOf(el)>=0; }));
    },

    // 获取第一个元素
    first: function(callback){ this.dom=compact([this.dom[0]]); return this },

    // 根据选择器过滤元素
    find: function(selector){
      return $(this.dom.map(function(el){ return $$(el, selector) }).reduce(function(a,b){ return a.concat(b) }, []));
    },
    closest: function(selector){
      var el = this.dom[0].parentNode, nodes = $$(d, selector);
      while(el && nodes.indexOf(el)<0) el = el.parentNode;
      return $(el && !(el===d) ? el : []);
    },
    pluck: function(property){ return this.dom.map(function(el){ return el[property] }) },
    show: function(){ return this.css('display', 'block') },
    hide: function(){ return this.css('display', 'none') },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === void 0 ? (this.dom.length>0 ? this.dom[0].innerHTML : null) : this(function(el){ el.innerHTML = html });
    },
    attr: function(name,value){
      return (typeof name == 'string' && value === void 0) ? (this.dom.length>0 ? this.dom[0].getAttribute(name) || undefined : null) :
        this(function(el){
          if (typeof name == 'object') for(k in name) el.setAttribute(k, name[k])
          else el.setAttribute(name,value);
        });
    },
    offset: function(){
      var obj = this.dom[0].getBoundingClientRect();
      return { left: obj.left+d.body.scrollLeft, top: obj.top+d.body.scrollTop, width: obj.width, height: obj.height };
    },
    css: function(prop, value){
      if(value === void 0 && typeof prop == 'string') return this.dom[0].style[camelize(prop)];
      css=""; for(k in prop) css += k+':'+prop[k]+';';
      if(typeof prop == 'string') css = prop+":"+value;
      return this(function(el) { el.style.cssText += ';' + css });
    },
    index: function(el){
      return this.dom.indexOf($(el).get(0));
    },
    bind: function(event, callback){
      return this(function(el){
        event.split(/\s/).forEach(function(event){ el.addEventListener(event, callback, false); });
      });
    },
    delegate: function(selector, event, callback){
      return this(function(el){
        el.addEventListener(event, function(event){
          var target = event.target, nodes = $$(el, selector);
          while(target && nodes.indexOf(target)<0) target = target.parentNode;
          if(target && !(target===el) && !(target===d)) callback(target, event);
        }, false);
      });
    },
    live: function(event, callback){
      $(d.body).delegate(this.selector, event, callback); return this;
    },
    hasClass: function(name){
      return classRE(name).test(this.dom[0].className);
    },
    addClass: function(name){
      return this(function(el){ !$(el).hasClass(name) && (el.className += (el.className ? ' ' : '') + name) });
    },
    removeClass: function(name){
      return this(function(el){ el.className = el.className.replace(classRE(name), ' ').trim() });
    },
    trigger: function(event){
      return this(function(el){ var e; el.dispatchEvent(e = d.createEvent('Events'), e.initEvent(event, true, false)) });
    }
  };
  
  ['width','height'].forEach(function(m){ $.fn[m] = function(){ return this.offset()[m] }});

  for(k in ADJ_OPS)
    $.fn[k] = (function(op){
      return function(html){ return this(function(el){
        el['insertAdjacent' + (html instanceof Element ? 'Element' : 'HTML')](op,html)
      })};
    })(ADJ_OPS[k]);

  return $;
})();

'$' in window||(window.$=Zepto);

```