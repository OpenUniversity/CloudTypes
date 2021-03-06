var State = require('../shared/State');
var CSetPrototype  = require('../shared/CSet').CSetPrototype;
var Restricted = require('../shared/Restricted');
var Index = require('../shared/Index');
var Table = require('./Table');

module.exports = State;

State.prototype.init = function (cid, client) {
  this.pending  = false;
  this.received = false;
  this.cid      = cid;
  this.uid      = 0;
  this.client   = client;
};

State.prototype.reinit = function (client) {
  this.client   = client;
  this.pending  = false;
  this.received = false;
};

State.prototype.yieldPull = function (state) {
  this.pending  = false;
  this.received = true;
  this.toJoin   = state;
};

State.prototype.yield = function () {
  var self = this;

  // (B) Revision from the server arrived, merge
  if (this.received) {
    console.log('yield: got revision from server');
    this.toJoin.joinIn(this);
    this.received = false;
    return this;
  }
  // (C) expecting a revision, but not present yet
  if (this.pending) {
    console.log('yield: waiting for server response');
    return this;
  }
  // (A) Not expecting server response, send state to server
  console.log('yield: pushing to server');
  this.checkCreations();
  this.client.yieldPush(this);
  this.applyFork();
  this.pending  = true;
  this.received = false;
};

State.prototype.checkCreations = function () {
  var self = this;
  self.forEachEntity(function (table) {
    // table.forEachFreshCreated(function (key) {
  //     var entry = table.getByKey(key);
  //     if (!self.canCreateTableEntry(entry, self.getUser())) {
  //       throw new Error("Not authorized to create " + entry);
  //     }
  //   });
    table.resetFreshCreated();
  });
};

// callback should take 1 argument that is set if it could not flush with server
State.prototype.flush = function (callback, timeout) {
  var self = this;

  timeout = timeout || 3000;
  var offline = setTimeout(function () {
    callback("Flush: could not sync on time with server (" + timeout + "ms)");
  }, timeout);

  this.client.flushPush(this, function flushPull(state) {
    // should actually replace this state,
    // but since there should be no operations done merging is the same.
    // self.print();
    console.log('received flushpull on client');

    // console.log('received: ' + Object.keys(state.arrays).map(function (n) { return n + "(" + state.arrays[n].constructor.name+")";}));

    state.joinIn(self);

    clearTimeout(offline);
    callback();
  });
  self.applyFork();
  return this;
};

State.prototype.getUser = function () {
  return this.client.user;
};

var join = State.prototype.joinIn;
State.prototype.joinIn = function (state) {
  var self = this;

  var deleted = {};
  
  // Retract data to which the state has no access anymore
  state.forEachArray(function (array) {
    var mArray = self.get(array.name);
    if (typeof mArray === 'undefined' || mArray instanceof Restricted) {
      deleted[array.name] = state.arrays[array.name];
      delete state.arrays[array.name];
      return;
    }
    array.forEachProperty(function (property) {
      // try {
       var mProperty = mArray.getProperty(property);
      if (typeof mProperty === 'undefined') {
        delete array.properties.properties[property.name];
        return;
      }
      // } catch(e) {
        
      // }
      property.forEachKey(function (key) {
        var value = property.getByKey(key);
        var mValue = mProperty.getByKey(key);
        if (typeof mValue === 'undefined') {
          property.obliterate(key);
        }
      })
    });
    if (array instanceof Table) {
        array.forEachState(function (key) {
          if (!mArray.defined(key) && !array.isFreshCreated(key)) {
            console.log('removing ' + key);
            array.obliterate(key);
          }
        });
      }
  });

  state.forEachArray(function (index) {
    index.forEachProperty(function (property) {
      if (property.CType instanceof Index) {
        property.CType = state.get(property.CType.name);
      }
    });

    index.keys.forEach(function (key, type, i) {
      if (type instanceof Index) {
        index.keys.types[i] = state.get(type.name);
      }
    });
  });
  self.propagate();


  join.call(this, state);
  return state;
};


// var checkTablePermission = State.prototype.checkTablePermission;

// State.prototype.checkTablePermission = function (action, table) {
//   return checkTablePermission.call(this, action, table, this.client.group);
// };

// var checkColumnPermission = State.prototype.checkColumnPermission;

// State.prototype.checkColumnPermission = function (action, table, cname) {
//   return checkColumnPermission.call(this, action, table, cname, this.client.group);
// };