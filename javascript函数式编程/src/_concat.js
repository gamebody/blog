function _concat(set1, set2) {
  const set1 = set1 || []
  const set2 = set2 || []

  const result = []

  let ind = 0

  while (ind < set1.length) {
    result[result.length] = set1[ind]
    ind++
  }

  ind = 0

  while (ind < set2.length) {
    result[result.length] = set2[ind]
    ind++
  }

  return result
}