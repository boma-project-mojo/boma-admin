/* 

This service handles direct uploads to s3 using presigned URLs.   
These are currently used when users upload Audio and Video.  

*/

import Service, { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default Service.extend({
	session: service(),
	store: service(),

	uploadingAudio: false,
	uploadingAudioPercentageComplete: null, 
	
  uploadingVideo: false,
	uploadingVideoPercentageComplete: null, 
	
  /* 
   * reset()
   *
   * Reset the uploader and the attribute on the model
   * 
   * model      Ember Data Object     the Model to reset the upload on
   */
  reset(model){
		this.set('uploadingAudio', false);
		this.set('uploadingAudioPercentageComplete', null);
		this.set('uploadingVideo', false);
		this.set('uploadingVideoPercentageComplete', null); 
    model.set('image_base64', null);
	},

  /* 
   * uploadToS3()
   *
   * Upload a file to amazon s3 using a pre-signed URL
   * 
   * file         The file to upload
   * fileType     The type of file (audio/video)
   */
	uploadToS3(file, fileType){
		var self = this;

    fileType = fileType.charAt(0).toUpperCase() + fileType.slice(1);

    return new Promise((resolve, reject) => {
      // First request a pre-signed URL for a temporary location to be able to upload the file 
      // directly to s3.  
      let headers = {};
      if (this.get('session.isAuthenticated')) {
        headers[
          'Authorization'
        ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
      }

      let axiosConfig = {
        headers: headers
      }

      let presignedURLRequestData = {
        filename: file.name,
        content_type: file.type,
      }

      axios.post(
        ENV.APP['options']['apiURL'] + '/articles/request_presigned_url',
        presignedURLRequestData,
        axiosConfig
      ).then((presignedURL)=>{
        // Now upload the file to s3 using the presigned URL.  

        // Generate a FormData object for the file.  
        var data = new FormData();
        Object.entries(presignedURL.data.url_fields).forEach(([key, value]) => {
          data.append(key, value);
        });
        data.append('file', file.file);

        // Set Uploading state.  
        self.set(`uploading${fileType}`, 'Uploading');

        // Make the post request, update the PercentageComplete for this file type.  
        axios.post(
          presignedURL.data.url,
          data,
          {
            onUploadProgress: function(progressEvent){
              self.set(`uploading${fileType}PercentageComplete`, Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
            }
          }
        ).then((response)=>{
          // On success, get the location that s3 has stored the file.   
          let s3ObjectURL = decodeURIComponent(
            $(response.data).find('Location')[0].innerHTML
          );
          self.set(`uploading${fileType}PercentageComplete`, 100);
          self.set(`uploading${fileType}`, 'Complete');
          resolve(s3ObjectURL);
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
      })
      .catch((response) => {
        reject(response);
      });
    });
  },
});
