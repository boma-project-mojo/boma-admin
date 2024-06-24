/* 

Handles querying for tags.  

*/

import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  /* 
   * getTags()
   *
   * Get tags by tagType, return only published tags.  
   * 
   * @params        object      queryParams (e.g search term)
   * @tagType       str         the tag type which should be returned.
   */
  getTags(params, tagType) {
    // Tags can be associated with festivals and organisation.  
    // If a festival_id is provided as a param
      // set the tag adapter namespace to return tags scoped by festival 
    // else if organisation_id is provided as a param
      // set the tag adapter namespace to return tags scoped by organisation 
    if (params.festival_id) {
      this.store
        .adapterFor('tag')
        .set('namespace', 'admin_api/v1/festivals/' + params.festival_id);
    } else if (params.organisation_id) {
      this.store
        .adapterFor('tag')
        .set(
          'namespace',
          'admin_api/v1/organisations/' + params.organisation_id
        );
    }

    // Filter tags to only return those with the provided tag_type 
    // which are currently in the 'published' state.  
    return this.store.findAll('tag', params).then(function (all_tags) {
      return all_tags.filter(function (tag) {
        if (
          tag.get('tag_type') === tagType &&
          tag.get('aasm_state') === 'published' &&
          (params.festival_id === undefined ||
            tag.get('festival_id') === params.festival_id)
        ) {
          return tag;
        }
      });
    });
  },
});
