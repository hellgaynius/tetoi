<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { nanoid } from 'nanoid';

export default {
  components: {
    AppButton,
  },

  props: {
    slots: Array,
    images: Object,
    currentSlotIndex: Number,
    slotsMaxQuantity: Number,
    isRenderNeeded: Boolean,
    isProjectFilled: Boolean,
  },

  emits: [
    'change-current-slot-index', 
    'remove-slot',
    'set-create-bulk-images-request-status',
  ],

  methods: {
    addSlot() {
      this.slots.push(
        {
          text: '', 
          id: nanoid(),
        }
      );

      this.$emit('change-current-slot-index', this.slots.length - 1);
    },

    chooseSlot(index) {
      this.$emit('change-current-slot-index', index);
    },

    removeSlot(id) {
      this.$emit('remove-slot', id);
    },
  },
}
</script>

<template>
 <div class="result-images">
    <div class="optional-notification save-image-hint">
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
            @click="removeSlot(slot.id)"
          >
            delete
          </AppButton>
        </div>
      </div>
      <div 
        v-show="slots.length < slotsMaxQuantity"
        class="add-slot"
        title="add one more page"
      >
        <button 
          @click="addSlot"
          class="add-slot-button"
        ></button>
      </div>
    </div>
    <div 
      class="optional-notification render-offer"
      v-show="isRenderNeeded && isProjectFilled"
    >
      <div>
        As the settings were changed, these miniature images are outdated,
        however you may update them all at once.
      </div>
      <AppButton
        button-like
        @click="$emit('set-create-bulk-images-request-status', true)"
      >
        update all at once!
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/style/colors';
@use '@/assets/style/breakpoints';

.result-images {
  .optional-notification {
    margin: 0 30px 30px 30px;
    padding: 20px 30px;
    box-shadow: 3px 3px 0 colors.$secondary;
    border: 2px solid colors.$secondary;
    color: colors.$secondary-darker;
    overflow-wrap: break-word;
    &.save-image-hint {
      display: none;
    }
    &.render-offer {
      display: grid;
      grid-template-columns: 5fr 3fr;
      gap: 30px;
    }
  }
  .carousel {
    display: flex;
    justify-content: right;
    gap: 11px;
    width: 100%;
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
    border: 1px solid colors.$secondary;
    &.current {
      box-shadow: 4px 4px 0 colors.$secondary;
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
    padding: 15px 0;
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
    .optional-notification {
      &.render-offer {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
      }
      &.save-image-hint {
        display: block;
      }
    }
  }
}
</style>
