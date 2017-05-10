import Ember from 'ember';
var Firebird = require('node-firebird');
var _ = require('lodash');

export default Ember.Controller.extend({
  openModalConnect: true,

  actions: {
    execQuery: function(query) {
      var _this = this;
      var db = this.get('db');
      if (!db) { return; }

      this.setCurrentTable(query);

      db.query(query, function(err, result) {
        _this.buildResult(err, result);
      });
    },

    refreshTables: function() {
      var db = this.get('db');
      if (!db) { return; }

      var _this = this;

      db.query('SELECT a.RDB$RELATION_NAME as "tablename" FROM RDB$RELATIONS a WHERE RDB$SYSTEM_FLAG = 0 AND RDB$RELATION_TYPE = 0', function(err, result) {
        if (err) alert(JSON.stringify(err));

        result = _.map(result, function(item) {
          return _.trim(item.tablename);
        });

        _this.set('tables', result);
        _this.set('db', db);
        _this.set('openModal', false);
      });
    },

    copyText: function(text) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    }
  },

  setCurrentTable: function(query) {
    var tableName = query.match(/select.*from\s+(\w+)/i);
    if (tableName && tableName.length >= 1) {
      tableName = tableName[1].toUpperCase();

      if (tableName === this.get('currentTableName')) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(tableName).select();
        document.execCommand("copy");
        $temp.remove();
      }
      this.set('currentTableName', tableName);
    }
  },

  setViewStatus: function(status) {
    this.set('string-view', false);
    this.set('table-view', false);

    this.set(status + '-view', true);
  },

  buildResult: function(err, result) {
    if (Array.isArray(result)) {
      this.buildTableView(result);
    } else {
      this.buildStringView(err, result);
    }
  },

  buildStringView: function(err, result) {
    this.setViewStatus('string');
    this.set('stringResultQuery', (result ? result : err));
  },

  buildTableView: function(result) {
    this.buildHeader(result, (tableHeader)=> {
      this.setViewStatus('table');
      this.set('tableHeader', tableHeader);
      this.set('tableLines', this.buildbody(result));
    });
  },

  buildHeader: function(result, cb) {
    if (!result) { return; }
    var tableHeader = [];

    if (result.length) {
      _.forEach(_.first(result), function(value, key) {
        tableHeader.push(key);
      });
      cb(tableHeader);
    } else {
      var db = this.get('db');
      if (!db) { return; }
      db.query("select rdb$field_name as colname from rdb$relation_fields where rdb$relation_name='"+ this.get("currentTableName") +"';", function(err, cols) {
        _.forEach(cols, function(value) {
          if (value && value.colname) {
            tableHeader.push(value.colname.trim().toLowerCase());
          }
        });

        cb(tableHeader);
      });
    }
  },

  buildbody: function(result) {
    if (!result) { return; }
    var tableLines = [];

    var tableColums;
    _.forEach(result, function(value) {
      tableColums = [];
      _.forEach(value, function(item) {
        tableColums.push(item);
      });
      tableLines.push(tableColums);
    });

    return tableLines;
  },
});
