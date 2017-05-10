import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'navbar navbar-default header navbar-fixed-top',
  actionRefreshTables: 'refreshTables',

  actions: {
    refreshTables: function() {
      this.sendAction('actionRefreshTables');
    }
  }
});
