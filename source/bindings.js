(function() {
  for (var type in Canopy.Compiler) {
    if (/^[A-Z]/.test(type))
      Canopy.MetaGrammar.Parser[type] = Canopy.Compiler[type];
  }

  if (typeof exports === 'object') {
    module.exports = exports;
    Canopy.extend(exports, Canopy);
    exports.compile = Canopy.compile;
  }
})();
