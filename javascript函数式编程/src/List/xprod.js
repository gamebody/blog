function xprod (a, b) {
  const ilen = a.length
  const re = []
  let i = 0
  let j = 0
  while (i < ilen) {
    j = 0
    while (j < b.length) {
      re[re.length] = [a[i], b[j]]
      j += 1
    }
    i += 1
  }

  return re
}




R.xprod([1, 2], ['a', 'b', 'c']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]