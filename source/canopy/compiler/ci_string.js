Canopy.Compiler.CIString = {
  toSexp: function() {
    return ['ci-string', this.stringValue()];
  },

  compile: function(builder, address, nodeType) {
    var string = this.stringValue(),
        length = string.length,
        temp   = builder.tempVar_('temp', builder.slice_(length)),
        tlc    = '.toLowerCase()',
        guard  = temp,
        match  = temp + tlc + ' === "' + string + '"' + tlc;

    builder.if_(guard + ' && ' + match, function(builder) {
      builder.syntaxNode_(address, nodeType, temp, length);
    });
    builder.else_(function(builder) {
      builder.failure_(address, this.textValue);
    }, this);
  },

  stringValue: function() {
    var string = '"' + this.elements[1].textValue + '"';
    return eval(string);
  }
};

