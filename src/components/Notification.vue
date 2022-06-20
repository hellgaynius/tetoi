<script>
  export default {
    props: ['notificationText'],
    emits: ['close-notification'],

    data() {
      return {
        NOTIFICATION_FADE_DELAY: 10000,
        NOTIFICATION_REMOVE_DELAY: 13000,
        isRemoved: false,
      }
    },

    watch: {
      notificationText() {
        this.closeWithDelay();
      },
    },

    methods: {
      stopTimerOfRemoval() {
        this.isRemoved = true;
        clearTimeout(this.removeTimeoutId);
      },

      closeWithDelay() {
        setTimeout(() => {
          this.isRemoved = true;
        }, this.NOTIFICATION_FADE_DELAY);

        this.removeTimeoutId = 
          setTimeout(() => {
              this.$emit('close-notification');
            }, 
            this.NOTIFICATION_REMOVE_DELAY,
          );
      },
    },

    mounted() {
    }
  };
</script>

<template>
  <div 
    class="notification"
    :class="{ removed: isRemoved }"
    @mouseenter="stopTimerOfRemoval"
    @mouseleave="closeWithDelay"
  >
    <span class="notification__text">{{ notificationText }}</span>
    <div 
      class="notification__close-icon"
      @click="$emit('close-notification')"
    >
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';

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
  transition: opacity 3s;
  &.removed {
    opacity: 0;
  }
  &:hover {
    opacity: 1;
    transition: opacity 0s;
  }
  &.warning {
    box-shadow: 3px 3px 0 colors.$warning;
    border: 2px solid colors.$warning;
    color: colors.$warning;
    & .notification__close-icon {
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
    color: colors.$info;
    & .notification__close-icon {
      border: 1px solid colors.$info;
      &::before {
        border-top: 3px solid colors.$info;
      }
      &::after {
        border-top: 3px solid colors.$info;
      }
    }  
  }
  &__close-icon {
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
