<script>
export default {
  props: {
    isActive: Boolean,
  },
}
</script>

<template>
  <Transition name="fade-preloader">
    <div
      v-if="isActive"
      class="preloader-bar"
    >
      <div class="preloader"></div>
    </div>
  </Transition>
</template>

<style lang="scss">
@use '@/assets/style/colors';
@import '@/assets/style/mixins';

.preloader-bar {
  position: fixed;
  width: 100%;
  z-index: 14;
  .preloader {
    position: fixed;
    top: 0;
    width: 40%;
    height: 3px;
    filter: blur(1px);
    background: radial-gradient(
      circle at 50%, 
      colors.$dark, 
      colors.$main-active,
      transparent,
    );
    animation-name: preloader;
    @include preloader-animation;
  }
  @keyframes preloader {
    0% {
      left: -20%;
    }
    50% {
      width: 80%;
    }
    100% {
      left: 80%;
    }
  }
}
</style>
