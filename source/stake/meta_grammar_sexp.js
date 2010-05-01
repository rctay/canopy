Stake.extend({
  MetaGrammarParser: Stake.Parser.fromSexp(
    ['grammar', 'MetaGrammar',
      
      // grammar <- space* grammar_name rules:(space* grammar_rule)+ space* <Stake.Compiler.Grammar>
      ['rule', 'grammar',
        ['type', 'Stake.Compiler.Grammar',
          ['sequence',
            ['repeat', 0, ['reference', 'space']],
            ['reference', 'grammar_name'],
            ['label', 'rules',
              ['repeat', 1,
                ['sequence',
                  ['repeat', 0, ['reference', 'space']],
                  ['reference', 'grammar_rule']]]],
            ['repeat', 0, ['reference', 'space']]]]],
      
      // grammar_name <- "grammar " object_identifier
      ['rule', 'grammar_name',
        ['sequence',
          ['string', 'grammar '],
          ['reference', 'object_identifier']]],
      
      // grammar_rule <- identifier assignment parsing_expression <Stake.Compiler.GrammarRule>
      ['rule', 'grammar_rule',
        ['type', 'Stake.Compiler.GrammarRule',
          ['sequence',
            ['reference', 'identifier'],
            ['reference', 'assignment'],
            ['reference', 'parsing_expression']]]],
      
      // assignment <- space+ "<-" space+
      ['rule', 'assignment',
        ['sequence',
          ['repeat', 1, ['reference', 'space']],
          ['string', '<-'],
          ['repeat', 1, ['reference', 'space']]]],
      
      // parsing_expression <- choice_expression / choice_part
      ['rule', 'parsing_expression',
        ['choice',
          ['reference', 'choice_expression'],
          ['reference', 'choice_part']]],
      
      // parenthesised_expression <- "(" space* parsing_expression space* ")"
      ['rule', 'parenthesised_expression',
        ['sequence',
          ['string', '('],
          ['repeat', 0, ['reference', 'space']],
          ['reference', 'parsing_expression'],
          ['repeat', 0, ['reference', 'space']],
          ['string', ')']]],
      
      // choice_expression <- first_expression:choice_part
      //                      rest_expressions:(space+ "/" space+ expression:choice_part)+
      //                      <Stake.Compiler.Choice>
      ['rule', 'choice_expression',
        ['type', 'Stake.Compiler.Choice',
          ['sequence',
            ['label', 'first_expression',
              ['reference', 'choice_part']],
            ['label', 'rest_expressions',
              ['repeat', 1,
                ['sequence',
                  ['repeat', 1, ['reference', 'space']],
                  ['string', '/'],
                  ['repeat', 1, ['reference', 'space']],
                  ['label', 'expression',
                    ['reference', 'choice_part']]]]]]]],
      
      // choice_part <- (sequence_expression / sequence_part) (space+ type_expression)? <Stake.Compiler.ChoicePart>
      ['rule', 'choice_part',
        ['type', 'Stake.Compiler.ChoicePart',
          ['sequence',
            ['choice',
              ['reference', 'sequence_expression'],
              ['reference', 'sequence_part']],
            ['maybe',
              ['sequence',
                ['repeat', 1, ['reference', 'space']],
                ['reference', 'type_expression']]]]]],
      
      // type_expression <- "<" object_identifier ">"
      ['rule', 'type_expression',
        ['sequence',
          ['string', '<'],
          ['reference', 'object_identifier'],
          ['string', '>']]],
      
      // sequence_expression <- first_expression:sequence_part
      //                        rest_expressions:(space+ sequence_part)+
      //                        <Stake.Compiler.Sequence>
      ['rule', 'sequence_expression',
        ['type', 'Stake.Compiler.Sequence',
          ['sequence',
            ['label', 'first_expression',
              ['reference', 'sequence_part']],
            ['label', 'rest_expressions',
              ['repeat', 1,
                ['sequence',
                  ['repeat', 1, ['reference', 'space']],
                  ['reference', 'sequence_part']]]]]]],
      
      // sequence_part <- label? expression:(quantified_atom / atom) <Stake.Compiler.SequencePart>
      ['rule', 'sequence_part',
        ['type', 'Stake.Compiler.SequencePart',
          ['sequence',
            ['maybe', ['reference', 'label']],
            ['label', 'expression',
              ['choice',
                ['reference', 'quantified_atom'],
                ['reference', 'atom']]]]]],
      
      // quantified_atom <- atom quantifier <Stake.Compiler.Repeat>
      ['rule', 'quantified_atom',
        ['type', 'Stake.Compiler.Repeat',
          ['sequence',
            ['reference', 'atom'],
            ['reference', 'quantifier']]]],
      
      // atom <- parenthesised_expression
      //       / predicated_atom
      //       / reference_expression
      //       / string_expression
      //       / any_char_expression
      //       / char_class_expression
      ['rule', 'atom',
        ['choice',
          ['reference', 'parenthesised_expression'],
          ['reference', 'predicated_atom'],
          ['reference', 'reference_expression'],
          ['reference', 'string_expression'],
          ['reference', 'any_char_expression'],
          ['reference', 'char_class_expression']]],
      
      // predicated_atom <- predicate:("&" / "!") atom <Stake.Compiler.PredicatedAtom>
      ['rule', 'predicated_atom',
        ['type', 'Stake.Compiler.PredicatedAtom',
          ['sequence',
            ['label', 'predicate',
              ['choice',
                ['string', '&'],
                ['string', '!']]],
            ['reference', 'atom']]]],
      
      // reference_expression <- identifier !assignment <Stake.Compiler.Reference>
      ['rule', 'reference_expression',
        ['type', 'Stake.Compiler.Reference',
          ['sequence',
            ['reference', 'identifier'],
            ['not', ['reference', 'assignment']]]]],
      
      // string_expression <- "\"" ("\\" . / [^"])* "\""
      //                      <Stake.Compiler.String>
      ['rule', 'string_expression',
        ['type', 'Stake.Compiler.String',
          ['sequence',
            ['string', '"'],
            ['repeat', 0,
              ['choice',
                ['sequence',
                  ['string', '\\'],
                  ['any-char']],
                ['char-class', '[^"]']]],
            ['string', '"']]]],
      
      // any_char_expression <- "." <Stake.Compiler.AnyChar>
      ['rule', 'any_char_expression',
        ['type', 'Stake.Compiler.AnyChar',
          ['string', '.']]],
      
      // char_class_expression <- "[" "^"? ("\\" . / [^\]])+ "]"
      //                          <Stake.Compiler.CharClass>
      ['rule', 'char_class_expression',
        ['type', 'Stake.Compiler.CharClass',
          ['sequence',
            ['string', '['],
            ['maybe', ['string', '^']],
            ['repeat', 1,
              ['choice',
                ['sequence',
                  ['string', '\\'],
                  ['any-char']],
                ['char-class', '[^\\]]']]],
            ['string', ']']]]],
      
      // label <- identifier ":"
      ['rule', 'label',
        ['sequence',
          ['reference', 'identifier'],
          ['string', ':']]],
      
      // object_identifier <- identifier ("." identifier)*
      ['rule', 'object_identifier',
        ['sequence',
          ['reference', 'identifier'],
          ['repeat', 0,
            ['sequence',
              ['string', '.'],
              ['reference', 'identifier']]]]],
      
      // identifier <- [a-zA-Z_$] [a-zA-Z0-9_$]*
      ['rule', 'identifier',
        ['sequence',
          ['char-class', '[a-zA-Z_$]'],
          ['repeat', 0,
            ['char-class', '[a-zA-Z0-9_$]']]]],
      
      // quantifier <- "?" / "*" / "+"
      ['rule', 'quantifier',
        ['choice',
          ['string', '?'],
          ['string', '*'],
          ['string', '+']]],
      
      // space <- [\s\n\r\t]
      ['rule', 'space',
        ['char-class', '[\\s\\n\\r\\t]']]])
});

