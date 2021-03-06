var CInt    = require('./extensions/CInt');
var CString = require('./extensions/CString');

// CInt
var cint  = new CInt();
var cint1 = new CInt(10);
var cint2 = new CInt(20);
var cint3 = new CInt(30);

var ucint1 = new CInt();
var ucint2 = new CInt();
var ucint3 = new CInt();




var cintc = new CInt();
cintc.set(20);

// CString
var cstring  = new CString();
var cstring1 = new CString();
var cstring2 = new CString();
var cstring3 = new CString();



// unchanged state
exports.unchanged = createMap();

exports.groceryUnchanged = {
  type        : 'Array',
  keys     : {
    names: ['name'],
    types: ['string']
  },
  properties  : [
    {
      name: 'toBuy',
      type: { tag: 'CInt' },
      values: {
        '[Apples]'  : cint.toJSON(),
        '[Cows]'    : cint1.toJSON(),
        '[Napkins]' : cint2.toJSON(),
        '[Potatoes]': cint3.toJSON()
      }
    }
  ],
  isProxy: false
};

exports.productUnchanged = {
  type        : 'Array',
  keys     : {
    names: ['id'],
    types: ['string']
  },
  properties  : [
    {
      name: 'name',
      type: { tag: 'CString' },
      values: {
        '[1]': cstring.toJSON(),
        '[3]': cstring1.toJSON(),
        '[4]': cstring2.toJSON(),
        '[5]': cstring3.toJSON()
      }
    },
    {
      name: 'price',
      type: { tag: 'CInt' },
      values: {
        '[1]': cint1.toJSON(),
        '[2]': cint3.toJSON()
      }
    }
  ],
  isProxy: false
};

exports.customerUnchanged = {
  type        : 'Entity',
  keys     : {
    names: ['uid'],
    types: ['string']
  },
  keyValues : {},
  properties  : [
    {
      name: 'name',
      type: { tag: 'CString' },
      values: {
        'Customer:0#0': cstring.toJSON()
      }
    }
  ],
  states: {
    'Customer:0#0': 'ok'
  }
};

exports.orderUnchanged = {
  type        : 'Entity',
  keys     : {
    names: ['uid'],
    types: ['string']
  },
  keyValues : {},
  properties  : [
    {
      name: 'product',
      type: { tag: 'CString' },
      values: {
        'Order:0#0': cstring.toJSON(),
      }
    },
    {
      name: 'quantity',
      type: { tag: 'CInt' },
      values: {
        'Order:0#0': cint2.toJSON()
      }
    },
    {
      name: 'customer',
      type: 'Customer',
      values: {
        'Order:0#0': 'Customer:0#0',
      }
    }
  ],
  states: {
    'Order:0#0': 'ok'
  }
};


// CInt
cint1.set(1);
cint2.add(2);
cint3.set(3);
cint3.add(3);
ucint1.set(10);
ucint2.set(20);
ucint3.set(30);

// CString
cstring1.set('foo');
cstring2.setIfEmpty('bar');
cstring3.set('foo');
cstring3.setIfEmpty('foobar');

exports.changed = createMap();

function createMap() {
  return {
    'cint'    : cint.toJSON(),
    'cint1'   : cint1.toJSON(),
    'cint2'   : cint2.toJSON(),
    'cint3'   : cint3.toJSON(),
    'cstring' : cstring.toJSON(),
    'cstring1': cstring1.toJSON(),
    'cstring2': cstring2.toJSON(),
    'cstring3': cstring3.toJSON()
  };
}




exports.groceryPoluted = {
  type        : 'Array',
  keys     : {
    names: ['name'],
    types: ['string']
  },
  properties  : [
    {
      name: 'toBuy',
      type: { tag: 'CInt' },
      values: {}
    }
  ],
  isProxy: false
};
exports.productPoluted = {
  type        : 'Array',
  keys     : {
    names: ['id'],
    types: ['string']
  },
  properties  : [
    {
      name: 'name',
      type: { tag: 'CString' },
      values: {}
    },
    {
      name: 'price',
      type: { tag: 'CInt' },
      values: {}
    }
  ],
  isProxy: false
};

exports.groceryChanged = {
  type        : 'Array',
  keys     : {
    names: ['name'],
    types: ['string']
  },
  properties  : [
    {
      name: 'toBuy',
      type: { tag: 'CInt' },
      values: {
        '[Apples]'  : cint.toJSON(),
        '[Peers]'   : cint.toJSON(),
        '[Cows]'    : cint1.toJSON(),
        '[Napkins]' : cint2.toJSON(),
        '[Potatoes]': cint3.toJSON()
      }
    }
  ],
  isProxy: false
};
exports.productChanged = {
  type   : 'Array',
  keys: {
    names: ['id'],
    types: ['string']
  },
  properties: [
    {
      name  : 'name',
      type  : { tag: 'CString' },
      values: {
        '[1]': cstring.toJSON(),
        '[2]': cstring.toJSON(),
        '[3]': cstring1.toJSON(),
        '[4]': cstring2.toJSON(),
        '[5]': cstring3.toJSON()
      }
    },
    {
      name: 'price',
      type: { tag: 'CInt' },
      values: {
        '[1]': cint1.toJSON(),
        '[2]': cint3.toJSON()
      }
    }
  ],
  isProxy: false
};

exports.customerChanged = {
  type        : 'Entity',
  keys     : {
    names: ['uid'],
    types: ['string']
  },
  keyValues : {},
  properties  : [
    {
      name: 'name',
      type: { tag: 'CString' },
      values: {
        'Customer:0#0': cstring.toJSON(),
        'Customer:0#1': cstring.toJSON(),
        'Customer:0#2': cstring2.toJSON(),
        'Customer:0#3': cstring3.toJSON()
      }
    }
  ],
  states: {
    'Customer:0#0': 'deleted',
    'Customer:0#1': 'ok',
    'Customer:0#2': 'ok',
    'Customer:0#3': 'ok',
    'Customer:0#4': 'ok'
  }
};

exports.orderChanged = {
  type        : 'Entity',
  keys     : {
    names: ['uid'],
    types: ['string']
  },
  keyValues : {},
  properties  : [
    {
      name: 'product',
      type: { tag: 'CString' },
      values: {
        'Order:0#0': cstring.toJSON(),
        'Order:0#1': cstring1.toJSON(),
        'Order:0#2': cstring2.toJSON(),
        'Order:0#3': cstring.toJSON(),
        'Order:0#4': cstring3.toJSON(),
        'Order:0#5': cstring3.toJSON(),
        'Order:0#6': cstring3.toJSON()
      }
    },
    {
      name: 'quantity',
      type: { tag: 'CInt' },
      values: {
        'Order:0#0': cint2.toJSON(),
        'Order:0#2': cint.toJSON(),
        'Order:0#3': ucint3.toJSON(),
        'Order:0#4': ucint3.toJSON(),
        'Order:0#5': ucint2.toJSON(),
        'Order:0#6': ucint1.toJSON()
      }
    },
    {
      name: 'customer',
      type: 'Customer',
      values: {
        'Order:0#0': 'Customer:0#2',
        'Order:0#1': 'Customer:0#2',
        'Order:0#2': 'Customer:0#2',
        'Order:0#3': 'Customer:0#2',
        'Order:0#4': 'Customer:0#2',
      }
    }
  ],
  states: {
    'Order:0#0': 'deleted',
    'Order:0#1': 'deleted',
    'Order:0#2': 'deleted',
    'Order:0#3': 'ok',
    'Order:0#4': 'deleted',
    'Order:0#5': 'ok',
    'Order:0#6': 'ok'
  }
};

exports.arrays = [
  exports.groceryUnchanged, exports.productUnchanged,
  exports.groceryPoluted, exports.productPoluted,
  exports.groceryChanged, exports.productChanged
];

exports.entities = [
  exports.customerUnchanged, exports.customerChanged,
  exports.orderUnchanged, exports.orderChanged
];

exports.stateUnchanged = {
  arrays: {
    "Grocery" : exports.groceryUnchanged,
    "Product" : exports.productUnchanged,
    "Customer": exports.customerUnchanged,
    "Order"   : exports.orderUnchanged
  }
};

exports.statePoluted = {
  arrays: {
    "Grocery": exports.groceryPoluted,
    "Product": exports.productPoluted
  }
};

exports.stateChanged = {
  arrays: {
    "Grocery" : exports.groceryChanged,
    "Product" : exports.productChanged,
    "Customer": exports.customerChanged,
    "Order"   : exports.orderChanged
  }
}

exports.states = [
  exports.stateUnchanged,
  exports.statePoluted,
  exports.stateChanged
];
