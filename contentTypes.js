/** TODO need more mime types? **/
var CONTENT_TYPES = {
  '.png': 'image/png'
};

module.exports = function (ext) {
  return CONTENT_TYPES[ext];
};
