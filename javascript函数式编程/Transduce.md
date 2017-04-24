# Transduce
## reduce
```javascript
var arr = [1, 2, 3, 4]
var sum = (a, b) => a + b
arr.reduce(sum, 0) // 10
```
其实reduce有三种运算
- 遍历
- 变形
- 累积

reduce方法虽然有很多的作用，但是耦合度很高，如果把这三种运算分割，这样代码的复用性会高很多，其实transduce就是这样的一个理念。

## Ramda中的transduce
先看用法：
```javascript
// 变形运算
var plusOne = x => x + 1;

// 累积运算
var append = function (newArr, x) {
  newArr.push(x);
  return newArr;
}; 

R.transduce(R.map(plusOne), append, [], arr);
// [2, 3, 4, 5]
```
Ramda内部实现
