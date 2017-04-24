function aperture(n, arr) {
  const length = arr.length
  const newArr = []
  let start = 0
  let end = start + n
  const limit = length - 1

  while (end <= limit) {
    newArr.push(arr.slice(start, end))
    start++
    end = start + n
  }
  return newArr
}

const arr = aperture(2, [1, 2, 3, 4, 5])