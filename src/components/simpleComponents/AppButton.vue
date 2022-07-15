<script>
export default {
  props: {
    buttonLike: Boolean,
    linkLike: Boolean,
    big: Boolean,
    settings: Boolean,
    markdown: Boolean,
  }
}
</script>

<template>
  <button 
    class="app-button"
    :class="{
      'button-like': buttonLike,
      'link-like': linkLike,
      big,
      markdown,
      settings,
    }"
  >
    <slot />
  </button>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';

.app-button {
  display: block;
  text-align: center;
  font-size: 1em;
  border: none;
  letter-spacing: 1px;
  background-color: transparent;
  transition: color 0.2s, box-shadow 0.2s, border 0.2s;
  &.button-like {
    min-width: 100px;
    padding: 10px 15px;
    border: 1px solid colors.$active-button-background;
    box-shadow: 3px 3px colors.$active-button-background;
    color: colors.$secondary-darker;
    background-color: colors.$app-background;
    cursor: pointer;
    &:hover {
      border: 1px solid colors.$active-button-hover;
      box-shadow: 3px 3px colors.$active-button-hover;
    }
    &:active {
      border: 1px solid colors.$active-button-active;
      box-shadow: 3px 3px colors.$active-button-active;
    }
    &:disabled {
      color: colors.$secondary;
      text-decoration: none;
      border: none;
      cursor: default;
      border: 1px solid colors.$secondary;
      box-shadow: 3px 3px colors.$secondary;
    }
  }
  &.link-like {
    text-align: right;
    text-decoration: underline;
    color: colors.$secondary-darker;
    background-color: transparent;
    transition: color 0.2s;
    cursor: pointer;
    &:hover {
      color: colors.$secondary;
    }
    &:disabled {
      color: colors.$secondary;
      box-shadow: none;
      text-decoration: none;
      border: none;
      cursor: default;
    }
    &.markdown {
      margin-bottom: 20px;
    }
  }
  &.big {
    letter-spacing: 2px;
    padding: 15px 10px;
    font-size: 16px;
  }
}  

@media #{breakpoints.$s-media} {
  .markdown {
    margin: 0 auto;
  }
}
</style>
