<script>
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import AppPreloader from '@/components/simpleComponents/AppPreloader.vue'
import AppNotification from '@/components/simpleComponents/AppNotification.vue'
import AppConfirmation from '@/components/simpleComponents/AppConfirmation.vue'
import { useConfirmation, modalOn, modalOff } from '@/processes/confirmation.js';
import { browserStorage } from '@/browserStorage/browserStorage.js'
import { projectApi } from '@/api/projectApi.js';
import { nanoid } from 'nanoid';

export default {
  LOCAL_STORAGE_ITEM_NAME: 'localProject',

  components: {
    AppPreloader,
    AppNotification,
    AppConfirmation,
    TextTransformator,
    MarkdownHint,
    ResultImages,
    ProjectActions,
  },

  setup() {
    return  {
      confirmation: useConfirmation(),
      modalOn,
      modalOff,
    };
  },

  data() {
    return {
      isRequestOngoing: false,
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
      currentSlotIndex: 0,
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
      let localProject = null;
      let serverProject = null;

      this.projectId = window.location.pathname;

      if (this.projectId.length > 1) {
        serverProject = await this.fetchProject(this.projectId);
      } 

      if (!serverProject) {
        this.projectId = null;
        localProject = browserStorage.fetch(this.$options.LOCAL_STORAGE_ITEM_NAME);
      };

      if (localProject) {
        this.showNotification({
          type: 'info',
          text: `Project is saved locally for this browser. <br>
            To have access from everywhere, publish your project.`,
        });
      };

      const project = serverProject || localProject;

      if (project) {
        this.post = project;
      };
      this.isProjectLoaded = true;
    },

    fetchProject(projectId) {
      this.isRequestOngoing = true;

      return projectApi.get(projectId)
        .then(serverResponse => {
          this.isProjectPublished = true;
          this.isProjectSaved = true;
          this.showNotification({
            type: 'info',
            text: 'Successfuly loaded project from server',
          });

          return serverResponse;
        })
        .catch(error => {
          window.history.replaceState({}, '', window.location.origin);
          this.showNotification({
            type: 'warning',
            text: error,
          });

          return null;
        })
        .finally(() => {
          this.isRequestOngoing = false;
        });
    },

    showNotification({ type, text }) {
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
        this.post.slots[this.currentSlotIndex].text = textValue;
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

    changeCurrentSlotIndex(index) {
      this.currentSlotIndex = index;
    },

    changeSlotImage({ imgSrc, slotId }) {
      this.images[slotId] = imgSrc;
    },

    removeSlot(id) {
      const deletedSlotIndex = this.post.slots.findIndex(slot => slot.id === id);

      if (this.currentSlotIndex === deletedSlotIndex) {
        this.currentSlotIndex = 0;
      } else if (this.currentSlotIndex > deletedSlotIndex) {
        this.currentSlotIndex--;
      };

      this.post.slots.splice(deletedSlotIndex, 1);
    },

    setProjectId(id) {
      this.projectId = '/' + id;
    },

    setRequestStatus(status) {
      this.isRequestOngoing = status;
    },

    setSaveStatus(status) {
      this.isProjectSaved = status;
    },

    setPublishStatus(status) {
      this.isProjectPublished = status;
    },

    resetProject() {
      this.setInitialPost(),
      this.currentSlotIndex = 0;
      this.images = [];
      this.showNotification({
        type: 'info',
        text: 'Your project was reset',
      });
    },
  },
};
</script>

<template>
  <AppPreloader :is-active="isRequestOngoing" />
  <AppNotification
    :notification="notification"
    @close-notification="closeNotification"
  />
  <AppConfirmation
    :is-active="confirmation.isModalOn"
    @close-confirmation="modalOff"
  />
  <div class="app">
    <h1 class="logo"
    @click="modalOn"
    >tetoi</h1>
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
        :is-disabled="isRequestOngoing"
        :is-project-loaded="isProjectLoaded"
        :is-project-filled="isProjectFilled"
        :is-markdown-hint-hidden="isMarkdownHintHidden"
        :current-slot-index="currentSlotIndex"
        :post="post"
        @toggle-markdown-hint="toggleMarkdownHint"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
      />
      <MarkdownHint v-show="!isMarkdownHintHidden"/>
      <ResultImages
        :current-slot-index="currentSlotIndex"
        :images="images"
        :slots="post.slots"
        @change-current-slot-index="changeCurrentSlotIndex"
        @remove-slot="removeSlot"
      />
      <ProjectActions
        :post="post"
        :projectId="projectId"
        :is-request-ongoing="isRequestOngoing"
        :is-project-filled="isProjectFilled"
        :is-project-published="isProjectPublished"
        :is-project-saved="isProjectSaved"
        @set-project-id="setProjectId"
        @set-request-status="setRequestStatus"
        @set-save-status="setSaveStatus"
        @set-publish-status="setPublishStatus"
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
    font: bold 76px 'Chakra Petch', sans-serif;
    background-image: linear-gradient(colors.$main-active, colors.$secondary);
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent; 
    -moz-text-fill-color: transparent;
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
    box-shadow: 10px 10px colors.$secondary;
    border: 2px solid colors.$secondary;
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
      color: colors.$main-active;
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
