<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';

export default {
  components: {
    AppButton,
  },

  props: {
    value: Number,
    min: Number,
    max: Number,
    step: Number,
    rangeName: String,
    modelValue: Number,
  },

  emits: [
    'update:rangeValue',
    'reset-value',
  ],
}
</script>

<template>
<div class="app-range">
  <div>
    <div class="range-info">
      <span 
        class="range-name"
        v-if="rangeName"
      >
        {{ rangeName }}
      </span>
      <span class="range-value">
        {{ modelValue }}
      </span>
    </div>
    <div class="range-controls">
      <input 
        class="type-range"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:modelValue', +$event.target.value)"
      />
      <slot />
    </div>
  </div>
</div>
</template>

<style lang="scss">
@use '@/assets/colors';

.app-range {
  display: flex;
  padding: 10px 0;
  .range-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .type-range {
    -webkit-appearance: none;
    background-color: colors.$secondary;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 18px;
      width: 18px;
      cursor: pointer;
      margin-top: -7px;
      border: 1px solid colors.$secondary;
      border-radius: 50%;
      background-color: colors.$main;
      background-image: url('@/assets/images/overlay-background-pattern.png');
    }
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
    }
  }
}
</style>
