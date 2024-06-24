/* 

This service handles the saving of production records

*/

import Evented from '@ember/object/evented';
import Service from '@ember/service';

export default Service.extend(Evented, {
  /* 
   * saveProduction()
   *
   * Save the production
   * 
   * @production
   * @context
   * @resetNewProduction
   */  
  async saveProduction(production, context, resetNewProduction = false) {
    var selectedTags = await context.get('selectedTags');
    var productionTags = await production.get('tags');

    context.tags.forEach((tag) => {
      if (selectedTags.indexOf(tag) > -1) {
        productionTags.pushObject(tag);
      } else {
        productionTags.removeObject(tag);
      }
    });

    return production
      .save({ adapterOptions: { updateRelationship: 'tags' } })
      .then(() => {
        context.set('file_is_loaded', false);
        // context.refreshModel(production);
        if (resetNewProduction) {
          context.refreshModel(production);
        } else {
          context.set('is_editing', false);
          context.set('isEditing', false);
          context.set('errors', null);
        }
      })
      .catch((response) => {
        console.log(response);
        context.set('errors', response.errors);
      });
  },
});
