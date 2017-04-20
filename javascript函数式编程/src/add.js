// 最简版本
// function add(a, b) {
//   switch (arguments.length) {
//     case 0:
//       return add
//     case 1:
//       return function (b) {
//         return a + b
//       }
//     case 2:
//       return a + b
//   }
// }

// const num1 = add(2, 3)
// const num2 = add(2)(3)

// console.log(num1, num2)
function _curry2 (fn) {
  return function f (a, b) {
    switch (arguments.length) {
      case 0:
        return f
      case 1:
        return function(_b) { return fn(a, _b) }
      case 2:
        return fn(a, b)
    }
  }
}

const add = _curry2(function add (a, b) {
  return a + b
})

console.log(add(2, 3))
console.log(add(2)(3))


