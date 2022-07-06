<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { modalPromise } from '@/processes/confirmation.js'
import { useConfirmation, modalOff } from '@/processes/confirmation';

export default {
  components: {
    AppButton,
  },

  setup() {
    return  {
      confirmation: useConfirmation(),
    };
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
    confirmation: {
      handler(value) {
        this.documentBody = document.querySelector('body');      
        this.documentBody.classList.toggle('scroll-off', value.isModalOn);
      },

      deep: true,
    }
  },

  methods: {
    confirm() {
      modalPromise.resolve();
      modalOff();
    },

    cancel() {
      modalPromise.reject();
      modalOff();
    },
  }
}
</script>

<template>
<div v-if="confirmation.isModalOn">
  <div 
    class="app-confirmation"
    ref="confirmationOverlay"
    @click="cancel"
  ></div>
  <div class="confirmation-window">
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
@use '@/assets/breakpoints';

.app-confirmation {
  position: fixed;
  z-index: 15;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/overlay-background-pattern.png');
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
  background-color: colors.$app-background;
  border: 3px solid colors.$active-button-background;
  box-shadow: 5px 5px colors.$active-button-background;
  color: colors.$secondary-darker;
}
.question {
  margin: 0 auto;
  text-align: center;
  font-size: 40px;
}
.buttons-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-around;
  gap: 40px;
  padding-top: 50px;
  font-size: 20px;
}

@media #{breakpoints.$s-media} {
  .confirmation-window {
    width: 350px;
    height: 200px;
  }
  .question {
    font-size: 30px;
  }
  .buttons-container {
    gap: 30px;
    padding-top: 30px;
  }
}
</style>
