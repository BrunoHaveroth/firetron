import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
  firestore: storageFor('firestore'),
  classNames: 'col-md-12',
  actionExecQuery: 'execQuery',

  actions: {
    execQuery: function(query) {
      if (!query) { return; }
      this.saveQuery(query);
      this.sendAction('actionExecQuery', query);
    },

    openHistory: function() {
      Ember.$('.container-modal-history').addClass('open-modal');
    }
  },

  saveQuery: function(query) {
    var history = this.get('firestore.history');
    history.unshiftObject({ text: query });
    this.set('firestore.history', history.slice(0, 50));
  }
});
