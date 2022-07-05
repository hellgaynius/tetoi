<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { ask, modalOff } from '@/processes/confirmation';
import { browserStorage } from '@/browserStorage/browserStorage.js'
import { projectApi } from '@/api/projectApi.js';

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
    'set-request-status',
    'set-save-status', 
    'set-publish-status',
    'reset-project', 
    'show-notification',
    'show-confirmation',
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
      this.$emit('set-request-status', true);

      projectApi.publish(this.post)
        .then(response => {
          this.$emit('set-project-id', response.id);
          this.$emit('set-publish-status', true);
          this.$emit('set-save-status', true);
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
          this.$emit('set-request-status', false);
        });
    },

    updateProject() {
      this.$emit('set-request-status', true);

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
          this.$emit('set-request-status', false);
        });
    },

    async deleteProject() {
      if (await ask()) {
        modalOff();
        this.$emit('set-request-status', true);

        projectApi.delete(this.projectId)
          .then(() => {
            window.history.replaceState({}, '', window.location.origin);
            browserStorage.reset();
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
            this.$emit('set-request-status', false);
          });  
      } else {
        modalOff();
      };
    },

    async resetProject() {
      if (await ask()) {
        modalOff();
        browserStorage.reset();
        this.$emit('reset-project');
      } else {
        modalOff();
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
            class="action-button third-grid-column"
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
    text-align: center !important;
  }
}
</style>
