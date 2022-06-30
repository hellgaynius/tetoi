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
@use '@/assets/colors';

.preloader-bar {
  position: fixed;
  width: 100%;
  z-index: 5;
}

.preloader {
  position: fixed;
  top: 0;
  width: 40%;
  height: 3px;
  filter: blur(1px);
  background: radial-gradient(
    circle at 50%, 
    colors.$app-shadow, 
    colors.$secondary, 
    transparent
  );
  animation-name: preloader;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(.75, -0.01, .59, .99);
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
</style>
