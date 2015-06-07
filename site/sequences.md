---
layout: default
---

## Sequences

A sequence is just what is sounds like: one or more nodes, listed one after the
other, separated by at least one whitespace character. A sequence matches the
input if the input contains matches for each of the sequence's nodes, in order.

For example, here's a grammar that matches an optional word followed by two more
required words:

###### hamlet.peg

    grammar Hamlet
      root  <-  "not "? "to be"

The sequence here is formed of two nodes: `"not "?` and `"to be"`. Here's the
resulting parses of the possible inputs:

```js
require('./hamlet').parse('to be')
   == { textValue: 'to be',
        offset: 0,
        elements: 
         [ { textValue: '', offset: 0, elements: [] },
           { textValue: 'to be', offset: 0, elements: [] } ] }

require('./hamlet').parse('not to be')
   == { textValue: 'not to be',
        offset: 0,
        elements: 
         [ { textValue: 'not ', offset: 0, elements: [] },
           { textValue: 'to be', offset: 4, elements: [] } ] }

require('./hamlet').parse('or not to be')
Error: Line 1: expected "to be"
or not to be
^
```

## Labelled nodes

Sequences have a special property: their child nodes can be labelled. You can
explicitly add a label to any item within a sequence, and
[cross-references](/references.html) are implicitly labelled with the name of
the reference. For example, take the following example that matches documents
that look like `{'abc' => 123}`:

###### hash.peg

    grammar Hash
      object  <-  "{" string " => " number:[0-9]+ "}"
      string  <-  "'" [^']* "'"

The `object` rule is a sequence containing five children:

* `"{"`
* `string`
* `" => "`
* `number:[0-9]+`
* `"}"`

The `string` node is a reference to another rule, and `number:[0-9]+` is a
labelled expression that matches one or more digits. These two children create
labelled nodes in the output:

```js
tree = require('./hash').parse("{'foo' => 36}")

   == { textValue: '{\'foo\' => 36}',
        offset: 0,
        elements: 
         [ { textValue: '{', offset: 0, elements: [] },
           { textValue: '\'foo\'', offset: 1, elements: [...] },
           { textValue: ' => ', offset: 6, elements: [] },
           { textValue: '36', offset: 10, elements: [...] },
           { textValue: '}', offset: 12, elements: [] } ],
        string: 
         { textValue: '\'foo\'', offset: 1, elements: [...] },
        number: 
         { textValue: '36', offset: 10, elements: [...] } }

tree.string.textValue
   == "'foo'"

tree.number.textValue
   == "36"
```

Here we see that `tree.string` is the same as `tree.elements[1]`, and
`tree.number` is the same as `tree.elements[3]`. These labels make it much
easier to navigate the tree and help keep your code readable.
