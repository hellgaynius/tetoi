<script>
import VButton from '@/components/base/VButton.vue';
import { nanoid } from 'nanoid';

export default {
  components: {
    VButton,
  },

  props: {
    slots: Object,
    currentSlotNumber: Number,
    currentTextValue: String,
  },

  emits: [
    'change-current-slot-id', 
    'remove-slot',
  ],

  computed: {
    slotsQuantity() {
      return this.slots.length;
    },
  },

  methods: {
    addSlot() {
      this.slots.push(
        {
          text: '', 
          imgSrc: '',
          id: nanoid(),
        }
      );
    },

    chooseSlot(index) {
      this.$emit('change-current-slot-id', index);
    }
  },
}
</script>

<template>
 <div class="result-images">
    <div class="save-image-hint">
      To save full-sized picture to your phone gallery, 
      long-press on the miniature and choose the option from menu.
    </div>
    <div class="carousel">
      <div 
        class="slot-wrapper"
        v-for="(slot, index) in slots"
      >
        <div 
          class="slot"
          :key="slot.id"
          :class="[
            { current: currentSlotNumber === index }, 
            { filled: slot.text }
          ]"
          @click="chooseSlot(index)"

          > 
          <img 
            v-if="slot.imgSrc"
            :src="slot.imgSrc"
            class="cloned-preview" 
          />
        </div>
        <div class="button-wrapper">
          <VButton 
            class="remove-slot"
            type="link-like"
            v-show="slotsQuantity > 1"
            @click="$emit('remove-slot', slot.id)"
          >
            delete
          </VButton>
        </div>
      </div>
      <div 
        v-show="slotsQuantity < 10"
        class="add-slot"
        title="add one more page"
      >
        <button 
          @click="addSlot"
          class="add-slot-button"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';

.result-images {
  .save-image-hint {
    display: none;
    margin: 0 30px;
    padding: 20px 30px;
    border-radius: 7px;
    box-shadow: 3px 3px 0 colors.$secondary;
    border: 2px solid colors.$secondary;
    color: colors.$secondary-darker;
  }
  .carousel {
    display: flex;
    justify-content: right;
    gap: 11px;
    width: 100%;
    padding: 30px 0;
  }  
  .slot-wrapper {
    &:hover .remove-slot {
      display: block;
    }
  }
  .slot {
    width: 60px;
    aspect-ratio: var(--preview-aspect-ratio);
    cursor: pointer;
    @include solid-border;
    &.current {
      @include light-shadow;
    }
    &.filled {
      border: 1px solid colors.$secondary-darker;
    }
  }
  .button-wrapper {
    height: 20px;
  }
  .remove-slot {
    display: none;
    min-width: 0;
    margin: 0 auto;
    padding: 5px;
    font-size: 10px;
    color: colors.$secondary;
    text-decoration: none;
    transition: color 0.5s, text-decoration 0.5s;
    cursor: pointer;
    &:hover {
      color: colors.$secondary-darker;
      text-decoration: underline;
    }
  }
  .add-slot {
    width: 60px;
    aspect-ratio: var(--preview-aspect-ratio);
  }
  .add-slot-button{
    display: block;
    width: 60px;
    aspect-ratio: 1;
    margin: 0 auto;
    cursor: pointer;
    background-color: transparent;
    &::before,
    &::after {
      display: block;
      content: '';
      margin: 0 auto;
      width: 30px;
      border-bottom: 2px solid colors.$secondary;
      transition: border-bottom 0.5s;
    }
    &::before {
      transform: rotate(-90deg) translateX(-2px) translateY(1px);
    }
    &:hover {
      &::before,
      &::after {
        border-bottom: 2px solid colors.$secondary-darker;
      }
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
    .carousel {
      flex-wrap: wrap;
      justify-content: center;
    }
    .add-slot {
      order: -1;
    }
  }  
}

@media #{breakpoints.$s-media} {
  .result-images {
    order: -1;
    .save-image-hint {
      display: block;
    }
  }
}
</style>
