const path = require('path');
const relative = require('relative');

function MpvuePlugin() {}

MpvuePlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    Object.keys(compilation.entrypoints).forEach(key => {
      const entry = compilation.entrypoints[key];
      const { chunks } = entry;
      const entryChunk = chunks.pop();
      entryChunk.files.forEach(filePath => {
        const extname = path.extname(filePath);
        let content = compilation.assets[filePath].source();
        chunks.reverse().forEach(chunk => {
          chunk.files.forEach(childFile => {
            if (path.extname(childFile) === extname && compilation.assets[filePath]) {
              content = extname === '.wxss' ? 
              `@import "${relative(filePath, childFile)}";\n${content}`
              : `require("${relative(filePath, childFile)}");\n${content}`;
            }
          })
          compilation.assets[filePath].source = () => content;
        })
      })
    })
    callback();
  });
};

module.exports = MpvuePlugin;