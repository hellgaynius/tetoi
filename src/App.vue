<script>
import PreviewSettings from '@/components/PreviewSettings.vue';
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import AppPreloader from '@/components/simpleComponents/AppPreloader.vue'
import AppNotification from '@/components/simpleComponents/AppNotification.vue'
import AppConfirmation from '@/components/simpleComponents/AppConfirmation.vue'
import { browserStorage } from '@/browserStorage/browserStorage.js'
import { projectApi } from '@/api/projectApi.js';
import { nanoid } from 'nanoid';

export default {
  LOCAL_PROJECT_ITEM_NAME: 'localProject',

  components: {
    AppPreloader,
    AppNotification,
    AppConfirmation,
    PreviewSettings,
    TextTransformator,
    MarkdownHint,
    ResultImages,
    ProjectActions,
  },

  data() {
    return {
      isRequestOngoing: false,
      isProjectSaved: false,
      isProjectPublished: false,
      isProjectLoaded: false,
      projectId: null,
      isMarkdownHintHidden: true,
      areSettingsHidden: true,
      isRerenderRequired: false,
      isCreateBulkImagesRequested: false,
      isRenderOngoing: false,
      notification: {
        show: false,
        type: 'info',
        text: '',
      },
      post: {},
      images: {},
      currentSlotIndex: 0,
      previewSettings: {},
      previewSettingsChangeCounter: 0,
    }
  },

  computed: {
    isProjectFilled() {
      return !!(this.post?.fullText ||
        this.post?.slots.some(slot => slot.text));
    },
  },

  watch: {
    previewSettings: {
      handler() {
        if (this.isProjectFilled) {
          this.previewSettingsChangeCounter++;
        } else {
          this.previewSettingsChangeCounter = 0;
        } 
      },

      deep: true,
    },

    previewSettingsChangeCounter(value) {
      if (value) {
        this.isRerenderRequired = true;
      } 
    },

    post: {
      handler() {
        browserStorage.handle(
          this.isProjectFilled, 
          this.isProjectPublished, 
          this.$options.LOCAL_PROJECT_ITEM_NAME, 
          this.post,
        );

        if (!this.isProjectFilled) {
          this.previewSettingsChangeCounter = 0;
          this.isRerenderRequired = false;
        }
      },

      deep: true,
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
        localProject = browserStorage.fetch(this.$options.LOCAL_PROJECT_ITEM_NAME);
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
    },

    toggleSettings() {
      this.areSettingsHidden = !this.areSettingsHidden;
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

    setRenderingStatus(status) {
      this.isRenderOngoing = status;
    },

    setRenderingNeed(isNeeded) {
      this.isRerenderRequired = isNeeded;
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

    acceptSettings(settings) {
      this.previewSettings = settings;
    },

    requestCreateBulkImages() {
      this.isCreateBulkImagesRequested = true;
    },
  },
};
</script>

<template>
  <AppPreloader :is-active="isRequestOngoing || isRenderOngoing" />
  <AppNotification
    :notification="notification"
    @close-notification="closeNotification"
  />
  <AppConfirmation />
  <div class="app">
    <h1 class="logo">
      tetoi
    </h1>
    <main class="main">
      <div 
        class="app-preloader-mask"
        v-show="isRenderOngoing"
      >
      </div>
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
      <PreviewSettings
        v-show="!areSettingsHidden"
        @pass-settings="acceptSettings"
      />
      <TextTransformator
        :is-disabled="isRequestOngoing"
        :is-project-loaded="isProjectLoaded"
        :is-project-filled="isProjectFilled"
        :is-markdown-hint-hidden="isMarkdownHintHidden"
        :current-slot-index="currentSlotIndex"
        :post="post"
        :preview-settings="previewSettings"
        :are-settings-hidden="areSettingsHidden"
        :is-create-bulk-images-requested="isCreateBulkImagesRequested"
        :is-render-ongoing="isRenderOngoing"
        @toggle-settings="toggleSettings"
        @toggle-markdown-hint="toggleMarkdownHint"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
        @set-rendering-status="setRenderingStatus"
        @set-rendering-need="setRenderingNeed"
      />
      <MarkdownHint v-show="!isMarkdownHintHidden"/>
      <ResultImages
        :current-slot-index="currentSlotIndex"
        :images="images"
        :slots="post.slots"
        :is-rerender-required="isRerenderRequired"
        :is-project-filled="isProjectFilled"
        @request-create-bulk-images="requestCreateBulkImages"
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
@import '@/assets/global';
@import '@/assets/preview-container';
@import '@/assets/app-transition';

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
  .app-preloader-mask {
    position: absolute;
    z-index: 9;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
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
      margin: 0;
      text-align: center;
    }
  }
}

@media #{breakpoints.$s-media} {
  .app {
    .main {
      width: 100%;
      min-width: 370px;
      padding: 40px 20px 80px 10px;
      box-shadow: none;
      border: none;
    }
    .project-status {
      padding: 20px;
    }
  }
}
</style>
