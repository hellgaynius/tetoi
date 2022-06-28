<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import browserStorage from '@/browserStorage/browserStorage.js'
import apiMethods from '@/api/api.js';

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

  methods: {
    publishProject() {
      this.$emit('change-request-status', true);

      apiMethods.publish(this.post)
        .then(response => {
          this.$emit('change-request-status', false);
          this.$emit('set-project-id', response.id);
          this.$emit('toggle-publish-status');
          this.$emit('toggle-save-status');
          browserStorage.reset();
          window.history.replaceState({}, '', response.id);
          this.$emit(
            'show-notification', 
            'info', 
            `Project was published successfully. <br>
            It is now available via the link: <br> <br>
            ${window.location}`,
          );
        })
        .catch(error => {
          this.$emit('change-request-status', false);
          this.$emit('show-notification', 'warning', error);
        });
    },

    updateProject() {
      this.$emit('change-request-status', true);

      apiMethods.update(this.post, this.projectId)
        .then(() => {
          this.$emit('change-request-status', false);
          this.$emit('toggle-save-status');
          this.$emit('show-notification', 'info', `Updates were saved successfully`);
        })
        .catch(error => {
          this.$emit('change-request-status', false);
          this.$emit('show-notification', 'warning', error);
        });
    },

    deleteProject() {
      this.$emit('change-request-status', true);

      apiMethods.delete(this.projectId)
        .then(() => {
          this.$emit('change-request-status', false);
          window.history.replaceState({}, '', window.location.origin);
          this.resetProject();
          this.$emit('show-notification', 'info', `Project ${this.projectId} deleted`);
          this.$emit('set-project-id', null);
          this.$emit('toggle-save-status');
          this.$emit('toggle-publish-status');
        })
        .catch(error => {
          this.$emit('change-request-status', false);
          this.$emit('show-notification', 'warning', error);
        })
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
            :disabled="isProjectPublished || !isProjectFilled || isRequestOngoing"
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
            :disabled="isProjectPublished || !isProjectFilled || isRequestOngoing"
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
            :disabled="isProjectSaved || isRequestOngoing"
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
