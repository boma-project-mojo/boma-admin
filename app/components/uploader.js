import Component from '@glimmer/component';
import { action } from '@ember/object';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class UploaderComponent extends Component {
  @service('upload') upload;
  @service('fileQueue') fileQueue;
  @tracked file_is_loaded = false;

  constructor(owner, args) {
    super(owner, args);

    if(this.args.onFileAdd === undefined){
      throw new Error('onFileAdd must be defined');
    }

    if(this.args.name === undefined){
      throw new Error('names must be defined');
    }
  }

  validateFile(file) {
    if (file.size < 10000000) {
      return true
    } else {
      alert("File size must be less than 10MB")
    }
  }

	async uploadPhoto(file) {
    var self = this;
    set(this, "file_is_loaded", true);

    try {
      let url = await file.readAsDataURL();

      if (url) {
        set(this.args.model, 'image_base64', {name: file.name, data: url});
      }
    } catch (e) {
      console.log(e);
    }
  }

  willDestroy(){
    // Purge all files from the various queues (one per uploader)
    this.fileQueue.files.forEach((f)=>{
      f.queue.remove(f)
    })
  }

  @action
  uploadAudio(file){
    let article = this.article
    this.upload.uploadToS3(file, 'audio').then((s3ObjectURL)=>{
      set(this.args.model, 'audio_url', s3ObjectURL);
    });
  }

  @action
  uploadVideo(file){
    let article = this.article
    this.upload.uploadToS3(file, 'video').then((s3ObjectURL)=>{
      set(this.args.model, 'video_url', s3ObjectURL);
    });
  }

  @action
  uploadImage(file) {
    this.uploadPhoto(file);
  }
}
