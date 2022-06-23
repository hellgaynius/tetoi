<script>
import VButton from '@/components/base/VButton.vue';

export default {
  components: {
    VButton,
  },

  props: {
    isProjectPublished: Boolean,
    isPublishButtonDisabled: Boolean,
    isResetButtonDisabled: Boolean,
    isSaveButtonDisabled: Boolean,
    isDeleteButtonDisabled: Boolean,
  },

  emits: [
    'publish-project', 
    'reset-project', 
    'update-project', 
    'delete-project', 
  ],
}
</script>

<template>
  <div class="project-actions">
    <div v-show="!isProjectPublished">
      <div class="buttons-wrapper">
        <VButton
          :disabled="isPublishButtonDisabled"
          type="button-like"
          size="big"
          action="publish"
          @click="$emit('publish-project')"
        >
          publish
        </VButton>
        <VButton
          :disabled="isResetButtonDisabled"
          type="link-like"
          action="reset"
          @click="$emit('reset-project')"
        >
          reset project
        </VButton>
      </div>
    </div>
    <div v-show="isProjectPublished">
      <div class="buttons-wrapper">
        <VButton
          :disabled="isSaveButtonDisabled"
          type="button-like"
          size="big"
          action="save"
          @click="$emit('update-project')"
        >
          save
        </VButton>
        <VButton
          :disabled="isDeleteButtonDisabled"
          type="link-like"
          action="delete"
          @click="$emit('delete-project')"
        >
          delete saved project
        </VButton>
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
}
</style>
