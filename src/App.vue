<script>
import Transformator from './components/Transformator.vue';
import ResultImages from './components/ResultImages.vue';
import Actions from './components/Actions.vue';
import MarkdownHint from './components/MarkdownHint.vue';
import Notification from './components/Notification.vue'

export default {
  components: {
    Notification,
    Transformator,
    MarkdownHint,
    ResultImages,
    Actions,
  },

  props: ['isProjectPublished'],

  data() {
    return {
      isButtonDisabled: true,
      isProjectSaved: true,
      projectId: null,
      isHintHidden: true,
      isNotificationDisplayed: false,
      notificationType: 'info',
      notificationText: '',
      isSmallScreen: window.matchMedia('max-width: 400px'),
      post: { 
        fullText: '', 
        slots: [
          {
            text: '',
            imgSrc: './slot.png',
          }
        ],
      },
      currentSlotId: 0,
    }
  },

  computed: {
    isProjectFilled() {
      return this.post.fullText ||
        this.post.slots.some(slot => slot.text)
    },
  },

  methods: {
    showNotification(type, text) {
      this.isNotificationDisplayed = true;
      this.notificationType = type;
      this.notificationText = text;
    },

    saveSlotText(event) {
      this.post.slots[this.currentSlotId].text = event.target.value;
    },

    saveFullText(event) {
      this.post.fullText = event.target.value;
    },

    changeCurrentSlotId(index) {
      this.currentSlotId = index;
    },

    changeSlotImage(imgSrc, slotId) {
      this.post.slots[slotId].imgSrc = imgSrc;
    },

    removeSlot(index) {
      this.post.slots.splice(index, 1);
      console.log(this.currentSlotId)
    },

    resetProject() {
      this.post.fullText = '';
      this.currentSlotId = 0;
      this.post.slots.splice(1);
      this.post.slots[0].text = '';
      this.post.slots[0].imgSrc = './slot.png';
    },
  },
};
</script>

<template>
  <Notification
    v-show="isNotificationDisplayed"
    :class="notificationType"
    :notificationText="notificationText"
    @close-notification="isNotificationDisplayed = false"
  />
  <div class="app">
    <h1 class="app__logo">tetoi</h1>
    <main class="app__main">
      <div 
        v-show="isProjectPublished"
        class="app__project-status">
        <span 
          v-if="isProjectSaved"
          class="app__status-text app__status-text--saved"
        >saved</span>
        <span 
          v-else
          class="app__status-text app__status-text--unsaved">unsaved</span>
      </div>
      <Transformator
        :isHintHidden="isHintHidden"
        :currentSlotId="currentSlotId"
        :post="post"
        :isButtonDisabled="isButtonDisabled"
        @toggle-markdown-hint="isHintHidden = !isHintHidden"
        @save-slot-text="saveSlotText"
        @save-full-text="saveFullText"
        @change-slot-image="changeSlotImage"
        @enable-button="isButtonDisabled = false"
        @disable-button="isButtonDisabled = true"
      />
      <MarkdownHint v-show="!isHintHidden"/>
      <ResultImages
        :currentSlotId="currentSlotId"
        :slots="post.slots"
        @change-current-slot-id="changeCurrentSlotId"
        @remove-slot="removeSlot"
      />
      <Actions
        :isProjectFilled="isProjectFilled"
        @reset-project="resetProject"
        @show-notification="showNotification"
      />
    </main>
  </div>
</template>

<style lang="scss">
@use './src/assets/colors';
@use './src/assets/breakpoints';
@import './src/assets/mixins';
@import './src/assets/global';

.app {
  display: flex;
  flex-direction: column;
  &__main {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    margin: 50px auto 150px auto;
    padding: 50px 50px 80px 50px;
    background-color: colors.$app-background;
    border-radius: 20px;
    box-shadow: 10px 20px 70px colors.$app-shadow;
  }
  &__logo {
    position: absolute;
    left: 100px;
    font: bold small-caps 76px 'Marcellus SC', serif;
  }
  &__project-status {
    text-align: right;
    &.unsaved {
      .app__status-text {
        &--saved {
          display: none;
        }
        &--unsaved {
          display: inline;
        }
      }
    }
  }
  &__status-text {
    letter-spacing: 4px;
    &--saved {
      color: colors.$secondary-active;
    }
    &--unsaved {
      display: none;
      color: colors.$secondary-darker;
    }
  }
}

@media #{breakpoints.$l-media} {
  .app {
    &__logo {
      position: static;
      min-width: 370px;
      padding-top: 30px;
      font-size: 66px;
      text-align: center;
    }
  }
}

@media #{breakpoints.$s-media} {
  .app {
    &__main {
      width: 100%;
      min-width: 370px;
      padding: 40px 10px 80px 10px;
      box-shadow: none;
    }
    &__project-status {
      padding: 20px;
    }
  }
}
</style>
