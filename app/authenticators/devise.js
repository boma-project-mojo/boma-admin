import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';
import ENV from '../config/environment';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: ENV.APP['simple-auth-devise']['serverTokenEndpoint'],
  tokenAttributeName: 'user_token',
  identificationAttributeName: 'user_email',
});
