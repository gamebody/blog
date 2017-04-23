adjust()
```
module.exports = _curry3(function adjust(fn, idx, list) {
  if (idx >= list.length || idx < -list.length) {
    return list;
  }
  var start = idx < 0 ? list.length : 0;
  var _idx = start + idx;
  var _list = _concat(list);
  _list[_idx] = fn(list[_idx]);
  return _list;
});
```
```
R.adjust(R.add(10), 1, [1, 2, 3])
// [1, 12, 3]
```
update()
```
module.exports = _curry3(function update(idx, x, list) {
  return adjust(always(x), idx, list);
});

R.update(10, 1, [1, 2, 3])
// [1, 12, 3]
```
分析：
在update源码中用到了alwals()这个方法，源码如下：
```
module.exports = _curry1(function always(val) {
  return function() {
    return val;
  };
});

const sayHello = R.always('hello)
sayHello()
sayHello('asdsd')
// 'hello'
```
这个方法返回一个函数，调用这个函数，返回alwals传入的值。调用的时候不管传入什么参数，都保持一开始的值。
