import domtoimage from 'dom-to-image';

export const imageCreation = {
  options: {},

  init(preview) {
    this.options.scaleSize = 2;
    this.options.preview = preview;
  
    this.options.compilation = {
      width: this.options.preview.clientWidth * this.options.scaleSize,
      height: this.options.preview.clientHeight * this.options.scaleSize,
      style: { 
        transform: `scale(${this.options.scaleSize})`, 
        transformOrigin: 'top left'
      },
    };
  },  

  generateUrl() {
    return domtoimage.toJpg(this.options.preview, this.options.compilation)
      .then(dataUrl => {
        return dataUrl;
    });
  },

  download(fileName) {
    domtoimage.toJpg(this.options.preview, this.options.compilation)
      .then(dataUrl => { 
        const linkEl = document.createElement('a');

        linkEl.download = fileName;
        linkEl.href = dataUrl;
        linkEl.click();
      });
  },

  copy() {
    domtoimage.toBlob(this.options.preview, this.options.compilation)
      .then(blob => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png' : blob })]);
      });
  },
};
