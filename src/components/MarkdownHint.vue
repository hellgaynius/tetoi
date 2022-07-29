<script>
import { markdownRules } from '@/data/markdownRules.js';

export default {
  beforeCreate() {
    this.markdownRules = markdownRules;
  },
}
</script>

<template>
<div class="markdown-hint">
  <div
    v-for="ruleset in markdownRules.rulesets"
    :class="ruleset.name"
  >
    <h4 class="ruleset-label"> 
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
@use '@/assets/style/colors';
@use '@/assets/style/breakpoints';

.markdown-hint {
  display: grid;
  grid-template: 
    "a b c e" auto
    "a d c e";
  align-items: start;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto 40px auto;
  padding: 35px;
  color: colors.$dark;
  border: 3px solid colors.$secondary;
  background-color: colors.$app-background;
  .ruleset-label{
    margin: 15px 0;
  }
  .ruleset {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .rule {
    padding: 5px 0;
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
    gap: 30px;  
    width: fit-content;
    margin: 0 auto;
  }
}
</style>
