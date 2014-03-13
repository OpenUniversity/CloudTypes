var TableEntry = require('../shared/TableEntry');
module.exports = TableEntry;

var create = TableEntry.prototype.create;

var update = TableEntry.prototype.set;
TableEntry.prototype.set = function () {
  var args = Array.prototype.slice.apply(arguments);
  console.log('UPDATING ' + Array.prototype.slice.apply(arguments));
  // this.index.state.checkColumnPermission('update', this.index, args[0], this.index.state.getGroup());
  return update.apply(this, args);
};


var remove = TableEntry.prototype.delete;
TableEntry.prototype.delete = function () {
  console.log('DELETING');
  // this.index.state.checkTablePermission('delete', this.index, this.index.state.getGroup());
  return remove.apply(this, Array.prototype.slice.apply(arguments));
};