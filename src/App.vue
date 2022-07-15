<script>
import PreviewSettings from '@/components/PreviewSettings.vue';
import TextTransformator from '@/components/TextTransformator.vue';
import ResultImages from '@/components/ResultImages.vue';
import ProjectActions from '@/components/ProjectActions.vue';
import MarkdownHint from '@/components/MarkdownHint.vue';
import AppButton from '@/components/simpleComponents/AppButton.vue';
import AppPreloader from '@/components/helperComponents/AppPreloader.vue';
import AppNotification from '@/components/helperComponents/AppNotification.vue';
import AppConfirmation from '@/components/helperComponents/AppConfirmation.vue';
import { browserStorage } from '@/browserStorage/browserStorage.js';
import { projectApi } from '@/api/projectApi.js';
import { nanoid } from 'nanoid';

export default {
  LOCAL_PROJECT_ITEM_NAME: 'localProject',

  components: {
    AppButton,
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
      projectId: null,
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
      statuses: {
        isServerRequestOngoing: false,
        isProjectSaved: false,
        isProjectPublished: false,
        isRerenderNeeded: false,
        isCreateBulkImagesRequested: false,
        isRenderOngoing: false,
      },
      switchers: {
        isMarkdownHintHidden: true,
        areSettingsHidden: true,
      },
    }
  },

  computed: {
    isProjectFilled() {
      return !!(this.post?.fullText ||
        this.post?.slots.some(slot => slot.text));
    },
  },

  watch: {
    post: {
      handler() {
        browserStorage.handlePostObject(
          this.isProjectFilled, 
          this.statuses.isProjectPublished, 
          this.$options.LOCAL_PROJECT_ITEM_NAME, 
          this.post,
        );

        if (!this.isProjectFilled) {
          this.statuses.isRerenderNeeded = false;
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

      this.statuses.isCreateBulkImagesRequested = true;
    },

    fetchProject(projectId) {
      this.statuses.isServerRequestOngoing = true;

      return projectApi.get(projectId)
        .then(serverResponse => {
          this.statuses.isProjectPublished = true;
          this.statuses.isProjectSaved = true;
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
          this.statuses.isServerRequestOngoing = false;
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

      if (this.statuses.isProjectPublished) {
        this.statuses.isProjectSaved = false;
      }
    },

    toggleSwitcher(switcher) {
      this.switchers[switcher] = !this.switchers[switcher];
    },

    toggleSettings() {
      this.switchers.areSettingsHidden = !this.switchers.areSettingsHidden;
    },

    toggleMarkdownHint() {
      this.switchers.isMarkdownHintHidden = !this.switchers.isMarkdownHintHidden;
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

    setStatus(entity, status) {
      this.statuses[entity] = status;
    }, 

    setSettings(settings) {
      this.previewSettings = settings;

      if (this.isProjectFilled) {
        this.previewSettingsChangeCounter++;
      } else {
        this.previewSettingsChangeCounter = 0;
      };

      if (this.previewSettingsChangeCounter) {
        this.statuses.isRerenderNeeded = true;
      };
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
  <AppPreloader :is-active="statuses.isServerRequestOngoing || statuses.isRenderOngoing" />
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
        v-show="statuses.isRenderOngoing"
      >
      </div>
      <PreviewSettings
        v-show="!switchers.areSettingsHidden"
        @change="setSettings"
      />
      <div class="single-button-wrapper">
        <AppButton 
          link-like
          settings
          @click="toggleSettings"
        >
          <span v-if="switchers.areSettingsHidden">show </span>
          <span v-else>hide </span>
          text settings
        </AppButton>
      </div>
      <TextTransformator
        :is-disabled="statuses.isServerRequestOngoing"
        :is-project-filled="isProjectFilled"
        :current-slot-index="currentSlotIndex"
        :post="post"
        :preview-settings="previewSettings"
        :is-create-bulk-images-requested="statuses.isCreateBulkImagesRequested"
        :is-render-ongoing="statuses.isRenderOngoing"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
        @set-rendering-status="setStatus"
        @set-rerendering-need="setStatus"
        @set-create-bulk-images-request-status="setStatus"
      />
      <div class="items-grid-wrapper">
        <div class="single-button-wrapper markdown">
          <AppButton 
            link-like
            markdown
            @click="toggleMarkdownHint"
          >
            <span v-if="switchers.isMarkdownHintHidden">show </span>
            <span v-else>hide </span>
            markdown hint
          </AppButton>
        </div>
        <div
          v-show="statuses.isProjectPublished"
          class="project-status"
        >
          <span 
            v-if="statuses.isProjectSaved"
            class="status-text saved"
          >saved</span>
          <span 
            v-else
            class="status-text unsaved"
          >unsaved</span>
        </div>
      </div>
      <MarkdownHint v-show="!switchers.isMarkdownHintHidden"/>
      <ResultImages
        :current-slot-index="currentSlotIndex"
        :images="images"
        :slots="post.slots"
        :is-rerender-needed="statuses.isRerenderNeeded"
        :is-project-filled="isProjectFilled"
        @set-create-bulk-images-request-status="setStatus"
        @change-current-slot-index="changeCurrentSlotIndex"
        @remove-slot="removeSlot"
      />
      <ProjectActions
        :post="post"
        :projectId="projectId"
        :is-request-ongoing="statuses.isServerRequestOngoing"
        :is-project-filled="isProjectFilled"
        :is-project-published="statuses.isProjectPublished"
        :is-project-saved="statuses.isProjectSaved"
        @set-project-id="setProjectId"
        @set-server-request-status="setStatus"
        @set-save-status="setStatus"
        @set-publish-status="setStatus"
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
  .items-grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 10px;
  }
  .single-button-wrapper {
    display: flex;
    justify-content: flex-end;
    &.markdown {
      justify-content: flex-start;
    }
  }
  .project-status {
    text-align: center;
    padding-bottom: 20px;
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
