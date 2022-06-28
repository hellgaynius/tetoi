<script>
export default {
  props: {
    buttonLike: Boolean,
    linkLike: Boolean,
    big: Boolean,
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
      markdown
    }"
  >
    <slot />
  </button>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.app-button {
  display: block;
  min-width: 100px;
  text-align: center;
  font-size: 12px;
  border: none;
  letter-spacing: 1px;
  &.button-like {
    padding: 10px 15px;
    border-radius: 5px;
    background-color: colors.$active-button-background;
    color: colors.$active-button-text;
    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
    cursor: pointer;
    @include light-shadow;
    &:hover {
      background-color: colors.$active-button-hover;
    }
    &:active {
      background-color: colors.$active-button-active;
    }
    &:disabled {
      background-color: colors.$main;
      @include inactive-button;
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
      @include inactive-button;
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
