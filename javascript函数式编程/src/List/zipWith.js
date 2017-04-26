zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
//=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]

function zipWith (fn, a, b) {
  const re = []
  const minLen = Math.min(a.length, b.length)
  let idx = 0

  while (idx < minLen) {
    re[idx] = fn(a[idx], b[idx])
    idx += 1
  }

  return re
}
function f(a, b) {
  return a + b
}
zipWith(f, [1, 2, 3], ['a', 'b', 'c']);