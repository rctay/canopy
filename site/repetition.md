---
layout: default
---

## Repeated nodes

Canopy offers the well-known `*` and `+` operators from regular expressions,
meaning "zero or more" and "one or more" respectively. Placing them after a node
allows the node to repeat the desired number of times.

Here's a grammar that matches the word `badger` one or more times:

###### badger.peg

    grammar Badger
      root  <-  "badger"+

When a repetition matches the input, you get one node for the repetition itself,
and one child node for each *instance* in the repetition. If there aren't enough
repetitions (for example if there's not at least one match for a `+` rule)
you'll get an error.

```js
require('./badger').parse('badgerbadgerbadger')
   == { textValue: 'badgerbadgerbadger',
        offset: 0,
        elements: 
         [ { textValue: 'badger', offset: 0, elements: [] },
           { textValue: 'badger', offset: 6, elements: [] },
           { textValue: 'badger', offset: 12, elements: [] } ] }

require('./badger').parse('bad')
Error: Line 1: expected "badger"
bad
^
```
