<script>
export default {
  data() {
    return {
      isAddSlotHidden: false,
      isRemoveIconHidden: true,
      hoveredSlot: null,
    }
  },

  props: ['slots', 'currentSlotId', 'currentTextValue'],
  emits: ['change-current-slot-id', 'remove-slot'],

  computed: {
    slotsQuantity() {
      return this.slots.length
    },
  },

  watch: {
    slotsQuantity(newValue) {
      this.isAddSlotHidden = newValue >= 10 ? true : false;
    },
  },

  methods: {
    addSlot() {
      this.slots.push(
        {
          text: '', 
          imgSrc: '../slot.png',
        }
      );
    },

    showRemoveIcon(index) {
      if (this.slotsQuantity > 1) {
        this.isRemoveIconHidden = false; 
        this.hoveredSlot = index;
      }
    },

    chooseSlot(index) {
      this.$emit('change-current-slot-id', index);
    }
  },
}
</script>

<template>
 <div class="result-images">
    <div class="result-images__save-image-hint">
      To save full-sized picture to your phone gallery, 
      long-press on the miniature and choose the option from menu.
    </div>
    <div class="result-images__carousel js-carousel">
      <div 
        class="result-images__slot"
        v-for="(slot, index) in slots"
        :key="index"
        :class="{ current: currentSlotId === index }"
        @click="chooseSlot(index)"
        @mouseenter="showRemoveIcon(index)"
        @mouseleave="isRemoveIconHidden = true"
        > 
        <div 
          class="result-images__remove-slot"
          v-show="hoveredSlot === index && !isRemoveIconHidden"
          @click="$emit('remove-slot', index)"
        ></div>
        <img 
          :src="slot.imgSrc"
          class="cloned-preview" 
        />
      </div>
      <div 
        v-show="!isAddSlotHidden"
        class="result-images__add-slot"
        title="add one more page"
      >
        <button 
          @click="addSlot"
          class="result-images__add-slot-button"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';

.result-images {
  &__save-image-hint {
    display: none;
    margin: 0 30px;
    padding: 20px 30px;
    border-radius: 7px;
    box-shadow: 3px 3px 0 colors.$secondary;
    border: 2px solid colors.$secondary;
    color: colors.$secondary-darker;
  }
  &__carousel {
    display: flex;
    justify-content: right;
    gap: 11px;
    width: 100%;
    padding: 30px 0;
  }  
  &__slot {
    position: relative;
    width: 60px;
    aspect-ratio: var(--preview-aspect-ratio);
    cursor: pointer;
    @include solid-border;
    &.current {
      @include light-shadow;
    }
  }
  &__remove-slot {
    position: absolute;
    width: 25px;
    height: 25px;
    margin-left: 88%;
    border-radius: 50%;
    cursor: pointer;
    &::before,
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 14px;
      background-color: colors.$warning;
      border-bottom: 3px solid colors.$warning;
    }
    &::before {
      transform: rotate(-45deg); 
    }
    &::after {
      transform: rotate(45deg); 
    }
  }
  &__add-slot {
    width: 60px;
    aspect-ratio: var(--preview-aspect-ratio);
  }
  &__add-slot-button{
    display: block;
    width: 60px;
    aspect-ratio: 1;
    margin: 0 auto;
    cursor: pointer;
    border-radius: 50%;
    background-color: transparent;
    &::before,
    &::after {
      display: block;
      content: '';
      margin: 0 auto;
      width: 30px;
      border-bottom: 2px solid colors.$secondary;
    }
      &::before {
        transform: rotate(-90deg) translateX(-2px) translateY(1px);
      }

  }
  .cloned-preview {
    display: block;
    width: 50px;
    aspect-ratio: var(--preview-aspect-ratio);
    margin: 0 auto;
  }
}

@media #{breakpoints.$m-media} {
  .result-images {
    &__carousel {
      flex-wrap: wrap;
      justify-content: center;
    }
  }  
}

@media #{breakpoints.$s-media} {
  .result-images {
    order: -1;
    &__save-image-hint {
      display: block;
    }
  }
}
</style>
