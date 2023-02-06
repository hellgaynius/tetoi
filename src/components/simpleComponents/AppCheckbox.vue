<script>
export default {
  props: {
    label: String,
    title: {
      type: String,
      default: '',
    },
    value: [Number, Boolean],
    modelValue: {
      default: false,
    },
    trueValue: {
      default: true,
    },
    falseValue: {
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value);
      }

      return this.modelValue === this.trueValue;
    },
  },
  methods: {
    change(isChecked) {
      console.log(isChecked);
      if (this.modelValue instanceof Array) {
        const newValue = [...this.modelValue];

        if (isChecked) {
          newValue.push(this.value);
        } else {
          newValue.splice(newValue.indexOf(this.value), 1);
        }

        this.$emit('update:modelValue', newValue);
      } else {
        this.$emit('update:modelValue', isChecked ? this.trueValue : this.falseValue);
      }
    },
  },
};
</script>

<template>
  <label
    class="app-checkbox"
    :class="[disabled]"
  >
    <input
      class="input"
      type="checkbox"
      :value="value"
      :disabled="disabled"
      :checked="isChecked"
      @change="change($event.target.checked)"
    >
    <div
      class="label"
      :class="{
        disabled: disabled,
        checked: isChecked,
      }"
      :title="title"
    >
      {{ label }}
    </div>
  </label>
</template>

<style lang="scss">
@use '@/assets/style/colors';

.app-checkbox {
  display: block;
  width: fit-content;
  overflow-wrap: anywhere;
  cursor: pointer;

  &.disabled {
    pointer-events: none;
  }

  &:last-of-type {
    margin-right: 0;
  }

  .input {
    display: none;
  }

  .label {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    margin-left: 30px;
    background-color: transparent;

    &.disabled {
      color: colors.$light;

      &::before,
      &::after {
        border-color: colors.$light;
      }
    }

    &.checked {
      &::after {
        opacity: 1;
      }
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
    }

    &::before {
      top: 50%;
      left: -30px;
      width: 18px;
      height: 18px;
      border: 2px solid colors.$dark;
      border-radius: 2px;
      transform: translateY(-50%);
    }

    &::after {
      top: 50%;
      left: -25px;
      width: 10px;
      height: 7px;
      border-left: 2px solid colors.$dark;
      border-bottom: 2px solid colors.$dark;
      opacity: 0;
      transform-origin: center center;
      transform: translateY(-50%) translate(-1px, -1px) rotate(-45deg);
      transition: opacity 0.2s;
    }
  }
}
</style>
