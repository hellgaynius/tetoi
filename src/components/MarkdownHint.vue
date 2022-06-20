<script>
export default {
  data() {
    return {
      rulesets: {
        headings: { 
          title: 'headings',
          rules: [
            { text: '# biggest' }, 
            { text: '## big' },
            { text: '### medium' },
            { text: '#### small' },
            { text: '##### smaller' },
            { text: '###### the smallest' }
          ]
        },
        alignModes: { 
          title: 'align-modes',
          rules: [
            { text: '-=- center' },
            { text: '--= right' }
          ]
        },
        lists: { 
          title: 'lists',
          rules: [
            { text: '- unordered <br> - list' },
            { text: '1. ordered <br> 2. list' }
          ]
        },
        misc: { 
          title: 'misc',
          rules: [
            { text: '*italic*' },
            { text: '**bold**' },
            { text: '\\\ empty line' },
            { text: '> blockquote' },
            { text: '`code`' }
          ]
        },
        combinations: { 
          title: 'combinations',
          rules: [
            { text: '## **bold heading**' },
            { text: '## -=- center heading' },
            { text: '> - quoted <br> > - list' }
          ]
        }
      }
    };
  },
}
</script>

<template>
  <div class="hint">
    <div
      v-for="ruleset in rulesets"
      :class="['hint__rules', 'hint__rules--' + ruleset.title]"
    >
      <h4> 
        {{ ruleset.title }}
      </h4>
      <ul>
        <li 
          class="hint__rule"
          v-for="rule in ruleset.rules"
          v-html="rule.text"
        >
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';

.hint {
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
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  &__rules {
    &--headings {
      grid-area: a;
    }
    &--align-modes {
      grid-area: b;
    }
    &--lists {
      grid-area: d;
    }
    &--misc {
      grid-area: c;
    }
    &--combinations {
      grid-area: e;
    }
  }
  &__rule {
    padding: 7px;
    font-size: 12px;
  }
}

@media #{breakpoints.$s-media} {
  .hint {
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
