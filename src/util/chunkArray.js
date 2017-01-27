var chunkArray = function (array, size) {
  var copy = [].concat(array);
  var results = [];
  while (copy.length) {
    results.push(copy.splice(0, size));
  }
  return results;
};

module.exports = chunkArray;
