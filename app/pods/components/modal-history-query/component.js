import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend({
  firestore: storageFor('firestore'),

  didInsertElement: function() {
    this.initStoreConnections();
  },

  actions: {
    copyText: function(text) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
      Ember.$('.container-modal-history').removeClass('open-modal');
    },

    closeModal: function() {
      Ember.$('.container-modal-history').removeClass('open-modal');
    }
  },

  initStoreConnections: function() {
    var firestore = this.get('firestore');

    if (!firestore.get('history')) {
      firestore.set('history', Ember.A());
    }
  },
});
