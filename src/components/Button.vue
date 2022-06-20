<script>
export default {
  data() {
    return {

    }
  },

  props: ['text', 'type', 'size', 'action']
}
</script>

<template>
  <button 
    class="button"
    :class="[
      'button--' + type, 
      size ? 'button--' + size : null, 
      action ? 'button--' + action : null 
    ]"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';

.button {
  display: block;
  min-width: 100px;
  text-align: center;
  font-size: 12px;
  border: none;
  color: colors.$secondary-darker;
  letter-spacing: 1px;
  &--button-like {
    padding: 10px 15px;
    border-radius: 5px;
    @include active-button;
    &:disabled {
      background-color: colors.$main;
      @include inactive-button;
    }
  }
  &--big {
    letter-spacing: 2px;
    padding: 15px 10px;
    font-size: 16px;
  }
  &--link-like {
    text-align: right;
    background-color: transparent;
    text-decoration: underline;
    cursor: pointer;
    &:disabled {
      text-decoration: none;
      @include inactive-button;
    }
  }
  &--markdown {
    &.info-is-opened {
      .button {
        &__text-for-hide {
          display: inline;
        }
        &__text-for-show {
          display: none;
        }
      }
    }
  }
  &__text-for-hide {
    display: none;
  }
  &--publish,
  &--save {
    grid-column-start: 2;
  }
  &--reset,
  &--delete {
    grid-column-start: 3;
  }
}

@media #{breakpoints.$s-media} {
  .button {
    &--markdown {
      margin: 0 auto;
    }
    &--reset,
    &--delete {
      text-align: center;
    }
  }
}
</style>
