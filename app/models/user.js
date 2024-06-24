import { computed } from '@ember/object';
import DS from 'ember-data';
import { or, equal } from '@ember/object/computed';

export default DS.Model.extend({
  roles: DS.attr(),
  name: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  aasm_state: DS.attr('string'),
  is_admin_or_super_admin: or('is_super_admin', 'is_admin'),
  is_admin: computed('roles', function () {
    return (
      this.roles.filter((role) => {
        return role.name == 'admin';
      }).length > 0
    );
  }),
  is_invited: equal('aasm_state', 'invited'),
  is_active: equal('aasm_state', 'active'),
  can_edit_venues: computed('roles', function () {
    return this.roles
      .filter((role) => {
        return (
          role.resource_type == 'AppData::Venue' && role.get('name') == 'editor'
        );
      })
      .map((role) => role.resource_id);
  }),
  reset_password_sent_at: DS.attr('string'),
  is_festival_admin: DS.attr('boolean'),
  is_super_admin: DS.attr('boolean'),
});
