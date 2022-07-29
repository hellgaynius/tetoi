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
import TestProjects from '@/components/TestProjects.vue';
import { browserStorage } from '@/browserStorage/browserStorage.js';
import { projectApi } from '@/api/projectApi.js';
import { nanoid } from 'nanoid';

export default {
  SLOTS_MAX_QUANTITY: 10,

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
    TestProjects,
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
      statuses: {
        isServerRequestOngoing: false,
        isProjectSaved: false,
        isProjectPublished: false,
        isRenderNeeded: false,
        isCreateBulkImagesRequested: false,
        isRenderOngoing: false,
        areInitialPreviewSettingsPassed: false,
      },
      switchers: {
        isMarkdownHintHidden: true,
        areSettingsHidden: true,
        areTestProjectsHidden: true,
      },
    }
  },

  computed: {
    isProjectFilled() {
      return !!(this.post?.fullText ||
        this.post?.slots.some(slot => slot.text));
    },

    project() {
      return {
        post: this.post,
        settings: this.previewSettings,
      }
    }
  },

  watch: {
    post: {
      handler() {
        browserStorage.saveItem(
          'project',
          this.post,
          this.statuses.isProjectPublished, 
          this.isProjectFilled, 
        );

        if (!this.isProjectFilled) {
          this.statuses.isRenderNeeded = false;
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
      };

      if (serverProject) {
        this.post = serverProject.post;
        this.previewSettings = serverProject.settings;
      } else {
        this.projectId = null;
        localProject = browserStorage.fetch('project');
      };

      if (localProject) {
        this.post = localProject;
        this.showNotification({
          type: 'info',
          text: `Project is saved locally for this browser. <br>
            To have access from everywhere, publish your project.`,
        });
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
      };

      if (this.statuses.isProjectPublished) {
        this.statuses.isProjectSaved = false;
      };
    },

    toggleSwitcher(switcher) {
      this.switchers[switcher] = !this.switchers[switcher];
    },

    changeCurrentSlotIndex(index) {
      this.currentSlotIndex = index;
    },

    changeSlotImage({ imgSrc, slotId }) {
      this.images[slotId] = imgSrc;
    },

    async removeSlot(id) {
      const deletedSlotIndex = this.post.slots.findIndex(slot => slot.id === id);

      if (this.currentSlotIndex === deletedSlotIndex) {
        this.currentSlotIndex = 0;
      } else if (this.currentSlotIndex > deletedSlotIndex) {
        this.currentSlotIndex--;
      };
      // nextTick here is due to confusing order of Vue handling interaction between components
      await this.$nextTick();
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
        this.areInitialPreviewSettingsPassed = true;
      };

      if (this.areInitialPreviewSettingsPassed) {
        this.statuses.isRenderNeeded = true;
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

    setTestProject(project) {
      this.post = project.post;
      this.previewSettings = project.settings;
      this.currentSlotIndex = 0;
      this.statuses.isCreateBulkImagesRequested = true;
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
        :preview-settings="previewSettings.settings"
        :is-project-published="statuses.isProjectPublished"
        v-show="!switchers.areSettingsHidden"
        @change="setSettings"
      />
      <div class="toggle-button-wrapper">
        <AppButton 
          link-like
          settings
          @click="toggleSwitcher('areSettingsHidden')"
        >
          {{ switchers.areSettingsHidden ? 'show' : 'hide' }} text settings
        </AppButton>
      </div>
      <TextTransformator
        :is-disabled="statuses.isServerRequestOngoing"
        :is-project-filled="isProjectFilled"
        :current-slot-index="currentSlotIndex"
        :post="post"
        :preview-settings="previewSettings"
        :slots-max-quantity="$options.SLOTS_MAX_QUANTITY"
        :is-create-bulk-images-requested="statuses.isCreateBulkImagesRequested"
        :is-render-ongoing="statuses.isRenderOngoing"
        @save-text="saveText"
        @change-slot-image="changeSlotImage"
        @set-rendering-status="setStatus('isRenderOngoing', $event)"
        @set-rendering-need="setStatus('isRenderNeeded', $event)"
        @set-create-bulk-images-request-status="setStatus('isCreateBulkImagesRequested', $event)"
      />
      <div class="items-grid-wrapper">
        <div class="toggle-button-wrapper markdown">
          <AppButton 
            link-like
            markdown
            @click="toggleSwitcher('isMarkdownHintHidden')"
          >
            {{ switchers.isMarkdownHintHidden ? 'show' : 'hide' }} markdown hint
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
        :slots-max-quantity="$options.SLOTS_MAX_QUANTITY"
        :is-render-needed="statuses.isRenderNeeded"
        :is-project-filled="isProjectFilled"
        @set-create-bulk-images-request-status="setStatus('isCreateBulkImagesRequested', $event)"
        @change-current-slot-index="changeCurrentSlotIndex"
        @remove-slot="removeSlot"
      />
      <ProjectActions
        :project="project"
        :projectId="projectId"
        :is-request-ongoing="statuses.isServerRequestOngoing"
        :is-project-filled="isProjectFilled"
        :is-project-published="statuses.isProjectPublished"
        :is-project-saved="statuses.isProjectSaved"
        @set-project-id="setProjectId"
        @set-server-request-status="setStatus('isServerRequestOngoing', $event)"
        @set-save-status="setStatus('isProjectSaved', $event)"
        @set-publish-status="setStatus('isProjectPublished', $event)"
        @reset-project="resetProject"
        @show-notification="showNotification"
      />
      <div class="test-projects-wrapper">
        <div class="toggle-button-wrapper">
          <AppButton 
            link-like
            markdown
            @click="toggleSwitcher('areTestProjectsHidden')"
          >
            {{ switchers.areTestProjectsHidden ? 'show' : 'hide' }} test projects
          </AppButton>
        </div>
        <TestProjects 
          v-show="!switchers.areTestProjectsHidden"
          :preview-settings="previewSettings"
          :is-project-filled="isProjectFilled"
          :is-project-published="statuses.isProjectPublished"
          @set-test-project="setTestProject"
          @set-project-id="setProjectId"
          @set-save-status="setStatus('isProjectSaved', $event)"
          @set-publish-status="setStatus('isProjectPublished', $event)"
          @show-notification="showNotification"
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
@use '@/assets/style/colors';
@use '@/assets/style/breakpoints';
@import '@/assets/style/global';
@import '@/assets/style/preview-container';
@import '@/assets/style/app-transition';
@import '@/assets/style/fonts';

.app {
  display: flex;
  flex-direction: column;
  .logo {
    position: absolute;
    top: 30px;
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
    padding: 50px 50px 30px 50px;
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
  .toggle-button-wrapper {
    display: flex;
    justify-content: flex-end;
    &.markdown {
      justify-content: flex-start;
    }
  }
  .test-projects-wrapper {
    padding-top: 50px;
    height: 150px;
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
    .items-grid-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
    .toggle-button-wrapper {
      width: var(--preview-width);
      margin: 0 auto;
    }
  }
}
</style>
