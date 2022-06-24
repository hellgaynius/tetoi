<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import browserStorage from '@/browserStorage/browserStorage.js'
import apiMethods from '@/api/api.js';

export default {
  components: {
    AppButton,
  },

  props: {
    isProjectPublished: Boolean,
    isProjectSaved: Boolean,
    isProjectFilled: Boolean,
    projectId: String,
    post: Object,
  },

  emits: [
    'set-project-id',
    'toggle-published-text-status', 
    'toggle-publish-status',
    'reset-project', 
    'show-notification'
  ],

  data() {
    return {
      isPublishButtonDisabled: !this.isProjectFilled,
      isResetButtonDisabled: !this.isProjectFilled,
      isSaveButtonDisabled: this.isProjectSaved,
      isDeleteButtonDisabled: !this.isProjectPublished,
    }
  },

  watch: {
    isProjectFilled(newValue) {
      this.isPublishButtonDisabled = !newValue;
      this.isResetButtonDisabled = !newValue;
    },

    isProjectSaved(newValue) {
      this.isSaveButtonDisabled = newValue;
    },

    isProjectPublished(newValue) {
      this.isDeleteButtonDisabled = !newValue;
    },
  },

  methods: {
    publishProject() {
      this.isPublishButtonDisabled = true;
      this.isResetButtonDisabled = true;

      apiMethods.publish(this.post)
        .then(response => {
          this.$emit('set-project-id', response.id);
          this.$emit('toggle-publish-status');
          this.$emit('toggle-published-text-status');
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
          this.isPublishButtonDisabled = false;
          this.isResetButtonDisabled = false;
          this.$emit('show-notification', 'warning', error);
        });
    },

    updateProject() {
      this.isSaveButtonDisabled = true;
      this.isDeleteButtonDisabled = true;

      apiMethods.update(this.post, this.projectId)
        .then(() => {
          this.$emit('toggle-published-text-status');
          this.isDeleteButtonDisabled = false; 
          this.$emit('show-notification', 'info', `Updates were saved successfully`);
        })
        .catch(error => {
          this.isSaveButtonDisabled = false;
          this.isDeleteButtonDisabled = false;
          this.$emit('show-notification', 'warning', error);
        });
    },

    deleteProject() {
      this.isSaveButtonDisabled = true,
      this.isDeleteButtonDisabled = true;

      apiMethods.delete(this.projectId)
        .then(() => {
          window.history.replaceState({}, '', window.location.origin);
          this.resetProject();
          this.$emit('show-notification', 'info', `Project ${this.projectId} deleted`);
          this.$emit('set-project-id', null);
          this.$emit('toggle-published-text-status');
          this.$emit('toggle-publish-status');
        })
        .catch(error => {
          this.isDeleteButtonDisabled = false;
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
            :disabled="isPublishButtonDisabled"
            buttonLike
            big
            @click="publishProject"
          >
            publish
          </AppButton>
        </div>
        <div class="third-grid-column">
          <AppButton
            class="action-button"
            :disabled="isResetButtonDisabled"
            linkLike
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
            buttonLike
            big
            @click="updateProject"
          >
            save
          </AppButton>
        </div>
        <div class="third-grid-column">
          <AppButton
            class="action-button"
            :disabled="isDeleteButtonDisabled"
            linkLike
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
