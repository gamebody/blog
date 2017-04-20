function add(a, b) {
  switch (arguments.length) {
    case 0:
      return add
    case 1:
      return function (b) {
        return a + b
      }
    case 2:
      return a + b
  }
}

const num1 = add(2, 3)
const num2 = add(2)(3)

console.log(num1, num2)
