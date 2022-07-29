<script>
import { testProjects } from '@/data/testProjects.js';
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { ask } from '@/processes/confirmation';

export default {
  components: {
    AppButton,
  },

  props: {
    previewSettings: Object,
    isProjectFilled: Boolean,
    isProjectPublished: Boolean,
  },

  emits: [
    'set-test-project',
    'set-project-id',
    'set-save-status',
    'set-publish-status',
    'show-notification',
  ],

  data() {
    return {
      testProjects: testProjects,
    }
  },

  methods: {
    setTestProject(project) {
      if (this.isProjectFilled && !this.isProjectPublished) {
        ask({
          question: `test project will override your current one. 
            are you sure you want to load it?`,
          height: 300,
          fontSize: 28,
        })
          .then(() => this.$emit('set-test-project', project))
      } else if (this.isProjectPublished) {
        this.$emit('show-notification', {
          type: 'info',
          text: `Your previous project is still available via the link
          ${window.location}`,
        });
        window.history.replaceState({}, '', window.location.origin);
        this.$emit('set-test-project', project);
        this.$emit('set-project-id', null);
        this.$emit('set-save-status', false);
        this.$emit('set-publish-status', false);
      } else {
        this.$emit('set-test-project', project);
      }

    }
  }
}

</script>

<template>
<div class="test-projects">
  <AppButton
    link-like
    v-for="project in testProjects"
    @click="setTestProject(testProjects[project.name])"
  >
    {{ project.title }}
  </AppButton>
</div>
</template>

<style lang="scss">
.test-projects {
  display: flex;
  justify-content: flex-end;
  gap: 40px;
}
</style>
