import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'navbar navbar-default header navbar-fixed-top',
  actionRefreshTables: 'refreshTables',
  actionDisconnect: 'disconnect',

  actions: {
    refreshTables: function() {
      this.sendAction('actionRefreshTables');
    },

    disconnect: function() {
      this.sendAction('actionDisconnect');
    }
  }
});
