<script>
import Button from './Button.vue';
import markdown from '../processes/markdown.js';
import imageCreation from '../processes/imageCreation.js';
import { debounce } from 'throttle-debounce';

markdown.init();

const RENDER_TEXT_DELAY = 1000;
const COPIED_FADE_DELAY = 1000;
const COPIED_REMOVE_DELAY = 3000;

export default {
  components: {
    Button
  },

  props: [
    'isHintHidden', 
    'currentSlotId', 
    'post',
    'isButtonDisabled'
  ],

  emits: [
    'toggle-markdown-hint', 
    'save-slot-text', 
    'save-full-text', 
    'change-slot-image',
    'enable-button',
    'disable-button'
  ],

  data() {
    return {
      isCopiedPopupHidden: true,
      isCopiedPopupInvisible: false,
      renderedPreview: '',
    }
  },

  computed: {
    currentTextValue() {
      return this.post.slots[this.currentSlotId]?.text || '';
    },

    fullTextValue() {
      return this.post.fullText || '';
    },
  },

  watch: {
    async renderedPreview() {
      const imgSrc = await imageCreation.saveToSlot();

      this.$emit('change-slot-image', imgSrc, this.currentSlotId);
    },

    currentTextValue() {
      this.renderTextDebounced();
    },

    currentSlotId() {
      this.renderText();
    },
  },

  methods: {
    renderText() {
        this.renderedPreview = markdown.render(this.currentTextValue);
        this.$emit(this.currentTextValue ? 'enable-button' : 'disable-button');
    },

    renderTextDebounced: debounce(RENDER_TEXT_DELAY, function() {
      this.renderText();
    }),

    downloadImage() {
      imageCreation.download();
    },

    copyImage() {
      imageCreation.copy();
    },

    showCopiedPopup() {
      this.isCopiedPopupHidden = false;

      setTimeout(() => {
        this.isCopiedPopupInvisible = true;
      }, COPIED_FADE_DELAY);
      setTimeout(() => {
        this.isCopiedPopupHidden = true;
        this.isCopiedPopupInvisible = false;
      }, COPIED_REMOVE_DELAY);
    }
  },

  mounted() {
    imageCreation.init(this.$refs.preview);
  }
}
</script>

<template>
  <div class="transformator">
    <div class="transformator__inner">
      <div class="transformator__fields">
        <label class="transformator__field-container transformator__field-container--full">
          <h3 class="transformator__field-title">
            Whole text:
          </h3>
          <textarea 
            :value="fullTextValue"
            @input="$emit('save-full-text', $event)"
            class="transformator__field transformator__field--full"
            placeholder="Enter your full text here"
          ></textarea>
        </label>
        <label class="transformator__field-container transformator__field-container--current">
          <h3 class="transformator__field-title">
            Current page:
          </h3>
          <textarea 
            :value="currentTextValue"
            @input="$emit('save-slot-text', $event, currentSlotId)"
            class="transformator__field transformator__field--current"
            placeholder="Enter text here"
          ></textarea>
        </label>
      </div>
      <div class="transformator__buttons transformator__buttons--markdown">
        <Button 
          :type="'link-like'"
          @click="$emit('toggle-markdown-hint')"
        >
          <span v-if="isHintHidden">show </span>
          <span v-else>hide </span>
          markdown instructions
        </Button>
      </div>
    </div>
    <div class="transformator__preview-block">
      <div class="transformator__preview-label">
        Preview:
      </div>
      <div class="transformator__preview-wrapper transformator__preview-wrapper--border">
        <div 
          class="transformator__preview-wrapper transformator__preview-wrapper--padding"
          ref="preview"
        >
          <div 
            class="preview"
            v-html="renderedPreview"
          >
          </div>
        </div>
      </div>
      <div class="transformator__buttons transformator__buttons--preview">
        <Button 
          :disabled="isButtonDisabled"
          :type="'button-like'"
          @click="downloadImage"
        >
          download as jpg
        </Button>
        <Button
          :disabled="isButtonDisabled"
          :type="'button-like'"
          @click="copyImage(), showCopiedPopup()"
        > 
          copy as png
        </Button>
      </div>
      <div 
        class="transformator__copied-notification"
        :class="{ 'g-hidden': isCopiedPopupHidden, invisible: isCopiedPopupInvisible }"
      >
        copied
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../assets/colors';
@use '../assets/breakpoints';
@import '../assets/mixins';
@import '../assets/global';
@import '../assets/preview';

.transformator {
  display: flex;
  justify-content: space-between;
  gap: calc(
    var(--label-padding-top)
    + var(--label-padding-bottom)
    + var(--font-size)
  );
  width: 100%;
  padding-bottom: 30px;
  &__inner {
    flex-grow: 1;
    min-width: 200px;
  }
  &__fields {
    display: flex;
    flex-direction: column;
    height: calc(
      (var(--preview-width) / var(--preview-aspect-ratio)) 
      + var(--preview-padding) 
      + var(--preview-width-border)
    ); 
  }
  &__field-container {
    display: flex;
    flex-direction: column;
    &--full {
      flex-grow: 1;
    }
    &--current {
      flex-grow: 2;
    }
  }
  &__field-title {
    font-size: 1em;
    font-weight: 100;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    color: colors.$secondary-darker;
  }
  &__field {
    display: block;
    flex-grow: 1;
    width: 100%;
    padding: 10px;
    resize: none;
    border-radius: unset;
    transition: box-shadow 0.3s;
    @include solid-border;
    &:focus-visible {
      @include light-shadow;
      outline: none;
    }
  }
  &__preview-block {
    display: flex;
    flex-direction: column;
    padding-top: var(--preview-padding);
    position: relative;
  }
  &__preview-label {
    display: none;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    margin: 0 auto;
    font-size: 16px;
    color: colors.$secondary-darker;
  }
  &__preview-wrapper {
    &--border {
      border: 1px solid black;
       @include solid-border; 
    }
    &--padding {
      width: var(--preview-width);
      aspect-ratio: var(--preview-aspect-ratio);
      padding: var(--preview-wrapper-padding);
      width: var(--preview-width);
      aspect-ratio: 0.8;
      overflow: hidden;
      background-color: colors.$secondary-light;
    }
  } 
  &__buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    height: 50px;
  }
  &__copied-notification {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 30px;
    background-color: colors.$secondary-darker;
    color: colors.$main;
    font-size: 14px;
    font-variant-caps: all-small-caps;
    border-radius: 5px;
    @include radial-shadow;
    &.invisible {
      opacity: 0;
      transition: opacity 2s;
    }
  }
}

@media #{breakpoints.$s-media} {
  .transformator {
    flex-wrap: wrap;
    &__preview-block {
      order: -1;
    }
    &__inner {
      min-width: var(--preview-width);
    }
    &__field-container {
      align-items: center;
      &--current {
        order: -1;
      }
    }
    &__field {
      width: var(--preview-width);
    }
    &__preview-label {
      display: block;
    }
    &__preview-wrapper {
      margin: 0 auto;
    }
    &__preview-block {
      margin: 0 auto;
      padding: 0;
    }
  }  
}

</style>
