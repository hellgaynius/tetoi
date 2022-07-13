<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import AppWrapper from '@/components/simpleComponents/AppWrapper.vue';
import AppRange from '@/components/simpleComponents/AppRange.vue';
import { previewSettings } from '@/data/previewSettings.js';
import { browserStorage } from '@/browserStorage/browserStorage.js'

export default {
  LOCAL_SETTINGS_ITEM_NAME: 'localSettings',

  components: {
    AppButton,
    AppRange,
    AppWrapper,
  },

  emits: [
    'pass-settings',
  ],

  data() {
    return {
      settings: {},
      defaultValues: previewSettings.getDefaultValues(),
    }
  },

  created() {
    this.settings = 
      browserStorage.fetch(this.$options.LOCAL_SETTINGS_ITEM_NAME) 
      || JSON.parse(JSON.stringify(previewSettings));

    this.$emit('pass-settings', this.passSettingsObject());
  },

  methods: {
    passSettingsObject() {
      const settingsValues = {
        paddingTop: this.settings.paddings.sides.top.value,
        paddingLeft: this.settings.paddings.sides.left.value,
        paddingRight: this.settings.paddings.sides.right.value,
        paddingBottom: this.settings.paddings.sides.bottom.value,
        mainTextFontSize: this.settings.textApplicants.mainText.fontSize.value,
        headingsFontSize: this.settings.textApplicants.headings.fontSize.value,
        mainTextLineHeight: this.settings.textApplicants.mainText.lineHeight.value,
        headingsLineHeight: this.settings.textApplicants.headings.lineHeight.value,
        mainTextFont: this.settings.textApplicants.mainText.font.value,
        headingsFont: this.settings.textApplicants.headings.font.value,
        mainTextFontFallback: 
          this.settings.fonts.options[this.settings.textApplicants.mainText.font.value].fallback,
        headingsFontFallback: 
          this.settings.fonts.options[this.settings.textApplicants.headings.font.value].fallback,
      };

      localStorage.setItem(
        this.$options.LOCAL_SETTINGS_ITEM_NAME, 
        JSON.stringify(this.settings),
      );

      return settingsValues;
    },

    resetValue(name, parameter) {
      parameter.value = this.defaultValues[name];
      this.$emit('pass-settings', this.passSettingsObject());
    },

    resetPaddings() {
      this.settings.paddings.sides.left.value = this.defaultValues.padding;
      this.settings.paddings.sides.right.value = this.defaultValues.padding;
      this.settings.paddings.sides.bottom.value = this.defaultValues.padding;
      this.settings.paddings.sides.top.value = this.defaultValues.padding;
      this.$emit('pass-settings', this.passSettingsObject());
    },

    resetAllToDefault() {
      this.settings = JSON.parse(JSON.stringify(previewSettings));
      this.$emit('pass-settings', this.passSettingsObject());
    },
  },
}
</script>

<template>
<div 
  class="preview-settings"
  v-if="true"
  autofocus
>   
  <div class="settings-wrapper">
    <div 
      v-for="textApplicant in settings.textApplicants"
      :class="textApplicant.class"
    >   
      <AppWrapper :name="textApplicant.name">
        <AppRange 
          v-for="(setting, key) in settings.textSettings"
          :min="setting.min"
          :max="setting.max"
          :step="setting.step"
          :range-name="setting.name"
          :range-value="textApplicant[key].value"
          @update:rangeValue="value => textApplicant[key].value = value"
          @input="$emit('pass-settings', passSettingsObject())"
        >
          <div class="single-button-wrapper">
            <AppButton 
              link-like
              class="reset-range"
              @click="resetValue(key, setting)"
            >
              reset
            </AppButton>
          </div>
        </AppRange>
        <AppWrapper
          subname="font:"
        >
          <label class="fonts-dropdown-wrapper">
            <select
              class="fonts-dropdown"
              v-model="textApplicant.font.value"
              @change="$emit('pass-settings', passSettingsObject())"
            >
              <option 
                v-for="option in settings.fonts.options"
                :value="option.value"
                :style="`font-family: ${option.value}, ${option.fallback};`"
              >
                {{ option.value }}
              </option>
            </select>
          </label>
        </AppWrapper>
        
      </AppWrapper>
    </div>
    <div class="paddings">
      <AppWrapper 
        :name="settings.paddings.name"
      >
        <div v-for="side in settings.paddings.sides">
          <AppRange 
            :min="settings.paddings.params.min"
            :max="settings.paddings.params.max"
            :step="settings.paddings.params.step"
            :range-name="side.label"
            :range-value="side.value"
            @update:rangeValue="value => side.value = value"
            @input="$emit('pass-settings', passSettingsObject())"
          ></AppRange>
        </div>
        <div class="single-button-wrapper">
          <AppButton 
            link-like
            class="reset-range"
            @click="resetPaddings"
          >
            reset paddings
          </AppButton>
        </div>
      </AppWrapper>
    </div>

  </div>
  <AppButton 
    class="reset"
    link-like
    @click="resetAllToDefault"
  >
    reset all to default
  </AppButton>
</div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';

.preview-settings {
  margin-bottom: 10px;
  padding: 20px;
  border: 3px solid colors.$secondary;
  .settings-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    gap: 40px;
  }
  .headings,
  .paddings,
  .main-text {
    display: flex;
    flex-direction: column;
  }
  .single-button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .fonts-dropdown-wrapper {
    border-bottom: 2px solid colors.$secondary;
    padding: 5px 0;
    cursor: pointer;
  }
  .fonts-dropdown {
    border: none;
    cursor: pointer;
  }
  .reset-range {
    font-size: 12px;
    cursor: pointer;
  }
  .reset {
    margin: 15px 30px;
  }
}

@media #{breakpoints.$s-media} {
  .preview-settings {
      width: fit-content;
      margin: 30px auto;
    .settings-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 30px 15px 0;
    }
    .reset {
      margin-right: 0;
      margin-left: 55%;
    }
  }
}
</style>
