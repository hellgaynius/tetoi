<script>
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import VNotification from '@/components/base/VNotification.vue'
import browserStorage from '@/browserStorage/browserStorage.js'
import apiMethods from '@/api/api.js';
import { nanoid } from 'nanoid';

const LOCAL_STORAGE_ITEM_NAME = 'localProject';

export default {
  components: {
    VNotification,
    TextTransformator,
    MarkdownHint,
    ResultImages,
    ProjectActions,
  },

  data() {
    return {
      isProjectSaved: false,
      isProjectPublished: false,
      isPublishButtonDisabled: true,
      isResetButtonDisabled: true,
      isSaveButtonDisabled: true,
      isDeleteButtonDisabled: false,
      projectId: null,
      isMarkdownHintHidden: true,
      notification: {
        isDisplayed: false,
        type: 'info',
        text: '',
      },
      post: { 
        fullText: '', 
        slots: [
          {
            text: '',
            imgSrc: '',
            id: nanoid(),
          }
        ],
      },
      currentSlotNumber: 0,
    }
  },

  computed: {
    isProjectFilled() {
      return this.post.fullText ||
        this.post.slots.some(slot => slot.text) ? true : false;
    },
  },

  watch: {
    isProjectFilled(newValue) {
      this.isPublishButtonDisabled = !newValue;
      this.isResetButtonDisabled = !newValue;
    }
  },

  methods: {
    showNotification(type, text) {
      this.notification.isDisplayed = true;
      this.notification.type = type;
      this.notification.text = text;
    },

    saveText(textValue, targetContainer) {
      if (targetContainer === 'slot') {
        this.post.slots[this.currentSlotNumber].text = textValue;
      } else {
        this.post.fullText = textValue;
      }

      if (this.isProjectPublished) {
        this.isSaveButtonDisabled = false;
        this.isProjectSaved = false;
      }

      const paramsForBrowserStorageHandler = [
        this.isProjectFilled, 
        this.isProjectPublished, 
        LOCAL_STORAGE_ITEM_NAME, 
        this.post
      ];

      browserStorage.handle(paramsForBrowserStorageHandler);
    },

    changeCurrentSlotNumber(index) {
      this.currentSlotNumber = index;
    },

    changeSlotImage(imgSrc, slotIndex) {
      this.post.slots[slotIndex].imgSrc = imgSrc;
    },

    removeSlot(id) {
      const deletedSlotIndex = this.post.slots.findIndex(slot => slot.id === id);

      if (this.currentSlotNumber === deletedSlotIndex) {
        this.currentSlotNumber = 0;
      } else if (this.currentSlotNumber > deletedSlotIndex) {
        this.currentSlotNumber -= 1;
      };

      this.post.slots =
        this.post.slots.filter(slot => slot.id != id);
    },

    publishProject() {
      this.isPublishButtonDisabled = true;
      this.isResetButtonDisabled = true;

      apiMethods.publish(this.post)
        .then(response => {
          this.projectId = '/' + response.id;
          this.isProjectPublished = true;
          this.isProjectSaved = true;
          this.isDeleteButtonDisabled = false,
          browserStorage.reset();
          window.history.replaceState({}, '', this.projectId);
          this.showNotification('info', 
            `Project was published successfully. <br>
            It is now available via the link: <br> <br>
            ${window.location}`);
        })
        .catch(error => {
          this.isPublishButtonDisabled = false;
          this.isResetButtonDisabled = false;
          this.showNotification('warning', error);
        });
    },

    updateProject() {
      this.isSaveButtonDisabled = true;
      this.isDeleteButtonDisabled = true;

      apiMethods.update(this.post, this.projectId)
        .then(() => {
          this.isProjectSaved = true;
          this.showNotification('info', `Updates were saved successfully`);
          this.isDeleteButtonDisabled = false; 
        })
        .catch(error => {
          this.isSaveButtonDisabled = false;
          this.isDeleteButtonDisabled = false;
          this.showNotification('warning', error);
        });
    },

    deleteProject() {
      this.isSaveButtonDisabled = true,
      this.isDeleteButtonDisabled = true;

      apiMethods.delete(this.projectId)
        .then(() => {
          window.history.replaceState({}, '', window.location.origin);
          this.resetProject();
          this.showNotification('info', `Project ${this.projectId} deleted`);
          this.projectId = null;
          this.isProjectPublished = false;
        })
        .catch(error => {
          this.isDeleteButtonDisabled = false;
          this.showNotification('warning', error);
        })
    },

    resetProject() {
      browserStorage.reset();
      this.currentSlotNumber = 0;
      this.post = { 
        fullText: '', 
        slots: [
          {
            text: '',
            imgSrc: '',
            id: nanoid(),
          },
        ],
      };
    },

    fetchProject(projectId) {
      return apiMethods.get(projectId)
        .then(serverResponse => {
          this.isProjectPublished = true;
          this.showNotification('info', 'Successfuly loaded project from server');

          return serverResponse;
        })
        .catch(error => {
          window.history.replaceState({}, '', window.location.origin);
          this.showNotification('warning', error);

          return null;
        })
    },

    async initProjectState() {
      let serverStore = null;
      let localStore = null;
      this.projectId = window.location.pathname;

      if (this.projectId.length > 1) {
        serverStore = await this.fetchProject(this.projectId)
      } 

      if (!serverStore) {
        localStore = browserStorage.fetch(LOCAL_STORAGE_ITEM_NAME);
      }

      const project = serverStore || localStore || null;

      if (project) {
        this.post = project;
      }
    },
  },

  created() {
    this.initProjectState();
  },
};
</script>

<template>
  <VNotification
    :notification="notification"
    @close-notification="notification.isDisplayed = false"
  />
  <div class="app">
    <h1 class="logo">tetoi</h1>
    <main class="main">
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
          class="status-text unsaved">unsaved</span>
      </div>
      <TextTransformator
        :is-markdown-hint-hidden="isMarkdownHintHidden"
        :current-slot-number="currentSlotNumber"
        :post="post"
        @toggle-markdown-hint="isMarkdownHintHidden = !isMarkdownHintHidden"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
      />
      <MarkdownHint v-show="!isMarkdownHintHidden"/>
      <ResultImages
        :current-slot-number="currentSlotNumber"
        :slots="post.slots"
        @change-current-slot-id="changeCurrentSlotNumber"
        @remove-slot="removeSlot"
      />
      <ProjectActions
        :is-project-filled="isProjectFilled"
        :is-project-published="isProjectPublished"
        :is-publish-button-disabled="isPublishButtonDisabled"
        :is-reset-button-disabled="isResetButtonDisabled"
        :is-save-button-disabled="isSaveButtonDisabled"
        :is-delete-button-disabled="isDeleteButtonDisabled"
        @publish-project="publishProject"
        @reset-project="resetProject"
        @update-project="updateProject"
        @delete-project="deleteProject"
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
  .main {
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
  .logo {
    position: absolute;
    left: 100px;
    font: bold small-caps 76px 'Marcellus SC', serif;
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
