'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    minifyJS: {
      enabled: false,
    },
    minifyCSS: {
      enabled: false,
    },
    'ember-bootstrap': {
      bootstrapVersion: 3,
      importBootstrapFont: false,
      importBootstrapCSS: true,
    },
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('node_modules/velocity-animate/velocity.min.js');

  app.import('vendor/ckeditor5/build/ckeditor.js');

  app.import('node_modules/chart.js/dist/chart.min.js');
  app.import('node_modules/chart.js/dist/chart.min.css');

  app.import('node_modules/@popperjs/core/dist/umd/popper.min.js');

  app.import('node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.js');
  app.import(
    'node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.css'
  );

  app.import('node_modules/axios/dist/axios.min.js');

  return app.toTree();
};
