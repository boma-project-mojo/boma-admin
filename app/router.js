import EmberRouter from '@ember/routing/router';
import config from 'admin/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  this.route('organisations');

  this.route('organisation-articles', { path: 'organisations/:organisation_id/articles' });

  this.route('organisation-articles', {
    path: 'organisations/:organisation_id/articles',
  });

  this.route('festivals', { path: 'organisations/:organisation_id/festivals' });
  this.route('events', {
    path: 'organisations/:organisation_id/festivals/:festival_id/events',
  });
  this.route('productions', {
    path: 'organisations/:organisation_id/festivals/:festival_id/productions',
  });
  this.route('venues', {
    path: 'organisations/:organisation_id/festivals/:festival_id/venues',
  });
  this.route('tags', {
    path: 'organisations/:organisation_id/festivals/:festival_id/tags',
  });
  this.route('users', {
    path: 'organisations/:organisation_id/festivals/:festival_id/users',
  });
  this.route('pages', {
    path: 'organisations/:organisation_id/festivals/:festival_id/pages',
  });
  this.route('messages', {
    path: 'organisations/:organisation_id/festivals/:festival_id/messages',
  });
  this.route('articles', {
    path: 'organisations/:organisation_id/festivals/:festival_id/articles',
  });

  this.route('forgotten-password');
  this.route('reset-password');
  this.route('claim-invite');
  this.route('login');

  this.route('settings', {path: 'settings'})
  this.route('community-events', { path: 'organisations/:organisation_id/festivals/:festival_id/community-events' });
  this.route('analysis', { path: 'organisations/:organisation_id/festivals/:festival_id/analysis' });
  this.route('address');
});

export default Router;
