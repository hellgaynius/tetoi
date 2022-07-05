<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { nanoid } from 'nanoid';

export default {
  components: {
    AppButton,
  },

  props: {
    slots: Object,
    images: Object,
    currentSlotIndex: Number,
  },

  emits: [
    'change-current-slot-index', 
    'remove-slot',
  ],

  methods: {
    addSlot() {
      this.slots.push(
        {
          text: '', 
          id: nanoid(),
        }
      );
    },

    chooseSlot(index) {
      this.$emit('change-current-slot-index', index);
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
          :class="{
            current: currentSlotIndex === index, 
            filled: !!slot.text,
          }"
          @click="chooseSlot(index)"
        > 
          <img 
            v-if="images[slot.id]"
            :src="images[slot.id]"
            class="preview" 
          />
        </div>
        <div class="button-wrapper">
          <AppButton 
            class="remove-slot"
            link-like
            v-show="slots.length > 1"
            @click="$emit('remove-slot', slot.id)"
          >
            delete
          </AppButton>
        </div>
      </div>
      <div 
        v-show="slots.length < 10"
        class="add-slot"
        title="add one more page"
      >
        <button 
          @click="addSlot"
          class="add-slot-button"
        ></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';

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
    border: 1px solid colors.$border;
    &.current {
      box-shadow: 4px 4px 0 colors.$el-shadow;
    }
    &.filled {
      border: 1px solid colors.$secondary-darker;
    }
  }
  .button-wrapper {
    height: 40px;
  }
  .remove-slot {
    display: none;
    min-width: 0;
    margin: 0 auto;
    padding: 15px 0px;
    font-size: 10px;
  }
  .add-slot {
    width: 60px;
    aspect-ratio: var(--preview-aspect-ratio);
  }
  .add-slot-button {
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
      transition: border-bottom 0.2s;
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
  .preview {
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
