var Index      = require('./Index');
var Keys       = require('./Keys');
var Properties = require('./Properties');
var Property   = require('./Property');
var TableEntry = require('./TableEntry');
var TableQuery = require('./TableQuery');
var TypeChecker = require('./TypeChecker');
module.exports = Table;

var OK = 'ok';
var DELETED = 'deleted';

// when declared in a State, the state will add itself and the declared name for this Index as properties
// to the Table object.
function Table(keys, columns) {
  var self = this;

  // declare with only columns
  if (typeof columns === 'undefined' && !(keys instanceof Array)) {
    columns = keys;
    keys = [];
  }
  // declare with no keys/columns (from json)
  else if (typeof columns === 'undefined' && typeof keys === 'undefined') {
    columns = {};
    keys = [];
  }

  Index.call(this, keys, columns);
  this.keyValues = {};
  this.states    = {};
  this.uid       = 0;
  this.cached = {};
}

Table.prototype = Object.create(Index.prototype);

Table.OK = OK;
Table.DELETED = DELETED;

Table.declare = function (keys, columns) {
  return new Table(keys, columns);
};

Table.declare.type = Table;

Table.prototype.create = function (keys) {
  var uid = this.name + ":" + this.state.createUID(this.uid);
  if (!(keys instanceof Array)) {
    keys = Array.prototype.slice.call(arguments, 0);
  }
  TypeChecker.keys(keys, this.keys);
  // keys = Keys.getKeys(keys, this).slice(1);
  this.uid += 1;
  this.setCreated(uid);
  this.setKeyValues(uid, keys);
  return this.getByKey(uid);
};

Table.prototype.delete = function (entry) {
  console.log('deleting: ' + entry.uid);
  this.setDeleted(entry.uid);
  this.state.propagate();
};

Table.prototype.getKeyValues = function (uid) {
  var values = this.keyValues[uid];
  if (typeof values === 'undefined') {
    return [];
  }
  return values;
};

Table.prototype.setKeyValues = function (uid, keys) {
  this.keyValues[uid] = keys;
  return this;
};

// Pure arguments version (user input version)
// Table.prototype.get = function () {
//   var args = Array.prototype.slice.call(arguments);
//   var key = Keys.createIndex(args);
//   if (this.states[key]) {
//     return new TableEntry(this, args);
//   }
//   return null;
// };

// Pure arguments version (user input version)
// Table.prototype.get = function () {
//   var args = Array.prototype.slice.call(arguments);
//   var key = Keys.createIndex(args);
//   if (this.exists(key)) {
//     return new TableEntry(this, args);
//   }
//   return null;
// };

Table.prototype.get = function () {
  throw new Error("should not call get on table");
};

// Flattened key version (internal version)
Table.prototype.getByKey = function (uid) {
  var self = this;
  if (this.exists(uid)) {
    var keys = this.getKeyValues(uid);
    var cache = self.cached[uid];
    if (typeof cache !== 'undefined') {
      cache.keys = Keys.getKeys(keys, self);
      return cache;
    }
    var entry = new TableEntry(this, uid, keys);
    self.cached[uid] = entry;
    return entry;
  }
  return null;
};

Table.prototype.forEachState = function (callback) {
  var self = this;
  return Object.keys(this.states).forEach(function (key) {
    callback(key, self.states[key]);
  });
};

Table.prototype.setMax = function (entity1, entity2, key) {
  var val1 = entity1.states[key];
  var val2 = entity2.states[key];
  if (val1 === DELETED || val2 === DELETED) {
    this.states[key] = DELETED;
    return;
  }
  if (val1 === OK || val2 === OK) {
    this.states[key] = OK;
    return;
  }

};

Table.prototype.where = function (filter) {
  return new TableQuery(this, filter);
};

Table.prototype.all = function () {
  var self = this;
  var entities = [];
  Object.keys(this.states).forEach(function (uid) {
    if (!self.state.deleted(uid, self))
      entities.push(self.getByKey(uid));
  });
  return entities;
};

Table.prototype.forEachRow = function (callback) {
  var self = this;
  Object.keys(this.states).forEach(function (uid) {
    if (!self.state.deleted(uid, self))
      callback(self.getByKey(uid));
  });
};

Table.prototype.setDeleted = function (key) {
  this.states[key] = DELETED;
};

Table.prototype.setCreated = function (key) {
  this.states[key] = OK;
};


Table.prototype.getByProperties = function (properties) {
  var results = this.where(function (row) {
    var toReturn = true;
    Object.keys(properties).forEach(function (name) {
      if (!row.get(name).equals(properties[name])) {
        toReturn = false;
      }
    });
    return toReturn;
  }).all();
  if (results.length > 0) {
    return results[0];
  }
  return null;
};

Table.prototype.getByKeys = function (keys) {
  var results = this.where(function (row) {
    var toReturn = true;
    Object.keys(keys).forEach(function (name) {
      var val = row.key(name);
      if (val instanceof TableEntry) {
        if (!(val.equals(keys[name]))) {
          toReturn = false;
        }
      } else {
        if (val !== keys[name]) {
          toReturn = false;
        }
      }
    });
    return toReturn;
  }).all();
  if (results.length > 0) {
    return results[0];
  }
  return null;
};



Table.prototype.exists = function (idx) {
  return (typeof this.states[idx] !== 'undefined' && this.states[idx] === OK);
};

Table.prototype.deleted = function (idx) {
  return (this.states[idx] === DELETED);
};

Table.prototype.fork = function () {
  var fKeys = this.keys.fork();
  var table = new Table();
  table.keys = fKeys;
  table.properties = this.properties.fork(table);
  table.states     = this.states;
  table.keyValues  = this.keyValues;
  index.isProxy    = this.isProxy;
  return table;
};

Table.prototype.restrictedFork = function (group) {
  var fKeys = this.keys.fork();
  var table = new Table();
  table.keys = fKeys;
  table.properties = this.properties.restrictedFork(table, group);
  table.states     = this.states;
  table.isProxy    = this.isProxy;
  table.keyValues  = this.keyValues;
  return table;
};

Table.fromJSON = function (json) {
  var table = new Table();
  table.keys = Keys.fromJSON(json.keys);
  table.keyValues = json.keyValues;
  table.properties = Properties.fromJSON(json.properties, table);
  table.states = {};
  Object.keys(json.states).forEach(function (key) {
    table.states[key] = json.states[key];
  });
  return table;
};

Table.prototype.toJSON = function () {
  return {
    type        : 'Entity',
    keys        : this.keys.toJSON(),
    keyValues   : this.keyValues,
    properties  : this.properties.toJSON(),
    states      : this.states
  };
};
