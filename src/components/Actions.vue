<script>
import Button from './Button.vue';

export default {
  components: {
    Button
  },

  props: ['isProjectFilled'],
  emits: ['reset-project', 'show-notification'],

  data() {
    return {
      isDisabled: true,
      isProjectPublished: false,
    }
  },

  watch: {
    isProjectPublished(val) {
      console.log((val));
    }
  },

  methods: {
    resetProject() {
      this.$emit('reset-project');
    },

    publishProject() {
      this.isProjectPublished = true;
    },

    saveProject() {

    },

    deleteProject() {
      this.resetProject();

      this.isProjectPublished = false;
    }
  },
}
</script>

<template>
  <div class="actions">
    <div 
      v-show="!isProjectPublished"
    >
      <div class="actions__buttons-wrapper">
        <Button
          :disabled="!isProjectFilled"
          :type="'button-like'"
          :size="'big'"
          :action="'publish'"
          @click="publishProject(), $emit('show-notification', 'warning', 'i am notification again')"
        >
          publish
        </Button>
        <Button
          :disabled="!isProjectFilled"
          :type="'link-like'"
          :action="'reset'"
          @click="$emit('reset-project')"
        >
          reset project
        </Button>
      </div>
    </div>
    <div 
      v-show="isProjectPublished"
    >
      <div class="actions__buttons-wrapper">
        <Button
          :disabled="isDisabled"
          :type="'button-like'"
          :size="'big'"
          :action="'save'"
        >
          save
        </Button>
        <Button
          :disabled="isDisabled"
          :type="'link-like'"
          :action="'delete'"
        >
          delete saved project
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';

.actions {
  &__buttons-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding-top: 20px;
  }
}

</style>
