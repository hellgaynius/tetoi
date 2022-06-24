<script>
export default {
  props: {
    active: Boolean,
  },

  data() {
    return {
      rulesets: {
        headings: { 
          label: 'Headings',
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
            '\\\ empty line',
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
  },
}
</script>

<template>
  <div class="markdown-hint">
    <div
      v-for="ruleset in rulesets"
      :class="ruleset.name"
    >
      <h4> 
        {{ ruleset.label }}
      </h4>
      <ul class="ruleset">
        <li 
          class="rule"
          v-for="rule in ruleset.rules"
          v-html="rule"
        ></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.markdown-hint {
  display: grid;
  grid-template: 
    "a b c e" auto
    "a d c e";
  align-items: start;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto 20px auto;
  padding: 25px;
  color: colors.$secondary-darker;
  background-color: colors.$markdown-background;
  border-radius: 10px;
  .ruleset {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .rule {
    padding: 7px;
    font-size: 12px;
  }
  .headings {
    grid-area: a;
  }
  .align-modes {
    grid-area: b;
  }
  .lists {
    grid-area: d;
  }
  .misc {
    grid-area: c;
  }
  .combinations {
    grid-area: e;
  }
}

@media #{breakpoints.$s-media} {
  .markdown-hint {
    grid-template: 
      "a b"
      "a b"
      "a d"
      "c d"
      "c e"
      "c e";
    justify-content: space-around;
    gap: 20px;  
  }
}
</style>
