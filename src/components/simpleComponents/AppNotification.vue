<script>
  export default {
    NOTIFICATION_FADE_DELAY: 10000,
    NOTIFICATION_REMOVE_DELAY: 13000,
    
    props: {
      notification: Object,
    },

    emits: ['close-notification'],

    data() {
      return {
        removeTimeoutId: null,
        fadeTimeoutId: null,
        isRemoved: false,
      }
    },

    watch: {
      notification: {
        handler() {
          this.stopRemoval();
          this.removeWithDelay();
        },

        immediate: true,
      },
    },

    methods: {
      stopRemoval() {
        clearTimeout(this.removeTimeoutId);
        this.isRemoved = false;
      },

      removeWithDelay() {
        this.removeTimeoutId = 
          setTimeout(() => {
            this.$emit('close-notification');
          }, 
          this.$options.NOTIFICATION_REMOVE_DELAY,
        );

        this.fadeTimeoutId = 
          setTimeout(() => {
            this.isRemoved = true;
          }, 
          this.$options.NOTIFICATION_FADE_DELAY,
        );
      },
    },
  };
</script>

<template>
  <div 
    class="notification"
    :class="[
      notification.type,
      {removed: isRemoved}
    ]"
    v-show="notification.show"
    @mouseenter="stopRemoval"
    @mouseleave="removeWithDelay"
  >
    <span 
      class="text"
      v-html="notification.text"
    ></span>
    <div 
      class="close-icon"
      @click="$emit('close-notification')"
    ></div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.notification {
  position: fixed;
  z-index: 10;
  max-width: 300px;
  top: 30px;
  right: 30px;
  padding: 20px 30px;
  border-radius: 7px;
  background-color: colors.$secondary-light;
  text-align: center;
  overflow-wrap: break-word;
  &.removed {
    opacity: 0;
    transition: opacity 3s;
  }
  &:hover {
    opacity: 1;
    transition: opacity 0s;
  }
  &.warning {
    box-shadow: 3px 3px 0 colors.$warning;
    border: 2px solid colors.$warning;
    color: colors.$secondary-darker;
    & .close-icon {
      border: 1px solid colors.$warning;
      &::before {
        border-top: 3px solid colors.$warning;
      }
      &::after {
        border-top: 3px solid colors.$warning;
      }
    }
  }
  &.info {
    box-shadow: 3px 3px 0 colors.$info;
    border: 2px solid colors.$info;
    color: colors.$secondary-darker;
    & .close-icon {
      border: 1px solid colors.$info;
      &::before {
        border-top: 3px solid colors.$info;
      }
      &::after {
        border-top: 3px solid colors.$info;
      }
    }  
  }
  .close-icon {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 25px;
    height: 25px;
    text-align: center;
    font-size: 14px;
    border-radius: 50%;
    background-color: colors.$secondary-light;
    cursor: pointer;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 4px;
      width: 15px;
    }
    &::before {
      transform: rotate(-45deg); 
    }
    &::after {
      transform: rotate(45deg); 
    }
  }
}
</style>
