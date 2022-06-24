<script>
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import AppNotification from '@/components/simpleComponents/AppNotification.vue'
import browserStorage from '@/browserStorage/browserStorage.js'
import apiMethods from '@/api/api.js';
import { nanoid } from 'nanoid';

const LOCAL_STORAGE_ITEM_NAME = 'localProject';

export default {
  components: {
    AppNotification,
    TextTransformator,
    MarkdownHint,
    ResultImages,
    ProjectActions,
  },

  data() {
    return {
      isProjectSaved: false,
      isProjectPublished: false,
      projectId: null,
      isMarkdownHintHidden: true,
      notification: {
        show: false,
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
          },
        ],
      },
      currentSlotNumber: 0,
    }
  },

  computed: {
    isProjectFilled() {
      return !!(this.post.fullText ||
        this.post.slots.some(slot => slot.text));
    },
  },

  created() {
    this.initProjectState();
  },

  methods: {
    showNotification(type, text) {
      this.notification = {
        show: true,
        type: type,
        text: text,
      };
    },

    setInitialPost() {
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

      this.currentSlotNumber = 0;
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
        LOCAL_STORAGE_ITEM_NAME, 
        this.post
      );
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

    async setProjectId(id) {
      this.projectId = '/' + await id;
    },

    togglePublishedTextStatus() {
      this.isProjectSaved = !this.isProjectSaved;
    },

    togglePublishStatus() {
      this.isProjectPublished = !this.isProjectPublished;
    },

    fetchProject(projectId) {
      return apiMethods.get(projectId)
        .then(serverResponse => {
          this.isProjectPublished = true;
          this.isProjectSaved = true;
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

        this.showNotification('info', 
          `Project is saved locally for this browser. <br>
          To have access from everywhere, publish your project.`)
      };

      const project = serverStore || localStore;

      if (project) {
        this.post = project;
      }
    },
  },
};
</script>

<template>
  <AppNotification
    :notification="notification"
    @close-notification="notification.show = false"
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
        :post="post"
        :projectId="projectId"
        :is-project-filled="isProjectFilled"
        :is-project-published="isProjectPublished"
        :is-project-saved="isProjectSaved"
        @set-project-id="setProjectId"
        @toggle-published-text-status="togglePublishedTextStatus"
        @toggle-publish-status="togglePublishStatus"
        @set-initial-post="setInitialPost"
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
