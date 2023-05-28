export default class FormFileUpload {

  constructor() {
    this.fileUploadList = document.querySelectorAll('.file-upload');
  }

  handleFileUpload(fileUpload) {
    const fileUploadInput = fileUpload.querySelector('input[type="file"]');

    fileUploadInput.addEventListener(
      'change',
      this.handleFileChange(fileUpload)
    );

    fileUpload.addEventListener('dragenter', this.handleDragOver);
    fileUpload.addEventListener('dragleave', this.handleDragOff);
    fileUpload.addEventListener('dragend', this.handleDragOff);
    fileUpload.addEventListener('drop', this.handleDrop);
  }

  handleFileChange(fileUpload) {
    return function (event) {
      const [file] = event.target.files;
      const { name: fileName, size } = file;
      const fileSize = (size / 1000).toFixed(2);

      const dataHTML = `
        <span class="file-upload__data">
            <span class="file-name">${fileName}</span>
            <span class="file-size">${fileSize} kb</span>
        </span>
      `;

      const fileUploadData = fileUpload.querySelector('.file-upload__data');

      if (fileUploadData) {
        fileUploadData.remove();
      }

      fileUpload.insertAdjacentHTML('beforeend', dataHTML);
    };
  }

  handleDragOver() {
    this.closest('.form-entry').classList.add('active');
  }

  handleDragOff() {
    this.closest('.form-entry').classList.remove('active');
  }

  handleDrop() {
    this.closest('.form-entry').classList.remove('active');
  }

  init() {
    this.fileUploadList.forEach((fileUpload) =>
      this.handleFileUpload(fileUpload)
    );
  }

}