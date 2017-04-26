// R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]

function zip (list1, list2) {
  const result = []
  let idx = 0
  const len = Math.min(list1.length, list2.length)
  while (idx < len) {
    result[idx] = [list1[idx], list2[idx]]
    idx += 1
  }
  return result
}
zip([1, 2, 3], ['a', 'b', 'c'])
