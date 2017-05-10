import Ember from 'ember';
var Firebird = require('node-firebird');
var _ = require('lodash');

export default Ember.Component.extend({
  actions: {
    openDbPath: function() {
      var dialog = require('electron').remote.dialog;
      var dir = dialog.showOpenDialog();
      this.set('dbPath', _.first(dir));
    },

    closeModal: function() {
      this.set('openModal', false);
    },

    connectDB: function() {
      var _this = this;
      var options = {};

      options.host = this.get('dbHost');
      options.port = this.get('dbPort');
      options.user = this.get('dbUser');;
      options.password = this.get('dbPassword');
      options.database = this.get('dbPath');
      options.lowercase_keys = true;
      options.role = null;
      options.pageSize = 4096;

      Firebird.attach(options, function(err, db) {
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
    }
  }
});
