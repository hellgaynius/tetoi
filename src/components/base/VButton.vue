<script>
export default {
  props: {
    text: String,
    type: String,
    size: String,
    action: String,
  }
}
</script>

<template>
  <button 
    class="v-button"
    :class="[
      type, 
      size ? size : null, 
      action ? action : null 
    ]"
  >
    <slot />
  </button>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.v-button {
  display: block;
  min-width: 100px;
  text-align: center;
  font-size: 12px;
  border: none;
  color: colors.$secondary-darker;
  letter-spacing: 1px;
  &.button-like {
    padding: 10px 15px;
    border-radius: 5px;
    @include active-button;
    &:disabled {
      background-color: colors.$main;
      @include inactive-button;
    }
  }
  &.link-like {
    text-align: right;
    background-color: transparent;
    text-decoration: underline;
    cursor: pointer;
    &:disabled {
      text-decoration: none;
      @include inactive-button;
    }
  }
  &.big {
    letter-spacing: 2px;
    padding: 15px 10px;
    font-size: 16px;
  }
  &.publish,
  &.save {
    grid-column-start: 2;
  }
  &.reset,
  &.delete {
    grid-column-start: 3;
  }
}  

@media #{breakpoints.$s-media} {
  .markdown {
    margin: 0 auto;
  }

  .reset,
  .delete {
    text-align: center;
  }
}
</style>
