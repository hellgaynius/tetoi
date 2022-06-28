<script>
  export default {
    NOTIFICATION_REMOVE_DELAY: 10000,
    
    props: {
      notification: Object,
    },

    emits: ['close-notification'],

    data() {
      return {
        removeTimeoutId: null,
      }
    },

    watch: {
      notification() {
        this.stopRemoval();
        this.removeWithDelay();
      },
    },

    mounted() {
      this.removeWithDelay();
    },

    methods: {
      stopRemoval() {
        clearTimeout(this.removeTimeoutId);
      },

      removeWithDelay() {
        this.removeTimeoutId = 
          setTimeout(() => {
            this.$emit('close-notification');
          }, 
          this.$options.NOTIFICATION_REMOVE_DELAY,
        );
      },
    },
  };
</script>

<template>
  <Transition name="fade-notification">
    <div 
      class="notification"
      :class="notification.type"
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
  </Transition>
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
  }
  &:hover {
    opacity: 1;
    transition: opacity 0s;
  }
  &.warning {
    box-shadow: 3px 3px 0 colors.$warning;
    border: 2px solid colors.$warning;
    color: colors.$warning;
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
    color: colors.$info;
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
