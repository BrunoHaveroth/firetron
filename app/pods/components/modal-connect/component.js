import Ember from 'ember';
import { storageFor } from 'ember-local-storage';
var Firebird = require('node-firebird');
var _ = require('lodash');

export default Ember.Component.extend({
  firestore: storageFor('firestore'),
  tabListConnections: true,

  didInsertElement: function() {
    this.initStoreConnections();
  },

  actions: {
    setTab: function(tabName) {
      this.set('tabListConnections', false);
      this.set('tabNewConnect', false);

      this.set(tabName, true);
    },

    openDbPath: function() {
      var dialog = require('electron').remote.dialog;
      var dir = dialog.showOpenDialog();
      this.set('dbPath', _.first(dir));
    },

    connect: function(connection) {
      var _this = this;

      Firebird.attach(connection, function(err, db) {
        if (err) alert(JSON.stringify(err));

        db.query('SELECT a.RDB$RELATION_NAME as "tablename" FROM RDB$RELATIONS a WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_TYPE = 0', function(err, result) {
          if (err) alert(JSON.stringify(err));

          result = _.map(result, function(item) {
            return _.trim(item.tablename);
          });

          _this.set('tables', result);
          _this.set('db', db);
          _this.set('openModal', false);
        });
      });
    },

    saveNewConnection: function() {
      var connections = this.get('firestore.connections');
      var newConnection = {};

      newConnection.id = this.generateId();
      newConnection.name = this.get('dbName');
      newConnection.host = this.get('dbHost');
      newConnection.port = this.get('dbPort');
      newConnection.user = this.get('dbUser');;
      newConnection.password = this.get('dbPassword');
      newConnection.database = this.get('dbPath');
      newConnection.lowercase_keys = true;
      newConnection.role = null;
      newConnection.pageSize = 4096;

      connections.unshiftObject(newConnection);

      this.set('firestore.connections', connections);

      this.set('tabNewConnect', false);
      this.set('tabListConnections', true);
    },

    removeConnection: function(connection) {
      var connections = this.get('firestore.connections');
      connections.removeObject(connection);
      this.set('firestore.connections', connections);
    },

    closeModal: function() {
      this.set('openModal', false);
    }
  },

  initStoreConnections: function() {
    var firestore = this.get('firestore');

    if (!firestore.get('connections')) {
      firestore.set('connections', Ember.A());
    }
  },

  generateId: function() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      newId = '';
    for (var x = 0; x < 16; x++) {
      var i = Math.floor(Math.random() * 60);
      newId += chars.charAt(i);
    }
    return newId;
  }
});
