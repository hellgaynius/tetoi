<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { modalPromise } from '@/processes/confirmation.js'
import { modalOff } from '../../processes/confirmation';

export default {
  components: {
    AppButton,
  },

  props: {
    isActive: Boolean,
  },

  data() {
    return {
      documentBody: null,
    }
  },

  watch: {
    isActive(value) {
      this.documentBody = document.querySelector('body');      
      this.documentBody.classList.toggle('scroll-off', value);
    },
  },

  beforeDestroy() {
    this.documentBody.classList.remove('scroll-off');
  },

  methods: {
    confirm() {
      modalPromise.resolve();
    },

    cancel() {
      modalPromise.reject();
    },

    closeModal(event) {
      if (event.target === this.$refs.confirmationOverlay) {
        modalOff();
      };
    },
  }
}
</script>
<template>
<div 
  class="confirmation-overlay"
  v-if="isActive"
  ref="confirmationOverlay"
  @click="closeModal($event)"
>
  <div 
    class="confirmation-window"
  >
    <div class="question">
      are you sure?
      <div class="buttons-container">
        <AppButton
          button-like
          big
          @click="confirm"
        >
          yes
        </AppButton>
        <AppButton
          button-like
          big
          @click="cancel"
        >
          no
        </AppButton>
      </div>
    </div>
  </div>
</div>
</template>


<style lang="scss">
@use '@/assets/colors';
@import '@/assets/global';

.confirmation-overlay {
  position: fixed;
  z-index: 15;
  width: 100%;
  height: 100vh;
  background-image: url(../../../background-pattern.png);
}  
.confirmation-window {
  position: fixed;
  z-index: 16;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 250px;
  padding: 50px;
  background-image: url(../../../app-background-pattern.png);
  border: 3px solid colors.$active-button-background;
  box-shadow: 5px 5px colors.$active-button-background;
  color: colors.$secondary-darker;
}
.question {
  margin: 0 auto;
  text-align: center;
  font-size: 3em;
}
.buttons-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-around;
  gap: 40px;
  padding-top: 50px;
  font-size: 20px;
}
.scroll-off {
  overflow: hidden;
}
</style>
