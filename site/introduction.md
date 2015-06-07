---
layout: default
---

Canopy works by converting grammar files into JavaScript code that parses the
language described by the grammar. The full syntax for these grammar files is
described by the articles listed on the left. For now, here's a quick example
grammar describing a language that consists of nested lists of single-digit
numbers and other lists:

###### lists.peg

    grammar Lists
      value   <-  list / number
      list    <-  "[" ( value ("," value)* )? "]"
      number  <-  [0-9]

## Compiling a grammar

Running the `canopy` executable on this file produces a JavaScript file called
`lists.js`. This file contains all the parser code for the langauge.

    $ canopy lists.peg

This JavaScript file will work both in the browser and in CommonJS environments.
The API it exposes in the browser is named after the `grammar` name at the top
of the `.peg` file, for example our `Lists` grammar creates a parser called
`ListsParser`, and you'd use it like this:

```js
var tree = ListsParser.parse('[1,[],2,[3,4,5],[[6]]]');
```

In a CommonJS environment the `parse()` method is part of the exported module
API of the parser file:

```js
var parser = require('./lists');
var tree   = parser.parse('[1,[],2,[3,4,5],[[6]]]');
```

## Parse trees

The data structure produced by the parser is a representation of the text whose
structure follows the grammar. The top level of this structure looks like this:

```js
{ textValue: '[1,[],2,[3,4,5],[[6]]]',
  offset: 0,
  elements: 
   [ { textValue: '[', offset: 0, elements: [] },
     { textValue: '1,[],2,[3,4,5],[[6]]',
       offset: 1,
       elements: [...] },
     { textValue: ']', offset: 21, elements: [] } ] }
```

Every node in the tree has the following properties:

* `textValue` - the text of the node, a slice of the original document
* `offset` - the position in the source document where the node occurred
* `elements` - an array of child nodes, which may be empty

We can navigate the tree structure via the `elements` property of nodes. Each
`elements` list takes us deeper into the tree, finding smaller sub-nodes as we
descend.

```js
tree = parser.parse('[1,[],2,[3,4,5],[[6]]]')

tree.elements[0]
   == { textValue: '[', offset: 0, elements: [] }

tree.elements[1].elements[0]
   == { textValue: '1', offset: 1, elements: [] }

tree.elements[1].elements[1].elements[0].elements[1]
   == { textValue: '[]',
        offset: 3,
        elements: 
         [ { textValue: '[', offset: 3, elements: [] },
           { textValue: '', offset: 4, elements: [] },
           { textValue: ']', offset: 4, elements: [] } ] }

tree.elements[1].elements[1].elements[1]
   == { textValue: ',2',
        offset: 5,
        elements: 
         [ { textValue: ',', offset: 5, elements: [] },
           { textValue: '2', offset: 6, elements: [] } ] }

tree.elements[1].elements[1].elements[3].elements[1].elements[1]
   == { textValue: '[6]',
        offset: 17,
        elements: 
         [ { textValue: '[6]',
             offset: 17,
             elements: [...] },
           { textValue: '', offset: 20, elements: [] } ] }
```

## Labelled nodes

The nodes can also have labelled children. Child nodes in a sequence can be
labelled in the grammar and that label is mirrored in the parse tree. Nodes that
come from referring to other rules are also labelled using the name of the rule:

###### hash.peg

    grammar Hash
      object  <-  "{" string " => " number:[0-9]+ "}"
      string  <-  "'" [^']* "'"

When we parse a document using this grammar, the root node has additional named
references to some of its child nodes, as well as the standard `textValue`,
`offset` and `elements` properties:

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

These labelled nodes can make it much easier to navigate the elements when
you're processing the parse tree.

## Parsing errors

If you try to use a Canopy parser to parse a document whose syntax is not valid
according to the grammar, an exception is raised with a helpful message about
where the error happened.

```js
require('./hash').parse("{'Unix epoch' => 1970")
Error: Line 1: expected "}"
{'Unix epoch' => 1970
                     ^
```
