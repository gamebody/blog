function zipObj (keys, values) {
  const resultObj = {}
  const len = Math.min(keys.length, values.length)

  let idx = 0

  while (idx < len) {
    resultObj[keys[idx]] = values[idx]
    idx += 1
  }

  return resultObj
}

zipObj(['a', 'b', 'c'], [1, 2, 3])