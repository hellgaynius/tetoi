<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { browserStorage } from '@/browserStorage/browserStorage.js'
import { projectApi } from '@/api/api.js';

export default {
  components: {
    AppButton,
  },

  props: {
    isRequestOngoing: Boolean,
    isProjectPublished: Boolean,
    isProjectSaved: Boolean,
    isProjectFilled: Boolean,
    projectId: String,
    post: Object,
  },

  emits: [
    'set-project-id',
    'change-request-status',
    'toggle-save-status', 
    'toggle-publish-status',
    'reset-project', 
    'show-notification',
  ],

  computed: {
    isLocalProjectButtonDisabled() {
      return this.isProjectPublished || !this.isProjectFilled || this.isRequestOngoing;
    },

    isSaveButtonDisabled() {
      return this.isProjectSaved || this.isRequestOngoing;
    },
  },

  methods: {
    publishProject() {
      this.$emit('change-request-status', true);

      projectApi.publish(this.post)
        .then(response => {
          this.$emit('set-project-id', response.id);
          this.$emit('toggle-publish-status', true);
          this.$emit('toggle-save-status', true);
          browserStorage.reset();
          window.history.replaceState({}, '', response.id);
          this.$emit('show-notification', {
              type: 'info',
              text: `Project was published successfully. <br>
            It is now available via the link: <br> <br>
            ${window.location}`,
            });
        })
        .catch(error => {
          this.$emit('show-notification', {
              type: 'warning',
              text: error,
            });
        })
        .finally(() => {
          this.$emit('change-request-status', false);
        });
    },

    updateProject() {
      this.$emit('change-request-status', true);

      projectApi.update(this.post, this.projectId)
        .then(() => {
          this.$emit('toggle-save-status', true);
          this.$emit('show-notification', {
              type: 'info',
              text: `Updates were saved successfully`,
            });
        })
        .catch(error => {
          this.$emit('show-notification', {
              type: 'warning',
              text: error,
            });
        })
        .finally(() => {
          this.$emit('change-request-status', false);
        });
    },

    deleteProject() {
      this.$emit('change-request-status', true);

      projectApi.delete(this.projectId)
        .then(() => {
          window.history.replaceState({}, '', window.location.origin);
          this.resetProject();
          this.$emit('show-notification', {
              type: 'info',
              text: `Project ${this.projectId} deleted`,
            });
          this.$emit('set-project-id', null);
          this.$emit('toggle-save-status', false);
          this.$emit('toggle-publish-status', false);
        })
        .catch(error => {
          this.$emit('show-notification', {
              type: 'warning',
              text: error,
            });
        })
        .finally(() => {
          this.$emit('change-request-status', false);
        });
    },

    resetProject() {
      browserStorage.reset();
      this.$emit('reset-project');
    },
  },
}
</script>

<template>
  <div class="project-actions">
    <div v-show="!isProjectPublished">
      <div class="buttons-wrapper">
        <div class="second-grid-column">
          <AppButton
            class="action-button"
            :disabled="isLocalProjectButtonDisabled"
            button-like
            big
            @click="publishProject"
          >
            publish
          </AppButton>
        </div>
        <div class="third-grid-column">
          <AppButton
            class="action-button"
            :disabled="isLocalProjectButtonDisabled"
            link-like
            @click="resetProject"
          >
            reset project
          </AppButton>
        </div>

      </div>
    </div>
    <div v-show="isProjectPublished">
      <div class="buttons-wrapper">
        <div class="second-grid-column">
          <AppButton
            class="action-button"
            :disabled="isSaveButtonDisabled"
            button-like
            big
            @click="updateProject"
          >
            save
          </AppButton>
        </div>
        <div class="third-grid-column">
          <AppButton
            class="action-button"
            :disabled="isRequestOngoing"
            link-like
            @click="deleteProject"
          >
            delete saved project
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.buttons-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-top: 20px;
  align-items: baseline;
  .action-button {
    width: 100%;
  }
  .second-grid-column {
    grid-column-start: 2;
  }
  .third-grid-column {
    grid-column-start: 3;
  }
}

@media #{breakpoints.$s-media} {
  .third-grid-column {
    text-align: center;
  }
}
</style>
