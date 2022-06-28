import domtoimage from 'dom-to-image';

export const imageCreation = {
  imageOptions: {},

  init(preview) {
    this.imageOptions.scaleSize = 2;
    this.imageOptions.preview = preview;
  
    this.imageOptions.options = {
      width: this.imageOptions.preview.clientWidth * this.imageOptions.scaleSize,
      height: this.imageOptions.preview.clientHeight * this.imageOptions.scaleSize,
      style: { 
        transform: `scale(${this.imageOptions.scaleSize})`, 
        transformOrigin: 'top left'
      },
    };
  },  

  generateImageUrl() {
    return domtoimage.toJpg(this.imageOptions.preview, this.imageOptions.options)
      .then(dataUrl => {
        return dataUrl;
    });
  },

  download() {
    domtoimage.toJpg(this.imageOptions.preview, this.imageOptions.options)
      .then(dataUrl => { 
        const linkEl = document.createElement('a');

        linkEl.download = `picture-page.jpg`;
        linkEl.href = dataUrl;
        linkEl.click();
      });
  },

  copy() {
    domtoimage.toBlob(this.imageOptions.preview, this.imageOptions.options)
      .then(blob => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png' : blob })]);
      });
  },
};
