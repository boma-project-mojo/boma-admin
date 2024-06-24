import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    token: {
      refreshModel: false,
    },
  },
});
