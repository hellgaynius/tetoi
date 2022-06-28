<script>
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import AppNotification from '@/components/simpleComponents/AppNotification.vue'
import browserStorage from '@/browserStorage/browserStorage.js'
import apiMethods from '@/api/api.js';
import { nanoid } from 'nanoid';

export default {
  components: {
    AppNotification,
    TextTransformator,
    MarkdownHint,
    ResultImages,
    ProjectActions,
  },

  LOCAL_STORAGE_ITEM_NAME: 'localProject',

  data() {
    return {
      isRequestOngoing: true,
      isProjectSaved: false,
      isProjectPublished: false,
      isProjectLoaded: false,
      projectId: null,
      isMarkdownHintHidden: true,
      notification: {
        show: false,
        type: 'info',
        text: '',
      },
      post: {},
      images: {},
      currentSlotNumber: 0,
    }
  },

  computed: {
    isProjectFilled() {
      return !!(this.post?.fullText ||
        this.post?.slots.some(slot => slot.text));
    },
  },

  created() {
    this.setInitialPost();
    this.initProjectState();
  },

  methods: {
    setInitialPost() {
      this.post = { 
        fullText: '', 
        slots: [
          {
            text: '',
            id: nanoid(),
          },
        ],
      };
    },

    async initProjectState() {
      let project = null;

      this.projectId = window.location.pathname;

      if (this.projectId.length > 1) {
        project = await this.fetchProject(this.projectId);
      } 

      if (!project) {
        this.projectId = null;
        project = browserStorage.fetch(this.$options.LOCAL_STORAGE_ITEM_NAME);

        this.showNotification('info', 
          `Project is saved locally for this browser. <br>
          To have access from everywhere, publish your project.`)
      };

      if (project) {
        this.post = project;
      };

      this.isProjectLoaded = true;
    },

    fetchProject(projectId) {
      this.isRequestOngoing = true;

      return apiMethods.get(projectId)
        .then(serverResponse => {
          this.isRequestOngoing = false;
          this.isProjectPublished = true;
          this.isProjectSaved = true;
          this.showNotification('info', 'Successfuly loaded project from server');

          return serverResponse;
        })
        .catch(error => {
          this.isRequestOngoing = false;
          window.history.replaceState({}, '', window.location.origin);
          this.showNotification('warning', error);

          return null;
        })
    },

    showNotification(type, text) {
      this.notification = {
        show: true,
        type: type,
        text: text,
      };
    },

    closeNotification() {
      this.notification.show = false;
    },

    saveText(textValue, targetContainer) {
      if (targetContainer === 'slot') {
        this.post.slots[this.currentSlotNumber].text = textValue;
      } else {
        this.post.fullText = textValue;
      }

      if (this.isProjectPublished) {
        this.isProjectSaved = false;
      }

      browserStorage.handle(
        this.isProjectFilled, 
        this.isProjectPublished, 
        this.$options.LOCAL_STORAGE_ITEM_NAME, 
        this.post,
      );
    },

    toggleMarkdownHint() {
      this.isMarkdownHintHidden = !this.isMarkdownHintHidden;
    },

    changeCurrentSlotNumber(index) {
      this.currentSlotNumber = index;
    },

    changeSlotImage(imgSrc, slotId) {
      this.images[slotId] = imgSrc;
    },

    removeSlot(id) {
      const deletedSlotIndex = this.post.slots.findIndex(slot => slot.id === id);

      if (this.currentSlotNumber === deletedSlotIndex) {
        this.currentSlotNumber = 0;
      } else if (this.currentSlotNumber > deletedSlotIndex) {
        this.currentSlotNumber -= 1;
      };

      this.post.slots.splice(deletedSlotIndex, 1);
    },

    setProjectId(id) {
      this.projectId = '/' + id;
    },

    changeRequestStatus(newValue) {
      this.isRequestOngoing = newValue;
    },

    toggleSaveStatus() {
      this.isProjectSaved = !this.isProjectSaved;
    },

    togglePublishStatus() {
      this.isProjectPublished = !this.isProjectPublished;
    },

    resetProject() {
      this.setInitialPost(),
      this.currentSlotNumber = 0;
      this.images = [];
    },
  },
};
</script>

<template>
  <AppNotification
    :notification="notification"
    @close-notification="closeNotification"
  />
  <div class="app">
    <h1 class="logo">tetoi</h1>
    <main class="main">
      <div 
        class="preloader-mask"
        v-show="isRequestOngoing"
      ></div>
      <div
        v-show="isProjectPublished"
        class="project-status"
      >
        <span 
          v-if="isProjectSaved"
          class="status-text saved"
        >saved</span>
        <span 
          v-else
          class="status-text unsaved"
        >unsaved</span>
      </div>
      <TextTransformator
        :isDisabled="isRequestOngoing"
        :is-project-loaded="isProjectLoaded"
        :is-project-published="isProjectPublished"
        :is-project-filled="isProjectFilled"
        :is-markdown-hint-hidden="isMarkdownHintHidden"
        :current-slot-number="currentSlotNumber"
        :post="post"
        @toggle-markdown-hint="toggleMarkdownHint"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
      />
      <MarkdownHint v-show="!isMarkdownHintHidden"/>
      <ResultImages
        :current-slot-number="currentSlotNumber"
        :images="images"
        :slots="post.slots"
        @change-current-slot-id="changeCurrentSlotNumber"
        @remove-slot="removeSlot"
      />
      <ProjectActions
        :post="post"
        :projectId="projectId"
        :is-project-filled="isProjectFilled"
        :is-project-published="isProjectPublished"
        :is-project-saved="isProjectSaved"
        @set-project-id="setProjectId"
        @change-request-status="changeRequestStatus"
        @toggle-save-status="toggleSaveStatus"
        @toggle-publish-status="togglePublishStatus"
        @reset-project="resetProject"
        @show-notification="showNotification"
      />
    </main>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.app {
  display: flex;
  flex-direction: column;
  .logo {
    position: absolute;
    left: 100px;
    font: bold small-caps 76px 'Marcellus SC', serif;
  }
  .main {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    width: 100%;
    margin: 50px auto 150px auto;
    padding: 50px 50px 80px 50px;
    background-color: colors.$app-background;
    border-radius: var(--main-border-radius);
    box-shadow: 10px 20px 70px colors.$app-shadow;
  }
  .preloader-mask {
    position: absolute;
    z-index: 9;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--main-border-radius);
    background-color: colors.$app-background;
    opacity: 0.5;
  }
  .project-status {
    text-align: right;
  }
  .status-text {
    letter-spacing: 4px;
    &.saved {
      color: colors.$secondary-active;
    }
    &.unsaved {
      color: colors.$secondary-darker;
    }
  }
}  

@media #{breakpoints.$l-media} {
  .app {
    .logo {
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
    .main {
      width: 100%;
      min-width: 370px;
      padding: 40px 10px 80px 10px;
      box-shadow: none;
    }
    .project-status {
      padding: 20px;
    }
  }
}
</style>
