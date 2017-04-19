# Pointfree
Pointfree是一种代码风格，函数对要操作的数据不必提及

```javascript
// 非 pointfree，因为提到了数据：word
var snakeCase = function (word) {
return word.toLowerCase().replace(/\s+/ig, '_');
};
// pointfree
var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);

```

虽然pointfree风格的函数，可以减少不必要的命名，但是从函数来看，我们就不知道传入什么类型的值，这就要求我们在函数命名的地方下功夫，知道此函数的意义。