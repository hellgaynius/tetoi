<script>
import { testProjects } from '@/data/testProjects.js';
import AppButton from '@/components/simpleComponents/AppButton.vue';

export default {
  components: {
    AppButton,
  },

  emits: [
    'set-test-project',
  ],

  data() {
    return {
      testProjects: testProjects,
    }
  },

  methods: {
    setTestProject(project) {
      this.$emit('set-test-project', project);
    }
  }
}
</script>

<template>
<div class="test-projects">
  <AppButton
    link-like
    big
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
  gap: 30px;
}
</style>
