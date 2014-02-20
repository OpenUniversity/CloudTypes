/**
 * Created by ticup on 07/11/13.
 */

var IndexQuery = require("./IndexQuery");

module.exports = TableQuery;

function TableQuery(cEntity, filter) {
  IndexQuery.call(this, cEntity, filter);
}
TableQuery.prototype = Object.create(IndexQuery.prototype);

TableQuery.prototype.all = function () {
  var self = this;
  var entities = [];
  Object.keys(self.cArray.states).forEach(function (index) {
    if (self.cArray.exists(index) && (typeof self.sumFilter === 'undefined' || self.sumFilter(self.cArray.getByIndex(index))))
      entities.push(self.cArray.getByIndex(index));
  });
  if (self.orderProperty) {
    var property = self.cArray.getProperty(self.orderProperty);
    if (typeof property === 'undefined') {
      throw new Error("orderBy only allowed on properties for the moment");
    }
    return entities.sort(function (entry1, entry2) {
      return entry1.get(self.orderProperty).compare(entry2.get(self.orderProperty), (self.orderDir === "desc"));
    });
  }
  return entities;
};