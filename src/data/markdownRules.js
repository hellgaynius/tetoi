export const markdownRules = {
  rulesets: {
    headings: { 
      label: 'Headings:',
      name: 'headings',
      rules: [
        '# biggest', 
        '## big',
        '### medium',
        '#### small',
        '##### smaller',
        '###### the smallest',
      ],
    },
    alignModes: { 
      label: 'Align modes:',
      name: 'align-modes',
      rules: [
        '-=- center',
        '--= right',
      ],
    },
    lists: { 
      label: 'Lists:',
      name: 'lists',
      rules: [
        '- unordered <br> - list',
        '1. ordered <br> 2. list',
      ],
    },
    misc: { 
      label: 'Misc:',
      name: 'misc',
      rules: [
        '*italic*',
        '**bold**',
        // as backslash is an escape symbol, we need to write 
        // six of them in the code
        // so that three of them appear on the webpage
        '\\\\\\ empty line',
        '> blockquote',
        '`code`',
      ]
    },
    combinations: { 
      label: 'Combinations:',
      name: 'combinations',
      rules: [
        '## **bold heading**',
        '## -=- center heading',
        '> - quoted <br> > - list',
      ],
    },
  },
};
