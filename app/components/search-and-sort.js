import { debounce } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    doSearch() {
      this.refreshModel();
    },
    clear() {
      this.set('query', '');
      setTimeout(() => {
        this.refreshModel();
      }, 100);
    },
  },
});
