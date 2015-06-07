JS.ENV.Canopy.Compiler.AnyCharSpec = JS.Test.describe("Canopy.Compiler.AnyChar",
function() { with(this) {
  include(Canopy.SpecHelper)

  before(function() { with(this) {
    Canopy.compile('grammar JS.ENV.AnyCharTest \
      anyChar <- .')
  }})

  it('parses a single character', function() { with(this) {
    assertParse( ['x', 0, []], AnyCharTest.parse('x') )
  }})

  it('does not parse the empty string', function() { with(this) {
    assertThrows(Error, function() { AnyCharTest.parse('') })
    assertEqual( {offset: 0, expected: ['<any char>']}, AnyCharTest.Parser.lastError )
  }})
}})
