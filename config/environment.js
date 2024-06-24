'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'admin',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
        Array: true,
      },
    },
    moment: {
      // Options:
      // 'all' - all years, all timezones
      // '2010-2020' - 2010-2020, all timezones
      // 'none' - no data, just timezone API
      includeTimezone: 'all',
      includeLocales: true,
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    var apiHost = 'http://localhost:3000';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    var apiHost = 'http://localhost:3000';
  }

  if (environment === 'staging') {
    var apiHost = process.env.API_HOST;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    var apiHost = process.env.API_HOST;
  }

  var apiNameSpace = 'admin_api/v1';
  var apiURL = apiHost + '/' + apiNameSpace;

  ENV.APP['options'] = {
    apiURL: apiURL,
    apiNameSpace: apiNameSpace,
    apiHost: apiHost,
  };

  ENV.APP['simple-auth'] = {
    crossOriginWhitelist: [apiHost],
    authorizer: 'devise',
    authenticationRoute: 'landing',
    // session: 'session:withCurrentUser'
  };

  ENV.APP['simple-auth-devise'] = {
    serverTokenEndpoint: apiURL + '/users/sign-in',
    crossOriginWhitelist: [apiHost],
  };

  return ENV;
};
