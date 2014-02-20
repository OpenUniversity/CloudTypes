var Keys        = require('./Keys');
var IndexEntry = require('./IndexEntry');

module.exports = TableEntry;

function TableEntry(index, keys) {
  IndexEntry.call(this, index, keys);
//  this.index = index;
//  this.keys = Keys.getKeys(keys, index);
}

TableEntry.prototype = Object.create(IndexEntry.prototype);


TableEntry.prototype.get = function (property) {
  return this.index.getProperty(property).saveGet(this.keys);
};

TableEntry.prototype.forEachIndex = function (callback) {
  return this.keys.slice(1).forEach(callback);
};

TableEntry.prototype.forEachKey = function (callback) {
  for (var i = 1; i<this.keys.length; i++) {
    callback(this.index.keys.getName(i), this.keys[i]);
  }
};

TableEntry.prototype.deleted = function () {
  return (this.index.state.deleted(this.keys, this.index));
};

TableEntry.prototype.delete = function () {
  return this.index.delete(this);
};

TableEntry.prototype.toString = function () {
  return Keys.createIndex(this.keys);
};