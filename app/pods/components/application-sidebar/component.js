import Ember from 'ember';

export default Ember.Component.extend({
  actionExecQuery: 'execQuery',

  actions: {
    showRegisters: function(table) {
      var query = 'SELECT * FROM ' + table;
      this.sendAction('actionExecQuery', query);
    }
  }
});
