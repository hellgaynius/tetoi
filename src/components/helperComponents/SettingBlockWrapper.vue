<script>
export default {
  props: {
    name: String,
    subname: String,
  },
}
</script>

<template>
  <div>
    <h4 
      v-if="name"
      class="name"
    >
      {{ name }}
    </h4>
    <div 
      v-if="subname"
      class="subname"
    >
      {{ subname }}
    </div>
    <slot />
  </div>
</template>

<style>
.name,
.subname {
  padding: 10px 0;
}
</style>
