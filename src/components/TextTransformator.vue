<script>
import VButton from '@/components/base/VButton.vue';
import markdown from '../processes/markdown.js';
import imageCreation from '../processes/imageCreation.js';
import { debounce } from 'throttle-debounce';

markdown.init();

const RENDER_TEXT_DELAY = 1000;
const COPIED_REMOVE_DELAY = 2000;

export default {
  components: {
    VButton,
  },

  props: {
    isMarkdownHintHidden: Boolean,
    currentSlotNumber: Number,
    post: Object,
  },

  emits: [
    'toggle-markdown-hint', 
    'save-text', 
    'change-slot-image',
  ],

  data() {
    return {
      isBigScreen: window.matchMedia('(min-width: 600px)').matches,
      isCopiedPopupHidden: true,
      isCopiedPopupInvisible: false,
      renderedPreview: '',
    }
  },

  computed: {
    currentTextValue() {
      return this.post.slots[this.currentSlotNumber]?.text || '';
    },

    fullTextValue() {
      return this.post.fullText || '';
    },

    isPreviewButtonDisabled() {
      return !this.renderedPreview ? true : false;
    },
  },

  watch: {
    async renderedPreview() {
      const imgSrc = await imageCreation.saveToSlot();

      this.$emit('change-slot-image', imgSrc, this.currentSlotNumber);
    },

    currentTextValue() {
      if (!this.post.slots[this.currentSlotNumber].imgSrc) {
        this.renderText()
      } else {
        this.renderTextDebounced();
      }
    },

    currentSlotNumber() {
      this.renderText();
    },
  },

  methods: {
    renderText() {
      this.renderedPreview = markdown.render(this.currentTextValue);
    },

    renderTextDebounced: debounce(RENDER_TEXT_DELAY, function() {
      this.renderText();
    }),

    downloadImage() {
      imageCreation.download();
    },

    copyImage() {
      imageCreation.copy();
      this.isCopiedPopupHidden = false;

      setTimeout(() => {
        this.isCopiedPopupHidden = true;
      }, COPIED_REMOVE_DELAY);
    },
  },

  mounted() {
    imageCreation.init(this.$refs.preview);
  }
}
</script>

<template>
  <div class="text-transformator">
    <div class="inner">
      <div class="fields">
        <label class="field-container full">
          <h3 class="field-title">
            Whole text:
          </h3>
          <textarea 
            :value="fullTextValue"
            @input="$emit('save-text', $event.target.value)"
            class="field full"
            placeholder="Place your full text here, and divide it between images later"
          ></textarea>
        </label>
        <label class="field-container current">
          <h3 class="field-title">
            Current page:
          </h3>
          <textarea
            :autofocus="isBigScreen"
            :value="currentTextValue"
            @input="$emit('save-text', $event.target.value, 'slot')"
            class="field current"
            placeholder="Style text here"
            ref="currentTextArea"
          ></textarea>
        </label>
      </div>
      <div class="buttons">
        <VButton 
          class="markdown"
          type="link-like"
          @click="$emit('toggle-markdown-hint')"
        >
          <span v-if="isMarkdownHintHidden">show </span>
          <span v-else>hide </span>
          markdown instructions
        </VButton>
      </div>
    </div>
    <div class="preview-block">
      <div class="preview-label">
        Preview:
      </div>
      <div class="preview-wrapper border">
        <div 
          class="preview-wrapper padding"
          ref="preview"
        >
          <div 
            class="preview"
            v-html="renderedPreview"
          >
          </div>
        </div>
      </div>
      <div class="buttons">
        <VButton 
          :disabled="isPreviewButtonDisabled"
          type="button-like"
          @click="downloadImage"
        >
          download as jpg
        </VButton>
        <VButton
          :disabled="isPreviewButtonDisabled"
          type="button-like"
          @click="copyImage"
        > 
          copy as png
        </VButton>
      </div>
      <Transition>
        <div 
          class="copied-notification"
          v-if="!isCopiedPopupHidden"
        >
          copied
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';
@import '@/assets/mixins';
@import '@/assets/global';
@import '@/assets/preview';

.text-transformator {
  display: flex;
  justify-content: space-between;
  gap: calc(
    var(--label-padding-top)
    + var(--label-padding-bottom)
    + var(--font-size)
  );
  width: 100%;
  padding-bottom: 30px;
  .inner {
    flex-grow: 1;
    min-width: 200px;
  }
  .fields {
    display: flex;
    flex-direction: column;
    height: calc(
      (var(--preview-width) / var(--preview-aspect-ratio)) 
      + var(--preview-padding) 
      + var(--preview-width-border)
    ); 
  }
  .field-container {
    display: flex;
    flex-direction: column;
    &.full {
      flex-grow: 1;
    }
    &.current {
      flex-grow: 2;
    }
  }
  .field-title {
    font-size: 1em;
    font-weight: 100;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    color: colors.$secondary-darker;
  }
  .field {
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
  .preview-block {
    display: flex;
    flex-direction: column;
    padding-top: var(--preview-padding);
    position: relative;
  }
  .preview-label {
    display: none;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    margin: 0 auto;
    font-size: 16px;
    color: colors.$secondary-darker;
  }
  .preview-wrapper {
    &.border {
      border: 1px solid black;
        @include solid-border; 
    }
    &.padding {
      width: var(--preview-width);
      aspect-ratio: var(--preview-aspect-ratio);
      padding: var(--preview-wrapper-padding);
      width: var(--preview-width);
      aspect-ratio: 0.8;
      overflow: hidden;
      background-color: colors.$secondary-light;
    }
  } 
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    height: 50px;
  }
  .copied-notification {
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
    &.v-leave-to {
      opacity: 0;
      transition: opacity 1s ease;
    }
  }
}

@media #{breakpoints.$s-media} {
  .text-transformator {
    flex-wrap: wrap;
    .inner {
      min-width: var(--preview-width);
    }
    .field-container {
      align-items: center;
      &.current {
        order: -1;
      }
    }
    .field {
      width: var(--preview-width);
    }
    .preview-label {
      display: block;
    }
    .preview-wrapper {
      margin: 0 auto;
    }
    .preview-block {
      order: -1;
      margin: 0 auto;
      padding: 0;
    }
  }
}  
</style>
