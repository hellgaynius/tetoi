export const previewSettings = {
  paddings: {
    name: 'Paddings',
    default: 20,
    min: 20,
    max: 80,
    step: 1,
    sides: {
      left: 'left:',
      right: 'right:',
      bottom: 'bottom:',
      top: 'top:',
    },
  },

  textApplicants: {
    headings: 'Headings',
    mainText: 'Main text'
  },

  fonts: {
    name: 'fonts:',
    options: {
      'Philosopher': {
        fallback: 'sans-serif',
        value: 'Philosopher',
      },
      'Alice': {
        fallback: 'serif',
        value: 'Alice',
      },
      'Fira Mono': { 
        fallback: 'monospace',
        value: 'Fira Mono', 
      },
      'Cormorant Infant': {
        fallback: 'serif',
        value: 'Cormorant Infant', 
      },
      'Bona Nova': {
        fallback: 'serif',
        value: 'Bona Nova',
      },
      'Jura': {
        fallback: 'sans-serif',
        value: 'Jura',
      },
      'Finlandica': {
        fallback: 'sans-serif',
        value: 'Finlandica',
      },
      'Roboto': {
        fallback: 'sans-serif',
        value: 'Roboto',
      },
    },
  },

  textSettings: {
    fontSize: {
      name: 'size:',
      min: 10,
      max: 24,
      step: 2,
    },

    lineHeight: {
      name: 'line height:',
      min: 0.5,
      max: 2.5,
      step: 0.1,
    },
  },

  getDefaultValues() {
    return {
      mainTextFontSize: this.textSettings.fontSize.value,
      headingsFontSize: this.textSettings.fontSize.value,
      mainTextLineHeight: this.textSettings.lineHeight.value,
      headingsLineHeight: this.textSettings.lineHeight.value,
      padding: this.paddings.default,
    }
  },
}
