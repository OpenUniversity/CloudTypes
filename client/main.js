var CloudTypeClient = require('./CloudTypeClient');
var ClientState     = require('./ClientState');

var CInt            = require('./CInt');
var CString         = require('./CString');
var Index           = require('../shared/Index');
var Restricted      = require('../shared/Restricted');
var Table           = require('./Table');
var TableEntry      = require('./TableEntry');

// needs to be loaded after all CloudTypes (modifies them)
var CloudType       = require('./CloudType');


var View            = require('./views/View');
var ListView        = require('./views/ListView');
var EntryView       = require('./views/EntryView');
var EditableListView = require('./views/EditableListView');

var CloudTypes = {
  // Client
  createClient: function () {
    return new CloudTypeClient();
  },

  // Views
  View: View,
  ListView: ListView,
  EntryView: EntryView,
  EditableListView: EditableListView,

  // Types
  Table: Table.declare,
  Index: Index.declare,
  Restricted: Restricted,
  CInt: CInt,
  CString: CString

};

global.CloudTypes = CloudTypes;
module.exports = CloudTypes;