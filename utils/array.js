function rangeArray(from, to) {
  var array = []
  for (var i = from; i < to; i ++) {    
    array.push(i)
  }
  return array
}

function repeatArray(repeatValue, repeatCount) {  
  var array = []
  for (var i = 0; i < repeatCount; i ++) {    
    array.push(repeatValue)
  }
  return array
}

module.exports = {
  rangeArray: rangeArray,
  repeatArray: repeatArray
}
