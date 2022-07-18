<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import AppRange from '@/components/simpleComponents/AppRange.vue';
import SettingBlockWrapper from '@/components/helperComponents/SettingBlockWrapper.vue';
import { previewSettings, getDefaultSettings } from '@/data/previewSettings.js';
import { browserStorage } from '@/browserStorage/browserStorage.js'

export default {
  components: {
    AppButton,
    AppRange,
    SettingBlockWrapper,
  },

  emits: [
    'change',
  ],

  data() {
    return {
      settingsOptions: JSON.parse(JSON.stringify(previewSettings)),
      settingsToPass: {},
    }
  },

  created() {
    this.settingsToPass = browserStorage.fetch('settings') 
      || getDefaultSettings();

    this.passSettingsObject();
  },

  methods: {
    passSettingsObject() {
      const settingsValues = {
        settings: JSON.parse(JSON.stringify(this.settingsToPass)),
        mainTextFontFallback: 
          this.settingsOptions.fonts.options[this.settingsToPass.textApplicants.mainText.font].fallback,
        headingsFontFallback: 
          this.settingsOptions.fonts.options[this.settingsToPass.textApplicants.headings.font].fallback,
      };

      browserStorage.saveItem('settings', this.settingsToPass);
      this.$emit('change', settingsValues);
    },

    resetValue(textApplicant, setting, defaultValue) {
      this.settingsToPass.textApplicants[textApplicant][setting] = defaultValue;
      this.passSettingsObject();
    },

    resetPaddings() {
      this.settingsToPass.paddings.left = this.settingsOptions.paddings.default;
      this.settingsToPass.paddings.right = this.settingsOptions.paddings.default;
      this.settingsToPass.paddings.bottom = this.settingsOptions.paddings.default;
      this.settingsToPass.paddings.top = this.settingsOptions.paddings.default;
      this.passSettingsObject();
    },

    resetAllToDefault() {
      this.settingsToPass = getDefaultSettings();
      this.passSettingsObject();
    },
  },
}
</script>

<template>
<div class="preview-settings">   
  <div class="settings-wrapper">
    <div 
      class="setting-column"
      v-for="(textApplicant, textApplicantKey) in settingsOptions.textApplicants"
      :key="textApplicantKey"
    >   
      <SettingBlockWrapper :name="textApplicant.name">
        <AppRange 
          v-for="(setting, settingKey) in textApplicant.settings"
          :key="settingKey"
          :min="setting.min"
          :max="setting.max"
          :step="setting.step"
          :range-name="setting.name"
          v-model="settingsToPass.textApplicants[textApplicantKey][settingKey]"
          @input="passSettingsObject()"
        >
          <div class="single-button-wrapper">
            <AppButton
              v-show="settingsToPass.textApplicants[textApplicantKey][settingKey] 
                !== setting.value"
              link-like
              class="reset-range"
              @click="resetValue(textApplicantKey, settingKey, setting.value)"
            >
              reset
            </AppButton>
          </div>
        </AppRange>
        <SettingBlockWrapper subname="font:">
          <label class="fonts-dropdown-wrapper">
            <select
              class="fonts-dropdown"
              v-model="settingsToPass.textApplicants[textApplicantKey].font"
              @change="passSettingsObject"
            >
              <option 
                v-for="(option, optionKey) in settingsOptions.fonts.options"
                :key="optionKey"
                :value="option.value"
                :style="`font-family: ${option.value}, ${option.fallback};`"
              >
                {{ option.value }}
              </option>
            </select>
          </label>
        </SettingBlockWrapper>
      </SettingBlockWrapper>
    </div>
    <div class="setting-column">
      <SettingBlockWrapper :name="settingsOptions.paddings.name">
        <div 
          v-for="(side, sideKey) in settingsOptions.paddings.sides"
          :key="sideKey"
        >
          <AppRange 
            :min="settingsOptions.paddings.min"
            :max="settingsOptions.paddings.max"
            :step="settingsOptions.paddings.step"
            :range-name="side"
            v-model="settingsToPass.paddings[sideKey]"
            @input="passSettingsObject"
          />
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
      </SettingBlockWrapper>
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
  .setting-column {
    display: flex;
    flex-direction: column;
  }
  .single-button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
    height: 25px;
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
    width: var(--preview-width);
    margin: 10px auto;
    .settings-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 10px 15px 0;
    }
    .reset {
      margin-right: 0;
      margin-left: 55%;
    }
  }
}
</style>
