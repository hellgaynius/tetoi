<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { ask } from '@/processes/confirmation';
import { browserStorage } from '@/browserStorage/browserStorage.js'
import { projectApi } from '@/api/projectApi.js';

export default {
  components: {
    AppButton,
  },

  props: {
    isServerRequestOngoing: Boolean,
    isProjectPublished: Boolean,
    isProjectSaved: Boolean,
    isProjectFilled: Boolean,
    projectId: String,
    post: Object,
  },

  emits: [
    'set-project-id',
    'set-server-request-status',
    'set-save-status', 
    'set-publish-status',
    'reset-project', 
    'show-notification',
  ],

  computed: {
    isLocalProjectButtonDisabled() {
      return this.isProjectPublished || !this.isProjectFilled || this.isServerRequestOngoing;
    },

    isSaveButtonDisabled() {
      return this.isProjectSaved || this.isServerRequestOngoing;
    },
  },

  methods: {
    publishProject() {
      this.$emit('set-server-request-status', true);

      projectApi.publish(this.post)
        .then(response => {
          this.$emit('set-project-id', response.id);
          this.$emit('set-publish-status', true);
          this.$emit('set-save-status', true);
          browserStorage.remove(this.$options.LOCAL_PROJECT_ITEM_NAME);
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
          this.$emit('set-server-request-status', false);
        });
    },

    updateProject() {
      this.$emit('set-server-request-status', true);

      projectApi.update(this.post, this.projectId)
        .then(() => {
          this.$emit('set-save-status', true);
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
          this.$emit('set-server-request-status', false);
        });
    },

    async deleteProject() {
      if (await ask()) {
        this.$emit('set-server-request-status', true);

        projectApi.delete(this.projectId)
          .then(() => {
            window.history.replaceState({}, '', window.location.origin);
            browserStorage.remove(this.$options.LOCAL_PROJECT_ITEM_NAME);
            this.$emit('reset-project');
            this.$emit('show-notification', {
                type: 'info',
                text: `Project ${this.projectId} deleted`,
              });
            this.$emit('set-project-id', null);
            this.$emit('set-save-status', false);
            this.$emit('set-publish-status', false);
          })
          .catch(error => {
            this.$emit('show-notification', {
                type: 'warning',
                text: error,
              });
          })
          .finally(() => {
            this.$emit('set-server-request-status', false);
          });  
      };
    },

    async resetProject() {
      if (await ask()) {
        browserStorage.remove(this.$options.LOCAL_PROJECT_ITEM_NAME);
        this.$emit('reset-project');
      };
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
            class="stretch-button"
            :disabled="isLocalProjectButtonDisabled"
            button-like
            big
            @click="publishProject"
          >
            publish
          </AppButton>
        </div>
        <div class="third-grid-column single-button-wrapper">
          <AppButton
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
            class="stretch-button"
            :disabled="isSaveButtonDisabled"
            button-like
            big
            @click="updateProject"
          >
            save
          </AppButton>
        </div>
        <div class="third-grid-column single-button-wrapper">
          <AppButton
            :disabled="isServerRequestOngoing"
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

.buttons-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding-top: 20px;
  align-items: baseline;
  .stretch-button {
    width: 100%;
  }
  .second-grid-column {
    grid-column-start: 2;
  }
  .third-grid-column {
    grid-column-start: 3;
  }
  .single-button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}

@media #{breakpoints.$s-media} {
  .project-actions {
    .buttons-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      justify-items: center;
      align-items: end;
    }
    .second-grid-column {
      grid-column-start: 1;
    }
    .third-grid-column {
      grid-column-start: 1;
    }
    .stretch-button {
      width: var(--preview-width);
    }
  }
}
</style>
