var State       = require('./extensions/State');
var Index      = require('../shared/Index');
var Table     = require('../shared/Table');
var IndexEntry = require('../shared/IndexEntry');
var Indexes     = require('../shared/Indexes');
var Properties  = require('../shared/Properties');
var Property    = require('../shared/Property');
var CloudType   = require('../shared/CloudType');
var CInt        = require('./extensions/CInt');
var CString     = require('./extensions/CString');
var should      = require('should');
var stubs       = require('./stubs');
var util        = require('util');


function createIndex() {
  var indexNames = [{name: "string"}];
  var properties = {toBuy: "CInt", shop: "CString"};
  var array = Index.declare(indexNames, properties);
  return array;
}

describe('Index', function () {
  var array, intArray;

  beforeEach(function () {
    array = createIndex();
    intArray = Index.declare([{slot: "int"}], {toBuy: "CInt"});

  });

  // Private
  describe('#new(indexes, properties)', function () {
    var indexes = [{name: "string"}];
    var properties = {toBuy: "CInt"};
    var array = new Index(indexes, properties);
    it('should create a new Index object', function () {
      array.should.be.an.instanceOf(Index);
    });
    it('should have properties property', function () {
      array.should.have.property('properties');
      array.properties.should.equal(properties);
    });
    it('should have indexes property', function () {
      array.should.have.property('indexes');
      array.indexes.should.be.an.instanceof(Indexes);
    });
  });

  // Private
  describe('#new(indexes, properties)', function () {
    var indexes = new Indexes();
    var properties = {toBuy: "CInt"};
    var array = new Index(indexes, properties);
    it('should create a new Index object', function () {
      array.should.be.an.instanceOf(Index);
    });
    it('should have properties property', function () {
      array.should.have.property('properties');
      array.properties.should.equal(properties);
    });
    it('should have indexes property', function () {
      array.should.have.property('indexes');
      array.indexes.should.be.an.instanceof(Indexes);
      array.indexes.should.equal(indexes);
    });
  });

  describe('#fromJSON(json)', function () {
    var cArrays = stubs.arrays.map(function (json) {
      return Index.fromJSON(json);
    });
    it('should create a Index', function () {
      var json = array.toJSON();
      var array2 = Index.fromJSON(stubs.groceryUnchanged);
      should.exist(array2);
      array2.should.be.an.instanceof(Index);
      array2.getProperty('toBuy').should.be.an.instanceof(Property);
    });
    it('should create a Index for all stubs', function () {
      stubs.arrays.map(function (json) {
        return [json, Index.fromJSON(json)];
      }).forEach(function (result) {
        var json = result[0];
        var cArray = result[1];
        should.exist(cArray);
        cArray.should.be.an.instanceof(Index);
        json.properties.forEach(function (jsonProperty) {
          should.exist(cArray.getProperty(jsonProperty.name));
        });
      });
    });
  });

  describe('.toJSON()', function () {
    it('should create a JSON representation', function () {
      var json = array.toJSON();
      should.exist(json);
      should.exist(json.indexes);
      should.exist(json.properties);
      json.indexes.should.eql(array.indexes.toJSON());
      json.properties.should.eql(array.properties.toJSON())
    });
    it('should be complementary with fromJSON for all stubs', function () {
      stubs.arrays.map(function (json) {
        json.should.eql(Index.fromJSON(json).toJSON());
      });
    });
  });

  // Public
  describe('#declare(indexNames, properties)', function () {
    var indexNames = [{name: "string"}];
    var properties = {toBuy: "CInt"};
    var array = Index.declare(indexNames, properties);
    it('should create a new Index object', function () {
      array.should.be.an.instanceOf(Index);
    });
    it('should have indexes property', function () {
      array.should.have.property('indexes');
      array.indexes.should.be.an.instanceof(Indexes);
    });
    it('should have initialized properties property', function () {
      array.should.have.property('properties');
      array.properties.should.be.instanceof(Properties);
      should.exist(array.properties.get('toBuy'));
      array.properties.get('toBuy').should.be.instanceof(Property);
    });
  });

  describe('.forEachProperty(callback)', function () {
    it('should call the callback for each property', function () {
      var ctr = 0;
      array.forEachProperty(function (property) {
        property.should.be.an.instanceof(Property);
        if (property.name === "toBuy")
          property.CType.should.equal(CInt);

        if (property.name === "shop")
          property.CType.should.equal(CString);
       ctr++;
      });
      ctr.should.equal(2);
    });
  });

  describe('.getProperty(propertyName)', function () {
    it('sould return the property with that name', function () {
      var property = array.getProperty('toBuy');
      should.exist(property);
      property.should.be.an.instanceof(Property);
      property.name.should.equal('toBuy');
    });
  });

  describe('.getProperty(property)', function () {
    it('sould return the property with the same name', function () {
      var property = array.getProperty('toBuy');
      var property2 = array.getProperty(property);
      should.exist(property2);
      property2.should.be.an.instanceof(Property);
      property2.name.should.equal('toBuy');
    });
  });


  describe('.get(indexes)', function () {
    it('should return a IndexEntry', function () {
      var entry = array.get('foo');
      should.exist(entry);
      entry.should.be.an.instanceof(IndexEntry);
    });

    it('should return a IndexEntry', function () {
      var entry = array.get('foo');
      should.exist(entry);
    });

    describe('.key(name)', function () {
      it('should return the value for given index', function () {
        var entry = array.get('foo');
        console.log(entry);
        should.exist(entry.key('name'));
      });

      it('should be a string if index is of type string', function () {
        var entry = array.get('bar');
        should.exist(entry.key('name'));
        (typeof entry.key('name')).should.equal('string');
      });

      it('should be a number if index is of type int', function () {
        var entry = intArray.get(1);
        should.exist(entry.key('slot'));
        (typeof entry.key('slot')).should.equal('number');
      });

      it('should be a Index if index is of declared Array type', function () {
        var state = new State();
        var array1 = state.declare('array1', Index.declare([{name: 'string'}], {prop: 'CString'}));
        var array2 = state.declare('array2', Index.declare([{ref: 'array1'}], {prop: 'CString'}));
        var entry1 = array1.get('foo');
        var entry2 = array2.get(entry1);
        should.exist(entry2);
        should.exist(entry2.key('ref'));
        entry2.key('ref').should.be.an.instanceof(IndexEntry);
        should(entry2.key('ref').equals(entry1));
      });

      it('should be a Table if index is of declared Entity type', function () {
        var state = new State();
        var entity = state.declare('entity', Table.declare([{name: 'string'}], {prop: 'CString'}));
        var array  = state.declare('array', Index.declare([{ref: 'entity'}], {prop: 'CString'}));
        var entry1 = entity.create('foo');
        var entry2 = array.get(entry1);
        should.exist(entry2);
        should.exist(entry2.key('ref'));
        entry2.key('ref').should.be.an.instanceof(IndexEntry);
      });

    });


  });






});