Canopy.Compiler.AnyChar = {
  toSexp: function() {
    return ['any-char'];
  },

  compile: function(builder, address, action) {
    builder.if_(builder.hasChars_(), function(builder) {
      var of = builder.offset_();
      builder.syntaxNode_(address, of, of + ' + 1', null, action);
    }, function(builder) {
      builder.failure_(address, '<any char>');
    });
  }
};
