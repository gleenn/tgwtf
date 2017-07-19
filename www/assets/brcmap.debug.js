(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// https://d3js.org/d3-array/ Version 1.2.0. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var ascending = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
};

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;

var pairs = function(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
};

function pair(a, b) {
  return [a, b];
}

var cross = function(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  if (reduce == null) reduce = pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
};

var descending = function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

var number = function(x) {
  return x === null ? NaN : +x;
};

var variance = function(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
};

var deviation = function(array, f) {
  var v = variance(array, f);
  return v ? Math.sqrt(v) : v;
};

var extent = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
};

var array = Array.prototype;

var slice = array.slice;
var map = array.map;

var constant = function(x) {
  return function() {
    return x;
  };
};

var identity = function(x) {
  return x;
};

var range = function(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function(start, stop, count) {
  var reverse = stop < start,
      i = -1,
      n,
      ticks,
      step;

  if (reverse) n = start, start = stop, stop = n;

  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
};

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

var sturges = function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var histogram = function() {
  var value = identity,
      domain = extent,
      threshold = sturges;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range(Math.ceil(x0 / tz) * tz, Math.floor(x1 / tz) * tz, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisectRight(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
};

var quantile = function(values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
};

var freedmanDiaconis = function(values, min, max) {
  values = map.call(values, number).sort(ascending);
  return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
};

var scott = function(values, min, max) {
  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
};

var max = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
};

var mean = function(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
};

var median = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return quantile(numbers.sort(ascending), 0.5);
};

var merge = function(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
};

var min = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
};

var permute = function(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
};

var scan = function(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = ascending;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
};

var shuffle = function(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
};

var sum = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
};

var transpose = function(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
};

function length(d) {
  return d.length;
}

var zip = function() {
  return transpose(arguments);
};

exports.bisect = bisectRight;
exports.bisectRight = bisectRight;
exports.bisectLeft = bisectLeft;
exports.ascending = ascending;
exports.bisector = bisector;
exports.cross = cross;
exports.descending = descending;
exports.deviation = deviation;
exports.extent = extent;
exports.histogram = histogram;
exports.thresholdFreedmanDiaconis = freedmanDiaconis;
exports.thresholdScott = scott;
exports.thresholdSturges = sturges;
exports.max = max;
exports.mean = mean;
exports.median = median;
exports.merge = merge;
exports.min = min;
exports.pairs = pairs;
exports.permute = permute;
exports.quantile = quantile;
exports.range = range;
exports.scan = scan;
exports.shuffle = shuffle;
exports.sum = sum;
exports.ticks = ticks;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
exports.transpose = transpose;
exports.variance = variance;
exports.zip = zip;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],2:[function(require,module,exports){
// https://d3js.org/d3-collection/ Version 1.0.4. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

var nest = function() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map$$1, depth) {
    if (++depth > keys.length) return map$$1;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map$$1.entries();
    else array = [], map$$1.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
};

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map();
}

function setMap(map$$1, key, value) {
  map$$1.set(key, value);
}

function Set() {}

var proto = map.prototype;

Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var keys = function(map) {
  var keys = [];
  for (var key in map) keys.push(key);
  return keys;
};

var values = function(map) {
  var values = [];
  for (var key in map) values.push(map[key]);
  return values;
};

var entries = function(map) {
  var entries = [];
  for (var key in map) entries.push({key: key, value: map[key]});
  return entries;
};

exports.nest = nest;
exports.set = set;
exports.map = map;
exports.keys = keys;
exports.values = values;
exports.entries = entries;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],3:[function(require,module,exports){
// https://d3js.org/d3-color/ Version 1.0.3. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var define = function(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  displayable: function() {
    return this.rgb().displayable();
  },
  toString: function() {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format])
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  toString: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var b = rgb2xyz(o.r),
      a = rgb2xyz(o.g),
      l = rgb2xyz(o.b),
      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend(Color, {
  brighter: function(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(
      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function xyz2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2xyz(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hcl, hcl, extend(Color, {
  brighter: function(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
  },
  darker: function(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
  },
  rgb: function() {
    return labConvert(this).rgb();
  }
}));

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh)),
      this.opacity
    );
  }
}));

exports.color = color;
exports.rgb = rgb;
exports.hsl = hsl;
exports.lab = lab;
exports.hcl = hcl;
exports.cubehelix = cubehelix;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],4:[function(require,module,exports){
// https://d3js.org/d3-dispatch/ Version 1.0.3. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

exports.dispatch = dispatch;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],5:[function(require,module,exports){
// https://d3js.org/d3-dsv/ Version 1.0.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

var dsv = function(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      delimiterCode = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns;
    return rows;
  }

  function parseRows(text, f) {
    var EOL = {}, // sentinel value for end-of-line
        EOF = {}, // sentinel value for end-of-file
        rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // the current line number
        t, // the current token
        eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I, c;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.slice(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var k = 1;
        c = text.charCodeAt(I++);
        if (c === 10) eol = true; // \n
        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.slice(j, I - k);
      }

      // special case: last token before EOF
      return text.slice(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && (a = f(a, n++)) == null) continue;
      rows.push(a);
    }

    return rows;
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return text == null ? ""
        : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
        : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
};

var csv = dsv(",");

var csvParse = csv.parse;
var csvParseRows = csv.parseRows;
var csvFormat = csv.format;
var csvFormatRows = csv.formatRows;

var tsv = dsv("\t");

var tsvParse = tsv.parse;
var tsvParseRows = tsv.parseRows;
var tsvFormat = tsv.format;
var tsvFormatRows = tsv.formatRows;

exports.dsvFormat = dsv;
exports.csvParse = csvParse;
exports.csvParseRows = csvParseRows;
exports.csvFormat = csvFormat;
exports.csvFormatRows = csvFormatRows;
exports.tsvParse = tsvParse;
exports.tsvParseRows = tsvParseRows;
exports.tsvFormat = tsvFormat;
exports.tsvFormatRows = tsvFormatRows;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],6:[function(require,module,exports){
// https://d3js.org/d3-format/ Version 1.2.0. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
var formatDecimal = function(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
};

var exponent = function(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

var formatGroup = function(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
};

var formatNumerals = function(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
};

var formatDefault = function(x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      case "e": break out;
      default: if (i0 > 0) i0 = 0; break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

var prefixExponent;

var formatPrefixAuto = function(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
};

var formatRounded = function(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
      + this.type;
};

var identity = function(x) {
  return x;
};

var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

var formatLocale = function(locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? (type ? 6 : 12)
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
};

var locale;



defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  exports.format = locale.format;
  exports.formatPrefix = locale.formatPrefix;
  return locale;
}

var precisionFixed = function(step) {
  return Math.max(0, -exponent(Math.abs(step)));
};

var precisionPrefix = function(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
};

var precisionRound = function(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
};

exports.formatDefaultLocale = defaultLocale;
exports.formatLocale = formatLocale;
exports.formatSpecifier = formatSpecifier;
exports.precisionFixed = precisionFixed;
exports.precisionPrefix = precisionPrefix;
exports.precisionRound = precisionRound;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],7:[function(require,module,exports){
// https://d3js.org/d3-geo/ Version 1.6.4. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Array) { 'use strict';

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

var adder = function() {
  return new Adder;
};

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add(temp, y, this.t);
    add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var tau = pi * 2;

var degrees = 180 / pi;
var radians = pi / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;

var log = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt = Math.sqrt;
var tan = Math.tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}

function noop() {}

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

var geoStream = function(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
};

var areaRingSum = adder();

var areaSum = adder();
var lambda00;
var phi00;
var lambda0;
var cosPhi0;
var sinPhi0;

var areaStream = {
  point: noop,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: function() {
    areaRingSum.reset();
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    var areaRing = +areaRingSum;
    areaSum.add(areaRing < 0 ? tau + areaRing : areaRing);
    this.lineStart = this.lineEnd = this.point = noop;
  },
  sphere: function() {
    areaSum.add(tau);
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaRingEnd() {
  areaPoint(lambda00, phi00);
}

function areaPointFirst(lambda, phi) {
  areaStream.point = areaPoint;
  lambda00 = lambda, phi00 = phi;
  lambda *= radians, phi *= radians;
  lambda0 = lambda, cosPhi0 = cos(phi = phi / 2 + quarterPi), sinPhi0 = sin(phi);
}

function areaPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  phi = phi / 2 + quarterPi; // half the angular distance from south pole

  // Spherical excess E for a spherical triangle with vertices: south pole,
  // previous point, current point.  Uses a formula derived from Cagnoli’s
  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
  var dLambda = lambda - lambda0,
      sdLambda = dLambda >= 0 ? 1 : -1,
      adLambda = sdLambda * dLambda,
      cosPhi = cos(phi),
      sinPhi = sin(phi),
      k = sinPhi0 * sinPhi,
      u = cosPhi0 * cosPhi + k * cos(adLambda),
      v = k * sdLambda * sin(adLambda);
  areaRingSum.add(atan2(v, u));

  // Advance the previous points.
  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
}

var area = function(object) {
  areaSum.reset();
  geoStream(object, areaStream);
  return areaSum * 2;
};

function spherical(cartesian) {
  return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
  return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

var lambda0$1;
var phi0;
var lambda1;
var phi1;
var lambda2;
var lambda00$1;
var phi00$1;
var p0;
var deltaSum = adder();
var ranges;
var range$1;

var boundsStream = {
  point: boundsPoint,
  lineStart: boundsLineStart,
  lineEnd: boundsLineEnd,
  polygonStart: function() {
    boundsStream.point = boundsRingPoint;
    boundsStream.lineStart = boundsRingStart;
    boundsStream.lineEnd = boundsRingEnd;
    deltaSum.reset();
    areaStream.polygonStart();
  },
  polygonEnd: function() {
    areaStream.polygonEnd();
    boundsStream.point = boundsPoint;
    boundsStream.lineStart = boundsLineStart;
    boundsStream.lineEnd = boundsLineEnd;
    if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    else if (deltaSum > epsilon) phi1 = 90;
    else if (deltaSum < -epsilon) phi0 = -90;
    range$1[0] = lambda0$1, range$1[1] = lambda1;
  }
};

function boundsPoint(lambda, phi) {
  ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
}

function linePoint(lambda, phi) {
  var p = cartesian([lambda * radians, phi * radians]);
  if (p0) {
    var normal = cartesianCross(p0, p),
        equatorial = [normal[1], -normal[0], 0],
        inflection = cartesianCross(equatorial, normal);
    cartesianNormalizeInPlace(inflection);
    inflection = spherical(inflection);
    var delta = lambda - lambda2,
        sign$$1 = delta > 0 ? 1 : -1,
        lambdai = inflection[0] * degrees * sign$$1,
        phii,
        antimeridian = abs(delta) > 180;
    if (antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
      phii = inflection[1] * degrees;
      if (phii > phi1) phi1 = phii;
    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
      phii = -inflection[1] * degrees;
      if (phii < phi0) phi0 = phii;
    } else {
      if (phi < phi0) phi0 = phi;
      if (phi > phi1) phi1 = phi;
    }
    if (antimeridian) {
      if (lambda < lambda2) {
        if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
      } else {
        if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
      }
    } else {
      if (lambda1 >= lambda0$1) {
        if (lambda < lambda0$1) lambda0$1 = lambda;
        if (lambda > lambda1) lambda1 = lambda;
      } else {
        if (lambda > lambda2) {
          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
        }
      }
    }
  } else {
    ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
  }
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
  p0 = p, lambda2 = lambda;
}

function boundsLineStart() {
  boundsStream.point = linePoint;
}

function boundsLineEnd() {
  range$1[0] = lambda0$1, range$1[1] = lambda1;
  boundsStream.point = boundsPoint;
  p0 = null;
}

function boundsRingPoint(lambda, phi) {
  if (p0) {
    var delta = lambda - lambda2;
    deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
  } else {
    lambda00$1 = lambda, phi00$1 = phi;
  }
  areaStream.point(lambda, phi);
  linePoint(lambda, phi);
}

function boundsRingStart() {
  areaStream.lineStart();
}

function boundsRingEnd() {
  boundsRingPoint(lambda00$1, phi00$1);
  areaStream.lineEnd();
  if (abs(deltaSum) > epsilon) lambda0$1 = -(lambda1 = 180);
  range$1[0] = lambda0$1, range$1[1] = lambda1;
  p0 = null;
}

// Finds the left-right distance between two longitudes.
// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
// the distance between ±180° to be 360°.
function angle(lambda0, lambda1) {
  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
}

function rangeCompare(a, b) {
  return a[0] - b[0];
}

function rangeContains(range$$1, x) {
  return range$$1[0] <= range$$1[1] ? range$$1[0] <= x && x <= range$$1[1] : x < range$$1[0] || range$$1[1] < x;
}

var bounds = function(feature) {
  var i, n, a, b, merged, deltaMax, delta;

  phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
  ranges = [];
  geoStream(feature, boundsStream);

  // First, sort ranges by their minimum longitudes.
  if (n = ranges.length) {
    ranges.sort(rangeCompare);

    // Then, merge any ranges that overlap.
    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
      b = ranges[i];
      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
      } else {
        merged.push(a = b);
      }
    }

    // Finally, find the largest gap between the merged ranges.
    // The final bounding box will be the inverse of this gap.
    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
      b = merged[i];
      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
    }
  }

  ranges = range$1 = null;

  return lambda0$1 === Infinity || phi0 === Infinity
      ? [[NaN, NaN], [NaN, NaN]]
      : [[lambda0$1, phi0], [lambda1, phi1]];
};

var W0;
var W1;
var X0;
var Y0;
var Z0;
var X1;
var Y1;
var Z1;
var X2;
var Y2;
var Z2;
var lambda00$2;
var phi00$2;
var x0;
var y0;
var z0; // previous point

var centroidStream = {
  sphere: noop,
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  }
};

// Arithmetic mean of Cartesian vectors.
function centroidPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi);
  centroidPointCartesian(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi));
}

function centroidPointCartesian(x, y, z) {
  ++W0;
  X0 += (x - X0) / W0;
  Y0 += (y - Y0) / W0;
  Z0 += (z - Z0) / W0;
}

function centroidLineStart() {
  centroidStream.point = centroidLinePointFirst;
}

function centroidLinePointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi);
  x0 = cosPhi * cos(lambda);
  y0 = cosPhi * sin(lambda);
  z0 = sin(phi);
  centroidStream.point = centroidLinePoint;
  centroidPointCartesian(x0, y0, z0);
}

function centroidLinePoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi),
      x = cosPhi * cos(lambda),
      y = cosPhi * sin(lambda),
      z = sin(phi),
      w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).
function centroidRingStart() {
  centroidStream.point = centroidRingPointFirst;
}

function centroidRingEnd() {
  centroidRingPoint(lambda00$2, phi00$2);
  centroidStream.point = centroidPoint;
}

function centroidRingPointFirst(lambda, phi) {
  lambda00$2 = lambda, phi00$2 = phi;
  lambda *= radians, phi *= radians;
  centroidStream.point = centroidRingPoint;
  var cosPhi = cos(phi);
  x0 = cosPhi * cos(lambda);
  y0 = cosPhi * sin(lambda);
  z0 = sin(phi);
  centroidPointCartesian(x0, y0, z0);
}

function centroidRingPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi),
      x = cosPhi * cos(lambda),
      y = cosPhi * sin(lambda),
      z = sin(phi),
      cx = y0 * z - z0 * y,
      cy = z0 * x - x0 * z,
      cz = x0 * y - y0 * x,
      m = sqrt(cx * cx + cy * cy + cz * cz),
      w = asin(m), // line weight = angle
      v = m && -w / m; // area weight multiplier
  X2 += v * cx;
  Y2 += v * cy;
  Z2 += v * cz;
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

var centroid = function(object) {
  W0 = W1 =
  X0 = Y0 = Z0 =
  X1 = Y1 = Z1 =
  X2 = Y2 = Z2 = 0;
  geoStream(object, centroidStream);

  var x = X2,
      y = Y2,
      z = Z2,
      m = x * x + y * y + z * z;

  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
  if (m < epsilon2) {
    x = X1, y = Y1, z = Z1;
    // If the feature has zero length, fall back to arithmetic mean of point vectors.
    if (W1 < epsilon) x = X0, y = Y0, z = Z0;
    m = x * x + y * y + z * z;
    // If the feature still has an undefined ccentroid, then return.
    if (m < epsilon2) return [NaN, NaN];
  }

  return [atan2(y, x) * degrees, asin(z / sqrt(m)) * degrees];
};

var constant = function(x) {
  return function() {
    return x;
  };
};

var compose = function(a, b) {

  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function(x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };

  return compose;
};

function rotationIdentity(lambda, phi) {
  return [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : rotationIdentity);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = cos(deltaPhi),
      sinDeltaPhi = sin(deltaPhi),
      cosDeltaGamma = cos(deltaGamma),
      sinDeltaGamma = sin(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = cos(phi),
        x = cos(lambda) * cosPhi,
        y = sin(lambda) * cosPhi,
        z = sin(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      asin(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = cos(phi),
        x = cos(lambda) * cosPhi,
        y = sin(lambda) * cosPhi,
        z = sin(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      asin(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

var rotation = function(rotate) {
  rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  };

  return forward;
};

// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = cos(radius),
      sinRadius = sin(radius),
      step = direction * delta;
  if (t0 == null) {
    t0 = radius + direction * tau;
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
  }
  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
    stream.point(point[0], point[1]);
  }
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = cartesian(point), point[0] -= cosRadius;
  cartesianNormalizeInPlace(point);
  var radius = acos(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
}

var circle = function() {
  var center = constant([0, 0]),
      radius = constant(90),
      precision = constant(6),
      ring,
      rotate,
      stream = {point: point};

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= degrees, x[1] *= degrees;
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * radians,
        p = precision.apply(this, arguments) * radians;
    ring = [];
    rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
    circleStream(stream, r, p, 1);
    c = {type: "Polygon", coordinates: [ring]};
    ring = rotate = null;
    return c;
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), circle) : radius;
  };

  circle.precision = function(_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : constant(+_), circle) : precision;
  };

  return circle;
};

var clipBuffer = function() {
  var lines = [],
      line;
  return {
    point: function(x, y) {
      line.push([x, y]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: noop,
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
};

var clipLine = function(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
};

var pointEqual = function(a, b) {
  return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
};

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
var clipPolygon = function(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n], x;

    // If the first and last points of a segment are coincident, then treat as a
    // closed ring. TODO if all rings are closed, then the winding order of the
    // exterior ring should be checked.
    if (pointEqual(p0, p1)) {
      stream.lineStart();
      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
      stream.lineEnd();
      return;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
};

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}

var clipMax = 1e9;
var clipMin = -clipMax;

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipExtent(x0, y0, x1, y1) {

  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null
        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
        || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
        : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
        : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb
        : ca === 0 ? b[1] - a[1]
        : ca === 1 ? a[0] - b[0]
        : ca === 2 ? a[1] - b[1]
        : b[0] - a[0];
  }

  return function(stream) {
    var activeStream = stream,
        bufferStream = clipBuffer(),
        segments,
        polygon,
        ring,
        x__, y__, v__, // first point
        x_, y_, v_, // previous point
        first,
        clean;

    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
        }
      }

      return winding;
    }

    // Buffer geometry within a polygon and then clip it en masse.
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = d3Array.merge(segments)).length;
      if (cleanInside || visible) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible) {
          clipPolygon(segments, compareIntersection, startInside, interpolate, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }

    // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if (clipLine(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}

var extent = function() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;

  return clip = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function(_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
};

var sum = adder();

var polygonContains = function(polygon, point) {
  var lambda = point[0],
      phi = point[1],
      normal = [sin(lambda), -cos(lambda), 0],
      angle = 0,
      winding = 0;

  sum.reset();

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = point0[0],
        phi0 = point0[1] / 2 + quarterPi,
        sinPhi0 = sin(phi0),
        cosPhi0 = cos(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = point1[0],
          phi1 = point1[1] / 2 + quarterPi,
          sinPhi1 = sin(phi1),
          cosPhi1 = cos(phi1),
          delta = lambda1 - lambda0,
          sign$$1 = delta >= 0 ? 1 : -1,
          absDelta = sign$$1 * delta,
          antimeridian = absDelta > pi,
          k = sinPhi0 * sinPhi1;

      sum.add(atan2(k * sign$$1 * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
      angle += antimeridian ? delta + sign$$1 * tau : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = cartesianCross(cartesian(point0), cartesian(point1));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(normal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -epsilon || angle < epsilon && sum < -epsilon) ^ (winding & 1);
};

var lengthSum = adder();
var lambda0$2;
var sinPhi0$1;
var cosPhi0$1;

var lengthStream = {
  sphere: noop,
  point: noop,
  lineStart: lengthLineStart,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = noop;
}

function lengthPointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  lambda0$2 = lambda, sinPhi0$1 = sin(phi), cosPhi0$1 = cos(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var sinPhi = sin(phi),
      cosPhi = cos(phi),
      delta = abs(lambda - lambda0$2),
      cosDelta = cos(delta),
      sinDelta = sin(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
      z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
  lengthSum.add(atan2(sqrt(x * x + y * y), z));
  lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
}

var length = function(object) {
  lengthSum.reset();
  geoStream(object, lengthStream);
  return +lengthSum;
};

var coordinates = [null, null];
var object = {type: "LineString", coordinates: coordinates};

var distance = function(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length(object);
};

var containsObjectType = {
  Feature: function(object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function(object, point) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
    return false;
  }
};

var containsGeometryType = {
  Sphere: function() {
    return true;
  },
  Point: function(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPoint(coordinates[i], point)) return true;
    return false;
  },
  LineString: function(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsLine(coordinates[i], point)) return true;
    return false;
  },
  Polygon: function(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
    return false;
  },
  GeometryCollection: function(object, point) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) if (containsGeometry(geometries[i], point)) return true;
    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
      ? containsGeometryType[geometry.type](geometry, point)
      : false;
}

function containsPoint(coordinates, point) {
  return distance(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ab = distance(coordinates[0], coordinates[1]),
      ao = distance(coordinates[0], point),
      ob = distance(point, coordinates[1]);
  return ao + ob <= ab + epsilon;
}

function containsPolygon(coordinates, point) {
  return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

var contains = function(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type)
      ? containsObjectType[object.type]
      : containsGeometry)(object, point);
};

function graticuleX(y0, y1, dy) {
  var y = d3Array.range(y0, y1 - epsilon, dy).concat(y1);
  return function(x) { return y.map(function(y) { return [x, y]; }); };
}

function graticuleY(x0, x1, dx) {
  var x = d3Array.range(x0, x1 - epsilon, dx).concat(x1);
  return function(y) { return x.map(function(x) { return [x, y]; }); };
}

function graticule() {
  var x1, x0, X1, X0,
      y1, y0, Y1, Y0,
      dx = 10, dy = dx, DX = 90, DY = 360,
      x, y, X, Y,
      precision = 2.5;

  function graticule() {
    return {type: "MultiLineString", coordinates: lines()};
  }

  function lines() {
    return d3Array.range(ceil(X0 / DX) * DX, X1, DX).map(X)
        .concat(d3Array.range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(d3Array.range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs(x % DX) > epsilon; }).map(x))
        .concat(d3Array.range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs(y % DY) > epsilon; }).map(y));
  }

  graticule.lines = function() {
    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
  };

  graticule.outline = function() {
    return {
      type: "Polygon",
      coordinates: [
        X(X0).concat(
        Y(Y1).slice(1),
        X(X1).reverse().slice(1),
        Y(Y0).reverse().slice(1))
      ]
    };
  };

  graticule.extent = function(_) {
    if (!arguments.length) return graticule.extentMinor();
    return graticule.extentMajor(_).extentMinor(_);
  };

  graticule.extentMajor = function(_) {
    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
    X0 = +_[0][0], X1 = +_[1][0];
    Y0 = +_[0][1], Y1 = +_[1][1];
    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
    return graticule.precision(precision);
  };

  graticule.extentMinor = function(_) {
    if (!arguments.length) return [[x0, y0], [x1, y1]];
    x0 = +_[0][0], x1 = +_[1][0];
    y0 = +_[0][1], y1 = +_[1][1];
    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
    return graticule.precision(precision);
  };

  graticule.step = function(_) {
    if (!arguments.length) return graticule.stepMinor();
    return graticule.stepMajor(_).stepMinor(_);
  };

  graticule.stepMajor = function(_) {
    if (!arguments.length) return [DX, DY];
    DX = +_[0], DY = +_[1];
    return graticule;
  };

  graticule.stepMinor = function(_) {
    if (!arguments.length) return [dx, dy];
    dx = +_[0], dy = +_[1];
    return graticule;
  };

  graticule.precision = function(_) {
    if (!arguments.length) return precision;
    precision = +_;
    x = graticuleX(y0, y1, 90);
    y = graticuleY(x0, x1, precision);
    X = graticuleX(Y0, Y1, 90);
    Y = graticuleY(X0, X1, precision);
    return graticule;
  };

  return graticule
      .extentMajor([[-180, -90 + epsilon], [180, 90 - epsilon]])
      .extentMinor([[-180, -80 - epsilon], [180, 80 + epsilon]]);
}

function graticule10() {
  return graticule()();
}

var interpolate = function(a, b) {
  var x0 = a[0] * radians,
      y0 = a[1] * radians,
      x1 = b[0] * radians,
      y1 = b[1] * radians,
      cy0 = cos(y0),
      sy0 = sin(y0),
      cy1 = cos(y1),
      sy1 = sin(y1),
      kx0 = cy0 * cos(x0),
      ky0 = cy0 * sin(x0),
      kx1 = cy1 * cos(x1),
      ky1 = cy1 * sin(x1),
      d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
      k = sin(d);

  var interpolate = d ? function(t) {
    var B = sin(t *= d) / k,
        A = sin(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      atan2(y, x) * degrees,
      atan2(z, sqrt(x * x + y * y)) * degrees
    ];
  } : function() {
    return [x0 * degrees, y0 * degrees];
  };

  interpolate.distance = d;

  return interpolate;
};

var identity = function(x) {
  return x;
};

var areaSum$1 = adder();
var areaRingSum$1 = adder();
var x00;
var y00;
var x0$1;
var y0$1;

var areaStream$1 = {
  point: noop,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: function() {
    areaStream$1.lineStart = areaRingStart$1;
    areaStream$1.lineEnd = areaRingEnd$1;
  },
  polygonEnd: function() {
    areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop;
    areaSum$1.add(abs(areaRingSum$1));
    areaRingSum$1.reset();
  },
  result: function() {
    var area = areaSum$1 / 2;
    areaSum$1.reset();
    return area;
  }
};

function areaRingStart$1() {
  areaStream$1.point = areaPointFirst$1;
}

function areaPointFirst$1(x, y) {
  areaStream$1.point = areaPoint$1;
  x00 = x0$1 = x, y00 = y0$1 = y;
}

function areaPoint$1(x, y) {
  areaRingSum$1.add(y0$1 * x - x0$1 * y);
  x0$1 = x, y0$1 = y;
}

function areaRingEnd$1() {
  areaPoint$1(x00, y00);
}

var x0$2 = Infinity;
var y0$2 = x0$2;
var x1 = -x0$2;
var y1 = x1;

var boundsStream$1 = {
  point: boundsPoint$1,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop,
  result: function() {
    var bounds = [[x0$2, y0$2], [x1, y1]];
    x1 = y1 = -(y0$2 = x0$2 = Infinity);
    return bounds;
  }
};

function boundsPoint$1(x, y) {
  if (x < x0$2) x0$2 = x;
  if (x > x1) x1 = x;
  if (y < y0$2) y0$2 = y;
  if (y > y1) y1 = y;
}

// TODO Enforce positive area for exterior, negative area for interior?

var X0$1 = 0;
var Y0$1 = 0;
var Z0$1 = 0;
var X1$1 = 0;
var Y1$1 = 0;
var Z1$1 = 0;
var X2$1 = 0;
var Y2$1 = 0;
var Z2$1 = 0;
var x00$1;
var y00$1;
var x0$3;
var y0$3;

var centroidStream$1 = {
  point: centroidPoint$1,
  lineStart: centroidLineStart$1,
  lineEnd: centroidLineEnd$1,
  polygonStart: function() {
    centroidStream$1.lineStart = centroidRingStart$1;
    centroidStream$1.lineEnd = centroidRingEnd$1;
  },
  polygonEnd: function() {
    centroidStream$1.point = centroidPoint$1;
    centroidStream$1.lineStart = centroidLineStart$1;
    centroidStream$1.lineEnd = centroidLineEnd$1;
  },
  result: function() {
    var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
        : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
        : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
        : [NaN, NaN];
    X0$1 = Y0$1 = Z0$1 =
    X1$1 = Y1$1 = Z1$1 =
    X2$1 = Y2$1 = Z2$1 = 0;
    return centroid;
  }
};

function centroidPoint$1(x, y) {
  X0$1 += x;
  Y0$1 += y;
  ++Z0$1;
}

function centroidLineStart$1() {
  centroidStream$1.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream$1.point = centroidPointLine;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidLineEnd$1() {
  centroidStream$1.point = centroidPoint$1;
}

function centroidRingStart$1() {
  centroidStream$1.point = centroidPointFirstRing;
}

function centroidRingEnd$1() {
  centroidPointRing(x00$1, y00$1);
}

function centroidPointFirstRing(x, y) {
  centroidStream$1.point = centroidPointRing;
  centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0$3,
      dy = y - y0$3,
      z = sqrt(dx * dx + dy * dy);

  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;

  z = y0$3 * x - x0$3 * y;
  X2$1 += z * (x0$3 + x);
  Y2$1 += z * (y0$3 + y);
  Z2$1 += z * 3;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, tau);
        break;
      }
    }
  },
  result: noop
};

var lengthSum$1 = adder();
var lengthRing;
var x00$2;
var y00$2;
var x0$4;
var y0$4;

var lengthStream$1 = {
  point: noop,
  lineStart: function() {
    lengthStream$1.point = lengthPointFirst$1;
  },
  lineEnd: function() {
    if (lengthRing) lengthPoint$1(x00$2, y00$2);
    lengthStream$1.point = noop;
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length = +lengthSum$1;
    lengthSum$1.reset();
    return length;
  }
};

function lengthPointFirst$1(x, y) {
  lengthStream$1.point = lengthPoint$1;
  x00$2 = x0$4 = x, y00$2 = y0$4 = y;
}

function lengthPoint$1(x, y) {
  x0$4 -= x, y0$4 -= y;
  lengthSum$1.add(sqrt(x0$4 * x0$4 + y0$4 * y0$4));
  x0$4 = x, y0$4 = y;
}

function PathString() {
  this._string = [];
}

PathString.prototype = {
  _radius: 4.5,
  _circle: circle$1(4.5),
  pointRadius: function(_) {
    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
    return this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._string.push("M", x, ",", y);
        this._point = 1;
        break;
      }
      case 1: {
        this._string.push("L", x, ",", y);
        break;
      }
      default: {
        if (this._circle == null) this._circle = circle$1(this._radius);
        this._string.push("M", x, ",", y, this._circle);
        break;
      }
    }
  },
  result: function() {
    if (this._string.length) {
      var result = this._string.join("");
      this._string = [];
      return result;
    } else {
      return null;
    }
  }
};

function circle$1(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}

var index = function(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      geoStream(object, projectionStream(contextStream));
    }
    return contextStream.result();
  }

  path.area = function(object) {
    geoStream(object, projectionStream(areaStream$1));
    return areaStream$1.result();
  };

  path.measure = function(object) {
    geoStream(object, projectionStream(lengthStream$1));
    return lengthStream$1.result();
  };

  path.bounds = function(object) {
    geoStream(object, projectionStream(boundsStream$1));
    return boundsStream$1.result();
  };

  path.centroid = function(object) {
    geoStream(object, projectionStream(centroidStream$1));
    return centroidStream$1.result();
  };

  path.projection = function(_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
};

var clip = function(pointVisible, clipLine, interpolate, start) {
  return function(rotate, sink) {
    var line = clipLine(sink),
        rotatedStart = rotate.invert(start[0], start[1]),
        ringBuffer = clipBuffer(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = d3Array.merge(segments);
        var startInside = polygonContains(polygon, rotatedStart);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      var point = rotate(lambda, phi);
      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      var point = rotate(lambda, phi);
      line.point(point[0], point[1]);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      var point = rotate(lambda, phi);
      ringSink.point(point[0], point[1]);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i, n = ringSegments.length, m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
          sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
};

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
       - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
}

var clipAntimeridian = clip(
  function() { return true; },
  clipAntimeridianLine,
  clipAntimeridianInterpolate,
  [-pi, -halfPi]
);

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? pi : -pi,
          delta = abs(lambda1 - lambda0);
      if (abs(delta - pi) < epsilon) { // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
        if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
        if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = sin(lambda0 - lambda1);
  return abs(sinLambda0Lambda1) > epsilon
      ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
          - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
      : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * halfPi;
    stream.point(-pi, phi);
    stream.point(0, phi);
    stream.point(pi, phi);
    stream.point(pi, 0);
    stream.point(pi, -phi);
    stream.point(0, -phi);
    stream.point(-pi, -phi);
    stream.point(-pi, 0);
    stream.point(-pi, phi);
  } else if (abs(from[0] - to[0]) > epsilon) {
    var lambda = from[0] < to[0] ? pi : -pi;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}

var clipCircle = function(radius, delta) {
  var cr = cos(radius),
      smallRadius = cr > 0,
      notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

  function interpolate(from, to, direction, stream) {
    circleStream(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return cos(lambda) * cos(phi) > cr;
  }

  // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.
  function clipLine(stream) {
    var point0, // previous point
        c0, // code for previous point
        v0, // visibility of previous point
        v00, // visibility of first point
        clean; // no intersections
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius
              ? v ? 0 : code(lambda, phi)
              : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart();
        // Handle degeneracies.
        // TODO ignore if not clipping polygons.
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2)) {
            point1[0] += epsilon;
            point1[1] += epsilon;
            v = visible(point1[0], point1[1]);
          }
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1]);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
            }
          }
        }
        if (v && (!point0 || !pointEqual(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  // Intersects the great circle between a and b with the clip circle.
  function intersect(a, b, two) {
    var pa = cartesian(a),
        pb = cartesian(b);

    // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
    var n1 = [1, 0, 0], // normal
        n2 = cartesianCross(pa, pb),
        n2n2 = cartesianDot(n2, n2),
        n1n2 = n2[0], // cartesianDot(n1, n2),
        determinant = n2n2 - n1n2 * n1n2;

    // Two polar points.
    if (!determinant) return !two && a;

    var c1 =  cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = cartesianCross(n1, n2),
        A = cartesianScale(n1, c1),
        B = cartesianScale(n2, c2);
    cartesianAddInPlace(A, B);

    // Solve |p(t)|^2 = 1.
    var u = n1xn2,
        w = cartesianDot(A, u),
        uu = cartesianDot(u, u),
        t2 = w * w - uu * (cartesianDot(A, A) - 1);

    if (t2 < 0) return;

    var t = sqrt(t2),
        q = cartesianScale(u, (-w - t) / uu);
    cartesianAddInPlace(q, A);
    q = spherical(q);

    if (!two) return q;

    // Two intersection points.
    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;

    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = abs(delta - pi) < epsilon,
        meridian = polar || delta < epsilon;

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

    // Check that the first point is between a and b.
    if (meridian
        ? polar
          ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
          : phi0 <= q[1] && q[1] <= phi1
        : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = cartesianScale(u, (-w + t) / uu);
      cartesianAddInPlace(q1, A);
      return [q, spherical(q1)];
    }
  }

  // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.
  function code(lambda, phi) {
    var r = smallRadius ? radius : pi - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right
    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above
    return code;
  }

  return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
};

var transform = function(methods) {
  return {
    stream: transformer(methods)
  };
};

function transformer(methods) {
  return function(stream) {
    var s = new TransformStream;
    for (var key in methods) s[key] = methods[key];
    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};

function fitExtent(projection, extent, object) {
  var w = extent[1][0] - extent[0][0],
      h = extent[1][1] - extent[0][1],
      clip = projection.clipExtent && projection.clipExtent();

  projection
      .scale(150)
      .translate([0, 0]);

  if (clip != null) projection.clipExtent(null);

  geoStream(object, projection.stream(boundsStream$1));

  var b = boundsStream$1.result(),
      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
      x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
      y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;

  if (clip != null) projection.clipExtent(clip);

  return projection
      .scale(k * 150)
      .translate([x, y]);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

var maxDepth = 16;
var cosMinDistance = cos(30 * radians); // cos(minimum angular distance)

var resample = function(project, delta2) {
  return +delta2 ? resample$1(project, delta2) : resampleNone(project);
};

function resampleNone(project) {
  return transformer({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample$1(project, delta2) {

  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = sqrt(a * a + b * b + c * c),
          phi2 = asin(c /= m),
          lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 // perpendicular projected distance
          || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }
  return function(stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
        lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = cartesian([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}

var transformRadians = transformer({
  point: function(x, y) {
    this.stream.point(x * radians, y * radians);
  }
});

function projection(project) {
  return projectionMutator(function() { return project; })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      x = 480, y = 250, // translate
      dx, dy, lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
      theta = null, preclip = clipAntimeridian, // clip angle
      x0 = null, y0, x1, y1, postclip = identity, // clip extent
      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
      cache,
      cacheStream;

  function projection(point) {
    point = projectRotate(point[0] * radians, point[1] * radians);
    return [point[0] * k + dx, dy - point[1] * k];
  }

  function invert(point) {
    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  function projectTransform(x, y) {
    return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians, 6 * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
  };

  projection.fitExtent = function(extent, object) {
    return fitExtent(projection, extent, object);
  };

  projection.fitSize = function(size, object) {
    return fitSize(projection, size, object);
  };

  function recenter() {
    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
    var center = project(lambda, phi);
    dx = x - center[0] * k;
    dy = y + center[1] * k;
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}

function conicProjection(projectAt) {
  var phi0 = 0,
      phi1 = pi / 3,
      m = projectionMutator(projectAt),
      p = m(phi0, phi1);

  p.parallels = function(_) {
    return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
  };

  return p;
}

function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = cos(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, sin(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, asin(y * cosPhi0)];
  };

  return forward;
}

function conicEqualAreaRaw(y0, y1) {
  var sy0 = sin(y0), n = (sy0 + sin(y1)) / 2;

  // Are the parallels symmetrical around the Equator?
  if (abs(n) < epsilon) return cylindricalEqualAreaRaw(y0);

  var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;

  function project(x, y) {
    var r = sqrt(c - 2 * n * sin(y)) / n;
    return [r * sin(x *= n), r0 - r * cos(x)];
  }

  project.invert = function(x, y) {
    var r0y = r0 - y;
    return [atan2(x, abs(r0y)) / n * sign(r0y), asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

var conicEqualArea = function() {
  return conicProjection(conicEqualAreaRaw)
      .scale(155.424)
      .center([0, 33.6442]);
};

var albers = function() {
  return conicEqualArea()
      .parallels([29.5, 45.5])
      .scale(1070)
      .translate([480, 250])
      .rotate([96, 0])
      .center([-0.6, 38.7]);
};

// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
  };
}

// A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
var albersUsa = function() {
  var cache,
      cacheStream,
      lower48 = albers(), lower48Point,
      alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
      hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
      point, pointStream = {point: function(x, y) { point = [x, y]; }};

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (lower48Point.point(x, y), point)
        || (alaskaPoint.point(x, y), point)
        || (hawaiiPoint.point(x, y), point);
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
        : lower48).invert(coordinates);
  };

  albersUsa.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
        .stream(pointStream);

    alaskaPoint = alaska
        .translate([x - 0.307 * k, y + 0.201 * k])
        .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    hawaiiPoint = hawaii
        .translate([x - 0.205 * k, y + 0.212 * k])
        .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  albersUsa.fitExtent = function(extent, object) {
    return fitExtent(albersUsa, extent, object);
  };

  albersUsa.fitSize = function(size, object) {
    return fitSize(albersUsa, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }

  return albersUsa.scale(1070);
};

function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = cos(x),
        cy = cos(y),
        k = scale(cx * cy);
    return [
      k * cy * sin(x),
      k * sin(y)
    ];
  }
}

function azimuthalInvert(angle) {
  return function(x, y) {
    var z = sqrt(x * x + y * y),
        c = angle(z),
        sc = sin(c),
        cc = cos(c);
    return [
      atan2(x * sc, z * cc),
      asin(z && y * sc / z)
    ];
  }
}

var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
  return sqrt(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
  return 2 * asin(z / 2);
});

var azimuthalEqualArea = function() {
  return projection(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
};

var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
  return (c = acos(c)) && c / sin(c);
});

azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
  return z;
});

var azimuthalEquidistant = function() {
  return projection(azimuthalEquidistantRaw)
      .scale(79.4188)
      .clipAngle(180 - 1e-3);
};

function mercatorRaw(lambda, phi) {
  return [lambda, log(tan((halfPi + phi) / 2))];
}

mercatorRaw.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi];
};

var mercator = function() {
  return mercatorProjection(mercatorRaw)
      .scale(961 / tau);
};

function mercatorProjection(project) {
  var m = projection(project),
      center = m.center,
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null, y0, x1, y1; // clip extent

  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.center = function(_) {
    return arguments.length ? (center(_), reclip()) : center();
  };

  m.clipExtent = function(_) {
    return arguments.length ? ((_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  function reclip() {
    var k = pi * scale(),
        t = m(rotation(m.rotate()).invert([0, 0]));
    return clipExtent(x0 == null
        ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw
        ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]
        : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
  }

  return reclip();
}

function tany(y) {
  return tan((halfPi + y) / 2);
}

function conicConformalRaw(y0, y1) {
  var cy0 = cos(y0),
      n = y0 === y1 ? sin(y0) : log(cy0 / cos(y1)) / log(tany(y1) / tany(y0)),
      f = cy0 * pow(tany(y0), n) / n;

  if (!n) return mercatorRaw;

  function project(x, y) {
    if (f > 0) { if (y < -halfPi + epsilon) y = -halfPi + epsilon; }
    else { if (y > halfPi - epsilon) y = halfPi - epsilon; }
    var r = f / pow(tany(y), n);
    return [r * sin(n * x), f - r * cos(n * x)];
  }

  project.invert = function(x, y) {
    var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy);
    return [atan2(x, abs(fy)) / n * sign(fy), 2 * atan(pow(f / r, 1 / n)) - halfPi];
  };

  return project;
}

var conicConformal = function() {
  return conicProjection(conicConformalRaw)
      .scale(109.5)
      .parallels([30, 30]);
};

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

equirectangularRaw.invert = equirectangularRaw;

var equirectangular = function() {
  return projection(equirectangularRaw)
      .scale(152.63);
};

function conicEquidistantRaw(y0, y1) {
  var cy0 = cos(y0),
      n = y0 === y1 ? sin(y0) : (cy0 - cos(y1)) / (y1 - y0),
      g = cy0 / n + y0;

  if (abs(n) < epsilon) return equirectangularRaw;

  function project(x, y) {
    var gy = g - y, nx = n * x;
    return [gy * sin(nx), g - gy * cos(nx)];
  }

  project.invert = function(x, y) {
    var gy = g - y;
    return [atan2(x, abs(gy)) / n * sign(gy), g - sign(n) * sqrt(x * x + gy * gy)];
  };

  return project;
}

var conicEquidistant = function() {
  return conicProjection(conicEquidistantRaw)
      .scale(131.154)
      .center([0, 13.9389]);
};

function gnomonicRaw(x, y) {
  var cy = cos(y), k = cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}

gnomonicRaw.invert = azimuthalInvert(atan);

var gnomonic = function() {
  return projection(gnomonicRaw)
      .scale(144.049)
      .clipAngle(60);
};

function scaleTranslate(kx, ky, tx, ty) {
  return kx === 1 && ky === 1 && tx === 0 && ty === 0 ? identity : transformer({
    point: function(x, y) {
      this.stream.point(x * kx + tx, y * ky + ty);
    }
  });
}

var identity$1 = function() {
  var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, transform = identity, // scale, translate and reflect
      x0 = null, y0, x1, y1, clip = identity, // clip extent
      cache,
      cacheStream,
      projection;

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return projection = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = transform(clip(cacheStream = stream));
    },
    clipExtent: function(_) {
      return arguments.length ? (clip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    },
    scale: function(_) {
      return arguments.length ? (transform = scaleTranslate((k = +_) * sx, k * sy, tx, ty), reset()) : k;
    },
    translate: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * sx, k * sy, tx = +_[0], ty = +_[1]), reset()) : [tx, ty];
    },
    reflectX: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * (sx = _ ? -1 : 1), k * sy, tx, ty), reset()) : sx < 0;
    },
    reflectY: function(_) {
      return arguments.length ? (transform = scaleTranslate(k * sx, k * (sy = _ ? -1 : 1), tx, ty), reset()) : sy < 0;
    },
    fitExtent: function(extent, object) {
      return fitExtent(projection, extent, object);
    },
    fitSize: function(size, object) {
      return fitSize(projection, size, object);
    }
  };
};

function orthographicRaw(x, y) {
  return [cos(y) * sin(x), sin(y)];
}

orthographicRaw.invert = azimuthalInvert(asin);

var orthographic = function() {
  return projection(orthographicRaw)
      .scale(249.5)
      .clipAngle(90 + epsilon);
};

function stereographicRaw(x, y) {
  var cy = cos(y), k = 1 + cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}

stereographicRaw.invert = azimuthalInvert(function(z) {
  return 2 * atan(z);
});

var stereographic = function() {
  return projection(stereographicRaw)
      .scale(250)
      .clipAngle(142);
};

function transverseMercatorRaw(lambda, phi) {
  return [log(tan((halfPi + phi) / 2)), -lambda];
}

transverseMercatorRaw.invert = function(x, y) {
  return [-y, 2 * atan(exp(x)) - halfPi];
};

var transverseMercator = function() {
  var m = mercatorProjection(transverseMercatorRaw),
      center = m.center,
      rotate = m.rotate;

  m.center = function(_) {
    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
  };

  m.rotate = function(_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };

  return rotate([0, 0, 90])
      .scale(159.155);
};

exports.geoArea = area;
exports.geoBounds = bounds;
exports.geoCentroid = centroid;
exports.geoCircle = circle;
exports.geoClipExtent = extent;
exports.geoContains = contains;
exports.geoDistance = distance;
exports.geoGraticule = graticule;
exports.geoGraticule10 = graticule10;
exports.geoInterpolate = interpolate;
exports.geoLength = length;
exports.geoPath = index;
exports.geoAlbers = albers;
exports.geoAlbersUsa = albersUsa;
exports.geoAzimuthalEqualArea = azimuthalEqualArea;
exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
exports.geoAzimuthalEquidistant = azimuthalEquidistant;
exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
exports.geoConicConformal = conicConformal;
exports.geoConicConformalRaw = conicConformalRaw;
exports.geoConicEqualArea = conicEqualArea;
exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
exports.geoConicEquidistant = conicEquidistant;
exports.geoConicEquidistantRaw = conicEquidistantRaw;
exports.geoEquirectangular = equirectangular;
exports.geoEquirectangularRaw = equirectangularRaw;
exports.geoGnomonic = gnomonic;
exports.geoGnomonicRaw = gnomonicRaw;
exports.geoIdentity = identity$1;
exports.geoProjection = projection;
exports.geoProjectionMutator = projectionMutator;
exports.geoMercator = mercator;
exports.geoMercatorRaw = mercatorRaw;
exports.geoOrthographic = orthographic;
exports.geoOrthographicRaw = orthographicRaw;
exports.geoStereographic = stereographic;
exports.geoStereographicRaw = stereographicRaw;
exports.geoTransverseMercator = transverseMercator;
exports.geoTransverseMercatorRaw = transverseMercatorRaw;
exports.geoRotation = rotation;
exports.geoStream = geoStream;
exports.geoTransform = transform;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-array":1}],8:[function(require,module,exports){
// https://d3js.org/d3-interpolate/ Version 1.1.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-color')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Color) { 'use strict';

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

var basis$1 = function(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
};

var basisClosed = function(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
};

var constant = function(x) {
  return function() {
    return x;
  };
};

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

var rgb$1 = ((function rgbGamma(y) {
  var color$$1 = gamma(y);

  function rgb$$1(start, end) {
    var r = color$$1((start = d3Color.rgb(start)).r, (end = d3Color.rgb(end)).r),
        g = color$$1(start.g, end.g),
        b = color$$1(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$$1.gamma = rgbGamma;

  return rgb$$1;
}))(1);

function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i, color$$1;
    for (i = 0; i < n; ++i) {
      color$$1 = d3Color.rgb(colors[i]);
      r[i] = color$$1.r || 0;
      g[i] = color$$1.g || 0;
      b[i] = color$$1.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color$$1.opacity = 1;
    return function(t) {
      color$$1.r = r(t);
      color$$1.g = g(t);
      color$$1.b = b(t);
      return color$$1 + "";
    };
  };
}

var rgbBasis = rgbSpline(basis$1);
var rgbBasisClosed = rgbSpline(basisClosed);

var array = function(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(nb),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
};

var date = function(a, b) {
  var d = new Date;
  return a = +a, b -= a, function(t) {
    return d.setTime(a + b * t), d;
  };
};

var number = function(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
};

var object = function(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

var string = function(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: number(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
};

var value = function(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant(b)
      : (t === "number" ? number
      : t === "string" ? ((c = d3Color.color(b)) ? (b = c, rgb$1) : string)
      : b instanceof d3Color.color ? rgb$1
      : b instanceof Date ? date
      : Array.isArray(b) ? array
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
      : number)(a, b);
};

var round = function(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

var decompose = function(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
};

var cssNode;
var cssRoot;
var cssView;
var svgNode;

function parseCss(value) {
  if (value === "none") return identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var rho = Math.SQRT2;
var rho2 = 2;
var rho4 = 4;
var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]
var zoom = function(p0, p1) {
  var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
      ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S;

  // Special case for u0 ≅ u1.
  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;
    i = function(t) {
      return [
        ux0 + t * dx,
        uy0 + t * dy,
        w0 * Math.exp(rho * t * S)
      ];
    };
  }

  // General case.
  else {
    var d1 = Math.sqrt(d2),
        b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
        b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
        r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
        r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / rho;
    i = function(t) {
      var s = t * S,
          coshr0 = cosh(r0),
          u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
      return [
        ux0 + u * dx,
        uy0 + u * dy,
        w0 * coshr0 / cosh(rho * s + r0)
      ];
    };
  }

  i.duration = S * 1000;

  return i;
};

function hsl$1(hue$$1) {
  return function(start, end) {
    var h = hue$$1((start = d3Color.hsl(start)).h, (end = d3Color.hsl(end)).h),
        s = nogamma(start.s, end.s),
        l = nogamma(start.l, end.l),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

var hsl$2 = hsl$1(hue);
var hslLong = hsl$1(nogamma);

function lab$1(start, end) {
  var l = nogamma((start = d3Color.lab(start)).l, (end = d3Color.lab(end)).l),
      a = nogamma(start.a, end.a),
      b = nogamma(start.b, end.b),
      opacity = nogamma(start.opacity, end.opacity);
  return function(t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}

function hcl$1(hue$$1) {
  return function(start, end) {
    var h = hue$$1((start = d3Color.hcl(start)).h, (end = d3Color.hcl(end)).h),
        c = nogamma(start.c, end.c),
        l = nogamma(start.l, end.l),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
}

var hcl$2 = hcl$1(hue);
var hclLong = hcl$1(nogamma);

function cubehelix$1(hue$$1) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = d3Color.cubehelix(start)).h, (end = d3Color.cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  })(1);
}

var cubehelix$2 = cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var quantize = function(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
  return samples;
};

exports.interpolate = value;
exports.interpolateArray = array;
exports.interpolateBasis = basis$1;
exports.interpolateBasisClosed = basisClosed;
exports.interpolateDate = date;
exports.interpolateNumber = number;
exports.interpolateObject = object;
exports.interpolateRound = round;
exports.interpolateString = string;
exports.interpolateTransformCss = interpolateTransformCss;
exports.interpolateTransformSvg = interpolateTransformSvg;
exports.interpolateZoom = zoom;
exports.interpolateRgb = rgb$1;
exports.interpolateRgbBasis = rgbBasis;
exports.interpolateRgbBasisClosed = rgbBasisClosed;
exports.interpolateHsl = hsl$2;
exports.interpolateHslLong = hslLong;
exports.interpolateLab = lab$1;
exports.interpolateHcl = hcl$2;
exports.interpolateHclLong = hclLong;
exports.interpolateCubehelix = cubehelix$2;
exports.interpolateCubehelixLong = cubehelixLong;
exports.quantize = quantize;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-color":3}],9:[function(require,module,exports){
// https://d3js.org/d3-path/ Version 1.0.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon)) {}

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

exports.path = path;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],10:[function(require,module,exports){
// https://d3js.org/d3-request/ Version 1.0.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-collection'), require('d3-dispatch'), require('d3-dsv')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-collection', 'd3-dispatch', 'd3-dsv'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3));
}(this, (function (exports,d3Collection,d3Dispatch,d3Dsv) { 'use strict';

var request = function(url, callback) {
  var request,
      event = d3Dispatch.dispatch("beforesend", "progress", "load", "error"),
      mimeType,
      headers = d3Collection.map(),
      xhr = new XMLHttpRequest,
      user = null,
      password = null,
      response,
      responseType,
      timeout = 0;

  // If IE does not support CORS, use XDomainRequest.
  if (typeof XDomainRequest !== "undefined"
      && !("withCredentials" in xhr)
      && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

  "onload" in xhr
      ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
      : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

  function respond(o) {
    var status = xhr.status, result;
    if (!status && hasResponse(xhr)
        || status >= 200 && status < 300
        || status === 304) {
      if (response) {
        try {
          result = response.call(request, xhr);
        } catch (e) {
          event.call("error", request, e);
          return;
        }
      } else {
        result = xhr;
      }
      event.call("load", request, result);
    } else {
      event.call("error", request, o);
    }
  }

  xhr.onprogress = function(e) {
    event.call("progress", request, e);
  };

  request = {
    header: function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers.get(name);
      if (value == null) headers.remove(name);
      else headers.set(name, value + "");
      return request;
    },

    // If mimeType is non-null and no Accept header is set, a default is used.
    mimeType: function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return request;
    },

    // Specifies what type the response value should take;
    // for instance, arraybuffer, blob, document, or text.
    responseType: function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return request;
    },

    timeout: function(value) {
      if (!arguments.length) return timeout;
      timeout = +value;
      return request;
    },

    user: function(value) {
      return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
    },

    password: function(value) {
      return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
    },

    // Specify how to convert the response content to a specific type;
    // changes the callback value on "load" events.
    response: function(value) {
      response = value;
      return request;
    },

    // Alias for send("GET", …).
    get: function(data, callback) {
      return request.send("GET", data, callback);
    },

    // Alias for send("POST", …).
    post: function(data, callback) {
      return request.send("POST", data, callback);
    },

    // If callback is non-null, it will be used for error and load events.
    send: function(method, data, callback) {
      xhr.open(method, url, true, user, password);
      if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
      if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
      if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
      if (responseType != null) xhr.responseType = responseType;
      if (timeout > 0) xhr.timeout = timeout;
      if (callback == null && typeof data === "function") callback = data, data = null;
      if (callback != null && callback.length === 1) callback = fixCallback(callback);
      if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
      event.call("beforesend", request, xhr);
      xhr.send(data == null ? null : data);
      return request;
    },

    abort: function() {
      xhr.abort();
      return request;
    },

    on: function() {
      var value = event.on.apply(event, arguments);
      return value === event ? request : value;
    }
  };

  if (callback != null) {
    if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
    return request.get(callback);
  }

  return request;
};

function fixCallback(callback) {
  return function(error, xhr) {
    callback(error == null ? xhr : null);
  };
}

function hasResponse(xhr) {
  var type = xhr.responseType;
  return type && type !== "text"
      ? xhr.response // null on error
      : xhr.responseText; // "" on error
}

var type = function(defaultMimeType, response) {
  return function(url, callback) {
    var r = request(url).mimeType(defaultMimeType).response(response);
    if (callback != null) {
      if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
      return r.get(callback);
    }
    return r;
  };
};

var html = type("text/html", function(xhr) {
  return document.createRange().createContextualFragment(xhr.responseText);
});

var json = type("application/json", function(xhr) {
  return JSON.parse(xhr.responseText);
});

var text = type("text/plain", function(xhr) {
  return xhr.responseText;
});

var xml = type("application/xml", function(xhr) {
  var xml = xhr.responseXML;
  if (!xml) throw new Error("parse error");
  return xml;
});

var dsv = function(defaultMimeType, parse) {
  return function(url, row, callback) {
    if (arguments.length < 3) callback = row, row = null;
    var r = request(url).mimeType(defaultMimeType);
    r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
    r.row(row);
    return callback ? r.get(callback) : r;
  };
};

function responseOf(parse, row) {
  return function(request$$1) {
    return parse(request$$1.responseText, row);
  };
}

var csv = dsv("text/csv", d3Dsv.csvParse);

var tsv = dsv("text/tab-separated-values", d3Dsv.tsvParse);

exports.request = request;
exports.html = html;
exports.json = json;
exports.text = text;
exports.xml = xml;
exports.csv = csv;
exports.tsv = tsv;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-collection":2,"d3-dispatch":4,"d3-dsv":5}],11:[function(require,module,exports){
// https://d3js.org/d3-scale/ Version 1.0.6. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-collection'), require('d3-interpolate'), require('d3-format'), require('d3-time'), require('d3-time-format'), require('d3-color')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-collection', 'd3-interpolate', 'd3-format', 'd3-time', 'd3-time-format', 'd3-color'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Array,d3Collection,d3Interpolate,d3Format,d3Time,d3TimeFormat,d3Color) { 'use strict';

var array = Array.prototype;

var map$1 = array.map;
var slice = array.slice;

var implicit = {name: "implicit"};

function ordinal(range$$1) {
  var index = d3Collection.map(),
      domain = [],
      unknown = implicit;

  range$$1 = range$$1 == null ? [] : slice.call(range$$1);

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }
    return range$$1[(i - 1) % range$$1.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = d3Collection.map();
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice.call(_), scale) : range$$1.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal()
        .domain(domain)
        .range(range$$1)
        .unknown(unknown);
  };

  return scale;
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range$$1 = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range$$1[1] < range$$1[0],
        start = range$$1[reverse - 0],
        stop = range$$1[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = d3Array.range(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
  };

  scale.rangeRound = function(_) {
    return range$$1 = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band()
        .domain(domain())
        .range(range$$1)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return rescale();
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band().paddingInner(1));
}

var constant = function(x) {
  return function() {
    return x;
  };
};

var number = function(x) {
  return +x;
};

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant(b);
}

function deinterpolateClamp(deinterpolate) {
  return function(a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
  };
}

function reinterpolateClamp(reinterpolate) {
  return function(a, b) {
    var r = reinterpolate(a = +a, b = +b);
    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
  };
}

function bimap(domain, range$$1, deinterpolate, reinterpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range$$1, deinterpolate, reinterpolate) {
  var j = Math.min(domain.length, range$$1.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range$$1 = range$$1.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
  }

  return function(x) {
    var i = d3Array.bisect(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate) {
  var domain = unit,
      range$$1 = unit,
      interpolate$$1 = d3Interpolate.interpolate,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function(y) {
    return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = map$1.call(_, number), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice.call(_), rescale()) : range$$1.slice();
  };

  scale.rangeRound = function(_) {
    return range$$1 = slice.call(_), interpolate$$1 = d3Interpolate.interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
  };

  return rescale();
}

var tickFormat = function(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = d3Array.tickStep(start, stop, count == null ? 10 : count),
      precision;
  specifier = d3Format.formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = d3Format.precisionPrefix(step, value))) specifier.precision = precision;
      return d3Format.formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = d3Format.precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = d3Format.precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return d3Format.format(specifier);
};

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return d3Array.ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = d3Array.tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = d3Array.tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = d3Array.tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = continuous(deinterpolateLinear, d3Interpolate.interpolateNumber);

  scale.copy = function() {
    return copy(scale, linear());
  };

  return linearish(scale);
}

function identity() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map$1.call(_, number), scale) : domain.slice();
  };

  scale.copy = function() {
    return identity().domain(domain);
  };

  return linearish(scale);
}

var nice = function(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
};

function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : constant(b);
}

function reinterpolate(a, b) {
  return a < 0
      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function log() {
  var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = d3Array.ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = d3Format.format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  scale.copy = function() {
    return copy(scale, log().base(base));
  };

  return scale;
}

function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow() {
  var exponent = 1,
      scale = continuous(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise(b, exponent) - (a = raise(a, exponent)))
        ? function(x) { return (raise(x, exponent) - a) / b; }
        : constant(b);
  }

  function reinterpolate(a, b) {
    b = raise(b, exponent) - (a = raise(a, exponent));
    return function(t) { return raise(a + b * t, 1 / exponent); };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return linearish(scale);
}

function sqrt() {
  return pow().exponent(0.5);
}

function quantile$1() {
  var domain = [],
      range$$1 = [],
      thresholds = [];

  function rescale() {
    var i = 0, n = Math.max(1, range$$1.length);
    thresholds = new Array(n - 1);
    while (++i < n) thresholds[i - 1] = d3Array.quantile(domain, i / n);
    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range$$1[d3Array.bisect(thresholds, x)];
  }

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return i < 0 ? [NaN, NaN] : [
      i > 0 ? thresholds[i - 1] : domain[0],
      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
    ];
  };

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
    domain.sort(d3Array.ascending);
    return rescale();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice.call(_), rescale()) : range$$1.slice();
  };

  scale.quantiles = function() {
    return thresholds.slice();
  };

  scale.copy = function() {
    return quantile$1()
        .domain(domain)
        .range(range$$1);
  };

  return scale;
}

function quantize() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range$$1 = [0, 1];

  function scale(x) {
    if (x <= x) return range$$1[d3Array.bisect(domain, x, 0, n)];
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);
    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
    return scale;
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function(_) {
    return arguments.length ? (n = (range$$1 = slice.call(_)).length - 1, rescale()) : range$$1.slice();
  };

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return i < 0 ? [NaN, NaN]
        : i < 1 ? [x0, domain[0]]
        : i >= n ? [domain[n - 1], x1]
        : [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return quantize()
        .domain([x0, x1])
        .range(range$$1);
  };

  return linearish(scale);
}

function threshold() {
  var domain = [0.5],
      range$$1 = [0, 1],
      n = 1;

  function scale(x) {
    if (x <= x) return range$$1[d3Array.bisect(domain, x, 0, n)];
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = slice.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : range$$1.slice();
  };

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return threshold()
        .domain(domain)
        .range(range$$1);
  };

  return scale;
}

var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number$1(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format$$1) {
  var scale = continuous(deinterpolateLinear, d3Interpolate.interpolateNumber),
      invert = scale.invert,
      domain = scale.domain;

  var formatMillisecond = format$$1(".%L"),
      formatSecond = format$$1(":%S"),
      formatMinute = format$$1("%I:%M"),
      formatHour = format$$1("%I %p"),
      formatDay = format$$1("%a %d"),
      formatWeek = format$$1("%b %d"),
      formatMonth = format$$1("%B"),
      formatYear = format$$1("%Y");

  var tickIntervals = [
    [second,  1,      durationSecond],
    [second,  5,  5 * durationSecond],
    [second, 15, 15 * durationSecond],
    [second, 30, 30 * durationSecond],
    [minute,  1,      durationMinute],
    [minute,  5,  5 * durationMinute],
    [minute, 15, 15 * durationMinute],
    [minute, 30, 30 * durationMinute],
    [  hour,  1,      durationHour  ],
    [  hour,  3,  3 * durationHour  ],
    [  hour,  6,  6 * durationHour  ],
    [  hour, 12, 12 * durationHour  ],
    [   day,  1,      durationDay   ],
    [   day,  2,  2 * durationDay   ],
    [  week,  1,      durationWeek  ],
    [ month,  1,      durationMonth ],
    [ month,  3,  3 * durationMonth ],
    [  year,  1,      durationYear  ]
  ];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = d3Array.bisector(function(i) { return i[2]; }).right(tickIntervals, target);
      if (i === tickIntervals.length) {
        step = d3Array.tickStep(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = d3Array.tickStep(start, stop, interval);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(map$1.call(_, number$1)) : domain().map(date);
  };

  scale.ticks = function(interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
    return r ? t.reverse() : t;
  };

  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat : format$$1(specifier);
  };

  scale.nice = function(interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
        ? domain(nice(d, interval))
        : scale;
  };

  scale.copy = function() {
    return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format$$1));
  };

  return scale;
}

var time = function() {
  return calendar(d3Time.timeYear, d3Time.timeMonth, d3Time.timeWeek, d3Time.timeDay, d3Time.timeHour, d3Time.timeMinute, d3Time.timeSecond, d3Time.timeMillisecond, d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};

var utcTime = function() {
  return calendar(d3Time.utcYear, d3Time.utcMonth, d3Time.utcWeek, d3Time.utcDay, d3Time.utcHour, d3Time.utcMinute, d3Time.utcSecond, d3Time.utcMillisecond, d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
};

var colors = function(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
};

var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

var cubehelix$1 = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(300, 0.5, 0.0), d3Color.cubehelix(-240, 0.5, 1.0));

var warm = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(-100, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

var cool = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(260, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

var rainbow = d3Color.cubehelix();

var rainbow$1 = function(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  rainbow.h = 360 * t - 100;
  rainbow.s = 1.5 - 1.5 * ts;
  rainbow.l = 0.8 - 0.9 * ts;
  return rainbow + "";
};

function ramp(range$$1) {
  var n = range$$1.length;
  return function(t) {
    return range$$1[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function() {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return linearish(scale);
}

exports.scaleBand = band;
exports.scalePoint = point;
exports.scaleIdentity = identity;
exports.scaleLinear = linear;
exports.scaleLog = log;
exports.scaleOrdinal = ordinal;
exports.scaleImplicit = implicit;
exports.scalePow = pow;
exports.scaleSqrt = sqrt;
exports.scaleQuantile = quantile$1;
exports.scaleQuantize = quantize;
exports.scaleThreshold = threshold;
exports.scaleTime = time;
exports.scaleUtc = utcTime;
exports.schemeCategory10 = category10;
exports.schemeCategory20b = category20b;
exports.schemeCategory20c = category20c;
exports.schemeCategory20 = category20;
exports.interpolateCubehelixDefault = cubehelix$1;
exports.interpolateRainbow = rainbow$1;
exports.interpolateWarm = warm;
exports.interpolateCool = cool;
exports.interpolateViridis = viridis;
exports.interpolateMagma = magma;
exports.interpolateInferno = inferno;
exports.interpolatePlasma = plasma;
exports.scaleSequential = sequential;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-array":1,"d3-collection":2,"d3-color":3,"d3-format":6,"d3-interpolate":8,"d3-time":14,"d3-time-format":13}],12:[function(require,module,exports){
// https://d3js.org/d3-selection/ Version 1.1.0. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
};

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

var creator = function(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
};

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

var matcher = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector
        || element.msMatchesSelector
        || element.mozMatchesSelector
        || element.oMatchesSelector;
    matcher = function(selector) {
      return function() {
        return vendorMatches.call(this, selector);
      };
    };
  }
}

var matcher$1 = matcher;

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element$1 = document.documentElement;
  if (!("onmouseenter" in element$1)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

var selection_on = function(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
};

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

var sourceEvent = function() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
};

var point = function(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
};

var mouse = function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

function none() {}

var selector = function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
};

var selection_select = function(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

function empty() {
  return [];
}

var selectorAll = function(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
};

var selection_filter = function(match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function(update) {
  return new Array(update.length);
};

var selection_enter = function() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

var constant = function(x) {
  return function() {
    return x;
  };
};

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

var selection_data = function(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
};

var selection_exit = function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_merge = function(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
};

var selection_order = function() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
};

var selection_node = function() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
};

var selection_empty = function() {
  return !this.node();
};

var selection_each = function(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

var selection_attr = function(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
};

var defaultView = function(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
};

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

var selection_style = function(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
};

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

var selection_property = function(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
};

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

var selection_classed = function(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
};

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

var selection_text = function(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
};

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

var selection_html = function(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
};

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function() {
  return this.each(raise);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function() {
  return this.each(lower);
};

var selection_append = function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function() {
  return this.each(remove);
};

var selection_datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
};

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

var selection_dispatch = function(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
};

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
};

var selectAll = function(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
};

var touch = function(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
};

var touches = function(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
};

exports.creator = creator;
exports.local = local;
exports.matcher = matcher$1;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.style = styleValue;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;
exports.customEvent = customEvent;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],13:[function(require,module,exports){
// https://d3js.org/d3-time-format/ Version 2.0.5. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-time')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-time'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Time) { 'use strict';

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "S": formatSeconds,
    "U": formatWeekNumberSunday,
    "w": formatWeekdayNumber,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "S": formatUTCSeconds,
    "U": formatUTCWeekNumberSunday,
    "w": formatUTCWeekdayNumber,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "S": parseSeconds,
    "U": parseWeekNumberSunday,
    "w": parseWeekdayNumber,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function(string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0);
      if (i != string.length) return null;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
        var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"};
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {}, i = -1, n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + d3Time.timeDay.count(d3Time.timeYear(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekNumberSunday(d, p) {
  return pad(d3Time.timeSunday.count(d3Time.timeYear(d), d), p, 2);
}

function formatWeekdayNumber(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(d3Time.timeMonday.count(d3Time.timeYear(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + d3Time.utcDay.count(d3Time.utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(d3Time.utcSunday.count(d3Time.utcYear(d), d), p, 2);
}

function formatUTCWeekdayNumber(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(d3Time.utcMonday.count(d3Time.utcYear(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

var locale$1;





defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale$1 = formatLocale(definition);
  exports.timeFormat = locale$1.format;
  exports.timeParse = locale$1.parse;
  exports.utcFormat = locale$1.utcFormat;
  exports.utcParse = locale$1.utcParse;
  return locale$1;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : exports.utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : exports.utcParse(isoSpecifier);

exports.timeFormatDefaultLocale = defaultLocale;
exports.timeFormatLocale = formatLocale;
exports.isoFormat = formatIso;
exports.isoParse = parseIso;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-time":14}],14:[function(require,module,exports){
// https://d3js.org/d3-time/ Version 1.0.7. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var t0 = new Date;
var t1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [];
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}

var millisecond = newInterval(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

var milliseconds = millisecond.range;

var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;

var second = newInterval(function(date) {
  date.setTime(Math.floor(date / durationSecond) * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});

var seconds = second.range;

var minute = newInterval(function(date) {
  date.setTime(Math.floor(date / durationMinute) * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});

var minutes = minute.range;

var hour = newInterval(function(date) {
  var offset = date.getTimezoneOffset() * durationMinute % durationHour;
  if (offset < 0) offset += durationHour;
  date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});

var hours = hour.range;

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});

var days = day.range;

function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;

var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

var months = month.range;

var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var years = year.range;

var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});

var utcMinutes = utcMinute.range;

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});

var utcHours = utcHour.range;

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay;
}, function(date) {
  return date.getUTCDate() - 1;
});

var utcDays = utcDay.range;

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;

var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

var utcMonths = utcMonth.range;

var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

var utcYears = utcYear.range;

exports.timeInterval = newInterval;
exports.timeMillisecond = millisecond;
exports.timeMilliseconds = milliseconds;
exports.utcMillisecond = millisecond;
exports.utcMilliseconds = milliseconds;
exports.timeSecond = second;
exports.timeSeconds = seconds;
exports.utcSecond = second;
exports.utcSeconds = seconds;
exports.timeMinute = minute;
exports.timeMinutes = minutes;
exports.timeHour = hour;
exports.timeHours = hours;
exports.timeDay = day;
exports.timeDays = days;
exports.timeWeek = sunday;
exports.timeWeeks = sundays;
exports.timeSunday = sunday;
exports.timeSundays = sundays;
exports.timeMonday = monday;
exports.timeMondays = mondays;
exports.timeTuesday = tuesday;
exports.timeTuesdays = tuesdays;
exports.timeWednesday = wednesday;
exports.timeWednesdays = wednesdays;
exports.timeThursday = thursday;
exports.timeThursdays = thursdays;
exports.timeFriday = friday;
exports.timeFridays = fridays;
exports.timeSaturday = saturday;
exports.timeSaturdays = saturdays;
exports.timeMonth = month;
exports.timeMonths = months;
exports.timeYear = year;
exports.timeYears = years;
exports.utcMinute = utcMinute;
exports.utcMinutes = utcMinutes;
exports.utcHour = utcHour;
exports.utcHours = utcHours;
exports.utcDay = utcDay;
exports.utcDays = utcDays;
exports.utcWeek = utcSunday;
exports.utcWeeks = utcSundays;
exports.utcSunday = utcSunday;
exports.utcSundays = utcSundays;
exports.utcMonday = utcMonday;
exports.utcMondays = utcMondays;
exports.utcTuesday = utcTuesday;
exports.utcTuesdays = utcTuesdays;
exports.utcWednesday = utcWednesday;
exports.utcWednesdays = utcWednesdays;
exports.utcThursday = utcThursday;
exports.utcThursdays = utcThursdays;
exports.utcFriday = utcFriday;
exports.utcFridays = utcFridays;
exports.utcSaturday = utcSaturday;
exports.utcSaturdays = utcSaturdays;
exports.utcMonth = utcMonth;
exports.utcMonths = utcMonths;
exports.utcYear = utcYear;
exports.utcYears = utcYears;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
var data = exports.data = {
   "features": [{
      "geometry": {
         "coordinates": [-119.2066, 40.7866],
         "type": "Point"
      },
      "properties": {
         "artPlazaDistanceFt": 4380.0,
         "artPlazaRadiusFt": 250.0,
         "brc": "city",
         "centerCampDistanceFt": 2907.0,
         "centerCampPlazaRadiusFt": 330.0,
         "civicPlazaDistanceFt": 3180.0,
         "civicPlazaRadiusFt": 250.0,
         "esplanadeRadiusFt": 2500.0,
         "esplanadeWidthFt": 40.0,
         "northSouthAxisHour": 4,
         "northSouthAxisMinute": 30,
         "pentagonPointsDistanceFt": 8175.0,
         "promenandeWidthFt": 40.0,
         "publicPlaza3DistanceFt": 4380.0,
         "publicPlaza6DistanceFt": 4680.0,
         "publicPlaza9DistanceFt": 4380.0,
         "publicPlazaRadiusFt": 250.0,
         "regularStreetWidthFt": 40.0,
         "rodsRoadRadiusFt": 750.0,
         "rodsRoadWidthFt": 40.0,
         "streetNames": ["Awe", "Breath", "Ceremony", "Dance", "Eulogy", "Fire", "Genuflect", "Hallowed", "Inspirit", "Juju", "Kundalini", "Lustrate"],
         "streetRadiusesFt": [2940.0, 3180.0, 3420.0, 3660.0, 3900.0, 4140.0, 4380.0, 4620.0, 4860.0, 5100.0, 5340.0, 5585.0],
         "year": 2017
      },
      "type": "Feature"
   }, {
      "type": "Feature",
      "geometry": null,
      "id": "discofish",
      "properties": {
         "vehicle": "artcar",
         "name": "Disco Fish",
         "description": "DiscoFish is an art car that takes inspiration from the angler fish. Converted from a 21 person, double-decker bus, DiscoFish offers a complete pro-audio sound system, front stage, 30″ illuminated disco ball, and fold down padded fins for guest seating. Come inside the fish to grab a drink at the installed full bar, or climb up to the second level, hang with the DJ, chill and take it all in. This awesome machine is covered with 3000 LEDs that are individually lit and computer controlled to have patterns or messages ripple over the fish. ",
         "tracker": "aprs/discof"
      }
   }],
   "type": "FeatureCollection"
};

},{}],16:[function(require,module,exports){
'use strict';

var _mapdata = require('./mapdata');

var _mapwidget = require('./mapwidget');

var _mapwidget2 = _interopRequireDefault(_mapwidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window) {
    window.brcmap = { Map: _mapwidget2.default };
}

},{"./mapdata":21,"./mapwidget":26}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Address = exports.Clock = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.toClock = toClock;
exports.ctr = ctr;

var _math = require('../math');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var minutesOnClockFace = 12 * 60;

var Clock = exports.Clock = function () {
    function Clock(hour, minute) {
        _classCallCheck(this, Clock);

        this.hour = hour % 12 == 0 ? 12 : hour % 12;
        this.minute = minute % 60;
    }

    _createClass(Clock, [{
        key: 'toString',
        value: function toString() {
            return Clock.toString(this.hour, this.minute);
        }
    }, {
        key: 'toSlug',
        value: function toSlug() {
            return Clock.toSlug(this.hour, this.minute);
        }
    }, {
        key: 'toRadians',


        /** deprecated */
        value: function toRadians() {
            return Clock.toRadians(this.hour, this.minute);
        }
    }, {
        key: 'radians',
        get: function get() {
            return Clock.toRadians(this.hour, this.minute);
        }
    }], [{
        key: 'toRadians',
        value: function toRadians(hour, minute) {
            var mins = (hour * 60 + minute) % minutesOnClockFace;
            if (mins > minutesOnClockFace / 2) {
                mins = -(minutesOnClockFace - mins);
            }
            return 2 * Math.PI * mins / minutesOnClockFace;
        }
    }, {
        key: 'toString',
        value: function toString(hour, minute) {
            var s = hour + ':';
            if (minute < 10) {
                s += '0';
            }
            return s + minute;
        }
    }, {
        key: 'toSlug',
        value: function toSlug(hour, minute) {
            var s = hour + '-';
            if (minute < 10) {
                s += '0';
            }
            return s + minute;
        }
    }]);

    return Clock;
}();

function toClock(angle) {
    angle = (0, _math.normalizeAngle)(angle, Math.PI);
    var mins = Math.floor(angle * minutesOnClockFace / (2 * Math.PI) + 0.5);
    var hr = Math.floor(mins / 60);
    if (hr == 0) {
        hr = 12;
    }
    return new Clock(hr, mins);
}

var Address = exports.Address = function () {
    function Address(clock, distance, street, landmark) {
        _classCallCheck(this, Address);

        this.clock = clock;
        this.distance = distance;
        this.street = street;
        this.landmak = landmark;
    }

    _createClass(Address, [{
        key: 'toString',
        value: function toString() {
            if (self.distance > 10000) {
                return 'default world';
            }
            var res = this.clock.toString();
            if (!this.street) {
                return res + ' / ' + (0, _math.toFeet)(this.distance).toFixed(0) + ' ft';
            }
            return res + ' & ' + this.street.letter;
        }
    }, {
        key: 'toLongString',
        value: function toLongString() {
            var landmarkName = self.distance > 10000 ? 'Default World' : self.landmark ? self.landmark.name : null;
            var res = this.clock.toString();
            if (this.street) {
                res += ' & ' + this.street.name;
            }
            if (landmarkName) {
                res += '(' + landmarkName + ')';
            }
            res += ', ' + (0, _math.toFeet)(this.distance).toFixed(0) + ' feet';
            return res;
        }
    }]);

    return Address;
}();

function ctr(hour, minute) {
    return Clock.toRadians(hour, minute);
}

},{"../math":34}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Marker = exports.APRSStation = exports.Vehicle = exports.Art = exports.Fence = exports.RodsRoad = exports.Plaza = exports.Promenande = exports.TStreet = exports.CStreet = exports.City = exports.Feature = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Array = require('d3-array');

var _math = require('../math');

var _address = require('./address');

var _util = require('../util');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Feature = exports.Feature = function () {
    function Feature(id) {
        _classCallCheck(this, Feature);

        this.id = id;
    }

    _createClass(Feature, [{
        key: 'toString',
        value: function toString() {
            return this.name;
        }
    }, {
        key: 'status',
        value: function status(city) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref$verbose = _ref.verbose,
                verbose = _ref$verbose === undefined ? false : _ref$verbose;

            var parts = [];
            if (this.lastseen) {
                parts.push((0, _util.daysAgoStr)(this.lastseen));
            }
            if (this.coords) {
                var addr = city.getAddress(this.coords);
                parts.push('at ' + (verbose ? addr.toLongString() : addr.toString()));
            } else {
                parts.push('at unknown location');
            }
            return parts.join(' ');
        }
    }, {
        key: 'kind',
        get: function get() {
            return 'other';
        }
    }, {
        key: 'coords',
        get: function get() {
            return this.geometry && this.geometry.type == 'Point' ? this.geometry.coordinates : null;
        }
    }]);

    return Feature;
}();

var City = exports.City = function (_Feature) {
    _inherits(City, _Feature);

    function City(year, center, orientation) {
        _classCallCheck(this, City);

        var _this = _possibleConstructorReturn(this, (City.__proto__ || Object.getPrototypeOf(City)).call(this, 'brc' + year));

        _this.year = year;
        _this.center = center;
        _this.orientation = orientation;
        _this.features = [];
        return _this;
    }

    _createClass(City, [{
        key: 'getBearing',
        value: function getBearing(angle) {
            return Math.PI - this.orientation + angle;
        }
    }, {
        key: 'getLocation',
        value: function getLocation() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                hour = _ref2.hour,
                minute = _ref2.minute,
                angle = _ref2.angle;

            var dist = arguments[1];

            if (angle === undefined || angle === null) {
                angle = _address.Clock.toRadians(hour, minute);
            }
            return (0, _math.getLocation)(this.center, this.getBearing(angle), dist);
        }
    }, {
        key: 'getClock',
        value: function getClock(coords) {
            return (0, _address.toClock)((0, _math.getBearing)(this.center, coords) - this.orientation + Math.PI / 2);
        }
    }, {
        key: 'getAddress',
        value: function getAddress(coords) {
            var dist = (0, _math.getDistance)(this.center, coords);
            var clock = this.getClock(coords);
            var street = null;
            if (clock.hour > 1 && clock.hour < 11) {
                if (dist > this.esplanade.radius - (this.aStreet.radius - this.esplanade.radius) / 2) {
                    if (dist < (this.esplanade.radius + this.aStreet.radius) / 2) {
                        street = this.esplanade;
                    } else {
                        for (var i = 1; i < this.cstreets.length; i++) {
                            if (dist < (this.cstreets[i].radius + this.cstreets[i - 1].radius) / 2) {
                                street = this.cstreets[i - 1];
                                break;
                            }
                        }
                        if (!street && dist < this.lStreet.radius + (this.lStreet.radius - this.kStreet.radius) / 2) {
                            street = this.lStreet;
                        }
                    }
                }
            }
            return new _address.Address(clock, (0, _math.getDistance)(this.center, coords), street);
        }
    }, {
        key: 'city',
        get: function get() {
            return this;
        }
    }, {
        key: 'kind',
        get: function get() {
            return 'city';
        }
    }, {
        key: 'name',
        get: function get() {
            return "Black Rock City " + this.year;
        }
    }, {
        key: 'coords',
        get: function get() {
            return this.center;
        }
    }, {
        key: 'cstreets',
        get: function get() {
            return this.features.filter(function (f) {
                return f instanceof CStreet;
            });
        }
    }]);

    return City;
}(Feature);

;

var CityFeature = function (_Feature2) {
    _inherits(CityFeature, _Feature2);

    function CityFeature(city, slug) {
        _classCallCheck(this, CityFeature);

        var _this2 = _possibleConstructorReturn(this, (CityFeature.__proto__ || Object.getPrototypeOf(CityFeature)).call(this, city.id + '/' + slug));

        _this2.city = city;
        city.features.push(_this2);
        return _this2;
    }

    return CityFeature;
}(Feature);

var CStreet = exports.CStreet = function (_CityFeature) {
    _inherits(CStreet, _CityFeature);

    function CStreet(city, name, radius, width) {
        _classCallCheck(this, CStreet);

        var _this3 = _possibleConstructorReturn(this, (CStreet.__proto__ || Object.getPrototypeOf(CStreet)).call(this, city, name == 'Esplanade' ? name.toLowerCase() : name[0].toLowerCase() + '-street'));

        _this3.name = name;
        _this3.radius = radius;
        _this3.width = width;
        if (name != 'Esplanade') {
            city[name[0].toLowerCase() + 'Street'] = _this3;
        }
        return _this3;
    }

    _createClass(CStreet, [{
        key: 'kind',
        get: function get() {
            return 'street';
        }
    }, {
        key: 'streetKind',
        get: function get() {
            return 'cstreet';
        }
    }, {
        key: 'letter',
        get: function get() {
            return this.name == 'Esplanade' ? 'Esp' : this.name[0].toUpperCase();
        }
    }, {
        key: 'geometry',
        get: function get() {
            var _this4 = this;

            var spans = this.letter != 'F' ? [[(0, _address.ctr)(2, 0), (0, _address.ctr)(10, 0)]] : [[(0, _address.ctr)(2, 30), (0, _address.ctr)(3, 30)], [(0, _address.ctr)(4, 0), (0, _address.ctr)(5, 0)], [(0, _address.ctr)(7, 0), (0, _address.ctr)(8, 0)], [(0, _address.ctr)(8, 30), (0, _address.ctr)(9, 30)]];
            return {
                type: 'MultiLineString',
                coordinates: spans.map(function (s) {
                    return (0, _math.interpolateArc)(_this4.center, _this4.radius, _this4.city.getBearing(s[0]), _this4.city.getBearing(s[1]), 25);
                })
            };
        }
    }, {
        key: 'isRoad',
        get: function get() {
            return true;
        }
    }, {
        key: 'center',
        get: function get() {
            return this.city.center;
        }
    }]);

    return CStreet;
}(CityFeature);

var TStreet = exports.TStreet = function (_CityFeature2) {
    _inherits(TStreet, _CityFeature2);

    function TStreet(city, direction, width) {
        _classCallCheck(this, TStreet);

        var _this5 = _possibleConstructorReturn(this, (TStreet.__proto__ || Object.getPrototypeOf(TStreet)).call(this, city, direction.toSlug() + '-street'));

        _this5.direction = direction;
        _this5.width = width;
        return _this5;
    }

    _createClass(TStreet, [{
        key: 'name',
        get: function get() {
            return this.direction.toString();
        }
    }, {
        key: 'kind',
        get: function get() {
            return 'street';
        }
    }, {
        key: 'streetKind',
        get: function get() {
            return 'tstreet';
        }
    }, {
        key: 'spans',
        get: function get() {
            return [[this.direction.minute == 15 || this.direction.minute == 45 ? this.city.gStreet.radius : this.city.esplanade.radius, this.city.lStreet.radius]];
        }
    }, {
        key: 'geometry',
        get: function get() {
            var _this6 = this;

            return {
                type: 'MultiLineString',
                coordinates: this.spans.map(function (s) {
                    return s.map(function (d) {
                        return _this6.city.getLocation(_this6.direction, d);
                    });
                })
            };
        }
    }, {
        key: 'isRoad',
        get: function get() {
            return true;
        }
    }]);

    return TStreet;
}(CityFeature);

var Promenande = exports.Promenande = function (_CityFeature3) {
    _inherits(Promenande, _CityFeature3);

    function Promenande(city, direction, width) {
        _classCallCheck(this, Promenande);

        var name = direction.hour + " O'Clock Promenande";

        var _this7 = _possibleConstructorReturn(this, (Promenande.__proto__ || Object.getPrototypeOf(Promenande)).call(this, city, (0, _util.slugify)(name)));

        _this7.name = name;
        _this7.direction = direction;
        _this7.width = width;
        return _this7;
    }

    _createClass(Promenande, [{
        key: 'kind',
        get: function get() {
            return 'street';
        }
    }, {
        key: 'streetKind',
        get: function get() {
            return 'promenande';
        }
    }, {
        key: 'span',
        get: function get() {
            return [0, this.city.esplanade.radius];
        }
    }, {
        key: 'geometry',
        get: function get() {
            var _this8 = this;

            return {
                type: 'LineString',
                coordinates: this.span.map(function (d) {
                    return _this8.city.getLocation(_this8.direction, d);
                })
            };
        }
    }, {
        key: 'isRoad',
        get: function get() {
            return true;
        }
    }]);

    return Promenande;
}(CityFeature);

var Plaza = exports.Plaza = function (_CityFeature4) {
    _inherits(Plaza, _CityFeature4);

    function Plaza(city, name, hour, minute, distance, radius) {
        _classCallCheck(this, Plaza);

        var _this9 = _possibleConstructorReturn(this, (Plaza.__proto__ || Object.getPrototypeOf(Plaza)).call(this, city, (0, _util.slugify)(name)));

        _this9.name = name;
        _this9.center = city.getLocation({ hour: hour, minute: minute }, distance);
        _this9.radius = radius;
        return _this9;
    }

    _createClass(Plaza, [{
        key: 'kind',
        get: function get() {
            return 'plaza';
        }
    }, {
        key: 'geometry',
        get: function get() {
            return {
                type: 'Polygon',
                coordinates: [(0, _math.interpolateArc)(this.center, this.radius, 0, 2 * Math.PI, 25)]
            };
        }
    }, {
        key: 'isRoad',
        get: function get() {
            return true;
        }
    }]);

    return Plaza;
}(CityFeature);

var RodsRoad = exports.RodsRoad = function (_CityFeature5) {
    _inherits(RodsRoad, _CityFeature5);

    function RodsRoad(city, centerCampDistance, radius, width) {
        _classCallCheck(this, RodsRoad);

        var name = "Rod's Road";

        var _this10 = _possibleConstructorReturn(this, (RodsRoad.__proto__ || Object.getPrototypeOf(RodsRoad)).call(this, city, (0, _util.slugify)(name)));

        _this10.name = name;
        _this10.center = city.getLocation({ hour: 6, minute: 0 }, centerCampDistance);
        _this10.radius = radius;
        _this10.width = width;
        return _this10;
    }

    _createClass(RodsRoad, [{
        key: 'kind',
        get: function get() {
            return 'street';
        }
    }, {
        key: 'geometry',
        get: function get() {
            return {
                type: 'LineString',
                coordinates: (0, _math.interpolateArc)(this.center, this.radius, 0, 2 * Math.PI, 25)
            };
        }
    }, {
        key: 'isRoad',
        get: function get() {
            return true;
        }
    }]);

    return RodsRoad;
}(CityFeature);

var Fence = exports.Fence = function (_CityFeature6) {
    _inherits(Fence, _CityFeature6);

    function Fence(city, radius) {
        _classCallCheck(this, Fence);

        var name = "Trash Fence";

        var _this11 = _possibleConstructorReturn(this, (Fence.__proto__ || Object.getPrototypeOf(Fence)).call(this, city, (0, _util.slugify)(name)));

        _this11.name = name;
        _this11.radius = radius;
        return _this11;
    }

    _createClass(Fence, [{
        key: 'geometry',
        get: function get() {
            var _this12 = this;

            return {
                type: 'LineString',
                coordinates: [0, 1, 2, 3, 4, 0].map(function (i) {
                    return (0, _math.getLocation)(_this12.city.center, _this12.city.getBearing(2 * i * Math.PI / 5), _this12.radius);
                })
            };
        }
    }]);

    return Fence;
}(CityFeature);

var Art = exports.Art = function (_CityFeature7) {
    _inherits(Art, _CityFeature7);

    function Art(city, name, coords) {
        _classCallCheck(this, Art);

        var _this13 = _possibleConstructorReturn(this, (Art.__proto__ || Object.getPrototypeOf(Art)).call(this, city, (0, _util.slugify)(name)));

        _this13.name = name;
        _this13.center = coords;
        return _this13;
    }

    _createClass(Art, [{
        key: 'kind',
        get: function get() {
            return 'art';
        }
    }, {
        key: 'geometry',
        get: function get() {
            return {
                type: 'Point',
                coordinates: this.center
            };
        }
    }]);

    return Art;
}(CityFeature);

var Vehicle = exports.Vehicle = function (_Feature3) {
    _inherits(Vehicle, _Feature3);

    function Vehicle(id, name, kind) {
        var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
            _ref3$trackerId = _ref3.trackerId,
            trackerId = _ref3$trackerId === undefined ? null : _ref3$trackerId;

        _classCallCheck(this, Vehicle);

        var _this14 = _possibleConstructorReturn(this, (Vehicle.__proto__ || Object.getPrototypeOf(Vehicle)).call(this, id));

        _this14.name = name;
        _this14.vehicleKind = kind;
        _this14.trackerId = trackerId;
        return _this14;
    }

    _createClass(Vehicle, [{
        key: 'kind',
        get: function get() {
            return 'vehicle';
        }
    }, {
        key: 'geometry',
        get: function get() {
            if (this.tracker) {
                return this.tracker.geometry;
            }
            return null;
        }
    }, {
        key: 'lastseen',
        get: function get() {
            if (this.tracker) {
                return this.tracker.lastseen;
            }
            return null;
        }
    }]);

    return Vehicle;
}(Feature);

;

var APRSStation = exports.APRSStation = function (_Feature4) {
    _inherits(APRSStation, _Feature4);

    function APRSStation(callsign) {
        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref4$lastseen = _ref4.lastseen,
            lastseen = _ref4$lastseen === undefined ? null : _ref4$lastseen,
            _ref4$coords = _ref4.coords,
            coords = _ref4$coords === undefined ? null : _ref4$coords,
            _ref4$rawPacket = _ref4.rawPacket,
            rawPacket = _ref4$rawPacket === undefined ? null : _ref4$rawPacket,
            _ref4$comment = _ref4.comment,
            comment = _ref4$comment === undefined ? null : _ref4$comment,
            _ref4$symbol = _ref4.symbol,
            symbol = _ref4$symbol === undefined ? null : _ref4$symbol,
            _ref4$path = _ref4.path,
            path = _ref4$path === undefined ? null : _ref4$path;

        _classCallCheck(this, APRSStation);

        var _this15 = _possibleConstructorReturn(this, (APRSStation.__proto__ || Object.getPrototypeOf(APRSStation)).call(this, 'aprs/' + callsign.toLowerCase()));

        _this15.name = callsign;
        _this15.lastseen = lastseen;
        _this15.rawPacket = rawPacket;
        _this15.comment = comment;
        _this15.geometry = coords ? {
            type: 'Point',
            coordinates: coords
        } : null;
        return _this15;
    }

    _createClass(APRSStation, [{
        key: 'kind',
        get: function get() {
            return 'aprs';
        }
    }, {
        key: 'isAPRSStation',
        get: function get() {
            return true;
        }
    }]);

    return APRSStation;
}(Feature);

;

var nextMarkerId = 1;

var Marker = exports.Marker = function (_Feature5) {
    _inherits(Marker, _Feature5);

    function Marker(coords) {
        var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref5$name = _ref5.name,
            name = _ref5$name === undefined ? null : _ref5$name,
            _ref5$color = _ref5.color,
            color = _ref5$color === undefined ? null : _ref5$color,
            _ref5$id = _ref5.id,
            id = _ref5$id === undefined ? null : _ref5$id,
            _ref5$lastseen = _ref5.lastseen,
            lastseen = _ref5$lastseen === undefined ? null : _ref5$lastseen;

        _classCallCheck(this, Marker);

        var _this16 = _possibleConstructorReturn(this, (Marker.__proto__ || Object.getPrototypeOf(Marker)).call(this));

        _this16.id = id ? id : 'marker' + nextMarkerId++;
        _this16.name = name;
        _this16.color = color ? color : '#fe7569';
        _this16.lastseen = lastseen;
        _this16.geometry = {
            type: 'Point',
            coordinates: coords
        };
        return _this16;
    }

    _createClass(Marker, [{
        key: 'center',
        get: function get() {
            return this.coords;
        }
    }]);

    return Marker;
}(Feature);

},{"../math":34,"../util":35,"./address":17,"d3-array":1}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseGeojson = parseGeojson;

var _math = require('../../math');

var _features = require('../features');

var _address = require('../address');

function lastSeen(feat) {
    return feat.properties.lastseen ? new Date(feat.properties.lastseen * 1000) : null;
};

function parseGeojson(data) {
    var dataFeatures = null;
    if (data.type == 'Feature') {
        dataFeatures = [data];
    } else if (data.type == 'FeatureCollection') {
        dataFeatures = data.features;
    } else {
        throw new Error('GeoJSON data must be of type Feature or FeatureCollection');
    }

    var parsedFeatures = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = dataFeatures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var df = _step.value;

            if (!df.properties) {
                df.properties = {};
            }
            if (df.properties.brc == 'city') {
                var c = df.properties;
                var _city = new _features.City(c.year, df.geometry.coordinates, _address.Clock.toRadians(c.northSouthAxisHour, c.northSouthAxisMinute));
                parsedFeatures.push(_city);

                for (var i = 0; i < c.streetNames.length; ++i) {
                    parsedFeatures.push(new _features.CStreet(_city, c.streetNames[i], (0, _math.fromFeet)(c.streetRadiusesFt[i]), (0, _math.fromFeet)(c.regularStreetWidthFt)));
                }
                _city.esplanade = new _features.CStreet(_city, 'Esplanade', (0, _math.fromFeet)(c.esplanadeRadiusFt), (0, _math.fromFeet)(c.esplanadeWidthFt));
                parsedFeatures.push(_city.esplanade);
                for (var hour = 2; hour <= 10; ++hour) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = (hour == 10 ? [0] : [0, 15, 30, 45])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var minute = _step2.value;

                            var direction = new _address.Clock(hour, minute);
                            var street = new _features.TStreet(_city, direction, (0, _math.fromFeet)(c.regularStreetWidthFt));
                            parsedFeatures.push(street);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
                parsedFeatures.push(new _features.Promenande(_city, new _address.Clock(3, 0), (0, _math.fromFeet)(c.promenandeWidthFt)));
                parsedFeatures.push(new _features.Promenande(_city, new _address.Clock(6, 0), (0, _math.fromFeet)(c.promenandeWidthFt)));
                parsedFeatures.push(new _features.Promenande(_city, new _address.Clock(9, 0), (0, _math.fromFeet)(c.promenandeWidthFt)));
                parsedFeatures.push(new _features.Promenande(_city, new _address.Clock(12, 0), (0, _math.fromFeet)(c.promenandeWidthFt)));

                _city.fence = new _features.Fence(_city, (0, _math.fromFeet)(c.pentagonPointsDistanceFt));
                parsedFeatures.push(_city.fence);
                parsedFeatures.push(new _features.RodsRoad(_city, (0, _math.fromFeet)(c.centerCampDistanceFt), (0, _math.fromFeet)(c.rodsRoadRadiusFt), (0, _math.fromFeet)(c.rodsRoadWidth)));

                parsedFeatures.push(new _features.Plaza(_city, 'Center Camp Plaza', 6, 0, (0, _math.fromFeet)(c.centerCampDistanceFt), (0, _math.fromFeet)(c.centerCampPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '3:00 Civic Plaza', 3, 0, (0, _math.fromFeet)(c.civicPlazaDistanceFt), (0, _math.fromFeet)(c.civicPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '9:00 Civic Plaza', 9, 0, (0, _math.fromFeet)(c.civicPlazaDistanceFt), (0, _math.fromFeet)(c.civicPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '3:00 Public Plaza', 3, 0, (0, _math.fromFeet)(c.publicPlaza3DistanceFt), (0, _math.fromFeet)(c.publicPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '6:00 Public Plaza', 6, 0, (0, _math.fromFeet)(c.publicPlaza6DistanceFt), (0, _math.fromFeet)(c.publicPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '9:00 Public Plaza', 9, 0, (0, _math.fromFeet)(c.publicPlaza9DistanceFt), (0, _math.fromFeet)(c.publicPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '4:30 Art Plaza', 4, 30, (0, _math.fromFeet)(c.artPlazaDistanceFt), (0, _math.fromFeet)(c.artPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, '7:30 Art Plaza', 7, 30, (0, _math.fromFeet)(c.artPlazaDistanceFt), (0, _math.fromFeet)(c.artPlazaRadiusFt)));
                parsedFeatures.push(new _features.Plaza(_city, 'Man Plaza', 0, 0, 0, (0, _math.fromFeet)(100)));

                var templeDistance = (0, _math.fromFeet)(2500);
                parsedFeatures.push(new _features.Plaza(_city, 'Temple Plaza', 0, 0, templeDistance, (0, _math.fromFeet)(100)));
            } else if (df.properties.brc == 'art') {
                parsedFeatures.push(new _features.Art(city, df.properties.name, df.geometry.coordinates));
            } else if (df.properties.vehicle) {
                parsedFeatures.push(new _features.Vehicle(df.id, df.properties.name, df.properties.vehicle, {
                    trackerId: df.properties.tracker
                }));
            } else if (df.properties.aprs) {
                parsedFeatures.push(new _features.APRSStation(df.properties.aprs, {
                    lastseen: lastSeen(df),
                    coords: df.geometry ? df.geometry.coordinates : null,
                    rawPacket: df.properties.rawpacket,
                    symbol: df.properties.symbol,
                    comment: df.properties.comment,
                    path: df.properties.path
                }));
            } else if (df.geometry && df.geometry.type == 'Point') {
                parsedFeatures.push(new _features.Marker(df.geometry.coordinates, {
                    name: df.properties.name,
                    id: df.id,
                    lastseen: lastSeen(df)
                }));
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return parsedFeatures;
}

},{"../../math":34,"../address":17,"../features":18}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _geojson = require('./geojson');

Object.keys(_geojson).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _geojson[key];
    }
  });
});

},{"./geojson":19}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MapData = undefined;

var _features = require('./features');

Object.keys(_features).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _features[key];
        }
    });
});

var _sources = require('./sources');

Object.keys(_sources).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _sources[key];
        }
    });
});

var _util = require('../util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapData = exports.MapData = function MapData(baseData) {
    var _this = this;

    _classCallCheck(this, MapData);

    var listeners = new _util.Listeners();
    var sources = [new _sources.StaticDataSource(baseData)];
    var features = [];
    var city = null;

    var update = function update() {
        var featuresById = new Map();
        city = null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var src = _step.value;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = src.features[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var f = _step3.value;

                        featuresById.set(f.id, f);
                        if (f instanceof _features.City) {
                            city = f;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = featuresById.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _f = _step2.value;

                if (_f.trackerId && featuresById.has(_f.trackerId)) {
                    _f.tracker = featuresById.get(_f.trackerId);
                    _f.tracker.tracked = true;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        features = [].concat(_toConsumableArray(featuresById.values()));
        listeners.notify('update', _this);
    };

    var stop = function stop() {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = sources[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var ds = _step4.value;

                ds.stop();
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    };

    this.clear = function () {
        sources = [];
        update();
        return _this;
    };

    this.addGeojson = function (data) {
        sources.push(new _sources.StaticDataSource(data, update));
        update();
        return _this;
    };

    this.addGeojsonUrl = function (url, pollInterval) {
        sources.push(new _sources.AjaxDataSource(url, pollInterval, update));
        update();
        return _this;
    };

    this.on = function (event, callback) {
        listeners.add(event, callback);
        return _this;
    };

    this.off = function (event, callback) {
        listeners.remove(event, callback);
        return _this;
    };

    Object.defineProperty(this, 'city', {
        get: function get() {
            return city;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'features', {
        get: function get() {
            return features;
        },
        enumerable: true
    });

    update();
};

},{"../util":35,"./features":18,"./sources":23}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AjaxDataSource = undefined;

var _formats = require('../formats');

var _d3Request = require('d3-request');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxDataSource = exports.AjaxDataSource = function AjaxDataSource(url, pollInterval, notify) {
    _classCallCheck(this, AjaxDataSource);

    var timeoutId = null;
    var features = [];
    var req = (0, _d3Request.request)(url).mimeType("application/json").response(function (xhr) {
        return JSON.parse(xhr.responseText);
    });

    if (pollInterval === null || pollInterval === undefined) {
        pollInterval = 5;
    }

    var onresponse = function onresponse(jsondata) {
        if (!jsondata) {
            console.error('Failed to get data from ' + url);
        } else {
            features = (0, _formats.parseGeojson)(jsondata);
            notify(features);
        }
        timeoutId = setTimeout(function () {
            return req.get(onresponse);
        }, pollInterval * 1000);
    };

    this.stop = function () {
        clearTimeout(timeoutId);
        req.abort();
    };

    Object.defineProperty(this, 'features', {
        get: function get() {
            return features;
        },
        enumerable: true
    });

    req.get(onresponse);
};

},{"../formats":20,"d3-request":10}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _static = require('./static');

Object.keys(_static).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _static[key];
    }
  });
});

var _ajax = require('./ajax');

Object.keys(_ajax).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ajax[key];
    }
  });
});

},{"./ajax":22,"./static":24}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StaticDataSource = undefined;

var _formats = require('../formats');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StaticDataSource = exports.StaticDataSource = function StaticDataSource(data) {
    _classCallCheck(this, StaticDataSource);

    this.features = (0, _formats.parseGeojson)(data);

    this.stop = function () {};
};

},{"../formats":20}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderGrid = renderGrid;

var _d3Selection = require('d3-selection');

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _math = require('../math');

var _util = require('../util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function renderGrid(projection, container, city, style) {
    var radials = [];
    if (style.showGrid && city) {
        var center = projection(city.center);
        // const ticks = scaleLinear()
        //     .domain([0, city.fence.radius])
        //     .ticks(10)

        radials = (0, _d3Array.range)(0, 10000, (0, _math.fromFeet)(100)).map(function (r) {
            return [(0, _util.toPixels)(projection, r)].concat(_toConsumableArray(center));
        });
    }
    var group = container.select('g.grid').attr('fill', 'none').attr('stroke-width', '0.2px').attr('stroke', style.mutedColor);

    var nodes = group.selectAll("circle").data(radials);

    nodes.exit().remove();

    nodes.enter().append('circle').merge(nodes).attr('r', function (d) {
        return d[0];
    }).attr('cx', function (d) {
        return d[1];
    }).attr('cy', function (d) {
        return d[2];
    });
}

},{"../math":34,"../util":35,"d3-array":1,"d3-scale":11,"d3-selection":12}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d3Selection = require('d3-selection');

var _d3Geo = require('d3-geo');

var _mapdata = require('../mapdata');

var _util = require('../util');

var _math = require('../math');

var _zoomer = require('./zoomer');

var _tiles = require('./tiles');

var _grid = require('./grid');

var _roads = require('./roads');

var _labels = require('./labels');

var _pois = require('./pois');

var _playabg = require('./playabg');

var _others = require('./others');

var _basemap = require('../basemap');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getFeatureColor(f, style, isSelected) {
    if (f.kind == 'vehicle') {
        return style.highlightColor;
    }
    return style.outlineColor;
}

var MapWidget = function MapWidget(element) {
    var _this = this;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        center = _ref.center,
        _ref$baseData = _ref.baseData,
        baseData = _ref$baseData === undefined ? _basemap.data : _ref$baseData,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === undefined ? 14.38 : _ref$zoom,
        _ref$maxZoom = _ref.maxZoom,
        maxZoom = _ref$maxZoom === undefined ? 18 : _ref$maxZoom,
        _ref$minZoom = _ref.minZoom,
        minZoom = _ref$minZoom === undefined ? 14 : _ref$minZoom,
        _ref$showGrid = _ref.showGrid,
        showGrid = _ref$showGrid === undefined ? false : _ref$showGrid,
        _ref$showPoiStatus = _ref.showPoiStatus,
        showPoiStatus = _ref$showPoiStatus === undefined ? true : _ref$showPoiStatus,
        _ref$showRasterTilesO = _ref.showRasterTilesOnPlaya,
        showRasterTilesOnPlaya = _ref$showRasterTilesO === undefined ? false : _ref$showRasterTilesO,
        _ref$rasterTiles = _ref.rasterTiles,
        rasterTiles = _ref$rasterTiles === undefined ? 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : _ref$rasterTiles,
        _ref$rasterTilesOpaci = _ref.rasterTilesOpacity,
        rasterTilesOpacity = _ref$rasterTilesOpaci === undefined ? 1 : _ref$rasterTilesOpaci,
        _ref$outlineColor = _ref.outlineColor,
        outlineColor = _ref$outlineColor === undefined ? '#999' : _ref$outlineColor,
        _ref$mutedColor = _ref.mutedColor,
        mutedColor = _ref$mutedColor === undefined ? '#ccc' : _ref$mutedColor,
        _ref$highlightColor = _ref.highlightColor,
        highlightColor = _ref$highlightColor === undefined ? '#ff0000' : _ref$highlightColor,
        _ref$backgroundColor = _ref.backgroundColor,
        backgroundColor = _ref$backgroundColor === undefined ? '#fff' : _ref$backgroundColor,
        _ref$onclick = _ref.onclick,
        onclick = _ref$onclick === undefined ? function (f) {
        return console.log(f.name + ' clicked');
    } : _ref$onclick,
        _ref$onviewchanged = _ref.onviewchanged,
        onviewchanged = _ref$onviewchanged === undefined ? function () {} : _ref$onviewchanged,
        _ref$featureColor = _ref.featureColor,
        featureColor = _ref$featureColor === undefined ? getFeatureColor : _ref$featureColor;

    _classCallCheck(this, MapWidget);

    var mapdata = new _mapdata.MapData(baseData);

    zoom = (0, _math.clamp)(zoom, minZoom, maxZoom);

    var currentProjection = function currentProjection() {
        var width = element.clientWidth;
        var height = element.clientHeight;
        return (0, _d3Geo.geoMercator)().center(center ? center : [0, 0]).translate([width / 2.0, height / 2.0]).scale((0, _util.fromZoom)(zoom));
    };

    var render = function render() {
        if (!center) {
            center = mapdata.city ? mapdata.city.center : null;
        }
        renderMap(element, mapdata, currentProjection(), _this, _this.onclick);
    };

    this.onviewchanged = onviewchanged;
    this.onclick = onclick;

    this.project = function (lnglat) {
        return currentProjection()(lnglat);
    };

    this.unproject = function (point) {
        return currentProjection().invert(point);
    };

    this.setView = function (newCenter, newZoom) {
        center = newCenter;
        zoom = (0, _math.clamp)(newZoom, minZoom, maxZoom);
        _this.onviewchanged(_this);
        render();
    };

    this.zoomAround = function (focusPoint, k) {
        center = _this.unproject(focusPoint);
        // note: this doesn't really work with k's that result in non-integer 
        // zoom levels because of how fromZoom is implemented. Fix it?
        zoom = (0, _math.clamp)((0, _util.toZoom)(k * (0, _util.fromZoom)(zoom)), minZoom, maxZoom);
        center = _this.unproject([element.clientWidth - focusPoint[0], element.clientHeight - focusPoint[1]]);
        render();
    };

    this.clearData = function () {
        mapdata.clear();
        return _this;
    };

    this.addGeojsonData = function () {
        mapdata.addGeojson.apply(mapdata, arguments);
        return _this;
    };

    this.addGeojsonDataUrl = function () {
        mapdata.addGeojsonUrl.apply(mapdata, arguments);
        return _this;
    };

    this.onData = function () {
        mapdata.on.apply(mapdata, arguments);
        return _this;
    };

    this.offData = function () {
        mapdata.off.apply(mapdata, arguments);
        return _this;
    };

    Object.defineProperty(this, 'data', {
        get: function get() {
            return mapdata;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'element', {
        get: function get() {
            return element;
        },
        set: function set(v) {
            element = element;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'center', {
        get: function get() {
            return center;
        },
        set: function set(v) {
            _this.setView(v, zoom);
        },
        enumerable: true
    });

    Object.defineProperty(this, 'zoomLevel', {
        get: function get() {
            return zoom;
        },
        set: function set(v) {
            _this.setView(center, v);
        },
        enumerable: true
    });

    Object.defineProperty(this, 'showGrid', {
        get: function get() {
            return showGrid;
        },
        set: function set(v) {
            showGrid = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'showRasterTilesOnPlaya', {
        get: function get() {
            return showRasterTilesOnPlaya;
        },
        set: function set(v) {
            showRasterTilesOnPlaya = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'showPoiStatus', {
        get: function get() {
            return showPoiStatus;
        },
        set: function set(v) {
            showPoiStatus = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'rasterTiles', {
        get: function get() {
            return rasterTiles;
        },
        set: function set(v) {
            rasterTiles = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'rasterTilesOpacity', {
        get: function get() {
            return rasterTilesOpacity;
        },
        set: function set(v) {
            rasterTilesOpacity = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'outlineColor', {
        get: function get() {
            return outlineColor;
        },
        set: function set(v) {
            outlineColor = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'mutedColor', {
        get: function get() {
            return outlineColor;
        },
        set: function set(v) {
            outlineColor = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'highlightColor', {
        get: function get() {
            return highlightColor;
        },
        set: function set(v) {
            highlightColor = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'backgroundColor', {
        get: function get() {
            return backgroundColor;
        },
        set: function set(v) {
            backgroundColor = v;render();
        },
        enumerable: true
    });

    Object.defineProperty(this, 'featureColor', {
        get: function get() {
            return featureColor;
        },
        set: function set(v) {
            featureColor = v;render();
        },
        enumerable: true
    });

    window.addEventListener('resize', render);
    render();
    (0, _zoomer.enableZoom)(this, (0, _d3Selection.select)(element).select('.container'));

    // Rerender every once in a while to update relative times
    // like "N minutes ago"
    var refreshTimerId = null;
    var refreshRelativeTimes = function refreshRelativeTimes() {
        render();
        refreshTimerId = setTimeout(refreshRelativeTimes, 30000);
    };
    refreshTimerId = setTimeout(refreshRelativeTimes, 30000);

    mapdata.on('update', render);
};

exports.default = MapWidget;


function renderMap(element, data, projection, style, onclick) {
    var nodes = (0, _d3Selection.select)(element).selectAll('svg').data([1]);

    nodes.exit().remove();

    nodes.enter().append('svg').attr('shape-rendering', 'auto').style('width', '100%').style('height', '100%').append('g').classed('container', true).merge(nodes).style('background', style.backgroundColor);

    var container = (0, _d3Selection.select)(element).select('g.container');

    nodes = container.selectAll('g').data(['tiles', 'playabg', 'grid',
    //'clicktargets',
    'outlines', 'others', 'fills', 'pois', 'labels']
    //'selection',
    //'ticks'
    );

    nodes.exit().remove();

    nodes.enter().append('g').merge(nodes).each(function (d) {
        (0, _d3Selection.select)(this).classed(d, true);
    });

    var features = data.features;
    var city = data.city;

    (0, _tiles.renderTiles)(projection, container, style);
    (0, _playabg.renderPlayaBg)(projection, container, style);
    (0, _grid.renderGrid)(projection, container, city, style);

    var layerRenderers = [_roads.renderRoads, _labels.renderLabels, _pois.renderPois, _others.renderOthers];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = layerRenderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var r = _step.value;

            r(projection, container, features, city, style, onclick);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

},{"../basemap":15,"../mapdata":21,"../math":34,"../util":35,"./grid":25,"./labels":27,"./others":28,"./playabg":29,"./pois":30,"./roads":31,"./tiles":32,"./zoomer":33,"d3-geo":7,"d3-selection":12}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderLabels = undefined;

var _d3Selection = require('d3-selection');

var _math = require('../math');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function renderLabels(projection, container, features, city, style, _onclick) {
    var cstreets = features.filter(function (f) {
        return f.streetKind == 'cstreet';
    });
    var tstreets = features.filter(function (f) {
        return f.stretKind == 'tstreat';
    });
    var pois = features.filter(function (f) {
        return f.geometry && f.geometry.type == 'Point' && !f.tracked;
    });

    var tstreetLabels = tstreets.map(function (street) {
        return {
            onclick: function onclick() {
                return _onclick(street);
            },
            pt: projection(street.city.getLocation(street.direction, street.city.lStreet.radius)),
            txt: street.name,
            ang: street.city.getBearing(street.direction.radians),
            off: [0, -15],
            anchor: 'middle',
            alignment: 'auto',
            fontSize: 10,
            fontWeight: 'normal',
            stroke: 'none',
            strokeWidth: 0,
            fill: style.outlineColor,
            selectable: false
        };
    });
    var cstreetLabels = cstreets.map(function (street) {
        return {
            onclick: function onclick() {
                return _onclick(street);
            },
            pt: projection(street.city.getLocation({ hour: 10, minute: 0 }, street.radius)),
            txt: street.name,
            ang: 0,
            off: [14, 0],
            anchor: 'start',
            alignment: 'auto',
            fontSize: 10,
            fontWeight: 'normal',
            stroke: 'none',
            strokeWidth: 0,
            fill: style.outlineColor,
            selectable: false
        };
    });
    var poiLabels = pois.map(function (poi) {
        return {
            onclick: function onclick() {
                return _onclick(poi);
            },
            pt: projection(poi.coords),
            txt: poi.name,
            ang: 0,
            off: [0, 8],
            anchor: 'middle',
            alignment: 'hanging',
            fontSize: 12,
            fontWeight: 'bold',
            stroke: style.backgroundColor,
            strokeWidth: 7,
            fill: style.featureColor(poi, style),
            selectable: true
        };
    });
    var poiStatuses = style.showPoiStatus ? pois.map(function (poi) {
        return {
            onclick: function onclick() {
                return _onclick(poi);
            },
            pt: projection(poi.coords),
            txt: poi.status(city),
            ang: 0,
            off: [0, 12 + 10],
            anchor: 'middle',
            alignment: 'hanging',
            fontSize: 10,
            fontWeight: 'normal',
            stroke: style.backgroundColor,
            strokeWidth: 7,
            fill: style.featureColor(poi, style),
            selectable: true
        };
    }) : [];

    var group = container.select('g.labels');
    var nodes = group.selectAll("text").data([].concat(_toConsumableArray(cstreetLabels), _toConsumableArray(tstreetLabels), _toConsumableArray(poiStatuses), _toConsumableArray(poiLabels)));

    nodes.exit().remove();

    nodes.enter().append('text').attr('font-family', 'Helvetica, sans-serif').attr('paint-order', 'stroke').style('cursor', 'default').merge(nodes).attr('stroke', function (l) {
        return l.stroke;
    }).attr('stroke-width', function (l) {
        return l.strokeWidth;
    }).attr('font-size', function (l) {
        return l.fontSize;
    }).attr('font-weight', function (l) {
        return l.fontWeight;
    }).attr('text-anchor', function (l) {
        return l.anchor;
    }).attr('alignment-baseline', function (l) {
        return l.alignment;
    }).attr('fill', function (l) {
        return l.fill;
    }).attr('pointer-events', function (l) {
        return l.selectable ? 'visible' : 'none';
    }).attr('transform', function (l) {
        return 'translate(' + l.pt.join(',') + ') rotate(' + (0, _math.toDegrees)(l.ang) + ') translate(' + l.off.join(',') + ')';
    }).style('user-select', function (l) {
        return l.selectable ? 'allowed' : 'none';
    }).on('click', function (l) {
        return l.onclick;
    }).text(function (l) {
        return l.txt;
    });
}
exports.renderLabels = renderLabels;

},{"../math":34,"d3-selection":12}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderOthers = renderOthers;

var _d3Selection = require('d3-selection');

var _d3Scale = require('d3-scale');

var _d3Path = require('d3-path');

var _d3Geo = require('d3-geo');

var _mapdata = require('../mapdata');

function renderOthers(projection, container, features, city, style, onclick) {
    features = features.filter(function (f) {
        return !f.isRoad && !f.isPOI;
    });

    var group = container.select('g.others');
    var geometryToPath = (0, _d3Geo.geoPath)(projection);
    var nodes = group.selectAll('path').data(features);

    nodes.exit().remove();

    nodes.enter().append('path').merge(nodes).each(function (f) {
        if (f instanceof _mapdata.Fence) {
            (0, _d3Selection.select)(this).attr('fill', 'none').attr('stroke', style.outlineColor).attr('stroke-width', 2).attr('stroke-dasharray', '5,4').attr('d', function (f) {
                return geometryToPath(f.geometry);
            }).on('click', onclick);
        } else {
            (0, _d3Selection.select)(this).attr('fill', style.mutedColor).attr('stroke', style.mutedColor).attr('stroke-width', 0.3).attr('d', function (f) {
                return geometryToPath(f.geometry);
            }).on('click', onclick);
        }
    });
}

},{"../mapdata":21,"d3-geo":7,"d3-path":9,"d3-scale":11,"d3-selection":12}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderPlayaBg = renderPlayaBg;

var _d3Selection = require('d3-selection');

function renderPlayaBg(projection, container, style) {
    var boxes = !style.showRasterTilesOnPlaya ? [[projection([-119.3290, 40.8512]), projection([-119.1378, 40.7262])]] : [];
    var group = container.select('g.playabg');
    var nodes = group.selectAll('rect').data(boxes);

    nodes.exit().remove();

    nodes.enter().append('rect').attr('stroke', null).merge(nodes).attr('x', function (f) {
        return f[0][0];
    }).attr('y', function (f) {
        return f[0][1];
    }).attr('width', function (f) {
        return f[1][0] - f[0][0];
    }).attr('height', function (f) {
        return f[1][1] - f[0][1];
    }).attr('fill', style.backgroundColor);
}

},{"d3-selection":12}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderPois = renderPois;

var _d3Selection = require('d3-selection');

var _d3Scale = require('d3-scale');

var _mapdata = require('../mapdata');

function renderPois(projection, container, features, city, style, onclick) {
    features = features.filter(function (f) {
        return f.geometry && f.geometry.type == 'Point' && !f.tracked;
    });

    var group = container.select('g.pois');
    var nodes = group.selectAll('circle').data(features);

    nodes.exit().remove();

    nodes.enter().append('circle').merge(nodes).attr('fill', function (f) {
        return style.featureColor(f, style);
    }).attr('stroke', null).attr('cx', function (f) {
        return projection(f.coords)[0];
    }).attr('cy', function (f) {
        return projection(f.coords)[1];
    }).attr('r', 3).on('click', onclick);
}

},{"../mapdata":21,"d3-scale":11,"d3-selection":12}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderRoads = renderRoads;

var _d3Selection = require('d3-selection');

var _d3Scale = require('d3-scale');

var _d3Path = require('d3-path');

var _d3Geo = require('d3-geo');

var _math = require('../math');

var _util = require('../util');

function renderPaths(projection, features, city, group, weight, color, onClick) {
    var geometryToPath = (0, _d3Geo.geoPath)(projection);
    var nodes = group.selectAll('path').data(features);

    nodes.exit().remove();

    nodes.enter().append('path').merge(nodes).attr('fill', function (f) {
        return f.geometry.type == 'Polygon' ? color : 'none';
    }).attr('stroke', color).attr('stroke-width', function (f) {
        return f.width ? (0, _util.toPixels)(projection, f.width) + weight : weight;
    }).attr('d', function (f) {
        return geometryToPath(f.geometry);
    }).on('click', onClick);
}

function renderRoads(projection, container, features, city, style, onClick) {
    var roadFeatures = features.filter(function (f) {
        return f.isRoad;
    });
    renderPaths(projection, roadFeatures, city, container.select('g.outlines'), 10, style.outlineColor, onClick);
    renderPaths(projection, roadFeatures, city, container.select('g.fills'), 7, style.backgroundColor, onClick);
}

},{"../math":34,"../util":35,"d3-geo":7,"d3-path":9,"d3-scale":11,"d3-selection":12}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderTiles = renderTiles;

var _d3Selection = require('d3-selection');

var _d3Geo = require('d3-geo');

var _d3Array = require('d3-array');

var _util = require('../util');

function tileUrl(x, y, zoom, pattern) {
  return pattern.replace('{s}', ["a", "b", "c"][Math.random() * 3 | 0]).replace('{z}', Math.floor(zoom)).replace('{x}', Math.floor(x)).replace('{y}', Math.floor(y));
};

function lng2tile(lon, zoom) {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

function lat2tile(lat, zoom) {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
}

function tile2lng(x, z) {
  return x / Math.pow(2, z) * 360 - 180;
}

function tile2lat(y, z) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

function renderTiles(projection, container, style) {
  var z = (0, _util.toZoom)(projection.scale());
  var zoom = Math.round(z);
  var k = Math.pow(2, z - zoom);
  var width = container.node().ownerSVGElement.clientWidth;
  var height = container.node().ownerSVGElement.clientHeight;
  var northwest = projection.invert([0, 0]);
  var southeast = projection.invert([width, height]);
  var top_tile = lat2tile(northwest[1], zoom);
  var left_tile = lng2tile(northwest[0], zoom);
  var bottom_tile = lat2tile(southeast[1], zoom);
  var right_tile = lng2tile(southeast[0], zoom);
  var tiles = [];
  if (style.rasterTiles) {
    for (var x = left_tile; x <= right_tile; ++x) {
      for (var y = top_tile; y <= bottom_tile; ++y) {
        var pt = projection([tile2lng(x, zoom), tile2lat(y, zoom)]);
        tiles.push([tileUrl(x, y, zoom, style.rasterTiles), Math.floor(pt[0]), Math.floor(pt[1]), z]);
      }
    }
  }

  var group = container.select('g.tiles');
  var nodes = group.selectAll('image').data(tiles);

  nodes.exit().remove();

  nodes.enter().append('image').merge(nodes).attr("width", Math.ceil(256 * k)).attr("height", Math.ceil(256 * k)).attr("xlink:href", function (t) {
    return t[0];
  }).attr("x", function (t) {
    return t[1];
  }).attr("y", function (t) {
    return t[2];
  }).attr("z", function (t) {
    return t[3];
  }).style('opacity', style.rasterTilesOpacity).on('error', function () {
    (0, _d3Selection.select)(this).style('visibility', 'hidden');
  });
}

},{"../util":35,"d3-array":1,"d3-geo":7,"d3-selection":12}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.enableZoom = enableZoom;
exports.disableZoom = disableZoom;

var _d3Selection = require('d3-selection');

var _util = require('../util');

function enableZoom(map, container) {
    var x0 = void 0,
        y0 = void 0;

    var onDragProgress = function onDragProgress() {
        var tr = [_d3Selection.event.clientX - x0, _d3Selection.event.clientY - y0];
        var scale = 1;
        //console.log(`zoom tr: ${tr}, s:${scale}`);
        container.style('transform', 'translate(' + tr[0] + 'px,' + tr[1] + 'px) scale(' + scale + ')');
    };

    var onDragStarted = function onDragStarted() {
        x0 = _d3Selection.event.clientX;
        y0 = _d3Selection.event.clientY;
        (0, _d3Selection.select)(map.element).on('mousemove.zoom', onDragProgress);
    };

    var onDragEnded = function onDragEnded() {
        var tr = [_d3Selection.event.clientX - x0, _d3Selection.event.clientY - y0];
        var scale = 1;
        //console.log(`zoomend tr:${tr}, sc:${scale}`);
        var newCenterPoint = [map.element.clientWidth / 2 - tr[0], map.element.clientHeight / 2 - tr[1]];
        var newCenterLngLat = map.unproject(newCenterPoint);
        var newScale = (0, _util.fromZoom)(map.zoomLevel) * scale;
        map.setView(newCenterLngLat, (0, _util.toZoom)(newScale));
        (0, _d3Selection.select)(map.element).on('mousemove.zoom', null);
        container.style('transform', 'translate(0px,0px) scale(1)');
    };

    var onDblClick = function onDblClick() {
        if (_d3Selection.event.shiftKey) {
            map.zoomAround([_d3Selection.event.clientX, _d3Selection.event.clientY], 0.5);
        } else {
            map.zoomAround([_d3Selection.event.clientX, _d3Selection.event.clientY], 2);
        }
    };

    var onKeyDown = function onKeyDown() {
        var zoomStep = 0.1;
        if (_d3Selection.event.keyCode == 187 /* equals, same key as plus */) {
                map.setView(map.center, map.zoomLevel + zoomStep);
                _d3Selection.event.stopPropagation();
            } else if (_d3Selection.event.keyCode == 189 /* minus */) {
                map.setView(map.center, map.zoomLevel - zoomStep);
                _d3Selection.event.stopPropagation();
            }
    };

    (0, _d3Selection.select)(map.element).on('mousedown.zoom', onDragStarted);
    (0, _d3Selection.select)(map.element).on('mouseup.zoom', onDragEnded);
    (0, _d3Selection.select)(map.element).on('dblclick.zoom', onDblClick);
    (0, _d3Selection.select)('body').on('keydown.zoom', onKeyDown);
};

function disableZoom(map) {
    (0, _d3Selection.select)(map.element).on('.zoom', null);
}

},{"../util":35,"d3-selection":12}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.sign = sign;
exports.clamp = clamp;
exports.normalizeAngle = normalizeAngle;
exports.fromDegrees = fromDegrees;
exports.toDegrees = toDegrees;
exports.fromFeet = fromFeet;
exports.toFeet = toFeet;
exports.getDistance = getDistance;
exports.getBearing = getBearing;
exports.getLocation = getLocation;
exports.interpolateArc = interpolateArc;
var EARTH_R = exports.EARTH_R = 6378137;
var TWO_PI = Math.PI * 2;

function sign(v) {
    return v > 0 ? 1 : v < 0 ? -1 : 0;
};

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function normalizeAngle(angle, center) {
    center = center === undefined ? 0 : center;
    return angle - TWO_PI * Math.floor((angle + Math.PI - center) / TWO_PI);
};

function fromDegrees(deg) {
    return deg * Math.PI / 180;
};

function toDegrees(rad) {
    return rad * 180 / Math.PI % 360;
};

function fromFeet(ft) {
    return ft / toFeet(1);
};

function toFeet(m) {
    return m * 3.28084;
};

/**
 * Get great-circle distance between locations. The distance is 
 * calculated using spherical law of cosines, an approximation to 
 * haversine formula.
 *
 * @param from first location, [longitude, latitude] array
 * @param to second location, [longitude, latitude] array
 * @return distance in meters.
 */
function getDistance(from, to) {
    // φ: latitude, λ: longitude 
    var λ1 = fromDegrees(from[0]),
        φ1 = fromDegrees(from[1]),
        λ2 = fromDegrees(to[0]),
        φ2 = fromDegrees(to[1]),
        Δλ = λ2 - λ1;

    return Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * EARTH_R;
};

/**
 * Get initial bearing (aka forward azimuth) between locations.
 * This is an angle between cardinal direction North and 
 * direction to second location as seen from first location.
 * 
 * @param from first location, [longitude, latitude] array
 * @param to second location, [longitude, latitude] array
 * @return bearing in radians, clockwise, -PI to PI
 */
function getBearing(from, to) {
    // φ: latitude, λ: longitude 
    var λ1 = fromDegrees(from[0]),
        φ1 = fromDegrees(from[1]),
        λ2 = fromDegrees(to[0]),
        φ2 = fromDegrees(to[1]),
        y = Math.sin(λ2 - λ1) * Math.cos(φ2),
        x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    return Math.atan2(y, x);
};

/**
 * Calculate destination point given initial location, bearing, 
 * and distance.
 */
function getLocation(from, bearing, distance) {
    // φ: latitude, λ: longitude 
    var λ1 = fromDegrees(from[0]),
        φ1 = fromDegrees(from[1]),
        φ2 = Math.asin(Math.sin(φ1) * Math.cos(distance / EARTH_R) + Math.cos(φ1) * Math.sin(distance / EARTH_R) * Math.cos(bearing)),
        λ2 = λ1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / EARTH_R) * Math.cos(φ1), Math.cos(distance / EARTH_R) - Math.sin(φ1) * Math.sin(φ2));

    return [toDegrees(λ2), toDegrees(φ2)];
};

/**
 * Generate locations along the circle arc
 */
function interpolateArc(center, radius, fromAngle, toAngle, npoints) {
    if (fromAngle != 0 || toAngle != 2 * Math.PI) {
        var _map = [fromAngle, toAngle].map(function (a) {
            return normalizeAngle(a, Math.PI);
        });

        var _map2 = _slicedToArray(_map, 2);

        fromAngle = _map2[0];
        toAngle = _map2[1];
    }
    var points = [];
    for (var i = npoints; i >= 0; --i) {
        points.push(getLocation(center, fromAngle + i * (toAngle - fromAngle) / npoints, radius));
    }
    return points;
}

function vadd(a, b, k) {
    k = k === undefined ? 1 : k;
    return [a[0] + k * b[0], a[1] + k * b[1]];
};

function join(array1, array2, callback) {
    var res = [];
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            res.push(callback(array1[i], array2[j]));
        }
    }
    return res;
};

function cross(array1, array2, callback) {
    var res = [];
    for (var i = 0; i < array1.length && i < array2.length; i++) {
        res.push(callback(array1[i], array2[j]));
    }
    return res;
};

function lineIntersection(start1, end1, start2, end2) {
    var line1StartX = start1[0],
        line1StartY = start1[1],
        line1EndX = end1[0],
        line1EndY = end1[1],
        line2StartX = start2[0],
        line2StartY = start2[1],
        line2EndX = end2[0],
        line2EndY = end2[1];

    var denominator,
        a,
        b,
        numerator1,
        numerator2,
        result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = (line2EndY - line2StartY) * (line1EndX - line1StartX) - (line2EndX - line2StartX) * (line1EndY - line1StartY);
    if (denominator == 0) {
        return null;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
    numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + a * (line1EndX - line1StartX);
    result.y = line1StartY + a * (line1EndY - line1StartY);
    /*
            // it is worth noting that this should be the same as:
            x = line2StartX + (b * (line2EndX - line2StartX));
            y = line2StartX + (b * (line2EndY - line2StartY));
            */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    //return result;
    //return result.onLine1 && result.onLine2 ? [result.x, result.y] : null;
    return result.onLine1 ? [result.x, result.y] : null;
    //return [result.x, result.y];
};

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Listeners = undefined;
exports.fromZoom = fromZoom;
exports.toZoom = toZoom;
exports.toPixels = toPixels;
exports.slugify = slugify;
exports.debounce = debounce;
exports.dateStr = dateStr;
exports.daysAgoStr = daysAgoStr;

var _math = require('./math');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fromZoom(zoom) {
    return Math.pow(2, 8 + zoom) / (2 * Math.PI);
};

function toZoom(scale) {
    return Math.max(Math.log(2 * Math.PI * scale) / Math.LN2 - 8, 0);
};

function toPixels(projection, distance) {
    // strictly speaking we should be looking at the latitude
    // at the exact point, not at projection center - but at our
    // scales the difference is negligible
    var lat = projection.center()[1],
        scale = projection.scale();
    return distance * scale / (_math.EARTH_R * Math.cos((0, _math.fromDegrees)(lat)));
};

function slugify(str) {
    return str.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function dateStr(then) {
    return then.getMonth() + '/' + then.getDay() + '/' + then.getFullYear() + ' ' + then.getHours() % 12 + ':' + then.getMinutes() + (then.getHours() < 12 ? 'am' : 'pm');
}

function daysAgoStr(then) {
    if (then === null || then === undefined) {
        return then;
    }

    var diff = Math.round((Date.now() - then.getTime()) / 1000);
    if (diff < 0) {
        return 'on ' + dateStr(then);
    }

    var second_diff = diff % 86400;
    var day_diff = Math.round(diff / 86400);

    if (day_diff == 0) {
        if (second_diff < 10) return "now";
        //if (second_diff < 60) return second_diff + " seconds ago";
        if (second_diff < 120) return "a minute ago";
        if (second_diff < 3600) return Math.round(second_diff / 60) + " minutes ago";
        if (second_diff < 7200) return "an hour ago";
        if (second_diff < 86400) return Math.round(second_diff / 3600) + " hours ago";
    }
    if (day_diff == 1) return "yesterday";
    if (day_diff < 7) return day_diff + " days ago";
    return 'on ' + dateStr(then);
    // if (day_diff < 14) return "last week";
    // if (day_diff < 31) return Math.round(day_diff/7) + " weeks ago";
    // if (day_diff < 60) return "last month";
    // if (day_diff < 365) return Math.round(day_diff/30) + " months ago";
    // if (day_diff < 730) return "a year ago";
    // return Math.round(day_diff/365) + " years ago";
}

var Listeners = exports.Listeners = function Listeners() {
    _classCallCheck(this, Listeners);

    var listeners = new Map();

    this.add = function (event, callback) {
        if (!listeners.has(event)) {
            listeners.set(event, []);
        }
        listeners.get(event).push(callback);
    };

    this.remove = function (event, callback) {
        if (listeners.has(event)) {
            listeners.set(event, listeners.get(event).filter(function (cb) {
                return cb != callback;
            }));
        }
    };

    this.notify = function (event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (listeners.has(event)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = listeners.get(event)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cb = _step.value;

                    cb.apply(undefined, args);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    };
};

},{"./math":34}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZDMtYXJyYXkvYnVpbGQvZDMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvZDMtY29sbGVjdGlvbi9idWlsZC9kMy1jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2QzLWNvbG9yL2J1aWxkL2QzLWNvbG9yLmpzIiwibm9kZV9tb2R1bGVzL2QzLWRpc3BhdGNoL2J1aWxkL2QzLWRpc3BhdGNoLmpzIiwibm9kZV9tb2R1bGVzL2QzLWRzdi9idWlsZC9kMy1kc3YuanMiLCJub2RlX21vZHVsZXMvZDMtZm9ybWF0L2J1aWxkL2QzLWZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9kMy1nZW8vYnVpbGQvZDMtZ2VvLmpzIiwibm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL2J1aWxkL2QzLWludGVycG9sYXRlLmpzIiwibm9kZV9tb2R1bGVzL2QzLXBhdGgvYnVpbGQvZDMtcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9kMy1yZXF1ZXN0L2J1aWxkL2QzLXJlcXVlc3QuanMiLCJub2RlX21vZHVsZXMvZDMtc2NhbGUvYnVpbGQvZDMtc2NhbGUuanMiLCJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL2J1aWxkL2QzLXNlbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9kMy10aW1lLWZvcm1hdC9idWlsZC9kMy10aW1lLWZvcm1hdC5qcyIsIm5vZGVfbW9kdWxlcy9kMy10aW1lL2J1aWxkL2QzLXRpbWUuanMiLCJzcmMvYmFzZW1hcC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9tYXBkYXRhL2FkZHJlc3MuanMiLCJzcmMvbWFwZGF0YS9mZWF0dXJlcy5qcyIsInNyYy9tYXBkYXRhL2Zvcm1hdHMvZ2VvanNvbi5qcyIsInNyYy9tYXBkYXRhL2Zvcm1hdHMvaW5kZXguanMiLCJzcmMvbWFwZGF0YS9pbmRleC5qcyIsInNyYy9tYXBkYXRhL3NvdXJjZXMvYWpheC5qcyIsInNyYy9tYXBkYXRhL3NvdXJjZXMvaW5kZXguanMiLCJzcmMvbWFwZGF0YS9zb3VyY2VzL3N0YXRpYy5qcyIsInNyYy9tYXB3aWRnZXQvZ3JpZC5qcyIsInNyYy9tYXB3aWRnZXQvaW5kZXguanMiLCJzcmMvbWFwd2lkZ2V0L2xhYmVscy5qcyIsInNyYy9tYXB3aWRnZXQvb3RoZXJzLmpzIiwic3JjL21hcHdpZGdldC9wbGF5YWJnLmpzIiwic3JjL21hcHdpZGdldC9wb2lzLmpzIiwic3JjL21hcHdpZGdldC9yb2Fkcy5qcyIsInNyYy9tYXB3aWRnZXQvdGlsZXMuanMiLCJzcmMvbWFwd2lkZ2V0L3pvb21lci5qcyIsInNyYy9tYXRoLmpzIiwic3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvNEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaDlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDLFVBQVUsR0FBVixDQUFjLEtBQWQsQ0FBTCxFQUEyQjtBQUN2QixzQkFBVSxHQUFWLENBQWMsS0FBZCxFQUFxQixFQUFyQjtBQUNIO0FBQ0Qsa0JBQVUsR0FBVixDQUFjLEtBQWQsRUFBcUIsSUFBckIsQ0FBMEIsUUFBMUI7QUFDSCxLQUxEOztBQU9BLFNBQUssTUFBTCxHQUFjLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDL0IsWUFBSSxVQUFVLEdBQVYsQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDdEIsc0JBQVUsR0FBVixDQUFjLEtBQWQsRUFBcUIsVUFBVSxHQUFWLENBQWMsS0FBZCxFQUFxQixNQUFyQixDQUE0QixVQUFDLEVBQUQ7QUFBQSx1QkFBUSxNQUFNLFFBQWQ7QUFBQSxhQUE1QixDQUFyQjtBQUNIO0FBQ0osS0FKRDs7QUFNQSxTQUFLLE1BQUwsR0FBYyxVQUFDLEtBQUQsRUFBb0I7QUFBQSwwQ0FBVCxJQUFTO0FBQVQsZ0JBQVM7QUFBQTs7QUFDOUIsWUFBSSxVQUFVLEdBQVYsQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIscUNBQWMsVUFBVSxHQUFWLENBQWMsS0FBZCxDQUFkLDhIQUFvQztBQUFBLHdCQUE1QixFQUE0Qjs7QUFDaEMsd0NBQU0sSUFBTjtBQUNIO0FBSHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJekI7QUFDSixLQU5EO0FBT0gsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBodHRwczovL2QzanMub3JnL2QzLWFycmF5LyBWZXJzaW9uIDEuMi4wLiBDb3B5cmlnaHQgMjAxNyBNaWtlIEJvc3RvY2suXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBhc2NlbmRpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn07XG5cbnZhciBiaXNlY3RvciA9IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKGNvbXBhcmUubGVuZ3RoID09PSAxKSBjb21wYXJlID0gYXNjZW5kaW5nQ29tcGFyYXRvcihjb21wYXJlKTtcbiAgcmV0dXJuIHtcbiAgICBsZWZ0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgIGlmIChsbyA9PSBudWxsKSBsbyA9IDA7XG4gICAgICBpZiAoaGkgPT0gbnVsbCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgIHZhciBtaWQgPSBsbyArIGhpID4+PiAxO1xuICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpIDwgMCkgbG8gPSBtaWQgKyAxO1xuICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxvO1xuICAgIH0sXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKGEsIHgsIGxvLCBoaSkge1xuICAgICAgaWYgKGxvID09IG51bGwpIGxvID0gMDtcbiAgICAgIGlmIChoaSA9PSBudWxsKSBoaSA9IGEubGVuZ3RoO1xuICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgIGlmIChjb21wYXJlKGFbbWlkXSwgeCkgPiAwKSBoaSA9IG1pZDtcbiAgICAgICAgZWxzZSBsbyA9IG1pZCArIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG87XG4gICAgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gYXNjZW5kaW5nQ29tcGFyYXRvcihmKSB7XG4gIHJldHVybiBmdW5jdGlvbihkLCB4KSB7XG4gICAgcmV0dXJuIGFzY2VuZGluZyhmKGQpLCB4KTtcbiAgfTtcbn1cblxudmFyIGFzY2VuZGluZ0Jpc2VjdCA9IGJpc2VjdG9yKGFzY2VuZGluZyk7XG52YXIgYmlzZWN0UmlnaHQgPSBhc2NlbmRpbmdCaXNlY3QucmlnaHQ7XG52YXIgYmlzZWN0TGVmdCA9IGFzY2VuZGluZ0Jpc2VjdC5sZWZ0O1xuXG52YXIgcGFpcnMgPSBmdW5jdGlvbihhcnJheSwgZikge1xuICBpZiAoZiA9PSBudWxsKSBmID0gcGFpcjtcbiAgdmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoIC0gMSwgcCA9IGFycmF5WzBdLCBwYWlycyA9IG5ldyBBcnJheShuIDwgMCA/IDAgOiBuKTtcbiAgd2hpbGUgKGkgPCBuKSBwYWlyc1tpXSA9IGYocCwgcCA9IGFycmF5WysraV0pO1xuICByZXR1cm4gcGFpcnM7XG59O1xuXG5mdW5jdGlvbiBwYWlyKGEsIGIpIHtcbiAgcmV0dXJuIFthLCBiXTtcbn1cblxudmFyIGNyb3NzID0gZnVuY3Rpb24odmFsdWVzMCwgdmFsdWVzMSwgcmVkdWNlKSB7XG4gIHZhciBuMCA9IHZhbHVlczAubGVuZ3RoLFxuICAgICAgbjEgPSB2YWx1ZXMxLmxlbmd0aCxcbiAgICAgIHZhbHVlcyA9IG5ldyBBcnJheShuMCAqIG4xKSxcbiAgICAgIGkwLFxuICAgICAgaTEsXG4gICAgICBpLFxuICAgICAgdmFsdWUwO1xuXG4gIGlmIChyZWR1Y2UgPT0gbnVsbCkgcmVkdWNlID0gcGFpcjtcblxuICBmb3IgKGkwID0gaSA9IDA7IGkwIDwgbjA7ICsraTApIHtcbiAgICBmb3IgKHZhbHVlMCA9IHZhbHVlczBbaTBdLCBpMSA9IDA7IGkxIDwgbjE7ICsraTEsICsraSkge1xuICAgICAgdmFsdWVzW2ldID0gcmVkdWNlKHZhbHVlMCwgdmFsdWVzMVtpMV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG52YXIgZGVzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGIgPCBhID8gLTEgOiBiID4gYSA/IDEgOiBiID49IGEgPyAwIDogTmFOO1xufTtcblxudmFyIG51bWJlciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHggPT09IG51bGwgPyBOYU4gOiAreDtcbn07XG5cbnZhciB2YXJpYW5jZSA9IGZ1bmN0aW9uKHZhbHVlcywgdmFsdWVvZikge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBtID0gMCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIG1lYW4gPSAwLFxuICAgICAgdmFsdWUsXG4gICAgICBkZWx0YSxcbiAgICAgIHN1bSA9IDA7XG5cbiAgaWYgKHZhbHVlb2YgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAoIWlzTmFOKHZhbHVlID0gbnVtYmVyKHZhbHVlc1tpXSkpKSB7XG4gICAgICAgIGRlbHRhID0gdmFsdWUgLSBtZWFuO1xuICAgICAgICBtZWFuICs9IGRlbHRhIC8gKyttO1xuICAgICAgICBzdW0gKz0gZGVsdGEgKiAodmFsdWUgLSBtZWFuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKCFpc05hTih2YWx1ZSA9IG51bWJlcih2YWx1ZW9mKHZhbHVlc1tpXSwgaSwgdmFsdWVzKSkpKSB7XG4gICAgICAgIGRlbHRhID0gdmFsdWUgLSBtZWFuO1xuICAgICAgICBtZWFuICs9IGRlbHRhIC8gKyttO1xuICAgICAgICBzdW0gKz0gZGVsdGEgKiAodmFsdWUgLSBtZWFuKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobSA+IDEpIHJldHVybiBzdW0gLyAobSAtIDEpO1xufTtcblxudmFyIGRldmlhdGlvbiA9IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gIHZhciB2ID0gdmFyaWFuY2UoYXJyYXksIGYpO1xuICByZXR1cm4gdiA/IE1hdGguc3FydCh2KSA6IHY7XG59O1xuXG52YXIgZXh0ZW50ID0gZnVuY3Rpb24odmFsdWVzLCB2YWx1ZW9mKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIGkgPSAtMSxcbiAgICAgIHZhbHVlLFxuICAgICAgbWluLFxuICAgICAgbWF4O1xuXG4gIGlmICh2YWx1ZW9mID09IG51bGwpIHtcbiAgICB3aGlsZSAoKytpIDwgbikgeyAvLyBGaW5kIHRoZSBmaXJzdCBjb21wYXJhYmxlIHZhbHVlLlxuICAgICAgaWYgKCh2YWx1ZSA9IHZhbHVlc1tpXSkgIT0gbnVsbCAmJiB2YWx1ZSA+PSB2YWx1ZSkge1xuICAgICAgICBtaW4gPSBtYXggPSB2YWx1ZTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHsgLy8gQ29tcGFyZSB0aGUgcmVtYWluaW5nIHZhbHVlcy5cbiAgICAgICAgICBpZiAoKHZhbHVlID0gdmFsdWVzW2ldKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobWluID4gdmFsdWUpIG1pbiA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKG1heCA8IHZhbHVlKSBtYXggPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlbHNlIHtcbiAgICB3aGlsZSAoKytpIDwgbikgeyAvLyBGaW5kIHRoZSBmaXJzdCBjb21wYXJhYmxlIHZhbHVlLlxuICAgICAgaWYgKCh2YWx1ZSA9IHZhbHVlb2YodmFsdWVzW2ldLCBpLCB2YWx1ZXMpKSAhPSBudWxsICYmIHZhbHVlID49IHZhbHVlKSB7XG4gICAgICAgIG1pbiA9IG1heCA9IHZhbHVlO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgeyAvLyBDb21wYXJlIHRoZSByZW1haW5pbmcgdmFsdWVzLlxuICAgICAgICAgIGlmICgodmFsdWUgPSB2YWx1ZW9mKHZhbHVlc1tpXSwgaSwgdmFsdWVzKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG1pbiA+IHZhbHVlKSBtaW4gPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChtYXggPCB2YWx1ZSkgbWF4ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFttaW4sIG1heF07XG59O1xuXG52YXIgYXJyYXkgPSBBcnJheS5wcm90b3R5cGU7XG5cbnZhciBzbGljZSA9IGFycmF5LnNsaWNlO1xudmFyIG1hcCA9IGFycmF5Lm1hcDtcblxudmFyIGNvbnN0YW50ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59O1xuXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4O1xufTtcblxudmFyIHJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgc3RhcnQgPSArc3RhcnQsIHN0b3AgPSArc3RvcCwgc3RlcCA9IChuID0gYXJndW1lbnRzLmxlbmd0aCkgPCAyID8gKHN0b3AgPSBzdGFydCwgc3RhcnQgPSAwLCAxKSA6IG4gPCAzID8gMSA6ICtzdGVwO1xuXG4gIHZhciBpID0gLTEsXG4gICAgICBuID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpIHwgMCxcbiAgICAgIHJhbmdlID0gbmV3IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgcmFuZ2VbaV0gPSBzdGFydCArIGkgKiBzdGVwO1xuICB9XG5cbiAgcmV0dXJuIHJhbmdlO1xufTtcblxudmFyIGUxMCA9IE1hdGguc3FydCg1MCk7XG52YXIgZTUgPSBNYXRoLnNxcnQoMTApO1xudmFyIGUyID0gTWF0aC5zcXJ0KDIpO1xuXG52YXIgdGlja3MgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgY291bnQpIHtcbiAgdmFyIHJldmVyc2UgPSBzdG9wIDwgc3RhcnQsXG4gICAgICBpID0gLTEsXG4gICAgICBuLFxuICAgICAgdGlja3MsXG4gICAgICBzdGVwO1xuXG4gIGlmIChyZXZlcnNlKSBuID0gc3RhcnQsIHN0YXJ0ID0gc3RvcCwgc3RvcCA9IG47XG5cbiAgaWYgKChzdGVwID0gdGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpKSA9PT0gMCB8fCAhaXNGaW5pdGUoc3RlcCkpIHJldHVybiBbXTtcblxuICBpZiAoc3RlcCA+IDApIHtcbiAgICBzdGFydCA9IE1hdGguY2VpbChzdGFydCAvIHN0ZXApO1xuICAgIHN0b3AgPSBNYXRoLmZsb29yKHN0b3AgLyBzdGVwKTtcbiAgICB0aWNrcyA9IG5ldyBBcnJheShuID0gTWF0aC5jZWlsKHN0b3AgLSBzdGFydCArIDEpKTtcbiAgICB3aGlsZSAoKytpIDwgbikgdGlja3NbaV0gPSAoc3RhcnQgKyBpKSAqIHN0ZXA7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnQgPSBNYXRoLmZsb29yKHN0YXJ0ICogc3RlcCk7XG4gICAgc3RvcCA9IE1hdGguY2VpbChzdG9wICogc3RlcCk7XG4gICAgdGlja3MgPSBuZXcgQXJyYXkobiA9IE1hdGguY2VpbChzdGFydCAtIHN0b3AgKyAxKSk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHRpY2tzW2ldID0gKHN0YXJ0IC0gaSkgLyBzdGVwO1xuICB9XG5cbiAgaWYgKHJldmVyc2UpIHRpY2tzLnJldmVyc2UoKTtcblxuICByZXR1cm4gdGlja3M7XG59O1xuXG5mdW5jdGlvbiB0aWNrSW5jcmVtZW50KHN0YXJ0LCBzdG9wLCBjb3VudCkge1xuICB2YXIgc3RlcCA9IChzdG9wIC0gc3RhcnQpIC8gTWF0aC5tYXgoMCwgY291bnQpLFxuICAgICAgcG93ZXIgPSBNYXRoLmZsb29yKE1hdGgubG9nKHN0ZXApIC8gTWF0aC5MTjEwKSxcbiAgICAgIGVycm9yID0gc3RlcCAvIE1hdGgucG93KDEwLCBwb3dlcik7XG4gIHJldHVybiBwb3dlciA+PSAwXG4gICAgICA/IChlcnJvciA+PSBlMTAgPyAxMCA6IGVycm9yID49IGU1ID8gNSA6IGVycm9yID49IGUyID8gMiA6IDEpICogTWF0aC5wb3coMTAsIHBvd2VyKVxuICAgICAgOiAtTWF0aC5wb3coMTAsIC1wb3dlcikgLyAoZXJyb3IgPj0gZTEwID8gMTAgOiBlcnJvciA+PSBlNSA/IDUgOiBlcnJvciA+PSBlMiA/IDIgOiAxKTtcbn1cblxuZnVuY3Rpb24gdGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gIHZhciBzdGVwMCA9IE1hdGguYWJzKHN0b3AgLSBzdGFydCkgLyBNYXRoLm1heCgwLCBjb3VudCksXG4gICAgICBzdGVwMSA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKHN0ZXAwKSAvIE1hdGguTE4xMCkpLFxuICAgICAgZXJyb3IgPSBzdGVwMCAvIHN0ZXAxO1xuICBpZiAoZXJyb3IgPj0gZTEwKSBzdGVwMSAqPSAxMDtcbiAgZWxzZSBpZiAoZXJyb3IgPj0gZTUpIHN0ZXAxICo9IDU7XG4gIGVsc2UgaWYgKGVycm9yID49IGUyKSBzdGVwMSAqPSAyO1xuICByZXR1cm4gc3RvcCA8IHN0YXJ0ID8gLXN0ZXAxIDogc3RlcDE7XG59XG5cbnZhciBzdHVyZ2VzID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiBNYXRoLmNlaWwoTWF0aC5sb2codmFsdWVzLmxlbmd0aCkgLyBNYXRoLkxOMikgKyAxO1xufTtcblxudmFyIGhpc3RvZ3JhbSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdmFsdWUgPSBpZGVudGl0eSxcbiAgICAgIGRvbWFpbiA9IGV4dGVudCxcbiAgICAgIHRocmVzaG9sZCA9IHN0dXJnZXM7XG5cbiAgZnVuY3Rpb24gaGlzdG9ncmFtKGRhdGEpIHtcbiAgICB2YXIgaSxcbiAgICAgICAgbiA9IGRhdGEubGVuZ3RoLFxuICAgICAgICB4LFxuICAgICAgICB2YWx1ZXMgPSBuZXcgQXJyYXkobik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICB2YWx1ZXNbaV0gPSB2YWx1ZShkYXRhW2ldLCBpLCBkYXRhKTtcbiAgICB9XG5cbiAgICB2YXIgeHogPSBkb21haW4odmFsdWVzKSxcbiAgICAgICAgeDAgPSB4elswXSxcbiAgICAgICAgeDEgPSB4elsxXSxcbiAgICAgICAgdHogPSB0aHJlc2hvbGQodmFsdWVzLCB4MCwgeDEpO1xuXG4gICAgLy8gQ29udmVydCBudW1iZXIgb2YgdGhyZXNob2xkcyBpbnRvIHVuaWZvcm0gdGhyZXNob2xkcy5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodHopKSB7XG4gICAgICB0eiA9IHRpY2tTdGVwKHgwLCB4MSwgdHopO1xuICAgICAgdHogPSByYW5nZShNYXRoLmNlaWwoeDAgLyB0eikgKiB0eiwgTWF0aC5mbG9vcih4MSAvIHR6KSAqIHR6LCB0eik7IC8vIGV4Y2x1c2l2ZVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgdGhyZXNob2xkcyBvdXRzaWRlIHRoZSBkb21haW4uXG4gICAgdmFyIG0gPSB0ei5sZW5ndGg7XG4gICAgd2hpbGUgKHR6WzBdIDw9IHgwKSB0ei5zaGlmdCgpLCAtLW07XG4gICAgd2hpbGUgKHR6W20gLSAxXSA+IHgxKSB0ei5wb3AoKSwgLS1tO1xuXG4gICAgdmFyIGJpbnMgPSBuZXcgQXJyYXkobSArIDEpLFxuICAgICAgICBiaW47XG5cbiAgICAvLyBJbml0aWFsaXplIGJpbnMuXG4gICAgZm9yIChpID0gMDsgaSA8PSBtOyArK2kpIHtcbiAgICAgIGJpbiA9IGJpbnNbaV0gPSBbXTtcbiAgICAgIGJpbi54MCA9IGkgPiAwID8gdHpbaSAtIDFdIDogeDA7XG4gICAgICBiaW4ueDEgPSBpIDwgbSA/IHR6W2ldIDogeDE7XG4gICAgfVxuXG4gICAgLy8gQXNzaWduIGRhdGEgdG8gYmlucyBieSB2YWx1ZSwgaWdub3JpbmcgYW55IG91dHNpZGUgdGhlIGRvbWFpbi5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICB4ID0gdmFsdWVzW2ldO1xuICAgICAgaWYgKHgwIDw9IHggJiYgeCA8PSB4MSkge1xuICAgICAgICBiaW5zW2Jpc2VjdFJpZ2h0KHR6LCB4LCAwLCBtKV0ucHVzaChkYXRhW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmlucztcbiAgfVxuXG4gIGhpc3RvZ3JhbS52YWx1ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh2YWx1ZSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoXyksIGhpc3RvZ3JhbSkgOiB2YWx1ZTtcbiAgfTtcblxuICBoaXN0b2dyYW0uZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRvbWFpbiA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoW19bMF0sIF9bMV1dKSwgaGlzdG9ncmFtKSA6IGRvbWFpbjtcbiAgfTtcblxuICBoaXN0b2dyYW0udGhyZXNob2xkcyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0aHJlc2hvbGQgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IEFycmF5LmlzQXJyYXkoXykgPyBjb25zdGFudChzbGljZS5jYWxsKF8pKSA6IGNvbnN0YW50KF8pLCBoaXN0b2dyYW0pIDogdGhyZXNob2xkO1xuICB9O1xuXG4gIHJldHVybiBoaXN0b2dyYW07XG59O1xuXG52YXIgcXVhbnRpbGUgPSBmdW5jdGlvbih2YWx1ZXMsIHAsIHZhbHVlb2YpIHtcbiAgaWYgKHZhbHVlb2YgPT0gbnVsbCkgdmFsdWVvZiA9IG51bWJlcjtcbiAgaWYgKCEobiA9IHZhbHVlcy5sZW5ndGgpKSByZXR1cm47XG4gIGlmICgocCA9ICtwKSA8PSAwIHx8IG4gPCAyKSByZXR1cm4gK3ZhbHVlb2YodmFsdWVzWzBdLCAwLCB2YWx1ZXMpO1xuICBpZiAocCA+PSAxKSByZXR1cm4gK3ZhbHVlb2YodmFsdWVzW24gLSAxXSwgbiAtIDEsIHZhbHVlcyk7XG4gIHZhciBuLFxuICAgICAgaSA9IChuIC0gMSkgKiBwLFxuICAgICAgaTAgPSBNYXRoLmZsb29yKGkpLFxuICAgICAgdmFsdWUwID0gK3ZhbHVlb2YodmFsdWVzW2kwXSwgaTAsIHZhbHVlcyksXG4gICAgICB2YWx1ZTEgPSArdmFsdWVvZih2YWx1ZXNbaTAgKyAxXSwgaTAgKyAxLCB2YWx1ZXMpO1xuICByZXR1cm4gdmFsdWUwICsgKHZhbHVlMSAtIHZhbHVlMCkgKiAoaSAtIGkwKTtcbn07XG5cbnZhciBmcmVlZG1hbkRpYWNvbmlzID0gZnVuY3Rpb24odmFsdWVzLCBtaW4sIG1heCkge1xuICB2YWx1ZXMgPSBtYXAuY2FsbCh2YWx1ZXMsIG51bWJlcikuc29ydChhc2NlbmRpbmcpO1xuICByZXR1cm4gTWF0aC5jZWlsKChtYXggLSBtaW4pIC8gKDIgKiAocXVhbnRpbGUodmFsdWVzLCAwLjc1KSAtIHF1YW50aWxlKHZhbHVlcywgMC4yNSkpICogTWF0aC5wb3codmFsdWVzLmxlbmd0aCwgLTEgLyAzKSkpO1xufTtcblxudmFyIHNjb3R0ID0gZnVuY3Rpb24odmFsdWVzLCBtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5jZWlsKChtYXggLSBtaW4pIC8gKDMuNSAqIGRldmlhdGlvbih2YWx1ZXMpICogTWF0aC5wb3codmFsdWVzLmxlbmd0aCwgLTEgLyAzKSkpO1xufTtcblxudmFyIG1heCA9IGZ1bmN0aW9uKHZhbHVlcywgdmFsdWVvZikge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBpID0gLTEsXG4gICAgICB2YWx1ZSxcbiAgICAgIG1heDtcblxuICBpZiAodmFsdWVvZiA9PSBudWxsKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHsgLy8gRmluZCB0aGUgZmlyc3QgY29tcGFyYWJsZSB2YWx1ZS5cbiAgICAgIGlmICgodmFsdWUgPSB2YWx1ZXNbaV0pICE9IG51bGwgJiYgdmFsdWUgPj0gdmFsdWUpIHtcbiAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7IC8vIENvbXBhcmUgdGhlIHJlbWFpbmluZyB2YWx1ZXMuXG4gICAgICAgICAgaWYgKCh2YWx1ZSA9IHZhbHVlc1tpXSkgIT0gbnVsbCAmJiB2YWx1ZSA+IG1heCkge1xuICAgICAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHsgLy8gRmluZCB0aGUgZmlyc3QgY29tcGFyYWJsZSB2YWx1ZS5cbiAgICAgIGlmICgodmFsdWUgPSB2YWx1ZW9mKHZhbHVlc1tpXSwgaSwgdmFsdWVzKSkgIT0gbnVsbCAmJiB2YWx1ZSA+PSB2YWx1ZSkge1xuICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgd2hpbGUgKCsraSA8IG4pIHsgLy8gQ29tcGFyZSB0aGUgcmVtYWluaW5nIHZhbHVlcy5cbiAgICAgICAgICBpZiAoKHZhbHVlID0gdmFsdWVvZih2YWx1ZXNbaV0sIGksIHZhbHVlcykpICE9IG51bGwgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtYXg7XG59O1xuXG52YXIgbWVhbiA9IGZ1bmN0aW9uKHZhbHVlcywgdmFsdWVvZikge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBtID0gbixcbiAgICAgIGkgPSAtMSxcbiAgICAgIHZhbHVlLFxuICAgICAgc3VtID0gMDtcblxuICBpZiAodmFsdWVvZiA9PSBudWxsKSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICghaXNOYU4odmFsdWUgPSBudW1iZXIodmFsdWVzW2ldKSkpIHN1bSArPSB2YWx1ZTtcbiAgICAgIGVsc2UgLS1tO1xuICAgIH1cbiAgfVxuXG4gIGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAoIWlzTmFOKHZhbHVlID0gbnVtYmVyKHZhbHVlb2YodmFsdWVzW2ldLCBpLCB2YWx1ZXMpKSkpIHN1bSArPSB2YWx1ZTtcbiAgICAgIGVsc2UgLS1tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtKSByZXR1cm4gc3VtIC8gbTtcbn07XG5cbnZhciBtZWRpYW4gPSBmdW5jdGlvbih2YWx1ZXMsIHZhbHVlb2YpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgaSA9IC0xLFxuICAgICAgdmFsdWUsXG4gICAgICBudW1iZXJzID0gW107XG5cbiAgaWYgKHZhbHVlb2YgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAoIWlzTmFOKHZhbHVlID0gbnVtYmVyKHZhbHVlc1tpXSkpKSB7XG4gICAgICAgIG51bWJlcnMucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICghaXNOYU4odmFsdWUgPSBudW1iZXIodmFsdWVvZih2YWx1ZXNbaV0sIGksIHZhbHVlcykpKSkge1xuICAgICAgICBudW1iZXJzLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBxdWFudGlsZShudW1iZXJzLnNvcnQoYXNjZW5kaW5nKSwgMC41KTtcbn07XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uKGFycmF5cykge1xuICB2YXIgbiA9IGFycmF5cy5sZW5ndGgsXG4gICAgICBtLFxuICAgICAgaSA9IC0xLFxuICAgICAgaiA9IDAsXG4gICAgICBtZXJnZWQsXG4gICAgICBhcnJheTtcblxuICB3aGlsZSAoKytpIDwgbikgaiArPSBhcnJheXNbaV0ubGVuZ3RoO1xuICBtZXJnZWQgPSBuZXcgQXJyYXkoaik7XG5cbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgYXJyYXkgPSBhcnJheXNbbl07XG4gICAgbSA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoLS1tID49IDApIHtcbiAgICAgIG1lcmdlZFstLWpdID0gYXJyYXlbbV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1lcmdlZDtcbn07XG5cbnZhciBtaW4gPSBmdW5jdGlvbih2YWx1ZXMsIHZhbHVlb2YpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgaSA9IC0xLFxuICAgICAgdmFsdWUsXG4gICAgICBtaW47XG5cbiAgaWYgKHZhbHVlb2YgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7IC8vIEZpbmQgdGhlIGZpcnN0IGNvbXBhcmFibGUgdmFsdWUuXG4gICAgICBpZiAoKHZhbHVlID0gdmFsdWVzW2ldKSAhPSBudWxsICYmIHZhbHVlID49IHZhbHVlKSB7XG4gICAgICAgIG1pbiA9IHZhbHVlO1xuICAgICAgICB3aGlsZSAoKytpIDwgbikgeyAvLyBDb21wYXJlIHRoZSByZW1haW5pbmcgdmFsdWVzLlxuICAgICAgICAgIGlmICgodmFsdWUgPSB2YWx1ZXNbaV0pICE9IG51bGwgJiYgbWluID4gdmFsdWUpIHtcbiAgICAgICAgICAgIG1pbiA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVsc2Uge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7IC8vIEZpbmQgdGhlIGZpcnN0IGNvbXBhcmFibGUgdmFsdWUuXG4gICAgICBpZiAoKHZhbHVlID0gdmFsdWVvZih2YWx1ZXNbaV0sIGksIHZhbHVlcykpICE9IG51bGwgJiYgdmFsdWUgPj0gdmFsdWUpIHtcbiAgICAgICAgbWluID0gdmFsdWU7XG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7IC8vIENvbXBhcmUgdGhlIHJlbWFpbmluZyB2YWx1ZXMuXG4gICAgICAgICAgaWYgKCh2YWx1ZSA9IHZhbHVlb2YodmFsdWVzW2ldLCBpLCB2YWx1ZXMpKSAhPSBudWxsICYmIG1pbiA+IHZhbHVlKSB7XG4gICAgICAgICAgICBtaW4gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWluO1xufTtcblxudmFyIHBlcm11dGUgPSBmdW5jdGlvbihhcnJheSwgaW5kZXhlcykge1xuICB2YXIgaSA9IGluZGV4ZXMubGVuZ3RoLCBwZXJtdXRlcyA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSkgcGVybXV0ZXNbaV0gPSBhcnJheVtpbmRleGVzW2ldXTtcbiAgcmV0dXJuIHBlcm11dGVzO1xufTtcblxudmFyIHNjYW4gPSBmdW5jdGlvbih2YWx1ZXMsIGNvbXBhcmUpIHtcbiAgaWYgKCEobiA9IHZhbHVlcy5sZW5ndGgpKSByZXR1cm47XG4gIHZhciBuLFxuICAgICAgaSA9IDAsXG4gICAgICBqID0gMCxcbiAgICAgIHhpLFxuICAgICAgeGogPSB2YWx1ZXNbal07XG5cbiAgaWYgKGNvbXBhcmUgPT0gbnVsbCkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIGlmIChjb21wYXJlKHhpID0gdmFsdWVzW2ldLCB4aikgPCAwIHx8IGNvbXBhcmUoeGosIHhqKSAhPT0gMCkge1xuICAgICAgeGogPSB4aSwgaiA9IGk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbXBhcmUoeGosIHhqKSA9PT0gMCkgcmV0dXJuIGo7XG59O1xuXG52YXIgc2h1ZmZsZSA9IGZ1bmN0aW9uKGFycmF5LCBpMCwgaTEpIHtcbiAgdmFyIG0gPSAoaTEgPT0gbnVsbCA/IGFycmF5Lmxlbmd0aCA6IGkxKSAtIChpMCA9IGkwID09IG51bGwgPyAwIDogK2kwKSxcbiAgICAgIHQsXG4gICAgICBpO1xuXG4gIHdoaWxlIChtKSB7XG4gICAgaSA9IE1hdGgucmFuZG9tKCkgKiBtLS0gfCAwO1xuICAgIHQgPSBhcnJheVttICsgaTBdO1xuICAgIGFycmF5W20gKyBpMF0gPSBhcnJheVtpICsgaTBdO1xuICAgIGFycmF5W2kgKyBpMF0gPSB0O1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxudmFyIHN1bSA9IGZ1bmN0aW9uKHZhbHVlcywgdmFsdWVvZikge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBpID0gLTEsXG4gICAgICB2YWx1ZSxcbiAgICAgIHN1bSA9IDA7XG5cbiAgaWYgKHZhbHVlb2YgPT0gbnVsbCkge1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAodmFsdWUgPSArdmFsdWVzW2ldKSBzdW0gKz0gdmFsdWU7IC8vIE5vdGU6IHplcm8gYW5kIG51bGwgYXJlIGVxdWl2YWxlbnQuXG4gICAgfVxuICB9XG5cbiAgZWxzZSB7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICh2YWx1ZSA9ICt2YWx1ZW9mKHZhbHVlc1tpXSwgaSwgdmFsdWVzKSkgc3VtICs9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdW07XG59O1xuXG52YXIgdHJhbnNwb3NlID0gZnVuY3Rpb24obWF0cml4KSB7XG4gIGlmICghKG4gPSBtYXRyaXgubGVuZ3RoKSkgcmV0dXJuIFtdO1xuICBmb3IgKHZhciBpID0gLTEsIG0gPSBtaW4obWF0cml4LCBsZW5ndGgpLCB0cmFuc3Bvc2UgPSBuZXcgQXJyYXkobSk7ICsraSA8IG07KSB7XG4gICAgZm9yICh2YXIgaiA9IC0xLCBuLCByb3cgPSB0cmFuc3Bvc2VbaV0gPSBuZXcgQXJyYXkobik7ICsraiA8IG47KSB7XG4gICAgICByb3dbal0gPSBtYXRyaXhbal1baV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0cmFuc3Bvc2U7XG59O1xuXG5mdW5jdGlvbiBsZW5ndGgoZCkge1xuICByZXR1cm4gZC5sZW5ndGg7XG59XG5cbnZhciB6aXAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRyYW5zcG9zZShhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5iaXNlY3QgPSBiaXNlY3RSaWdodDtcbmV4cG9ydHMuYmlzZWN0UmlnaHQgPSBiaXNlY3RSaWdodDtcbmV4cG9ydHMuYmlzZWN0TGVmdCA9IGJpc2VjdExlZnQ7XG5leHBvcnRzLmFzY2VuZGluZyA9IGFzY2VuZGluZztcbmV4cG9ydHMuYmlzZWN0b3IgPSBiaXNlY3RvcjtcbmV4cG9ydHMuY3Jvc3MgPSBjcm9zcztcbmV4cG9ydHMuZGVzY2VuZGluZyA9IGRlc2NlbmRpbmc7XG5leHBvcnRzLmRldmlhdGlvbiA9IGRldmlhdGlvbjtcbmV4cG9ydHMuZXh0ZW50ID0gZXh0ZW50O1xuZXhwb3J0cy5oaXN0b2dyYW0gPSBoaXN0b2dyYW07XG5leHBvcnRzLnRocmVzaG9sZEZyZWVkbWFuRGlhY29uaXMgPSBmcmVlZG1hbkRpYWNvbmlzO1xuZXhwb3J0cy50aHJlc2hvbGRTY290dCA9IHNjb3R0O1xuZXhwb3J0cy50aHJlc2hvbGRTdHVyZ2VzID0gc3R1cmdlcztcbmV4cG9ydHMubWF4ID0gbWF4O1xuZXhwb3J0cy5tZWFuID0gbWVhbjtcbmV4cG9ydHMubWVkaWFuID0gbWVkaWFuO1xuZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuZXhwb3J0cy5taW4gPSBtaW47XG5leHBvcnRzLnBhaXJzID0gcGFpcnM7XG5leHBvcnRzLnBlcm11dGUgPSBwZXJtdXRlO1xuZXhwb3J0cy5xdWFudGlsZSA9IHF1YW50aWxlO1xuZXhwb3J0cy5yYW5nZSA9IHJhbmdlO1xuZXhwb3J0cy5zY2FuID0gc2NhbjtcbmV4cG9ydHMuc2h1ZmZsZSA9IHNodWZmbGU7XG5leHBvcnRzLnN1bSA9IHN1bTtcbmV4cG9ydHMudGlja3MgPSB0aWNrcztcbmV4cG9ydHMudGlja0luY3JlbWVudCA9IHRpY2tJbmNyZW1lbnQ7XG5leHBvcnRzLnRpY2tTdGVwID0gdGlja1N0ZXA7XG5leHBvcnRzLnRyYW5zcG9zZSA9IHRyYW5zcG9zZTtcbmV4cG9ydHMudmFyaWFuY2UgPSB2YXJpYW5jZTtcbmV4cG9ydHMuemlwID0gemlwO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiLy8gaHR0cHM6Ly9kM2pzLm9yZy9kMy1jb2xsZWN0aW9uLyBWZXJzaW9uIDEuMC40LiBDb3B5cmlnaHQgMjAxNyBNaWtlIEJvc3RvY2suXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBwcmVmaXggPSBcIiRcIjtcblxuZnVuY3Rpb24gTWFwKCkge31cblxuTWFwLnByb3RvdHlwZSA9IG1hcC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBNYXAsXG4gIGhhczogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIChwcmVmaXggKyBrZXkpIGluIHRoaXM7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXNbcHJlZml4ICsga2V5XTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdGhpc1twcmVmaXggKyBrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIHByb3BlcnR5ID0gcHJlZml4ICsga2V5O1xuICAgIHJldHVybiBwcm9wZXJ0eSBpbiB0aGlzICYmIGRlbGV0ZSB0aGlzW3Byb3BlcnR5XTtcbiAgfSxcbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSBkZWxldGUgdGhpc1twcm9wZXJ0eV07XG4gIH0sXG4gIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIGtleXMucHVzaChwcm9wZXJ0eS5zbGljZSgxKSk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH0sXG4gIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSB2YWx1ZXMucHVzaCh0aGlzW3Byb3BlcnR5XSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSxcbiAgZW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgZW50cmllcy5wdXNoKHtrZXk6IHByb3BlcnR5LnNsaWNlKDEpLCB2YWx1ZTogdGhpc1twcm9wZXJ0eV19KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfSxcbiAgc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNpemUgPSAwO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHRoaXMpIGlmIChwcm9wZXJ0eVswXSA9PT0gcHJlZml4KSArK3NpemU7XG4gICAgcmV0dXJuIHNpemU7XG4gIH0sXG4gIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0aGlzKSBpZiAocHJvcGVydHlbMF0gPT09IHByZWZpeCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBlYWNoOiBmdW5jdGlvbihmKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdGhpcykgaWYgKHByb3BlcnR5WzBdID09PSBwcmVmaXgpIGYodGhpc1twcm9wZXJ0eV0sIHByb3BlcnR5LnNsaWNlKDEpLCB0aGlzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFwKG9iamVjdCwgZikge1xuICB2YXIgbWFwID0gbmV3IE1hcDtcblxuICAvLyBDb3B5IGNvbnN0cnVjdG9yLlxuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgTWFwKSBvYmplY3QuZWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7IG1hcC5zZXQoa2V5LCB2YWx1ZSk7IH0pO1xuXG4gIC8vIEluZGV4IGFycmF5IGJ5IG51bWVyaWMgaW5kZXggb3Igc3BlY2lmaWVkIGtleSBmdW5jdGlvbi5cbiAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgdmFyIGkgPSAtMSxcbiAgICAgICAgbiA9IG9iamVjdC5sZW5ndGgsXG4gICAgICAgIG87XG5cbiAgICBpZiAoZiA9PSBudWxsKSB3aGlsZSAoKytpIDwgbikgbWFwLnNldChpLCBvYmplY3RbaV0pO1xuICAgIGVsc2Ugd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQoZihvID0gb2JqZWN0W2ldLCBpLCBvYmplY3QpLCBvKTtcbiAgfVxuXG4gIC8vIENvbnZlcnQgb2JqZWN0IHRvIG1hcC5cbiAgZWxzZSBpZiAob2JqZWN0KSBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSBtYXAuc2V0KGtleSwgb2JqZWN0W2tleV0pO1xuXG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBuZXN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBrZXlzID0gW10sXG4gICAgICBzb3J0S2V5cyA9IFtdLFxuICAgICAgc29ydFZhbHVlcyxcbiAgICAgIHJvbGx1cCxcbiAgICAgIG5lc3Q7XG5cbiAgZnVuY3Rpb24gYXBwbHkoYXJyYXksIGRlcHRoLCBjcmVhdGVSZXN1bHQsIHNldFJlc3VsdCkge1xuICAgIGlmIChkZXB0aCA+PSBrZXlzLmxlbmd0aCkge1xuICAgICAgaWYgKHNvcnRWYWx1ZXMgIT0gbnVsbCkgYXJyYXkuc29ydChzb3J0VmFsdWVzKTtcbiAgICAgIHJldHVybiByb2xsdXAgIT0gbnVsbCA/IHJvbGx1cChhcnJheSkgOiBhcnJheTtcbiAgICB9XG5cbiAgICB2YXIgaSA9IC0xLFxuICAgICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICBrZXkgPSBrZXlzW2RlcHRoKytdLFxuICAgICAgICBrZXlWYWx1ZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHZhbHVlc0J5S2V5ID0gbWFwKCksXG4gICAgICAgIHZhbHVlcyxcbiAgICAgICAgcmVzdWx0ID0gY3JlYXRlUmVzdWx0KCk7XG5cbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHZhbHVlcyA9IHZhbHVlc0J5S2V5LmdldChrZXlWYWx1ZSA9IGtleSh2YWx1ZSA9IGFycmF5W2ldKSArIFwiXCIpKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlc0J5S2V5LnNldChrZXlWYWx1ZSwgW3ZhbHVlXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsdWVzQnlLZXkuZWFjaChmdW5jdGlvbih2YWx1ZXMsIGtleSkge1xuICAgICAgc2V0UmVzdWx0KHJlc3VsdCwga2V5LCBhcHBseSh2YWx1ZXMsIGRlcHRoLCBjcmVhdGVSZXN1bHQsIHNldFJlc3VsdCkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVudHJpZXMobWFwJCQxLCBkZXB0aCkge1xuICAgIGlmICgrK2RlcHRoID4ga2V5cy5sZW5ndGgpIHJldHVybiBtYXAkJDE7XG4gICAgdmFyIGFycmF5LCBzb3J0S2V5ID0gc29ydEtleXNbZGVwdGggLSAxXTtcbiAgICBpZiAocm9sbHVwICE9IG51bGwgJiYgZGVwdGggPj0ga2V5cy5sZW5ndGgpIGFycmF5ID0gbWFwJCQxLmVudHJpZXMoKTtcbiAgICBlbHNlIGFycmF5ID0gW10sIG1hcCQkMS5lYWNoKGZ1bmN0aW9uKHYsIGspIHsgYXJyYXkucHVzaCh7a2V5OiBrLCB2YWx1ZXM6IGVudHJpZXModiwgZGVwdGgpfSk7IH0pO1xuICAgIHJldHVybiBzb3J0S2V5ICE9IG51bGwgPyBhcnJheS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIHNvcnRLZXkoYS5rZXksIGIua2V5KTsgfSkgOiBhcnJheTtcbiAgfVxuXG4gIHJldHVybiBuZXN0ID0ge1xuICAgIG9iamVjdDogZnVuY3Rpb24oYXJyYXkpIHsgcmV0dXJuIGFwcGx5KGFycmF5LCAwLCBjcmVhdGVPYmplY3QsIHNldE9iamVjdCk7IH0sXG4gICAgbWFwOiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gYXBwbHkoYXJyYXksIDAsIGNyZWF0ZU1hcCwgc2V0TWFwKTsgfSxcbiAgICBlbnRyaWVzOiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gZW50cmllcyhhcHBseShhcnJheSwgMCwgY3JlYXRlTWFwLCBzZXRNYXApLCAwKTsgfSxcbiAgICBrZXk6IGZ1bmN0aW9uKGQpIHsga2V5cy5wdXNoKGQpOyByZXR1cm4gbmVzdDsgfSxcbiAgICBzb3J0S2V5czogZnVuY3Rpb24ob3JkZXIpIHsgc29ydEtleXNba2V5cy5sZW5ndGggLSAxXSA9IG9yZGVyOyByZXR1cm4gbmVzdDsgfSxcbiAgICBzb3J0VmFsdWVzOiBmdW5jdGlvbihvcmRlcikgeyBzb3J0VmFsdWVzID0gb3JkZXI7IHJldHVybiBuZXN0OyB9LFxuICAgIHJvbGx1cDogZnVuY3Rpb24oZikgeyByb2xsdXAgPSBmOyByZXR1cm4gbmVzdDsgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gY3JlYXRlT2JqZWN0KCkge1xuICByZXR1cm4ge307XG59XG5cbmZ1bmN0aW9uIHNldE9iamVjdChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwKCkge1xuICByZXR1cm4gbWFwKCk7XG59XG5cbmZ1bmN0aW9uIHNldE1hcChtYXAkJDEsIGtleSwgdmFsdWUpIHtcbiAgbWFwJCQxLnNldChrZXksIHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gU2V0KCkge31cblxudmFyIHByb3RvID0gbWFwLnByb3RvdHlwZTtcblxuU2V0LnByb3RvdHlwZSA9IHNldC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZXQsXG4gIGhhczogcHJvdG8uaGFzLFxuICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFsdWUgKz0gXCJcIjtcbiAgICB0aGlzW3ByZWZpeCArIHZhbHVlXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZW1vdmU6IHByb3RvLnJlbW92ZSxcbiAgY2xlYXI6IHByb3RvLmNsZWFyLFxuICB2YWx1ZXM6IHByb3RvLmtleXMsXG4gIHNpemU6IHByb3RvLnNpemUsXG4gIGVtcHR5OiBwcm90by5lbXB0eSxcbiAgZWFjaDogcHJvdG8uZWFjaFxufTtcblxuZnVuY3Rpb24gc2V0KG9iamVjdCwgZikge1xuICB2YXIgc2V0ID0gbmV3IFNldDtcblxuICAvLyBDb3B5IGNvbnN0cnVjdG9yLlxuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgU2V0KSBvYmplY3QuZWFjaChmdW5jdGlvbih2YWx1ZSkgeyBzZXQuYWRkKHZhbHVlKTsgfSk7XG5cbiAgLy8gT3RoZXJ3aXNlLCBhc3N1bWUgaXTigJlzIGFuIGFycmF5LlxuICBlbHNlIGlmIChvYmplY3QpIHtcbiAgICB2YXIgaSA9IC0xLCBuID0gb2JqZWN0Lmxlbmd0aDtcbiAgICBpZiAoZiA9PSBudWxsKSB3aGlsZSAoKytpIDwgbikgc2V0LmFkZChvYmplY3RbaV0pO1xuICAgIGVsc2Ugd2hpbGUgKCsraSA8IG4pIHNldC5hZGQoZihvYmplY3RbaV0sIGksIG9iamVjdCkpO1xuICB9XG5cbiAgcmV0dXJuIHNldDtcbn1cblxudmFyIGtleXMgPSBmdW5jdGlvbihtYXApIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG1hcCkga2V5cy5wdXNoKGtleSk7XG4gIHJldHVybiBrZXlzO1xufTtcblxudmFyIHZhbHVlcyA9IGZ1bmN0aW9uKG1hcCkge1xuICB2YXIgdmFsdWVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBtYXApIHZhbHVlcy5wdXNoKG1hcFtrZXldKTtcbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbnZhciBlbnRyaWVzID0gZnVuY3Rpb24obWFwKSB7XG4gIHZhciBlbnRyaWVzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBtYXApIGVudHJpZXMucHVzaCh7a2V5OiBrZXksIHZhbHVlOiBtYXBba2V5XX0pO1xuICByZXR1cm4gZW50cmllcztcbn07XG5cbmV4cG9ydHMubmVzdCA9IG5lc3Q7XG5leHBvcnRzLnNldCA9IHNldDtcbmV4cG9ydHMubWFwID0gbWFwO1xuZXhwb3J0cy5rZXlzID0ga2V5cztcbmV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuZXhwb3J0cy5lbnRyaWVzID0gZW50cmllcztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtY29sb3IvIFZlcnNpb24gMS4wLjMuIENvcHlyaWdodCAyMDE3IE1pa2UgQm9zdG9jay5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcblx0KGZhY3RvcnkoKGdsb2JhbC5kMyA9IGdsb2JhbC5kMyB8fCB7fSkpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIGRlZmluZSA9IGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBmYWN0b3J5LCBwcm90b3R5cGUpIHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gZmFjdG9yeS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xufTtcblxuZnVuY3Rpb24gZXh0ZW5kKHBhcmVudCwgZGVmaW5pdGlvbikge1xuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcbiAgZm9yICh2YXIga2V5IGluIGRlZmluaXRpb24pIHByb3RvdHlwZVtrZXldID0gZGVmaW5pdGlvbltrZXldO1xuICByZXR1cm4gcHJvdG90eXBlO1xufVxuXG5mdW5jdGlvbiBDb2xvcigpIHt9XG5cbnZhciBkYXJrZXIgPSAwLjc7XG52YXIgYnJpZ2h0ZXIgPSAxIC8gZGFya2VyO1xuXG52YXIgcmVJID0gXCJcXFxccyooWystXT9cXFxcZCspXFxcXHMqXCI7XG52YXIgcmVOID0gXCJcXFxccyooWystXT9cXFxcZCpcXFxcLj9cXFxcZCsoPzpbZUVdWystXT9cXFxcZCspPylcXFxccypcIjtcbnZhciByZVAgPSBcIlxcXFxzKihbKy1dP1xcXFxkKlxcXFwuP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KSVcXFxccypcIjtcbnZhciByZUhleDMgPSAvXiMoWzAtOWEtZl17M30pJC87XG52YXIgcmVIZXg2ID0gL14jKFswLTlhLWZdezZ9KSQvO1xudmFyIHJlUmdiSW50ZWdlciA9IG5ldyBSZWdFeHAoXCJecmdiXFxcXChcIiArIFtyZUksIHJlSSwgcmVJXSArIFwiXFxcXCkkXCIpO1xudmFyIHJlUmdiUGVyY2VudCA9IG5ldyBSZWdFeHAoXCJecmdiXFxcXChcIiArIFtyZVAsIHJlUCwgcmVQXSArIFwiXFxcXCkkXCIpO1xudmFyIHJlUmdiYUludGVnZXIgPSBuZXcgUmVnRXhwKFwiXnJnYmFcXFxcKFwiICsgW3JlSSwgcmVJLCByZUksIHJlTl0gKyBcIlxcXFwpJFwiKTtcbnZhciByZVJnYmFQZXJjZW50ID0gbmV3IFJlZ0V4cChcIl5yZ2JhXFxcXChcIiArIFtyZVAsIHJlUCwgcmVQLCByZU5dICsgXCJcXFxcKSRcIik7XG52YXIgcmVIc2xQZXJjZW50ID0gbmV3IFJlZ0V4cChcIl5oc2xcXFxcKFwiICsgW3JlTiwgcmVQLCByZVBdICsgXCJcXFxcKSRcIik7XG52YXIgcmVIc2xhUGVyY2VudCA9IG5ldyBSZWdFeHAoXCJeaHNsYVxcXFwoXCIgKyBbcmVOLCByZVAsIHJlUCwgcmVOXSArIFwiXFxcXCkkXCIpO1xuXG52YXIgbmFtZWQgPSB7XG4gIGFsaWNlYmx1ZTogMHhmMGY4ZmYsXG4gIGFudGlxdWV3aGl0ZTogMHhmYWViZDcsXG4gIGFxdWE6IDB4MDBmZmZmLFxuICBhcXVhbWFyaW5lOiAweDdmZmZkNCxcbiAgYXp1cmU6IDB4ZjBmZmZmLFxuICBiZWlnZTogMHhmNWY1ZGMsXG4gIGJpc3F1ZTogMHhmZmU0YzQsXG4gIGJsYWNrOiAweDAwMDAwMCxcbiAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICBibHVlOiAweDAwMDBmZixcbiAgYmx1ZXZpb2xldDogMHg4YTJiZTIsXG4gIGJyb3duOiAweGE1MmEyYSxcbiAgYnVybHl3b29kOiAweGRlYjg4NyxcbiAgY2FkZXRibHVlOiAweDVmOWVhMCxcbiAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gIGNob2NvbGF0ZTogMHhkMjY5MWUsXG4gIGNvcmFsOiAweGZmN2Y1MCxcbiAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICBjb3Juc2lsazogMHhmZmY4ZGMsXG4gIGNyaW1zb246IDB4ZGMxNDNjLFxuICBjeWFuOiAweDAwZmZmZixcbiAgZGFya2JsdWU6IDB4MDAwMDhiLFxuICBkYXJrY3lhbjogMHgwMDhiOGIsXG4gIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICBkYXJrZ3JheTogMHhhOWE5YTksXG4gIGRhcmtncmVlbjogMHgwMDY0MDAsXG4gIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgZGFya2toYWtpOiAweGJkYjc2YixcbiAgZGFya21hZ2VudGE6IDB4OGIwMDhiLFxuICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gIGRhcmtvcmFuZ2U6IDB4ZmY4YzAwLFxuICBkYXJrb3JjaGlkOiAweDk5MzJjYyxcbiAgZGFya3JlZDogMHg4YjAwMDAsXG4gIGRhcmtzYWxtb246IDB4ZTk5NjdhLFxuICBkYXJrc2VhZ3JlZW46IDB4OGZiYzhmLFxuICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgZGFya3NsYXRlZ3JheTogMHgyZjRmNGYsXG4gIGRhcmtzbGF0ZWdyZXk6IDB4MmY0ZjRmLFxuICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgZGFya3Zpb2xldDogMHg5NDAwZDMsXG4gIGRlZXBwaW5rOiAweGZmMTQ5MyxcbiAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICBkaW1ncmF5OiAweDY5Njk2OSxcbiAgZGltZ3JleTogMHg2OTY5NjksXG4gIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICBmaXJlYnJpY2s6IDB4YjIyMjIyLFxuICBmbG9yYWx3aGl0ZTogMHhmZmZhZjAsXG4gIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgZnVjaHNpYTogMHhmZjAwZmYsXG4gIGdhaW5zYm9ybzogMHhkY2RjZGMsXG4gIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICBnb2xkOiAweGZmZDcwMCxcbiAgZ29sZGVucm9kOiAweGRhYTUyMCxcbiAgZ3JheTogMHg4MDgwODAsXG4gIGdyZWVuOiAweDAwODAwMCxcbiAgZ3JlZW55ZWxsb3c6IDB4YWRmZjJmLFxuICBncmV5OiAweDgwODA4MCxcbiAgaG9uZXlkZXc6IDB4ZjBmZmYwLFxuICBob3RwaW5rOiAweGZmNjliNCxcbiAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgaW5kaWdvOiAweDRiMDA4MixcbiAgaXZvcnk6IDB4ZmZmZmYwLFxuICBraGFraTogMHhmMGU2OGMsXG4gIGxhdmVuZGVyOiAweGU2ZTZmYSxcbiAgbGF2ZW5kZXJibHVzaDogMHhmZmYwZjUsXG4gIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gIGxlbW9uY2hpZmZvbjogMHhmZmZhY2QsXG4gIGxpZ2h0Ymx1ZTogMHhhZGQ4ZTYsXG4gIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICBsaWdodGN5YW46IDB4ZTBmZmZmLFxuICBsaWdodGdvbGRlbnJvZHllbGxvdzogMHhmYWZhZDIsXG4gIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gIGxpZ2h0Z3JlZW46IDB4OTBlZTkwLFxuICBsaWdodGdyZXk6IDB4ZDNkM2QzLFxuICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICBsaWdodHNhbG1vbjogMHhmZmEwN2EsXG4gIGxpZ2h0c2VhZ3JlZW46IDB4MjBiMmFhLFxuICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICBsaWdodHNsYXRlZ3JheTogMHg3Nzg4OTksXG4gIGxpZ2h0c2xhdGVncmV5OiAweDc3ODg5OSxcbiAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICBsaWdodHllbGxvdzogMHhmZmZmZTAsXG4gIGxpbWU6IDB4MDBmZjAwLFxuICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICBsaW5lbjogMHhmYWYwZTYsXG4gIG1hZ2VudGE6IDB4ZmYwMGZmLFxuICBtYXJvb246IDB4ODAwMDAwLFxuICBtZWRpdW1hcXVhbWFyaW5lOiAweDY2Y2RhYSxcbiAgbWVkaXVtYmx1ZTogMHgwMDAwY2QsXG4gIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gIG1lZGl1bXB1cnBsZTogMHg5MzcwZGIsXG4gIG1lZGl1bXNlYWdyZWVuOiAweDNjYjM3MSxcbiAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgbWVkaXVtc3ByaW5nZ3JlZW46IDB4MDBmYTlhLFxuICBtZWRpdW10dXJxdW9pc2U6IDB4NDhkMWNjLFxuICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICBtaWRuaWdodGJsdWU6IDB4MTkxOTcwLFxuICBtaW50Y3JlYW06IDB4ZjVmZmZhLFxuICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICBtb2NjYXNpbjogMHhmZmU0YjUsXG4gIG5hdmFqb3doaXRlOiAweGZmZGVhZCxcbiAgbmF2eTogMHgwMDAwODAsXG4gIG9sZGxhY2U6IDB4ZmRmNWU2LFxuICBvbGl2ZTogMHg4MDgwMDAsXG4gIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gIG9yYW5nZTogMHhmZmE1MDAsXG4gIG9yYW5nZXJlZDogMHhmZjQ1MDAsXG4gIG9yY2hpZDogMHhkYTcwZDYsXG4gIHBhbGVnb2xkZW5yb2Q6IDB4ZWVlOGFhLFxuICBwYWxlZ3JlZW46IDB4OThmYjk4LFxuICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgcGFsZXZpb2xldHJlZDogMHhkYjcwOTMsXG4gIHBhcGF5YXdoaXA6IDB4ZmZlZmQ1LFxuICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICBwZXJ1OiAweGNkODUzZixcbiAgcGluazogMHhmZmMwY2IsXG4gIHBsdW06IDB4ZGRhMGRkLFxuICBwb3dkZXJibHVlOiAweGIwZTBlNixcbiAgcHVycGxlOiAweDgwMDA4MCxcbiAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gIHJlZDogMHhmZjAwMDAsXG4gIHJvc3licm93bjogMHhiYzhmOGYsXG4gIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gIHNhZGRsZWJyb3duOiAweDhiNDUxMyxcbiAgc2FsbW9uOiAweGZhODA3MixcbiAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gIHNlYWdyZWVuOiAweDJlOGI1NyxcbiAgc2Vhc2hlbGw6IDB4ZmZmNWVlLFxuICBzaWVubmE6IDB4YTA1MjJkLFxuICBzaWx2ZXI6IDB4YzBjMGMwLFxuICBza3libHVlOiAweDg3Y2VlYixcbiAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgc2xhdGVncmF5OiAweDcwODA5MCxcbiAgc2xhdGVncmV5OiAweDcwODA5MCxcbiAgc25vdzogMHhmZmZhZmEsXG4gIHNwcmluZ2dyZWVuOiAweDAwZmY3ZixcbiAgc3RlZWxibHVlOiAweDQ2ODJiNCxcbiAgdGFuOiAweGQyYjQ4YyxcbiAgdGVhbDogMHgwMDgwODAsXG4gIHRoaXN0bGU6IDB4ZDhiZmQ4LFxuICB0b21hdG86IDB4ZmY2MzQ3LFxuICB0dXJxdW9pc2U6IDB4NDBlMGQwLFxuICB2aW9sZXQ6IDB4ZWU4MmVlLFxuICB3aGVhdDogMHhmNWRlYjMsXG4gIHdoaXRlOiAweGZmZmZmZixcbiAgd2hpdGVzbW9rZTogMHhmNWY1ZjUsXG4gIHllbGxvdzogMHhmZmZmMDAsXG4gIHllbGxvd2dyZWVuOiAweDlhY2QzMlxufTtcblxuZGVmaW5lKENvbG9yLCBjb2xvciwge1xuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkuZGlzcGxheWFibGUoKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpICsgXCJcIjtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICB2YXIgbTtcbiAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCBuZXcgUmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4MGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpLCAxKSkgLy8gI2YwMFxuICAgICAgOiAobSA9IHJlSGV4Ni5leGVjKGZvcm1hdCkpID8gcmdibihwYXJzZUludChtWzFdLCAxNikpIC8vICNmZjAwMDBcbiAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSwgbVsyXSwgbVszXSwgMSkgLy8gcmdiKDI1NSwgMCwgMClcbiAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgMSkgLy8gcmdiKDEwMCUsIDAlLCAwJSlcbiAgICAgIDogKG0gPSByZVJnYmFJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0sIG1bMl0sIG1bM10sIG1bNF0pIC8vIHJnYmEoMjU1LCAwLCAwLCAxKVxuICAgICAgOiAobSA9IHJlUmdiYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgbVs0XSkgLy8gcmdiKDEwMCUsIDAlLCAwJSwgMSlcbiAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgMSkgLy8gaHNsKDEyMCwgNTAlLCA1MCUpXG4gICAgICA6IChtID0gcmVIc2xhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCBtWzRdKSAvLyBoc2xhKDEyMCwgNTAlLCA1MCUsIDEpXG4gICAgICA6IG5hbWVkLmhhc093blByb3BlcnR5KGZvcm1hdCkgPyByZ2JuKG5hbWVkW2Zvcm1hdF0pXG4gICAgICA6IGZvcm1hdCA9PT0gXCJ0cmFuc3BhcmVudFwiID8gbmV3IFJnYihOYU4sIE5hTiwgTmFOLCAwKVxuICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZ2JuKG4pIHtcbiAgcmV0dXJuIG5ldyBSZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmLCAxKTtcbn1cblxuZnVuY3Rpb24gcmdiYShyLCBnLCBiLCBhKSB7XG4gIGlmIChhIDw9IDApIHIgPSBnID0gYiA9IE5hTjtcbiAgcmV0dXJuIG5ldyBSZ2IociwgZywgYiwgYSk7XG59XG5cbmZ1bmN0aW9uIHJnYkNvbnZlcnQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBSZ2I7XG4gIG8gPSBvLnJnYigpO1xuICByZXR1cm4gbmV3IFJnYihvLnIsIG8uZywgby5iLCBvLm9wYWNpdHkpO1xufVxuXG5mdW5jdGlvbiByZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IHJnYkNvbnZlcnQocikgOiBuZXcgUmdiKHIsIGcsIGIsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gUmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5yID0gK3I7XG4gIHRoaXMuZyA9ICtnO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShSZ2IsIHJnYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5yICYmIHRoaXMuciA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuZyAmJiB0aGlzLmcgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmIgJiYgdGhpcy5iIDw9IDI1NSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhID0gdGhpcy5vcGFjaXR5OyBhID0gaXNOYU4oYSkgPyAxIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgYSkpO1xuICAgIHJldHVybiAoYSA9PT0gMSA/IFwicmdiKFwiIDogXCJyZ2JhKFwiKVxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLnIpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmcpIHx8IDApKSArIFwiLCBcIlxuICAgICAgICArIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh0aGlzLmIpIHx8IDApKVxuICAgICAgICArIChhID09PSAxID8gXCIpXCIgOiBcIiwgXCIgKyBhICsgXCIpXCIpO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIGhzbGEoaCwgcywgbCwgYSkge1xuICBpZiAoYSA8PSAwKSBoID0gcyA9IGwgPSBOYU47XG4gIGVsc2UgaWYgKGwgPD0gMCB8fCBsID49IDEpIGggPSBzID0gTmFOO1xuICBlbHNlIGlmIChzIDw9IDApIGggPSBOYU47XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIGEpO1xufVxuXG5mdW5jdGlvbiBoc2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBuZXcgSHNsKG8uaCwgby5zLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IEhzbDtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBvO1xuICBvID0gby5yZ2IoKTtcbiAgdmFyIHIgPSBvLnIgLyAyNTUsXG4gICAgICBnID0gby5nIC8gMjU1LFxuICAgICAgYiA9IG8uYiAvIDI1NSxcbiAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICBoID0gTmFOLFxuICAgICAgcyA9IG1heCAtIG1pbixcbiAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gIGlmIChzKSB7XG4gICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyBzICsgKGcgPCBiKSAqIDY7XG4gICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHMgKyAyO1xuICAgIGVsc2UgaCA9IChyIC0gZykgLyBzICsgNDtcbiAgICBzIC89IGwgPCAwLjUgPyBtYXggKyBtaW4gOiAyIC0gbWF4IC0gbWluO1xuICAgIGggKj0gNjA7XG4gIH0gZWxzZSB7XG4gICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gIH1cbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gaHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBoc2xDb252ZXJ0KGgpIDogbmV3IEhzbChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIEhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoSHNsLCBoc2wsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsICsgKGwgPCAwLjUgPyBsIDogMSAtIGwpICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9LFxuICBkaXNwbGF5YWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMucyAmJiB0aGlzLnMgPD0gMSB8fCBpc05hTih0aGlzLnMpKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmwgJiYgdGhpcy5sIDw9IDEpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH1cbn0pKTtcblxuLyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgOiBoIDwgMTgwID8gbTJcbiAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgIDogbTEpICogMjU1O1xufVxuXG52YXIgZGVnMnJhZCA9IE1hdGguUEkgLyAxODA7XG52YXIgcmFkMmRlZyA9IDE4MCAvIE1hdGguUEk7XG5cbnZhciBLbiA9IDE4O1xudmFyIFhuID0gMC45NTA0NzA7XG52YXIgWW4gPSAxO1xudmFyIFpuID0gMS4wODg4MzA7XG52YXIgdDAgPSA0IC8gMjk7XG52YXIgdDEgPSA2IC8gMjk7XG52YXIgdDIgPSAzICogdDEgKiB0MTtcbnZhciB0MyA9IHQxICogdDEgKiB0MTtcblxuZnVuY3Rpb24gbGFiQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgTGFiKSByZXR1cm4gbmV3IExhYihvLmwsIG8uYSwgby5iLCBvLm9wYWNpdHkpO1xuICBpZiAobyBpbnN0YW5jZW9mIEhjbCkge1xuICAgIHZhciBoID0gby5oICogZGVnMnJhZDtcbiAgICByZXR1cm4gbmV3IExhYihvLmwsIE1hdGguY29zKGgpICogby5jLCBNYXRoLnNpbihoKSAqIG8uYywgby5vcGFjaXR5KTtcbiAgfVxuICBpZiAoIShvIGluc3RhbmNlb2YgUmdiKSkgbyA9IHJnYkNvbnZlcnQobyk7XG4gIHZhciBiID0gcmdiMnh5eihvLnIpLFxuICAgICAgYSA9IHJnYjJ4eXooby5nKSxcbiAgICAgIGwgPSByZ2IyeHl6KG8uYiksXG4gICAgICB4ID0geHl6MmxhYigoMC40MTI0NTY0ICogYiArIDAuMzU3NTc2MSAqIGEgKyAwLjE4MDQzNzUgKiBsKSAvIFhuKSxcbiAgICAgIHkgPSB4eXoybGFiKCgwLjIxMjY3MjkgKiBiICsgMC43MTUxNTIyICogYSArIDAuMDcyMTc1MCAqIGwpIC8gWW4pLFxuICAgICAgeiA9IHh5ejJsYWIoKDAuMDE5MzMzOSAqIGIgKyAwLjExOTE5MjAgKiBhICsgMC45NTAzMDQxICogbCkgLyBabik7XG4gIHJldHVybiBuZXcgTGFiKDExNiAqIHkgLSAxNiwgNTAwICogKHggLSB5KSwgMjAwICogKHkgLSB6KSwgby5vcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gbGFiKGwsIGEsIGIsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBsYWJDb252ZXJ0KGwpIDogbmV3IExhYihsLCBhLCBiLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIExhYihsLCBhLCBiLCBvcGFjaXR5KSB7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLmEgPSArYTtcbiAgdGhpcy5iID0gK2I7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoTGFiLCBsYWIsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCArIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIsIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcjogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgTGFiKHRoaXMubCAtIEtuICogKGsgPT0gbnVsbCA/IDEgOiBrKSwgdGhpcy5hLCB0aGlzLmIsIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHkgPSAodGhpcy5sICsgMTYpIC8gMTE2LFxuICAgICAgICB4ID0gaXNOYU4odGhpcy5hKSA/IHkgOiB5ICsgdGhpcy5hIC8gNTAwLFxuICAgICAgICB6ID0gaXNOYU4odGhpcy5iKSA/IHkgOiB5IC0gdGhpcy5iIC8gMjAwO1xuICAgIHkgPSBZbiAqIGxhYjJ4eXooeSk7XG4gICAgeCA9IFhuICogbGFiMnh5eih4KTtcbiAgICB6ID0gWm4gKiBsYWIyeHl6KHopO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgeHl6MnJnYiggMy4yNDA0NTQyICogeCAtIDEuNTM3MTM4NSAqIHkgLSAwLjQ5ODUzMTQgKiB6KSwgLy8gRDY1IC0+IHNSR0JcbiAgICAgIHh5ejJyZ2IoLTAuOTY5MjY2MCAqIHggKyAxLjg3NjAxMDggKiB5ICsgMC4wNDE1NTYwICogeiksXG4gICAgICB4eXoycmdiKCAwLjA1NTY0MzQgKiB4IC0gMC4yMDQwMjU5ICogeSArIDEuMDU3MjI1MiAqIHopLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfVxufSkpO1xuXG5mdW5jdGlvbiB4eXoybGFiKHQpIHtcbiAgcmV0dXJuIHQgPiB0MyA/IE1hdGgucG93KHQsIDEgLyAzKSA6IHQgLyB0MiArIHQwO1xufVxuXG5mdW5jdGlvbiBsYWIyeHl6KHQpIHtcbiAgcmV0dXJuIHQgPiB0MSA/IHQgKiB0ICogdCA6IHQyICogKHQgLSB0MCk7XG59XG5cbmZ1bmN0aW9uIHh5ejJyZ2IoeCkge1xuICByZXR1cm4gMjU1ICogKHggPD0gMC4wMDMxMzA4ID8gMTIuOTIgKiB4IDogMS4wNTUgKiBNYXRoLnBvdyh4LCAxIC8gMi40KSAtIDAuMDU1KTtcbn1cblxuZnVuY3Rpb24gcmdiMnh5eih4KSB7XG4gIHJldHVybiAoeCAvPSAyNTUpIDw9IDAuMDQwNDUgPyB4IC8gMTIuOTIgOiBNYXRoLnBvdygoeCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xufVxuXG5mdW5jdGlvbiBoY2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIY2wpIHJldHVybiBuZXcgSGNsKG8uaCwgby5jLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBMYWIpKSBvID0gbGFiQ29udmVydChvKTtcbiAgdmFyIGggPSBNYXRoLmF0YW4yKG8uYiwgby5hKSAqIHJhZDJkZWc7XG4gIHJldHVybiBuZXcgSGNsKGggPCAwID8gaCArIDM2MCA6IGgsIE1hdGguc3FydChvLmEgKiBvLmEgKyBvLmIgKiBvLmIpLCBvLmwsIG8ub3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIGhjbChoLCBjLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaGNsQ29udmVydChoKSA6IG5ldyBIY2woaCwgYywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5mdW5jdGlvbiBIY2woaCwgYywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5jID0gK2M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEhjbCwgaGNsLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXI6IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IEhjbCh0aGlzLmgsIHRoaXMuYywgdGhpcy5sIC0gS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBsYWJDb252ZXJ0KHRoaXMpLnJnYigpO1xuICB9XG59KSk7XG5cbnZhciBBID0gLTAuMTQ4NjE7XG52YXIgQiA9ICsxLjc4Mjc3O1xudmFyIEMgPSAtMC4yOTIyNztcbnZhciBEID0gLTAuOTA2NDk7XG52YXIgRSA9ICsxLjk3Mjk0O1xudmFyIEVEID0gRSAqIEQ7XG52YXIgRUIgPSBFICogQjtcbnZhciBCQ19EQSA9IEIgKiBDIC0gRCAqIEE7XG5cbmZ1bmN0aW9uIGN1YmVoZWxpeENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEN1YmVoZWxpeCkgcmV0dXJuIG5ldyBDdWJlaGVsaXgoby5oLCBvLnMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIFJnYikpIG8gPSByZ2JDb252ZXJ0KG8pO1xuICB2YXIgciA9IG8uciAvIDI1NSxcbiAgICAgIGcgPSBvLmcgLyAyNTUsXG4gICAgICBiID0gby5iIC8gMjU1LFxuICAgICAgbCA9IChCQ19EQSAqIGIgKyBFRCAqIHIgLSBFQiAqIGcpIC8gKEJDX0RBICsgRUQgLSBFQiksXG4gICAgICBibCA9IGIgLSBsLFxuICAgICAgayA9IChFICogKGcgLSBsKSAtIEMgKiBibCkgLyBELFxuICAgICAgcyA9IE1hdGguc3FydChrICogayArIGJsICogYmwpIC8gKEUgKiBsICogKDEgLSBsKSksIC8vIE5hTiBpZiBsPTAgb3IgbD0xXG4gICAgICBoID0gcyA/IE1hdGguYXRhbjIoaywgYmwpICogcmFkMmRlZyAtIDEyMCA6IE5hTjtcbiAgcmV0dXJuIG5ldyBDdWJlaGVsaXgoaCA8IDAgPyBoICsgMzYwIDogaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gY3ViZWhlbGl4KGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBjdWJlaGVsaXhDb252ZXJ0KGgpIDogbmV3IEN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIEN1YmVoZWxpeChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoQ3ViZWhlbGl4LCBjdWJlaGVsaXgsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcjogZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEN1YmVoZWxpeCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyOiBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGggPSBpc05hTih0aGlzLmgpID8gMCA6ICh0aGlzLmggKyAxMjApICogZGVnMnJhZCxcbiAgICAgICAgbCA9ICt0aGlzLmwsXG4gICAgICAgIGEgPSBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyAqIGwgKiAoMSAtIGwpLFxuICAgICAgICBjb3NoID0gTWF0aC5jb3MoaCksXG4gICAgICAgIHNpbmggPSBNYXRoLnNpbihoKTtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIDI1NSAqIChsICsgYSAqIChBICogY29zaCArIEIgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoQyAqIGNvc2ggKyBEICogc2luaCkpLFxuICAgICAgMjU1ICogKGwgKyBhICogKEUgKiBjb3NoKSksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9XG59KSk7XG5cbmV4cG9ydHMuY29sb3IgPSBjb2xvcjtcbmV4cG9ydHMucmdiID0gcmdiO1xuZXhwb3J0cy5oc2wgPSBoc2w7XG5leHBvcnRzLmxhYiA9IGxhYjtcbmV4cG9ydHMuaGNsID0gaGNsO1xuZXhwb3J0cy5jdWJlaGVsaXggPSBjdWJlaGVsaXg7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCIvLyBodHRwczovL2QzanMub3JnL2QzLWRpc3BhdGNoLyBWZXJzaW9uIDEuMC4zLiBDb3B5cmlnaHQgMjAxNyBNaWtlIEJvc3RvY2suXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbnZhciBub29wID0ge3ZhbHVlOiBmdW5jdGlvbigpIHt9fTtcblxuZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aCwgXyA9IHt9LCB0OyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEodCA9IGFyZ3VtZW50c1tpXSArIFwiXCIpIHx8ICh0IGluIF8pKSB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIHR5cGU6IFwiICsgdCk7XG4gICAgX1t0XSA9IFtdO1xuICB9XG4gIHJldHVybiBuZXcgRGlzcGF0Y2goXyk7XG59XG5cbmZ1bmN0aW9uIERpc3BhdGNoKF8pIHtcbiAgdGhpcy5fID0gXztcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzLCB0eXBlcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgaWYgKHQgJiYgIXR5cGVzLmhhc093blByb3BlcnR5KHQpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdCk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbkRpc3BhdGNoLnByb3RvdHlwZSA9IGRpc3BhdGNoLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IERpc3BhdGNoLFxuICBvbjogZnVuY3Rpb24odHlwZW5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF8gPSB0aGlzLl8sXG4gICAgICAgIFQgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIsIF8pLFxuICAgICAgICB0LFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIG4gPSBULmxlbmd0aDtcblxuICAgIC8vIElmIG5vIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgY2FsbGJhY2sgb2YgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgJiYgKHQgPSBnZXQoX1t0XSwgdHlwZW5hbWUubmFtZSkpKSByZXR1cm4gdDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBhIHR5cGUgd2FzIHNwZWNpZmllZCwgc2V0IHRoZSBjYWxsYmFjayBmb3IgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiBhIG51bGwgY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmVtb3ZlIGNhbGxiYWNrcyBvZiB0aGUgZ2l2ZW4gbmFtZS5cbiAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBjYWxsYmFjayk7XG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PSBudWxsKSBmb3IgKHQgaW4gXykgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvcHkgPSB7fSwgXyA9IHRoaXMuXztcbiAgICBmb3IgKHZhciB0IGluIF8pIGNvcHlbdF0gPSBfW3RdLnNsaWNlKCk7XG4gICAgcmV0dXJuIG5ldyBEaXNwYXRjaChjb3B5KTtcbiAgfSxcbiAgY2FsbDogZnVuY3Rpb24odHlwZSwgdGhhdCkge1xuICAgIGlmICgobiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyKSA+IDApIGZvciAodmFyIGFyZ3MgPSBuZXcgQXJyYXkobiksIGkgPSAwLCBuLCB0OyBpIDwgbjsgKytpKSBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfSxcbiAgYXBwbHk6IGZ1bmN0aW9uKHR5cGUsIHRoYXQsIGFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodmFyIHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldCh0eXBlLCBuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGgsIGM7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoKGMgPSB0eXBlW2ldKS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gYy52YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAodHlwZVtpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICB0eXBlW2ldID0gbm9vcCwgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSkuY29uY2F0KHR5cGUuc2xpY2UoaSArIDEpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkgdHlwZS5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogY2FsbGJhY2t9KTtcbiAgcmV0dXJuIHR5cGU7XG59XG5cbmV4cG9ydHMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtZHN2LyBWZXJzaW9uIDEuMC41LiBDb3B5cmlnaHQgMjAxNyBNaWtlIEJvc3RvY2suXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG9iamVjdENvbnZlcnRlcihjb2x1bW5zKSB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oXCJkXCIsIFwicmV0dXJuIHtcIiArIGNvbHVtbnMubWFwKGZ1bmN0aW9uKG5hbWUsIGkpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobmFtZSkgKyBcIjogZFtcIiArIGkgKyBcIl1cIjtcbiAgfSkuam9pbihcIixcIikgKyBcIn1cIik7XG59XG5cbmZ1bmN0aW9uIGN1c3RvbUNvbnZlcnRlcihjb2x1bW5zLCBmKSB7XG4gIHZhciBvYmplY3QgPSBvYmplY3RDb252ZXJ0ZXIoY29sdW1ucyk7XG4gIHJldHVybiBmdW5jdGlvbihyb3csIGkpIHtcbiAgICByZXR1cm4gZihvYmplY3Qocm93KSwgaSwgY29sdW1ucyk7XG4gIH07XG59XG5cbi8vIENvbXB1dGUgdW5pcXVlIGNvbHVtbnMgaW4gb3JkZXIgb2YgZGlzY292ZXJ5LlxuZnVuY3Rpb24gaW5mZXJDb2x1bW5zKHJvd3MpIHtcbiAgdmFyIGNvbHVtblNldCA9IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgICBjb2x1bW5zID0gW107XG5cbiAgcm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIGZvciAodmFyIGNvbHVtbiBpbiByb3cpIHtcbiAgICAgIGlmICghKGNvbHVtbiBpbiBjb2x1bW5TZXQpKSB7XG4gICAgICAgIGNvbHVtbnMucHVzaChjb2x1bW5TZXRbY29sdW1uXSA9IGNvbHVtbik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY29sdW1ucztcbn1cblxudmFyIGRzdiA9IGZ1bmN0aW9uKGRlbGltaXRlcikge1xuICB2YXIgcmVGb3JtYXQgPSBuZXcgUmVnRXhwKFwiW1xcXCJcIiArIGRlbGltaXRlciArIFwiXFxuXFxyXVwiKSxcbiAgICAgIGRlbGltaXRlckNvZGUgPSBkZWxpbWl0ZXIuY2hhckNvZGVBdCgwKTtcblxuICBmdW5jdGlvbiBwYXJzZSh0ZXh0LCBmKSB7XG4gICAgdmFyIGNvbnZlcnQsIGNvbHVtbnMsIHJvd3MgPSBwYXJzZVJvd3ModGV4dCwgZnVuY3Rpb24ocm93LCBpKSB7XG4gICAgICBpZiAoY29udmVydCkgcmV0dXJuIGNvbnZlcnQocm93LCBpIC0gMSk7XG4gICAgICBjb2x1bW5zID0gcm93LCBjb252ZXJ0ID0gZiA/IGN1c3RvbUNvbnZlcnRlcihyb3csIGYpIDogb2JqZWN0Q29udmVydGVyKHJvdyk7XG4gICAgfSk7XG4gICAgcm93cy5jb2x1bW5zID0gY29sdW1ucztcbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlUm93cyh0ZXh0LCBmKSB7XG4gICAgdmFyIEVPTCA9IHt9LCAvLyBzZW50aW5lbCB2YWx1ZSBmb3IgZW5kLW9mLWxpbmVcbiAgICAgICAgRU9GID0ge30sIC8vIHNlbnRpbmVsIHZhbHVlIGZvciBlbmQtb2YtZmlsZVxuICAgICAgICByb3dzID0gW10sIC8vIG91dHB1dCByb3dzXG4gICAgICAgIE4gPSB0ZXh0Lmxlbmd0aCxcbiAgICAgICAgSSA9IDAsIC8vIGN1cnJlbnQgY2hhcmFjdGVyIGluZGV4XG4gICAgICAgIG4gPSAwLCAvLyB0aGUgY3VycmVudCBsaW5lIG51bWJlclxuICAgICAgICB0LCAvLyB0aGUgY3VycmVudCB0b2tlblxuICAgICAgICBlb2w7IC8vIGlzIHRoZSBjdXJyZW50IHRva2VuIGZvbGxvd2VkIGJ5IEVPTD9cblxuICAgIGZ1bmN0aW9uIHRva2VuKCkge1xuICAgICAgaWYgKEkgPj0gTikgcmV0dXJuIEVPRjsgLy8gc3BlY2lhbCBjYXNlOiBlbmQgb2YgZmlsZVxuICAgICAgaWYgKGVvbCkgcmV0dXJuIGVvbCA9IGZhbHNlLCBFT0w7IC8vIHNwZWNpYWwgY2FzZTogZW5kIG9mIGxpbmVcblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBxdW90ZXNcbiAgICAgIHZhciBqID0gSSwgYztcbiAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQoaikgPT09IDM0KSB7XG4gICAgICAgIHZhciBpID0gajtcbiAgICAgICAgd2hpbGUgKGkrKyA8IE4pIHtcbiAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkpID09PSAzNCkge1xuICAgICAgICAgICAgaWYgKHRleHQuY2hhckNvZGVBdChpICsgMSkgIT09IDM0KSBicmVhaztcbiAgICAgICAgICAgICsraTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSSA9IGkgKyAyO1xuICAgICAgICBjID0gdGV4dC5jaGFyQ29kZUF0KGkgKyAxKTtcbiAgICAgICAgaWYgKGMgPT09IDEzKSB7XG4gICAgICAgICAgZW9sID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodGV4dC5jaGFyQ29kZUF0KGkgKyAyKSA9PT0gMTApICsrSTtcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSAxMCkge1xuICAgICAgICAgIGVvbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHQuc2xpY2UoaiArIDEsIGkpLnJlcGxhY2UoL1wiXCIvZywgXCJcXFwiXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBjb21tb24gY2FzZTogZmluZCBuZXh0IGRlbGltaXRlciBvciBuZXdsaW5lXG4gICAgICB3aGlsZSAoSSA8IE4pIHtcbiAgICAgICAgdmFyIGsgPSAxO1xuICAgICAgICBjID0gdGV4dC5jaGFyQ29kZUF0KEkrKyk7XG4gICAgICAgIGlmIChjID09PSAxMCkgZW9sID0gdHJ1ZTsgLy8gXFxuXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IDEzKSB7IGVvbCA9IHRydWU7IGlmICh0ZXh0LmNoYXJDb2RlQXQoSSkgPT09IDEwKSArK0ksICsrazsgfSAvLyBcXHJ8XFxyXFxuXG4gICAgICAgIGVsc2UgaWYgKGMgIT09IGRlbGltaXRlckNvZGUpIGNvbnRpbnVlO1xuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShqLCBJIC0gayk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogbGFzdCB0b2tlbiBiZWZvcmUgRU9GXG4gICAgICByZXR1cm4gdGV4dC5zbGljZShqKTtcbiAgICB9XG5cbiAgICB3aGlsZSAoKHQgPSB0b2tlbigpKSAhPT0gRU9GKSB7XG4gICAgICB2YXIgYSA9IFtdO1xuICAgICAgd2hpbGUgKHQgIT09IEVPTCAmJiB0ICE9PSBFT0YpIHtcbiAgICAgICAgYS5wdXNoKHQpO1xuICAgICAgICB0ID0gdG9rZW4oKTtcbiAgICAgIH1cbiAgICAgIGlmIChmICYmIChhID0gZihhLCBuKyspKSA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIHJvd3MucHVzaChhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdChyb3dzLCBjb2x1bW5zKSB7XG4gICAgaWYgKGNvbHVtbnMgPT0gbnVsbCkgY29sdW1ucyA9IGluZmVyQ29sdW1ucyhyb3dzKTtcbiAgICByZXR1cm4gW2NvbHVtbnMubWFwKGZvcm1hdFZhbHVlKS5qb2luKGRlbGltaXRlcildLmNvbmNhdChyb3dzLm1hcChmdW5jdGlvbihyb3cpIHtcbiAgICAgIHJldHVybiBjb2x1bW5zLm1hcChmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFZhbHVlKHJvd1tjb2x1bW5dKTtcbiAgICAgIH0pLmpvaW4oZGVsaW1pdGVyKTtcbiAgICB9KSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFJvd3Mocm93cykge1xuICAgIHJldHVybiByb3dzLm1hcChmb3JtYXRSb3cpLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRSb3cocm93KSB7XG4gICAgcmV0dXJuIHJvdy5tYXAoZm9ybWF0VmFsdWUpLmpvaW4oZGVsaW1pdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dCA9PSBudWxsID8gXCJcIlxuICAgICAgICA6IHJlRm9ybWF0LnRlc3QodGV4dCArPSBcIlwiKSA/IFwiXFxcIlwiICsgdGV4dC5yZXBsYWNlKC9cXFwiL2csIFwiXFxcIlxcXCJcIikgKyBcIlxcXCJcIlxuICAgICAgICA6IHRleHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhcnNlOiBwYXJzZSxcbiAgICBwYXJzZVJvd3M6IHBhcnNlUm93cyxcbiAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICBmb3JtYXRSb3dzOiBmb3JtYXRSb3dzXG4gIH07XG59O1xuXG52YXIgY3N2ID0gZHN2KFwiLFwiKTtcblxudmFyIGNzdlBhcnNlID0gY3N2LnBhcnNlO1xudmFyIGNzdlBhcnNlUm93cyA9IGNzdi5wYXJzZVJvd3M7XG52YXIgY3N2Rm9ybWF0ID0gY3N2LmZvcm1hdDtcbnZhciBjc3ZGb3JtYXRSb3dzID0gY3N2LmZvcm1hdFJvd3M7XG5cbnZhciB0c3YgPSBkc3YoXCJcXHRcIik7XG5cbnZhciB0c3ZQYXJzZSA9IHRzdi5wYXJzZTtcbnZhciB0c3ZQYXJzZVJvd3MgPSB0c3YucGFyc2VSb3dzO1xudmFyIHRzdkZvcm1hdCA9IHRzdi5mb3JtYXQ7XG52YXIgdHN2Rm9ybWF0Um93cyA9IHRzdi5mb3JtYXRSb3dzO1xuXG5leHBvcnRzLmRzdkZvcm1hdCA9IGRzdjtcbmV4cG9ydHMuY3N2UGFyc2UgPSBjc3ZQYXJzZTtcbmV4cG9ydHMuY3N2UGFyc2VSb3dzID0gY3N2UGFyc2VSb3dzO1xuZXhwb3J0cy5jc3ZGb3JtYXQgPSBjc3ZGb3JtYXQ7XG5leHBvcnRzLmNzdkZvcm1hdFJvd3MgPSBjc3ZGb3JtYXRSb3dzO1xuZXhwb3J0cy50c3ZQYXJzZSA9IHRzdlBhcnNlO1xuZXhwb3J0cy50c3ZQYXJzZVJvd3MgPSB0c3ZQYXJzZVJvd3M7XG5leHBvcnRzLnRzdkZvcm1hdCA9IHRzdkZvcm1hdDtcbmV4cG9ydHMudHN2Rm9ybWF0Um93cyA9IHRzdkZvcm1hdFJvd3M7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCIvLyBodHRwczovL2QzanMub3JnL2QzLWZvcm1hdC8gVmVyc2lvbiAxLjIuMC4gQ29weXJpZ2h0IDIwMTcgTWlrZSBCb3N0b2NrLlxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuXHQoZmFjdG9yeSgoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4vLyBzaWduaWZpY2FudCBkaWdpdHMgcCwgd2hlcmUgeCBpcyBwb3NpdGl2ZSBhbmQgcCBpcyBpbiBbMSwgMjFdIG9yIHVuZGVmaW5lZC5cbi8vIEZvciBleGFtcGxlLCBmb3JtYXREZWNpbWFsKDEuMjMpIHJldHVybnMgW1wiMTIzXCIsIDBdLlxudmFyIGZvcm1hdERlY2ltYWwgPSBmdW5jdGlvbih4LCBwKSB7XG4gIGlmICgoaSA9ICh4ID0gcCA/IHgudG9FeHBvbmVudGlhbChwIC0gMSkgOiB4LnRvRXhwb25lbnRpYWwoKSkuaW5kZXhPZihcImVcIikpIDwgMCkgcmV0dXJuIG51bGw7IC8vIE5hTiwgwrFJbmZpbml0eVxuICB2YXIgaSwgY29lZmZpY2llbnQgPSB4LnNsaWNlKDAsIGkpO1xuXG4gIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgLy8gKGUuZy4sIDEuMmUrMykgb3IgdGhlIGZvcm0gXFxkZVstK11cXGQrIChlLmcuLCAxZSszKS5cbiAgcmV0dXJuIFtcbiAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICt4LnNsaWNlKGkgKyAxKVxuICBdO1xufTtcblxudmFyIGV4cG9uZW50ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCA9IGZvcm1hdERlY2ltYWwoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbn07XG5cbnZhciBmb3JtYXRHcm91cCA9IGZ1bmN0aW9uKGdyb3VwaW5nLCB0aG91c2FuZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCB3aWR0aCkge1xuICAgIHZhciBpID0gdmFsdWUubGVuZ3RoLFxuICAgICAgICB0ID0gW10sXG4gICAgICAgIGogPSAwLFxuICAgICAgICBnID0gZ3JvdXBpbmdbMF0sXG4gICAgICAgIGxlbmd0aCA9IDA7XG5cbiAgICB3aGlsZSAoaSA+IDAgJiYgZyA+IDApIHtcbiAgICAgIGlmIChsZW5ndGggKyBnICsgMSA+IHdpZHRoKSBnID0gTWF0aC5tYXgoMSwgd2lkdGggLSBsZW5ndGgpO1xuICAgICAgdC5wdXNoKHZhbHVlLnN1YnN0cmluZyhpIC09IGcsIGkgKyBnKSk7XG4gICAgICBpZiAoKGxlbmd0aCArPSBnICsgMSkgPiB3aWR0aCkgYnJlYWs7XG4gICAgICBnID0gZ3JvdXBpbmdbaiA9IChqICsgMSkgJSBncm91cGluZy5sZW5ndGhdO1xuICAgIH1cblxuICAgIHJldHVybiB0LnJldmVyc2UoKS5qb2luKHRob3VzYW5kcyk7XG4gIH07XG59O1xuXG52YXIgZm9ybWF0TnVtZXJhbHMgPSBmdW5jdGlvbihudW1lcmFscykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvWzAtOV0vZywgZnVuY3Rpb24oaSkge1xuICAgICAgcmV0dXJuIG51bWVyYWxzWytpXTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbnZhciBmb3JtYXREZWZhdWx0ID0gZnVuY3Rpb24oeCwgcCkge1xuICB4ID0geC50b1ByZWNpc2lvbihwKTtcblxuICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgc3dpdGNoICh4W2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOiBpMCA9IGkxID0gaTsgYnJlYWs7XG4gICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgIGNhc2UgXCJlXCI6IGJyZWFrIG91dDtcbiAgICAgIGRlZmF1bHQ6IGlmIChpMCA+IDApIGkwID0gMDsgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGkwID4gMCA/IHguc2xpY2UoMCwgaTApICsgeC5zbGljZShpMSArIDEpIDogeDtcbn07XG5cbnZhciBwcmVmaXhFeHBvbmVudDtcblxudmFyIGZvcm1hdFByZWZpeEF1dG8gPSBmdW5jdGlvbih4LCBwKSB7XG4gIHZhciBkID0gZm9ybWF0RGVjaW1hbCh4LCBwKTtcbiAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICBleHBvbmVudCA9IGRbMV0sXG4gICAgICBpID0gZXhwb25lbnQgLSAocHJlZml4RXhwb25lbnQgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCAvIDMpKSkgKiAzKSArIDEsXG4gICAgICBuID0gY29lZmZpY2llbnQubGVuZ3RoO1xuICByZXR1cm4gaSA9PT0gbiA/IGNvZWZmaWNpZW50XG4gICAgICA6IGkgPiBuID8gY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoaSAtIG4gKyAxKS5qb2luKFwiMFwiKVxuICAgICAgOiBpID4gMCA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGkpICsgXCIuXCIgKyBjb2VmZmljaWVudC5zbGljZShpKVxuICAgICAgOiBcIjAuXCIgKyBuZXcgQXJyYXkoMSAtIGkpLmpvaW4oXCIwXCIpICsgZm9ybWF0RGVjaW1hbCh4LCBNYXRoLm1heCgwLCBwICsgaSAtIDEpKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxufTtcblxudmFyIGZvcm1hdFJvdW5kZWQgPSBmdW5jdGlvbih4LCBwKSB7XG4gIHZhciBkID0gZm9ybWF0RGVjaW1hbCh4LCBwKTtcbiAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICBleHBvbmVudCA9IGRbMV07XG4gIHJldHVybiBleHBvbmVudCA8IDAgPyBcIjAuXCIgKyBuZXcgQXJyYXkoLWV4cG9uZW50KS5qb2luKFwiMFwiKSArIGNvZWZmaWNpZW50XG4gICAgICA6IGNvZWZmaWNpZW50Lmxlbmd0aCA+IGV4cG9uZW50ICsgMSA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGV4cG9uZW50ICsgMSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGV4cG9uZW50ICsgMSlcbiAgICAgIDogY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoZXhwb25lbnQgLSBjb2VmZmljaWVudC5sZW5ndGggKyAyKS5qb2luKFwiMFwiKTtcbn07XG5cbnZhciBmb3JtYXRUeXBlcyA9IHtcbiAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgXCIlXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuICh4ICogMTAwKS50b0ZpeGVkKHApOyB9LFxuICBcImJcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygyKTsgfSxcbiAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICBcImRcIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZygxMCk7IH0sXG4gIFwiZVwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRXhwb25lbnRpYWwocCk7IH0sXG4gIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gIFwiZ1wiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvUHJlY2lzaW9uKHApOyB9LFxuICBcIm9cIjogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5yb3VuZCh4KS50b1N0cmluZyg4KTsgfSxcbiAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gIFwiclwiOiBmb3JtYXRSb3VuZGVkLFxuICBcInNcIjogZm9ybWF0UHJlZml4QXV0byxcbiAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gIFwieFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDE2KTsgfVxufTtcblxuLy8gW1tmaWxsXWFsaWduXVtzaWduXVtzeW1ib2xdWzBdW3dpZHRoXVssXVsucHJlY2lzaW9uXVt0eXBlXVxudmFyIHJlID0gL14oPzooLik/KFs8Pj1eXSkpPyhbK1xcLVxcKCBdKT8oWyQjXSk/KDApPyhcXGQrKT8oLCk/KFxcLlxcZCspPyhbYS16JV0pPyQvaTtcblxuZnVuY3Rpb24gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICByZXR1cm4gbmV3IEZvcm1hdFNwZWNpZmllcihzcGVjaWZpZXIpO1xufVxuXG5mb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlID0gRm9ybWF0U3BlY2lmaWVyLnByb3RvdHlwZTsgLy8gaW5zdGFuY2VvZlxuXG5mdW5jdGlvbiBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gIGlmICghKG1hdGNoID0gcmUuZXhlYyhzcGVjaWZpZXIpKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmb3JtYXQ6IFwiICsgc3BlY2lmaWVyKTtcblxuICB2YXIgbWF0Y2gsXG4gICAgICBmaWxsID0gbWF0Y2hbMV0gfHwgXCIgXCIsXG4gICAgICBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLFxuICAgICAgc2lnbiA9IG1hdGNoWzNdIHx8IFwiLVwiLFxuICAgICAgc3ltYm9sID0gbWF0Y2hbNF0gfHwgXCJcIixcbiAgICAgIHplcm8gPSAhIW1hdGNoWzVdLFxuICAgICAgd2lkdGggPSBtYXRjaFs2XSAmJiArbWF0Y2hbNl0sXG4gICAgICBjb21tYSA9ICEhbWF0Y2hbN10sXG4gICAgICBwcmVjaXNpb24gPSBtYXRjaFs4XSAmJiArbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgICB0eXBlID0gbWF0Y2hbOV0gfHwgXCJcIjtcblxuICAvLyBUaGUgXCJuXCIgdHlwZSBpcyBhbiBhbGlhcyBmb3IgXCIsZ1wiLlxuICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gIC8vIE1hcCBpbnZhbGlkIHR5cGVzIHRvIHRoZSBkZWZhdWx0IGZvcm1hdC5cbiAgZWxzZSBpZiAoIWZvcm1hdFR5cGVzW3R5cGVdKSB0eXBlID0gXCJcIjtcblxuICAvLyBJZiB6ZXJvIGZpbGwgaXMgc3BlY2lmaWVkLCBwYWRkaW5nIGdvZXMgYWZ0ZXIgc2lnbiBhbmQgYmVmb3JlIGRpZ2l0cy5cbiAgaWYgKHplcm8gfHwgKGZpbGwgPT09IFwiMFwiICYmIGFsaWduID09PSBcIj1cIikpIHplcm8gPSB0cnVlLCBmaWxsID0gXCIwXCIsIGFsaWduID0gXCI9XCI7XG5cbiAgdGhpcy5maWxsID0gZmlsbDtcbiAgdGhpcy5hbGlnbiA9IGFsaWduO1xuICB0aGlzLnNpZ24gPSBzaWduO1xuICB0aGlzLnN5bWJvbCA9IHN5bWJvbDtcbiAgdGhpcy56ZXJvID0gemVybztcbiAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICB0aGlzLmNvbW1hID0gY29tbWE7XG4gIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICB0aGlzLnR5cGUgPSB0eXBlO1xufVxuXG5Gb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZpbGxcbiAgICAgICsgdGhpcy5hbGlnblxuICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICsgdGhpcy5zeW1ib2xcbiAgICAgICsgKHRoaXMuemVybyA/IFwiMFwiIDogXCJcIilcbiAgICAgICsgKHRoaXMud2lkdGggPT0gbnVsbCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICArICh0aGlzLmNvbW1hID8gXCIsXCIgOiBcIlwiKVxuICAgICAgKyAodGhpcy5wcmVjaXNpb24gPT0gbnVsbCA/IFwiXCIgOiBcIi5cIiArIE1hdGgubWF4KDAsIHRoaXMucHJlY2lzaW9uIHwgMCkpXG4gICAgICArIHRoaXMudHlwZTtcbn07XG5cbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHg7XG59O1xuXG52YXIgcHJlZml4ZXMgPSBbXCJ5XCIsXCJ6XCIsXCJhXCIsXCJmXCIsXCJwXCIsXCJuXCIsXCLCtVwiLFwibVwiLFwiXCIsXCJrXCIsXCJNXCIsXCJHXCIsXCJUXCIsXCJQXCIsXCJFXCIsXCJaXCIsXCJZXCJdO1xuXG52YXIgZm9ybWF0TG9jYWxlID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBncm91cCA9IGxvY2FsZS5ncm91cGluZyAmJiBsb2NhbGUudGhvdXNhbmRzID8gZm9ybWF0R3JvdXAobG9jYWxlLmdyb3VwaW5nLCBsb2NhbGUudGhvdXNhbmRzKSA6IGlkZW50aXR5LFxuICAgICAgY3VycmVuY3kgPSBsb2NhbGUuY3VycmVuY3ksXG4gICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWwsXG4gICAgICBudW1lcmFscyA9IGxvY2FsZS5udW1lcmFscyA/IGZvcm1hdE51bWVyYWxzKGxvY2FsZS5udW1lcmFscykgOiBpZGVudGl0eSxcbiAgICAgIHBlcmNlbnQgPSBsb2NhbGUucGVyY2VudCB8fCBcIiVcIjtcblxuICBmdW5jdGlvbiBuZXdGb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcik7XG5cbiAgICB2YXIgZmlsbCA9IHNwZWNpZmllci5maWxsLFxuICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgc2lnbiA9IHNwZWNpZmllci5zaWduLFxuICAgICAgICBzeW1ib2wgPSBzcGVjaWZpZXIuc3ltYm9sLFxuICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgIHdpZHRoID0gc3BlY2lmaWVyLndpZHRoLFxuICAgICAgICBjb21tYSA9IHNwZWNpZmllci5jb21tYSxcbiAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgdHlwZSA9IHNwZWNpZmllci50eXBlO1xuXG4gICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgdmFyIHByZWZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVswXSA6IHN5bWJvbCA9PT0gXCIjXCIgJiYgL1tib3hYXS8udGVzdCh0eXBlKSA/IFwiMFwiICsgdHlwZS50b0xvd2VyQ2FzZSgpIDogXCJcIixcbiAgICAgICAgc3VmZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzFdIDogL1slcF0vLnRlc3QodHlwZSkgPyBwZXJjZW50IDogXCJcIjtcblxuICAgIC8vIFdoYXQgZm9ybWF0IGZ1bmN0aW9uIHNob3VsZCB3ZSB1c2U/XG4gICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgLy8gQ2FuIHRoaXMgdHlwZSBnZW5lcmF0ZSBleHBvbmVudGlhbCBub3RhdGlvbj9cbiAgICB2YXIgZm9ybWF0VHlwZSA9IGZvcm1hdFR5cGVzW3R5cGVdLFxuICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHByZWNpc2lvbiBpZiBub3Qgc3BlY2lmaWVkLFxuICAgIC8vIG9yIGNsYW1wIHRoZSBzcGVjaWZpZWQgcHJlY2lzaW9uIHRvIHRoZSBzdXBwb3J0ZWQgcmFuZ2UuXG4gICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgIC8vIEZvciBmaXhlZCBwcmVjaXNpb24sIGl0IG11c3QgYmUgaW4gWzAsIDIwXS5cbiAgICBwcmVjaXNpb24gPSBwcmVjaXNpb24gPT0gbnVsbCA/ICh0eXBlID8gNiA6IDEyKVxuICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigyMCwgcHJlY2lzaW9uKSk7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQodmFsdWUpIHtcbiAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IHN1ZmZpeCxcbiAgICAgICAgICBpLCBuLCBjO1xuXG4gICAgICBpZiAodHlwZSA9PT0gXCJjXCIpIHtcbiAgICAgICAgdmFsdWVTdWZmaXggPSBmb3JtYXRUeXBlKHZhbHVlKSArIHZhbHVlU3VmZml4O1xuICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICt2YWx1ZTtcblxuICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgIHZhciB2YWx1ZU5lZ2F0aXZlID0gdmFsdWUgPCAwO1xuICAgICAgICB2YWx1ZSA9IGZvcm1hdFR5cGUoTWF0aC5hYnModmFsdWUpLCBwcmVjaXNpb24pO1xuXG4gICAgICAgIC8vIElmIGEgbmVnYXRpdmUgdmFsdWUgcm91bmRzIHRvIHplcm8gZHVyaW5nIGZvcm1hdHRpbmcsIHRyZWF0IGFzIHBvc2l0aXZlLlxuICAgICAgICBpZiAodmFsdWVOZWdhdGl2ZSAmJiArdmFsdWUgPT09IDApIHZhbHVlTmVnYXRpdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBDb21wdXRlIHRoZSBwcmVmaXggYW5kIHN1ZmZpeC5cbiAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICB2YWx1ZVN1ZmZpeCA9IHZhbHVlU3VmZml4ICsgKHR5cGUgPT09IFwic1wiID8gcHJlZml4ZXNbOCArIHByZWZpeEV4cG9uZW50IC8gM10gOiBcIlwiKSArICh2YWx1ZU5lZ2F0aXZlICYmIHNpZ24gPT09IFwiKFwiID8gXCIpXCIgOiBcIlwiKTtcblxuICAgICAgICAvLyBCcmVhayB0aGUgZm9ybWF0dGVkIHZhbHVlIGludG8gdGhlIGludGVnZXIg4oCcdmFsdWXigJ0gcGFydCB0aGF0IGNhbiBiZVxuICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgaWYgKG1heWJlU3VmZml4KSB7XG4gICAgICAgICAgaSA9IC0xLCBuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgdmFsdWVTdWZmaXggPSAoYyA9PT0gNDYgPyBkZWNpbWFsICsgdmFsdWUuc2xpY2UoaSArIDEpIDogdmFsdWUuc2xpY2UoaSkpICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgbm90IFwiMFwiLCBncm91cGluZyBpcyBhcHBsaWVkIGJlZm9yZSBwYWRkaW5nLlxuICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHBhZGRpbmcuXG4gICAgICB2YXIgbGVuZ3RoID0gdmFsdWVQcmVmaXgubGVuZ3RoICsgdmFsdWUubGVuZ3RoICsgdmFsdWVTdWZmaXgubGVuZ3RoLFxuICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAvLyBJZiB0aGUgZmlsbCBjaGFyYWN0ZXIgaXMgXCIwXCIsIGdyb3VwaW5nIGlzIGFwcGxpZWQgYWZ0ZXIgcGFkZGluZy5cbiAgICAgIGlmIChjb21tYSAmJiB6ZXJvKSB2YWx1ZSA9IGdyb3VwKHBhZGRpbmcgKyB2YWx1ZSwgcGFkZGluZy5sZW5ndGggPyB3aWR0aCAtIHZhbHVlU3VmZml4Lmxlbmd0aCA6IEluZmluaXR5KSwgcGFkZGluZyA9IFwiXCI7XG5cbiAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgc3dpdGNoIChhbGlnbikge1xuICAgICAgICBjYXNlIFwiPFwiOiB2YWx1ZSA9IHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiPVwiOiB2YWx1ZSA9IHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiXlwiOiB2YWx1ZSA9IHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiB2YWx1ZSA9IHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7IGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVtZXJhbHModmFsdWUpO1xuICAgIH1cblxuICAgIGZvcm1hdC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllciArIFwiXCI7XG4gICAgfTtcblxuICAgIHJldHVybiBmb3JtYXQ7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRQcmVmaXgoc3BlY2lmaWVyLCB2YWx1ZSkge1xuICAgIHZhciBmID0gbmV3Rm9ybWF0KChzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSwgc3BlY2lmaWVyLnR5cGUgPSBcImZcIiwgc3BlY2lmaWVyKSksXG4gICAgICAgIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgayA9IE1hdGgucG93KDEwLCAtZSksXG4gICAgICAgIHByZWZpeCA9IHByZWZpeGVzWzggKyBlIC8gM107XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZihrICogdmFsdWUpICsgcHJlZml4O1xuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvcm1hdDogbmV3Rm9ybWF0LFxuICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gIH07XG59O1xuXG52YXIgbG9jYWxlO1xuXG5cblxuZGVmYXVsdExvY2FsZSh7XG4gIGRlY2ltYWw6IFwiLlwiLFxuICB0aG91c2FuZHM6IFwiLFwiLFxuICBncm91cGluZzogWzNdLFxuICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxufSk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRMb2NhbGUoZGVmaW5pdGlvbikge1xuICBsb2NhbGUgPSBmb3JtYXRMb2NhbGUoZGVmaW5pdGlvbik7XG4gIGV4cG9ydHMuZm9ybWF0ID0gbG9jYWxlLmZvcm1hdDtcbiAgZXhwb3J0cy5mb3JtYXRQcmVmaXggPSBsb2NhbGUuZm9ybWF0UHJlZml4O1xuICByZXR1cm4gbG9jYWxlO1xufVxuXG52YXIgcHJlY2lzaW9uRml4ZWQgPSBmdW5jdGlvbihzdGVwKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCAtZXhwb25lbnQoTWF0aC5hYnMoc3RlcCkpKTtcbn07XG5cbnZhciBwcmVjaXNpb25QcmVmaXggPSBmdW5jdGlvbihzdGVwLCB2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5tYXgoLTgsIE1hdGgubWluKDgsIE1hdGguZmxvb3IoZXhwb25lbnQodmFsdWUpIC8gMykpKSAqIDMgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpO1xufTtcblxudmFyIHByZWNpc2lvblJvdW5kID0gZnVuY3Rpb24oc3RlcCwgbWF4KSB7XG4gIHN0ZXAgPSBNYXRoLmFicyhzdGVwKSwgbWF4ID0gTWF0aC5hYnMobWF4KSAtIHN0ZXA7XG4gIHJldHVybiBNYXRoLm1heCgwLCBleHBvbmVudChtYXgpIC0gZXhwb25lbnQoc3RlcCkpICsgMTtcbn07XG5cbmV4cG9ydHMuZm9ybWF0RGVmYXVsdExvY2FsZSA9IGRlZmF1bHRMb2NhbGU7XG5leHBvcnRzLmZvcm1hdExvY2FsZSA9IGZvcm1hdExvY2FsZTtcbmV4cG9ydHMuZm9ybWF0U3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyO1xuZXhwb3J0cy5wcmVjaXNpb25GaXhlZCA9IHByZWNpc2lvbkZpeGVkO1xuZXhwb3J0cy5wcmVjaXNpb25QcmVmaXggPSBwcmVjaXNpb25QcmVmaXg7XG5leHBvcnRzLnByZWNpc2lvblJvdW5kID0gcHJlY2lzaW9uUm91bmQ7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCIvLyBodHRwczovL2QzanMub3JnL2QzLWdlby8gVmVyc2lvbiAxLjYuNC4gQ29weXJpZ2h0IDIwMTcgTWlrZSBCb3N0b2NrLlxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCdkMy1hcnJheScpKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAnZDMtYXJyYXknXSwgZmFjdG9yeSkgOlxuXHQoZmFjdG9yeSgoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSxnbG9iYWwuZDMpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzLGQzQXJyYXkpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyBBZGRzIGZsb2F0aW5nIHBvaW50IG51bWJlcnMgd2l0aCB0d2ljZSB0aGUgbm9ybWFsIHByZWNpc2lvbi5cbi8vIFJlZmVyZW5jZTogSi4gUi4gU2hld2NodWssIEFkYXB0aXZlIFByZWNpc2lvbiBGbG9hdGluZy1Qb2ludCBBcml0aG1ldGljIGFuZFxuLy8gRmFzdCBSb2J1c3QgR2VvbWV0cmljIFByZWRpY2F0ZXMsIERpc2NyZXRlICYgQ29tcHV0YXRpb25hbCBHZW9tZXRyeSAxOCgzKVxuLy8gMzA14oCTMzYzICgxOTk3KS5cbi8vIENvZGUgYWRhcHRlZCBmcm9tIEdlb2dyYXBoaWNMaWIgYnkgQ2hhcmxlcyBGLiBGLiBLYXJuZXksXG4vLyBodHRwOi8vZ2VvZ3JhcGhpY2xpYi5zb3VyY2Vmb3JnZS5uZXQvXG5cbnZhciBhZGRlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEFkZGVyO1xufTtcblxuZnVuY3Rpb24gQWRkZXIoKSB7XG4gIHRoaXMucmVzZXQoKTtcbn1cblxuQWRkZXIucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogQWRkZXIsXG4gIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnMgPSAvLyByb3VuZGVkIHZhbHVlXG4gICAgdGhpcy50ID0gMDsgLy8gZXhhY3QgZXJyb3JcbiAgfSxcbiAgYWRkOiBmdW5jdGlvbih5KSB7XG4gICAgYWRkKHRlbXAsIHksIHRoaXMudCk7XG4gICAgYWRkKHRoaXMsIHRlbXAucywgdGhpcy5zKTtcbiAgICBpZiAodGhpcy5zKSB0aGlzLnQgKz0gdGVtcC50O1xuICAgIGVsc2UgdGhpcy5zID0gdGVtcC50O1xuICB9LFxuICB2YWx1ZU9mOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zO1xuICB9XG59O1xuXG52YXIgdGVtcCA9IG5ldyBBZGRlcjtcblxuZnVuY3Rpb24gYWRkKGFkZGVyLCBhLCBiKSB7XG4gIHZhciB4ID0gYWRkZXIucyA9IGEgKyBiLFxuICAgICAgYnYgPSB4IC0gYSxcbiAgICAgIGF2ID0geCAtIGJ2O1xuICBhZGRlci50ID0gKGEgLSBhdikgKyAoYiAtIGJ2KTtcbn1cblxudmFyIGVwc2lsb24gPSAxZS02O1xudmFyIGVwc2lsb24yID0gMWUtMTI7XG52YXIgcGkgPSBNYXRoLlBJO1xudmFyIGhhbGZQaSA9IHBpIC8gMjtcbnZhciBxdWFydGVyUGkgPSBwaSAvIDQ7XG52YXIgdGF1ID0gcGkgKiAyO1xuXG52YXIgZGVncmVlcyA9IDE4MCAvIHBpO1xudmFyIHJhZGlhbnMgPSBwaSAvIDE4MDtcblxudmFyIGFicyA9IE1hdGguYWJzO1xudmFyIGF0YW4gPSBNYXRoLmF0YW47XG52YXIgYXRhbjIgPSBNYXRoLmF0YW4yO1xudmFyIGNvcyA9IE1hdGguY29zO1xudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZXhwID0gTWF0aC5leHA7XG5cbnZhciBsb2cgPSBNYXRoLmxvZztcbnZhciBwb3cgPSBNYXRoLnBvdztcbnZhciBzaW4gPSBNYXRoLnNpbjtcbnZhciBzaWduID0gTWF0aC5zaWduIHx8IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAwID8gMSA6IHggPCAwID8gLTEgOiAwOyB9O1xudmFyIHNxcnQgPSBNYXRoLnNxcnQ7XG52YXIgdGFuID0gTWF0aC50YW47XG5cbmZ1bmN0aW9uIGFjb3MoeCkge1xuICByZXR1cm4geCA+IDEgPyAwIDogeCA8IC0xID8gcGkgOiBNYXRoLmFjb3MoeCk7XG59XG5cbmZ1bmN0aW9uIGFzaW4oeCkge1xuICByZXR1cm4geCA+IDEgPyBoYWxmUGkgOiB4IDwgLTEgPyAtaGFsZlBpIDogTWF0aC5hc2luKHgpO1xufVxuXG5mdW5jdGlvbiBoYXZlcnNpbih4KSB7XG4gIHJldHVybiAoeCA9IHNpbih4IC8gMikpICogeDtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmZ1bmN0aW9uIHN0cmVhbUdlb21ldHJ5KGdlb21ldHJ5LCBzdHJlYW0pIHtcbiAgaWYgKGdlb21ldHJ5ICYmIHN0cmVhbUdlb21ldHJ5VHlwZS5oYXNPd25Qcm9wZXJ0eShnZW9tZXRyeS50eXBlKSkge1xuICAgIHN0cmVhbUdlb21ldHJ5VHlwZVtnZW9tZXRyeS50eXBlXShnZW9tZXRyeSwgc3RyZWFtKTtcbiAgfVxufVxuXG52YXIgc3RyZWFtT2JqZWN0VHlwZSA9IHtcbiAgRmVhdHVyZTogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW1HZW9tZXRyeShvYmplY3QuZ2VvbWV0cnksIHN0cmVhbSk7XG4gIH0sXG4gIEZlYXR1cmVDb2xsZWN0aW9uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBmZWF0dXJlcyA9IG9iamVjdC5mZWF0dXJlcywgaSA9IC0xLCBuID0gZmVhdHVyZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1HZW9tZXRyeShmZWF0dXJlc1tpXS5nZW9tZXRyeSwgc3RyZWFtKTtcbiAgfVxufTtcblxudmFyIHN0cmVhbUdlb21ldHJ5VHlwZSA9IHtcbiAgU3BoZXJlOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbS5zcGhlcmUoKTtcbiAgfSxcbiAgUG9pbnQ6IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0LmNvb3JkaW5hdGVzO1xuICAgIHN0cmVhbS5wb2ludChvYmplY3RbMF0sIG9iamVjdFsxXSwgb2JqZWN0WzJdKTtcbiAgfSxcbiAgTXVsdGlQb2ludDogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgb2JqZWN0ID0gY29vcmRpbmF0ZXNbaV0sIHN0cmVhbS5wb2ludChvYmplY3RbMF0sIG9iamVjdFsxXSwgb2JqZWN0WzJdKTtcbiAgfSxcbiAgTGluZVN0cmluZzogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICBzdHJlYW1MaW5lKG9iamVjdC5jb29yZGluYXRlcywgc3RyZWFtLCAwKTtcbiAgfSxcbiAgTXVsdGlMaW5lU3RyaW5nOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IG9iamVjdC5jb29yZGluYXRlcywgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1MaW5lKGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0sIDApO1xuICB9LFxuICBQb2x5Z29uOiBmdW5jdGlvbihvYmplY3QsIHN0cmVhbSkge1xuICAgIHN0cmVhbVBvbHlnb24ob2JqZWN0LmNvb3JkaW5hdGVzLCBzdHJlYW0pO1xuICB9LFxuICBNdWx0aVBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgc3RyZWFtKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0gb2JqZWN0LmNvb3JkaW5hdGVzLCBpID0gLTEsIG4gPSBjb29yZGluYXRlcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIHN0cmVhbVBvbHlnb24oY29vcmRpbmF0ZXNbaV0sIHN0cmVhbSk7XG4gIH0sXG4gIEdlb21ldHJ5Q29sbGVjdGlvbjogZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgICB2YXIgZ2VvbWV0cmllcyA9IG9iamVjdC5nZW9tZXRyaWVzLCBpID0gLTEsIG4gPSBnZW9tZXRyaWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgc3RyZWFtR2VvbWV0cnkoZ2VvbWV0cmllc1tpXSwgc3RyZWFtKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc3RyZWFtTGluZShjb29yZGluYXRlcywgc3RyZWFtLCBjbG9zZWQpIHtcbiAgdmFyIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aCAtIGNsb3NlZCwgY29vcmRpbmF0ZTtcbiAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICB3aGlsZSAoKytpIDwgbikgY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0ucG9pbnQoY29vcmRpbmF0ZVswXSwgY29vcmRpbmF0ZVsxXSwgY29vcmRpbmF0ZVsyXSk7XG4gIHN0cmVhbS5saW5lRW5kKCk7XG59XG5cbmZ1bmN0aW9uIHN0cmVhbVBvbHlnb24oY29vcmRpbmF0ZXMsIHN0cmVhbSkge1xuICB2YXIgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICBzdHJlYW0ucG9seWdvblN0YXJ0KCk7XG4gIHdoaWxlICgrK2kgPCBuKSBzdHJlYW1MaW5lKGNvb3JkaW5hdGVzW2ldLCBzdHJlYW0sIDEpO1xuICBzdHJlYW0ucG9seWdvbkVuZCgpO1xufVxuXG52YXIgZ2VvU3RyZWFtID0gZnVuY3Rpb24ob2JqZWN0LCBzdHJlYW0pIHtcbiAgaWYgKG9iamVjdCAmJiBzdHJlYW1PYmplY3RUeXBlLmhhc093blByb3BlcnR5KG9iamVjdC50eXBlKSkge1xuICAgIHN0cmVhbU9iamVjdFR5cGVbb2JqZWN0LnR5cGVdKG9iamVjdCwgc3RyZWFtKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJlYW1HZW9tZXRyeShvYmplY3QsIHN0cmVhbSk7XG4gIH1cbn07XG5cbnZhciBhcmVhUmluZ1N1bSA9IGFkZGVyKCk7XG5cbnZhciBhcmVhU3VtID0gYWRkZXIoKTtcbnZhciBsYW1iZGEwMDtcbnZhciBwaGkwMDtcbnZhciBsYW1iZGEwO1xudmFyIGNvc1BoaTA7XG52YXIgc2luUGhpMDtcblxudmFyIGFyZWFTdHJlYW0gPSB7XG4gIHBvaW50OiBub29wLFxuICBsaW5lU3RhcnQ6IG5vb3AsXG4gIGxpbmVFbmQ6IG5vb3AsXG4gIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgYXJlYVJpbmdTdW0ucmVzZXQoKTtcbiAgICBhcmVhU3RyZWFtLmxpbmVTdGFydCA9IGFyZWFSaW5nU3RhcnQ7XG4gICAgYXJlYVN0cmVhbS5saW5lRW5kID0gYXJlYVJpbmdFbmQ7XG4gIH0sXG4gIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmVhUmluZyA9ICthcmVhUmluZ1N1bTtcbiAgICBhcmVhU3VtLmFkZChhcmVhUmluZyA8IDAgPyB0YXUgKyBhcmVhUmluZyA6IGFyZWFSaW5nKTtcbiAgICB0aGlzLmxpbmVTdGFydCA9IHRoaXMubGluZUVuZCA9IHRoaXMucG9pbnQgPSBub29wO1xuICB9LFxuICBzcGhlcmU6IGZ1bmN0aW9uKCkge1xuICAgIGFyZWFTdW0uYWRkKHRhdSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFyZWFSaW5nU3RhcnQoKSB7XG4gIGFyZWFTdHJlYW0ucG9pbnQgPSBhcmVhUG9pbnRGaXJzdDtcbn1cblxuZnVuY3Rpb24gYXJlYVJpbmdFbmQoKSB7XG4gIGFyZWFQb2ludChsYW1iZGEwMCwgcGhpMDApO1xufVxuXG5mdW5jdGlvbiBhcmVhUG9pbnRGaXJzdChsYW1iZGEsIHBoaSkge1xuICBhcmVhU3RyZWFtLnBvaW50ID0gYXJlYVBvaW50O1xuICBsYW1iZGEwMCA9IGxhbWJkYSwgcGhpMDAgPSBwaGk7XG4gIGxhbWJkYSAqPSByYWRpYW5zLCBwaGkgKj0gcmFkaWFucztcbiAgbGFtYmRhMCA9IGxhbWJkYSwgY29zUGhpMCA9IGNvcyhwaGkgPSBwaGkgLyAyICsgcXVhcnRlclBpKSwgc2luUGhpMCA9IHNpbihwaGkpO1xufVxuXG5mdW5jdGlvbiBhcmVhUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgbGFtYmRhICo9IHJhZGlhbnMsIHBoaSAqPSByYWRpYW5zO1xuICBwaGkgPSBwaGkgLyAyICsgcXVhcnRlclBpOyAvLyBoYWxmIHRoZSBhbmd1bGFyIGRpc3RhbmNlIGZyb20gc291dGggcG9sZVxuXG4gIC8vIFNwaGVyaWNhbCBleGNlc3MgRSBmb3IgYSBzcGhlcmljYWwgdHJpYW5nbGUgd2l0aCB2ZXJ0aWNlczogc291dGggcG9sZSxcbiAgLy8gcHJldmlvdXMgcG9pbnQsIGN1cnJlbnQgcG9pbnQuICBVc2VzIGEgZm9ybXVsYSBkZXJpdmVkIGZyb20gQ2Fnbm9saeKAmXNcbiAgLy8gdGhlb3JlbS4gIFNlZSBUb2RodW50ZXIsIFNwaGVyaWNhbCBUcmlnLiAoMTg3MSksIFNlYy4gMTAzLCBFcS4gKDIpLlxuICB2YXIgZExhbWJkYSA9IGxhbWJkYSAtIGxhbWJkYTAsXG4gICAgICBzZExhbWJkYSA9IGRMYW1iZGEgPj0gMCA/IDEgOiAtMSxcbiAgICAgIGFkTGFtYmRhID0gc2RMYW1iZGEgKiBkTGFtYmRhLFxuICAgICAgY29zUGhpID0gY29zKHBoaSksXG4gICAgICBzaW5QaGkgPSBzaW4ocGhpKSxcbiAgICAgIGsgPSBzaW5QaGkwICogc2luUGhpLFxuICAgICAgdSA9IGNvc1BoaTAgKiBjb3NQaGkgKyBrICogY29zKGFkTGFtYmRhKSxcbiAgICAgIHYgPSBrICogc2RMYW1iZGEgKiBzaW4oYWRMYW1iZGEpO1xuICBhcmVhUmluZ1N1bS5hZGQoYXRhbjIodiwgdSkpO1xuXG4gIC8vIEFkdmFuY2UgdGhlIHByZXZpb3VzIHBvaW50cy5cbiAgbGFtYmRhMCA9IGxhbWJkYSwgY29zUGhpMCA9IGNvc1BoaSwgc2luUGhpMCA9IHNpblBoaTtcbn1cblxudmFyIGFyZWEgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgYXJlYVN1bS5yZXNldCgpO1xuICBnZW9TdHJlYW0ob2JqZWN0LCBhcmVhU3RyZWFtKTtcbiAgcmV0dXJuIGFyZWFTdW0gKiAyO1xufTtcblxuZnVuY3Rpb24gc3BoZXJpY2FsKGNhcnRlc2lhbikge1xuICByZXR1cm4gW2F0YW4yKGNhcnRlc2lhblsxXSwgY2FydGVzaWFuWzBdKSwgYXNpbihjYXJ0ZXNpYW5bMl0pXTtcbn1cblxuZnVuY3Rpb24gY2FydGVzaWFuKHNwaGVyaWNhbCkge1xuICB2YXIgbGFtYmRhID0gc3BoZXJpY2FsWzBdLCBwaGkgPSBzcGhlcmljYWxbMV0sIGNvc1BoaSA9IGNvcyhwaGkpO1xuICByZXR1cm4gW2Nvc1BoaSAqIGNvcyhsYW1iZGEpLCBjb3NQaGkgKiBzaW4obGFtYmRhKSwgc2luKHBoaSldO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW5Eb3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW5Dcm9zcyhhLCBiKSB7XG4gIHJldHVybiBbYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSwgYVsyXSAqIGJbMF0gLSBhWzBdICogYlsyXSwgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXV07XG59XG5cbi8vIFRPRE8gcmV0dXJuIGFcbmZ1bmN0aW9uIGNhcnRlc2lhbkFkZEluUGxhY2UoYSwgYikge1xuICBhWzBdICs9IGJbMF0sIGFbMV0gKz0gYlsxXSwgYVsyXSArPSBiWzJdO1xufVxuXG5mdW5jdGlvbiBjYXJ0ZXNpYW5TY2FsZSh2ZWN0b3IsIGspIHtcbiAgcmV0dXJuIFt2ZWN0b3JbMF0gKiBrLCB2ZWN0b3JbMV0gKiBrLCB2ZWN0b3JbMl0gKiBrXTtcbn1cblxuLy8gVE9ETyByZXR1cm4gZFxuZnVuY3Rpb24gY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShkKSB7XG4gIHZhciBsID0gc3FydChkWzBdICogZFswXSArIGRbMV0gKiBkWzFdICsgZFsyXSAqIGRbMl0pO1xuICBkWzBdIC89IGwsIGRbMV0gLz0gbCwgZFsyXSAvPSBsO1xufVxuXG52YXIgbGFtYmRhMCQxO1xudmFyIHBoaTA7XG52YXIgbGFtYmRhMTtcbnZhciBwaGkxO1xudmFyIGxhbWJkYTI7XG52YXIgbGFtYmRhMDAkMTtcbnZhciBwaGkwMCQxO1xudmFyIHAwO1xudmFyIGRlbHRhU3VtID0gYWRkZXIoKTtcbnZhciByYW5nZXM7XG52YXIgcmFuZ2UkMTtcblxudmFyIGJvdW5kc1N0cmVhbSA9IHtcbiAgcG9pbnQ6IGJvdW5kc1BvaW50LFxuICBsaW5lU3RhcnQ6IGJvdW5kc0xpbmVTdGFydCxcbiAgbGluZUVuZDogYm91bmRzTGluZUVuZCxcbiAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICBib3VuZHNTdHJlYW0ucG9pbnQgPSBib3VuZHNSaW5nUG9pbnQ7XG4gICAgYm91bmRzU3RyZWFtLmxpbmVTdGFydCA9IGJvdW5kc1JpbmdTdGFydDtcbiAgICBib3VuZHNTdHJlYW0ubGluZUVuZCA9IGJvdW5kc1JpbmdFbmQ7XG4gICAgZGVsdGFTdW0ucmVzZXQoKTtcbiAgICBhcmVhU3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICB9LFxuICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICBhcmVhU3RyZWFtLnBvbHlnb25FbmQoKTtcbiAgICBib3VuZHNTdHJlYW0ucG9pbnQgPSBib3VuZHNQb2ludDtcbiAgICBib3VuZHNTdHJlYW0ubGluZVN0YXJ0ID0gYm91bmRzTGluZVN0YXJ0O1xuICAgIGJvdW5kc1N0cmVhbS5saW5lRW5kID0gYm91bmRzTGluZUVuZDtcbiAgICBpZiAoYXJlYVJpbmdTdW0gPCAwKSBsYW1iZGEwJDEgPSAtKGxhbWJkYTEgPSAxODApLCBwaGkwID0gLShwaGkxID0gOTApO1xuICAgIGVsc2UgaWYgKGRlbHRhU3VtID4gZXBzaWxvbikgcGhpMSA9IDkwO1xuICAgIGVsc2UgaWYgKGRlbHRhU3VtIDwgLWVwc2lsb24pIHBoaTAgPSAtOTA7XG4gICAgcmFuZ2UkMVswXSA9IGxhbWJkYTAkMSwgcmFuZ2UkMVsxXSA9IGxhbWJkYTE7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJvdW5kc1BvaW50KGxhbWJkYSwgcGhpKSB7XG4gIHJhbmdlcy5wdXNoKHJhbmdlJDEgPSBbbGFtYmRhMCQxID0gbGFtYmRhLCBsYW1iZGExID0gbGFtYmRhXSk7XG4gIGlmIChwaGkgPCBwaGkwKSBwaGkwID0gcGhpO1xuICBpZiAocGhpID4gcGhpMSkgcGhpMSA9IHBoaTtcbn1cblxuZnVuY3Rpb24gbGluZVBvaW50KGxhbWJkYSwgcGhpKSB7XG4gIHZhciBwID0gY2FydGVzaWFuKFtsYW1iZGEgKiByYWRpYW5zLCBwaGkgKiByYWRpYW5zXSk7XG4gIGlmIChwMCkge1xuICAgIHZhciBub3JtYWwgPSBjYXJ0ZXNpYW5Dcm9zcyhwMCwgcCksXG4gICAgICAgIGVxdWF0b3JpYWwgPSBbbm9ybWFsWzFdLCAtbm9ybWFsWzBdLCAwXSxcbiAgICAgICAgaW5mbGVjdGlvbiA9IGNhcnRlc2lhbkNyb3NzKGVxdWF0b3JpYWwsIG5vcm1hbCk7XG4gICAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShpbmZsZWN0aW9uKTtcbiAgICBpbmZsZWN0aW9uID0gc3BoZXJpY2FsKGluZmxlY3Rpb24pO1xuICAgIHZhciBkZWx0YSA9IGxhbWJkYSAtIGxhbWJkYTIsXG4gICAgICAgIHNpZ24kJDEgPSBkZWx0YSA+IDAgPyAxIDogLTEsXG4gICAgICAgIGxhbWJkYWkgPSBpbmZsZWN0aW9uWzBdICogZGVncmVlcyAqIHNpZ24kJDEsXG4gICAgICAgIHBoaWksXG4gICAgICAgIGFudGltZXJpZGlhbiA9IGFicyhkZWx0YSkgPiAxODA7XG4gICAgaWYgKGFudGltZXJpZGlhbiBeIChzaWduJCQxICogbGFtYmRhMiA8IGxhbWJkYWkgJiYgbGFtYmRhaSA8IHNpZ24kJDEgKiBsYW1iZGEpKSB7XG4gICAgICBwaGlpID0gaW5mbGVjdGlvblsxXSAqIGRlZ3JlZXM7XG4gICAgICBpZiAocGhpaSA+IHBoaTEpIHBoaTEgPSBwaGlpO1xuICAgIH0gZWxzZSBpZiAobGFtYmRhaSA9IChsYW1iZGFpICsgMzYwKSAlIDM2MCAtIDE4MCwgYW50aW1lcmlkaWFuIF4gKHNpZ24kJDEgKiBsYW1iZGEyIDwgbGFtYmRhaSAmJiBsYW1iZGFpIDwgc2lnbiQkMSAqIGxhbWJkYSkpIHtcbiAgICAgIHBoaWkgPSAtaW5mbGVjdGlvblsxXSAqIGRlZ3JlZXM7XG4gICAgICBpZiAocGhpaSA8IHBoaTApIHBoaTAgPSBwaGlpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGhpIDwgcGhpMCkgcGhpMCA9IHBoaTtcbiAgICAgIGlmIChwaGkgPiBwaGkxKSBwaGkxID0gcGhpO1xuICAgIH1cbiAgICBpZiAoYW50aW1lcmlkaWFuKSB7XG4gICAgICBpZiAobGFtYmRhIDwgbGFtYmRhMikge1xuICAgICAgICBpZiAoYW5nbGUobGFtYmRhMCQxLCBsYW1iZGEpID4gYW5nbGUobGFtYmRhMCQxLCBsYW1iZGExKSkgbGFtYmRhMSA9IGxhbWJkYTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhbmdsZShsYW1iZGEsIGxhbWJkYTEpID4gYW5nbGUobGFtYmRhMCQxLCBsYW1iZGExKSkgbGFtYmRhMCQxID0gbGFtYmRhO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobGFtYmRhMSA+PSBsYW1iZGEwJDEpIHtcbiAgICAgICAgaWYgKGxhbWJkYSA8IGxhbWJkYTAkMSkgbGFtYmRhMCQxID0gbGFtYmRhO1xuICAgICAgICBpZiAobGFtYmRhID4gbGFtYmRhMSkgbGFtYmRhMSA9IGxhbWJkYTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChsYW1iZGEgPiBsYW1iZGEyKSB7XG4gICAgICAgICAgaWYgKGFuZ2xlKGxhbWJkYTAkMSwgbGFtYmRhKSA+IGFuZ2xlKGxhbWJkYTAkMSwgbGFtYmRhMSkpIGxhbWJkYTEgPSBsYW1iZGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGFuZ2xlKGxhbWJkYSwgbGFtYmRhMSkgPiBhbmdsZShsYW1iZGEwJDEsIGxhbWJkYTEpKSBsYW1iZGEwJDEgPSBsYW1iZGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmFuZ2VzLnB1c2gocmFuZ2UkMSA9IFtsYW1iZGEwJDEgPSBsYW1iZGEsIGxhbWJkYTEgPSBsYW1iZGFdKTtcbiAgfVxuICBpZiAocGhpIDwgcGhpMCkgcGhpMCA9IHBoaTtcbiAgaWYgKHBoaSA+IHBoaTEpIHBoaTEgPSBwaGk7XG4gIHAwID0gcCwgbGFtYmRhMiA9IGxhbWJkYTtcbn1cblxuZnVuY3Rpb24gYm91bmRzTGluZVN0YXJ0KCkge1xuICBib3VuZHNTdHJlYW0ucG9pbnQgPSBsaW5lUG9pbnQ7XG59XG5cbmZ1bmN0aW9uIGJvdW5kc0xpbmVFbmQoKSB7XG4gIHJhbmdlJDFbMF0gPSBsYW1iZGEwJDEsIHJhbmdlJDFbMV0gPSBsYW1iZGExO1xuICBib3VuZHNTdHJlYW0ucG9pbnQgPSBib3VuZHNQb2ludDtcbiAgcDAgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBib3VuZHNSaW5nUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgaWYgKHAwKSB7XG4gICAgdmFyIGRlbHRhID0gbGFtYmRhIC0gbGFtYmRhMjtcbiAgICBkZWx0YVN1bS5hZGQoYWJzKGRlbHRhKSA+IDE4MCA/IGRlbHRhICsgKGRlbHRhID4gMCA/IDM2MCA6IC0zNjApIDogZGVsdGEpO1xuICB9IGVsc2Uge1xuICAgIGxhbWJkYTAwJDEgPSBsYW1iZGEsIHBoaTAwJDEgPSBwaGk7XG4gIH1cbiAgYXJlYVN0cmVhbS5wb2ludChsYW1iZGEsIHBoaSk7XG4gIGxpbmVQb2ludChsYW1iZGEsIHBoaSk7XG59XG5cbmZ1bmN0aW9uIGJvdW5kc1JpbmdTdGFydCgpIHtcbiAgYXJlYVN0cmVhbS5saW5lU3RhcnQoKTtcbn1cblxuZnVuY3Rpb24gYm91bmRzUmluZ0VuZCgpIHtcbiAgYm91bmRzUmluZ1BvaW50KGxhbWJkYTAwJDEsIHBoaTAwJDEpO1xuICBhcmVhU3RyZWFtLmxpbmVFbmQoKTtcbiAgaWYgKGFicyhkZWx0YVN1bSkgPiBlcHNpbG9uKSBsYW1iZGEwJDEgPSAtKGxhbWJkYTEgPSAxODApO1xuICByYW5nZSQxWzBdID0gbGFtYmRhMCQxLCByYW5nZSQxWzFdID0gbGFtYmRhMTtcbiAgcDAgPSBudWxsO1xufVxuXG4vLyBGaW5kcyB0aGUgbGVmdC1yaWdodCBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsb25naXR1ZGVzLlxuLy8gVGhpcyBpcyBhbG1vc3QgdGhlIHNhbWUgYXMgKGxhbWJkYTEgLSBsYW1iZGEwICsgMzYwwrApICUgMzYwwrAsIGV4Y2VwdCB0aGF0IHdlIHdhbnRcbi8vIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIMKxMTgwwrAgdG8gYmUgMzYwwrAuXG5mdW5jdGlvbiBhbmdsZShsYW1iZGEwLCBsYW1iZGExKSB7XG4gIHJldHVybiAobGFtYmRhMSAtPSBsYW1iZGEwKSA8IDAgPyBsYW1iZGExICsgMzYwIDogbGFtYmRhMTtcbn1cblxuZnVuY3Rpb24gcmFuZ2VDb21wYXJlKGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gLSBiWzBdO1xufVxuXG5mdW5jdGlvbiByYW5nZUNvbnRhaW5zKHJhbmdlJCQxLCB4KSB7XG4gIHJldHVybiByYW5nZSQkMVswXSA8PSByYW5nZSQkMVsxXSA/IHJhbmdlJCQxWzBdIDw9IHggJiYgeCA8PSByYW5nZSQkMVsxXSA6IHggPCByYW5nZSQkMVswXSB8fCByYW5nZSQkMVsxXSA8IHg7XG59XG5cbnZhciBib3VuZHMgPSBmdW5jdGlvbihmZWF0dXJlKSB7XG4gIHZhciBpLCBuLCBhLCBiLCBtZXJnZWQsIGRlbHRhTWF4LCBkZWx0YTtcblxuICBwaGkxID0gbGFtYmRhMSA9IC0obGFtYmRhMCQxID0gcGhpMCA9IEluZmluaXR5KTtcbiAgcmFuZ2VzID0gW107XG4gIGdlb1N0cmVhbShmZWF0dXJlLCBib3VuZHNTdHJlYW0pO1xuXG4gIC8vIEZpcnN0LCBzb3J0IHJhbmdlcyBieSB0aGVpciBtaW5pbXVtIGxvbmdpdHVkZXMuXG4gIGlmIChuID0gcmFuZ2VzLmxlbmd0aCkge1xuICAgIHJhbmdlcy5zb3J0KHJhbmdlQ29tcGFyZSk7XG5cbiAgICAvLyBUaGVuLCBtZXJnZSBhbnkgcmFuZ2VzIHRoYXQgb3ZlcmxhcC5cbiAgICBmb3IgKGkgPSAxLCBhID0gcmFuZ2VzWzBdLCBtZXJnZWQgPSBbYV07IGkgPCBuOyArK2kpIHtcbiAgICAgIGIgPSByYW5nZXNbaV07XG4gICAgICBpZiAocmFuZ2VDb250YWlucyhhLCBiWzBdKSB8fCByYW5nZUNvbnRhaW5zKGEsIGJbMV0pKSB7XG4gICAgICAgIGlmIChhbmdsZShhWzBdLCBiWzFdKSA+IGFuZ2xlKGFbMF0sIGFbMV0pKSBhWzFdID0gYlsxXTtcbiAgICAgICAgaWYgKGFuZ2xlKGJbMF0sIGFbMV0pID4gYW5nbGUoYVswXSwgYVsxXSkpIGFbMF0gPSBiWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVyZ2VkLnB1c2goYSA9IGIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZpbmFsbHksIGZpbmQgdGhlIGxhcmdlc3QgZ2FwIGJldHdlZW4gdGhlIG1lcmdlZCByYW5nZXMuXG4gICAgLy8gVGhlIGZpbmFsIGJvdW5kaW5nIGJveCB3aWxsIGJlIHRoZSBpbnZlcnNlIG9mIHRoaXMgZ2FwLlxuICAgIGZvciAoZGVsdGFNYXggPSAtSW5maW5pdHksIG4gPSBtZXJnZWQubGVuZ3RoIC0gMSwgaSA9IDAsIGEgPSBtZXJnZWRbbl07IGkgPD0gbjsgYSA9IGIsICsraSkge1xuICAgICAgYiA9IG1lcmdlZFtpXTtcbiAgICAgIGlmICgoZGVsdGEgPSBhbmdsZShhWzFdLCBiWzBdKSkgPiBkZWx0YU1heCkgZGVsdGFNYXggPSBkZWx0YSwgbGFtYmRhMCQxID0gYlswXSwgbGFtYmRhMSA9IGFbMV07XG4gICAgfVxuICB9XG5cbiAgcmFuZ2VzID0gcmFuZ2UkMSA9IG51bGw7XG5cbiAgcmV0dXJuIGxhbWJkYTAkMSA9PT0gSW5maW5pdHkgfHwgcGhpMCA9PT0gSW5maW5pdHlcbiAgICAgID8gW1tOYU4sIE5hTl0sIFtOYU4sIE5hTl1dXG4gICAgICA6IFtbbGFtYmRhMCQxLCBwaGkwXSwgW2xhbWJkYTEsIHBoaTFdXTtcbn07XG5cbnZhciBXMDtcbnZhciBXMTtcbnZhciBYMDtcbnZhciBZMDtcbnZhciBaMDtcbnZhciBYMTtcbnZhciBZMTtcbnZhciBaMTtcbnZhciBYMjtcbnZhciBZMjtcbnZhciBaMjtcbnZhciBsYW1iZGEwMCQyO1xudmFyIHBoaTAwJDI7XG52YXIgeDA7XG52YXIgeTA7XG52YXIgejA7IC8vIHByZXZpb3VzIHBvaW50XG5cbnZhciBjZW50cm9pZFN0cmVhbSA9IHtcbiAgc3BoZXJlOiBub29wLFxuICBwb2ludDogY2VudHJvaWRQb2ludCxcbiAgbGluZVN0YXJ0OiBjZW50cm9pZExpbmVTdGFydCxcbiAgbGluZUVuZDogY2VudHJvaWRMaW5lRW5kLFxuICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNlbnRyb2lkU3RyZWFtLmxpbmVTdGFydCA9IGNlbnRyb2lkUmluZ1N0YXJ0O1xuICAgIGNlbnRyb2lkU3RyZWFtLmxpbmVFbmQgPSBjZW50cm9pZFJpbmdFbmQ7XG4gIH0sXG4gIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgIGNlbnRyb2lkU3RyZWFtLmxpbmVTdGFydCA9IGNlbnRyb2lkTGluZVN0YXJ0O1xuICAgIGNlbnRyb2lkU3RyZWFtLmxpbmVFbmQgPSBjZW50cm9pZExpbmVFbmQ7XG4gIH1cbn07XG5cbi8vIEFyaXRobWV0aWMgbWVhbiBvZiBDYXJ0ZXNpYW4gdmVjdG9ycy5cbmZ1bmN0aW9uIGNlbnRyb2lkUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgbGFtYmRhICo9IHJhZGlhbnMsIHBoaSAqPSByYWRpYW5zO1xuICB2YXIgY29zUGhpID0gY29zKHBoaSk7XG4gIGNlbnRyb2lkUG9pbnRDYXJ0ZXNpYW4oY29zUGhpICogY29zKGxhbWJkYSksIGNvc1BoaSAqIHNpbihsYW1iZGEpLCBzaW4ocGhpKSk7XG59XG5cbmZ1bmN0aW9uIGNlbnRyb2lkUG9pbnRDYXJ0ZXNpYW4oeCwgeSwgeikge1xuICArK1cwO1xuICBYMCArPSAoeCAtIFgwKSAvIFcwO1xuICBZMCArPSAoeSAtIFkwKSAvIFcwO1xuICBaMCArPSAoeiAtIFowKSAvIFcwO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZExpbmVTdGFydCgpIHtcbiAgY2VudHJvaWRTdHJlYW0ucG9pbnQgPSBjZW50cm9pZExpbmVQb2ludEZpcnN0O1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZExpbmVQb2ludEZpcnN0KGxhbWJkYSwgcGhpKSB7XG4gIGxhbWJkYSAqPSByYWRpYW5zLCBwaGkgKj0gcmFkaWFucztcbiAgdmFyIGNvc1BoaSA9IGNvcyhwaGkpO1xuICB4MCA9IGNvc1BoaSAqIGNvcyhsYW1iZGEpO1xuICB5MCA9IGNvc1BoaSAqIHNpbihsYW1iZGEpO1xuICB6MCA9IHNpbihwaGkpO1xuICBjZW50cm9pZFN0cmVhbS5wb2ludCA9IGNlbnRyb2lkTGluZVBvaW50O1xuICBjZW50cm9pZFBvaW50Q2FydGVzaWFuKHgwLCB5MCwgejApO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZExpbmVQb2ludChsYW1iZGEsIHBoaSkge1xuICBsYW1iZGEgKj0gcmFkaWFucywgcGhpICo9IHJhZGlhbnM7XG4gIHZhciBjb3NQaGkgPSBjb3MocGhpKSxcbiAgICAgIHggPSBjb3NQaGkgKiBjb3MobGFtYmRhKSxcbiAgICAgIHkgPSBjb3NQaGkgKiBzaW4obGFtYmRhKSxcbiAgICAgIHogPSBzaW4ocGhpKSxcbiAgICAgIHcgPSBhdGFuMihzcXJ0KCh3ID0geTAgKiB6IC0gejAgKiB5KSAqIHcgKyAodyA9IHowICogeCAtIHgwICogeikgKiB3ICsgKHcgPSB4MCAqIHkgLSB5MCAqIHgpICogdyksIHgwICogeCArIHkwICogeSArIHowICogeik7XG4gIFcxICs9IHc7XG4gIFgxICs9IHcgKiAoeDAgKyAoeDAgPSB4KSk7XG4gIFkxICs9IHcgKiAoeTAgKyAoeTAgPSB5KSk7XG4gIFoxICs9IHcgKiAoejAgKyAoejAgPSB6KSk7XG4gIGNlbnRyb2lkUG9pbnRDYXJ0ZXNpYW4oeDAsIHkwLCB6MCk7XG59XG5cbmZ1bmN0aW9uIGNlbnRyb2lkTGluZUVuZCgpIHtcbiAgY2VudHJvaWRTdHJlYW0ucG9pbnQgPSBjZW50cm9pZFBvaW50O1xufVxuXG4vLyBTZWUgSi4gRS4gQnJvY2ssIFRoZSBJbmVydGlhIFRlbnNvciBmb3IgYSBTcGhlcmljYWwgVHJpYW5nbGUsXG4vLyBKLiBBcHBsaWVkIE1lY2hhbmljcyA0MiwgMjM5ICgxOTc1KS5cbmZ1bmN0aW9uIGNlbnRyb2lkUmluZ1N0YXJ0KCkge1xuICBjZW50cm9pZFN0cmVhbS5wb2ludCA9IGNlbnRyb2lkUmluZ1BvaW50Rmlyc3Q7XG59XG5cbmZ1bmN0aW9uIGNlbnRyb2lkUmluZ0VuZCgpIHtcbiAgY2VudHJvaWRSaW5nUG9pbnQobGFtYmRhMDAkMiwgcGhpMDAkMik7XG4gIGNlbnRyb2lkU3RyZWFtLnBvaW50ID0gY2VudHJvaWRQb2ludDtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWRSaW5nUG9pbnRGaXJzdChsYW1iZGEsIHBoaSkge1xuICBsYW1iZGEwMCQyID0gbGFtYmRhLCBwaGkwMCQyID0gcGhpO1xuICBsYW1iZGEgKj0gcmFkaWFucywgcGhpICo9IHJhZGlhbnM7XG4gIGNlbnRyb2lkU3RyZWFtLnBvaW50ID0gY2VudHJvaWRSaW5nUG9pbnQ7XG4gIHZhciBjb3NQaGkgPSBjb3MocGhpKTtcbiAgeDAgPSBjb3NQaGkgKiBjb3MobGFtYmRhKTtcbiAgeTAgPSBjb3NQaGkgKiBzaW4obGFtYmRhKTtcbiAgejAgPSBzaW4ocGhpKTtcbiAgY2VudHJvaWRQb2ludENhcnRlc2lhbih4MCwgeTAsIHowKTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWRSaW5nUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgbGFtYmRhICo9IHJhZGlhbnMsIHBoaSAqPSByYWRpYW5zO1xuICB2YXIgY29zUGhpID0gY29zKHBoaSksXG4gICAgICB4ID0gY29zUGhpICogY29zKGxhbWJkYSksXG4gICAgICB5ID0gY29zUGhpICogc2luKGxhbWJkYSksXG4gICAgICB6ID0gc2luKHBoaSksXG4gICAgICBjeCA9IHkwICogeiAtIHowICogeSxcbiAgICAgIGN5ID0gejAgKiB4IC0geDAgKiB6LFxuICAgICAgY3ogPSB4MCAqIHkgLSB5MCAqIHgsXG4gICAgICBtID0gc3FydChjeCAqIGN4ICsgY3kgKiBjeSArIGN6ICogY3opLFxuICAgICAgdyA9IGFzaW4obSksIC8vIGxpbmUgd2VpZ2h0ID0gYW5nbGVcbiAgICAgIHYgPSBtICYmIC13IC8gbTsgLy8gYXJlYSB3ZWlnaHQgbXVsdGlwbGllclxuICBYMiArPSB2ICogY3g7XG4gIFkyICs9IHYgKiBjeTtcbiAgWjIgKz0gdiAqIGN6O1xuICBXMSArPSB3O1xuICBYMSArPSB3ICogKHgwICsgKHgwID0geCkpO1xuICBZMSArPSB3ICogKHkwICsgKHkwID0geSkpO1xuICBaMSArPSB3ICogKHowICsgKHowID0geikpO1xuICBjZW50cm9pZFBvaW50Q2FydGVzaWFuKHgwLCB5MCwgejApO1xufVxuXG52YXIgY2VudHJvaWQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgVzAgPSBXMSA9XG4gIFgwID0gWTAgPSBaMCA9XG4gIFgxID0gWTEgPSBaMSA9XG4gIFgyID0gWTIgPSBaMiA9IDA7XG4gIGdlb1N0cmVhbShvYmplY3QsIGNlbnRyb2lkU3RyZWFtKTtcblxuICB2YXIgeCA9IFgyLFxuICAgICAgeSA9IFkyLFxuICAgICAgeiA9IFoyLFxuICAgICAgbSA9IHggKiB4ICsgeSAqIHkgKyB6ICogejtcblxuICAvLyBJZiB0aGUgYXJlYS13ZWlnaHRlZCBjY2VudHJvaWQgaXMgdW5kZWZpbmVkLCBmYWxsIGJhY2sgdG8gbGVuZ3RoLXdlaWdodGVkIGNjZW50cm9pZC5cbiAgaWYgKG0gPCBlcHNpbG9uMikge1xuICAgIHggPSBYMSwgeSA9IFkxLCB6ID0gWjE7XG4gICAgLy8gSWYgdGhlIGZlYXR1cmUgaGFzIHplcm8gbGVuZ3RoLCBmYWxsIGJhY2sgdG8gYXJpdGhtZXRpYyBtZWFuIG9mIHBvaW50IHZlY3RvcnMuXG4gICAgaWYgKFcxIDwgZXBzaWxvbikgeCA9IFgwLCB5ID0gWTAsIHogPSBaMDtcbiAgICBtID0geCAqIHggKyB5ICogeSArIHogKiB6O1xuICAgIC8vIElmIHRoZSBmZWF0dXJlIHN0aWxsIGhhcyBhbiB1bmRlZmluZWQgY2NlbnRyb2lkLCB0aGVuIHJldHVybi5cbiAgICBpZiAobSA8IGVwc2lsb24yKSByZXR1cm4gW05hTiwgTmFOXTtcbiAgfVxuXG4gIHJldHVybiBbYXRhbjIoeSwgeCkgKiBkZWdyZWVzLCBhc2luKHogLyBzcXJ0KG0pKSAqIGRlZ3JlZXNdO1xufTtcblxudmFyIGNvbnN0YW50ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59O1xuXG52YXIgY29tcG9zZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblxuICBmdW5jdGlvbiBjb21wb3NlKHgsIHkpIHtcbiAgICByZXR1cm4geCA9IGEoeCwgeSksIGIoeFswXSwgeFsxXSk7XG4gIH1cblxuICBpZiAoYS5pbnZlcnQgJiYgYi5pbnZlcnQpIGNvbXBvc2UuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiB4ID0gYi5pbnZlcnQoeCwgeSksIHggJiYgYS5pbnZlcnQoeFswXSwgeFsxXSk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvc2U7XG59O1xuXG5mdW5jdGlvbiByb3RhdGlvbklkZW50aXR5KGxhbWJkYSwgcGhpKSB7XG4gIHJldHVybiBbbGFtYmRhID4gcGkgPyBsYW1iZGEgLSB0YXUgOiBsYW1iZGEgPCAtcGkgPyBsYW1iZGEgKyB0YXUgOiBsYW1iZGEsIHBoaV07XG59XG5cbnJvdGF0aW9uSWRlbnRpdHkuaW52ZXJ0ID0gcm90YXRpb25JZGVudGl0eTtcblxuZnVuY3Rpb24gcm90YXRlUmFkaWFucyhkZWx0YUxhbWJkYSwgZGVsdGFQaGksIGRlbHRhR2FtbWEpIHtcbiAgcmV0dXJuIChkZWx0YUxhbWJkYSAlPSB0YXUpID8gKGRlbHRhUGhpIHx8IGRlbHRhR2FtbWEgPyBjb21wb3NlKHJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSwgcm90YXRpb25QaGlHYW1tYShkZWx0YVBoaSwgZGVsdGFHYW1tYSkpXG4gICAgOiByb3RhdGlvbkxhbWJkYShkZWx0YUxhbWJkYSkpXG4gICAgOiAoZGVsdGFQaGkgfHwgZGVsdGFHYW1tYSA/IHJvdGF0aW9uUGhpR2FtbWEoZGVsdGFQaGksIGRlbHRhR2FtbWEpXG4gICAgOiByb3RhdGlvbklkZW50aXR5KTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKSB7XG4gIHJldHVybiBmdW5jdGlvbihsYW1iZGEsIHBoaSkge1xuICAgIHJldHVybiBsYW1iZGEgKz0gZGVsdGFMYW1iZGEsIFtsYW1iZGEgPiBwaSA/IGxhbWJkYSAtIHRhdSA6IGxhbWJkYSA8IC1waSA/IGxhbWJkYSArIHRhdSA6IGxhbWJkYSwgcGhpXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcm90YXRpb25MYW1iZGEoZGVsdGFMYW1iZGEpIHtcbiAgdmFyIHJvdGF0aW9uID0gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKGRlbHRhTGFtYmRhKTtcbiAgcm90YXRpb24uaW52ZXJ0ID0gZm9yd2FyZFJvdGF0aW9uTGFtYmRhKC1kZWx0YUxhbWJkYSk7XG4gIHJldHVybiByb3RhdGlvbjtcbn1cblxuZnVuY3Rpb24gcm90YXRpb25QaGlHYW1tYShkZWx0YVBoaSwgZGVsdGFHYW1tYSkge1xuICB2YXIgY29zRGVsdGFQaGkgPSBjb3MoZGVsdGFQaGkpLFxuICAgICAgc2luRGVsdGFQaGkgPSBzaW4oZGVsdGFQaGkpLFxuICAgICAgY29zRGVsdGFHYW1tYSA9IGNvcyhkZWx0YUdhbW1hKSxcbiAgICAgIHNpbkRlbHRhR2FtbWEgPSBzaW4oZGVsdGFHYW1tYSk7XG5cbiAgZnVuY3Rpb24gcm90YXRpb24obGFtYmRhLCBwaGkpIHtcbiAgICB2YXIgY29zUGhpID0gY29zKHBoaSksXG4gICAgICAgIHggPSBjb3MobGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeSA9IHNpbihsYW1iZGEpICogY29zUGhpLFxuICAgICAgICB6ID0gc2luKHBoaSksXG4gICAgICAgIGsgPSB6ICogY29zRGVsdGFQaGkgKyB4ICogc2luRGVsdGFQaGk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGF0YW4yKHkgKiBjb3NEZWx0YUdhbW1hIC0gayAqIHNpbkRlbHRhR2FtbWEsIHggKiBjb3NEZWx0YVBoaSAtIHogKiBzaW5EZWx0YVBoaSksXG4gICAgICBhc2luKGsgKiBjb3NEZWx0YUdhbW1hICsgeSAqIHNpbkRlbHRhR2FtbWEpXG4gICAgXTtcbiAgfVxuXG4gIHJvdGF0aW9uLmludmVydCA9IGZ1bmN0aW9uKGxhbWJkYSwgcGhpKSB7XG4gICAgdmFyIGNvc1BoaSA9IGNvcyhwaGkpLFxuICAgICAgICB4ID0gY29zKGxhbWJkYSkgKiBjb3NQaGksXG4gICAgICAgIHkgPSBzaW4obGFtYmRhKSAqIGNvc1BoaSxcbiAgICAgICAgeiA9IHNpbihwaGkpLFxuICAgICAgICBrID0geiAqIGNvc0RlbHRhR2FtbWEgLSB5ICogc2luRGVsdGFHYW1tYTtcbiAgICByZXR1cm4gW1xuICAgICAgYXRhbjIoeSAqIGNvc0RlbHRhR2FtbWEgKyB6ICogc2luRGVsdGFHYW1tYSwgeCAqIGNvc0RlbHRhUGhpICsgayAqIHNpbkRlbHRhUGhpKSxcbiAgICAgIGFzaW4oayAqIGNvc0RlbHRhUGhpIC0geCAqIHNpbkRlbHRhUGhpKVxuICAgIF07XG4gIH07XG5cbiAgcmV0dXJuIHJvdGF0aW9uO1xufVxuXG52YXIgcm90YXRpb24gPSBmdW5jdGlvbihyb3RhdGUpIHtcbiAgcm90YXRlID0gcm90YXRlUmFkaWFucyhyb3RhdGVbMF0gKiByYWRpYW5zLCByb3RhdGVbMV0gKiByYWRpYW5zLCByb3RhdGUubGVuZ3RoID4gMiA/IHJvdGF0ZVsyXSAqIHJhZGlhbnMgOiAwKTtcblxuICBmdW5jdGlvbiBmb3J3YXJkKGNvb3JkaW5hdGVzKSB7XG4gICAgY29vcmRpbmF0ZXMgPSByb3RhdGUoY29vcmRpbmF0ZXNbMF0gKiByYWRpYW5zLCBjb29yZGluYXRlc1sxXSAqIHJhZGlhbnMpO1xuICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlcztcbiAgfVxuXG4gIGZvcndhcmQuaW52ZXJ0ID0gZnVuY3Rpb24oY29vcmRpbmF0ZXMpIHtcbiAgICBjb29yZGluYXRlcyA9IHJvdGF0ZS5pbnZlcnQoY29vcmRpbmF0ZXNbMF0gKiByYWRpYW5zLCBjb29yZGluYXRlc1sxXSAqIHJhZGlhbnMpO1xuICAgIHJldHVybiBjb29yZGluYXRlc1swXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlc1sxXSAqPSBkZWdyZWVzLCBjb29yZGluYXRlcztcbiAgfTtcblxuICByZXR1cm4gZm9yd2FyZDtcbn07XG5cbi8vIEdlbmVyYXRlcyBhIGNpcmNsZSBjZW50ZXJlZCBhdCBbMMKwLCAwwrBdLCB3aXRoIGEgZ2l2ZW4gcmFkaXVzIGFuZCBwcmVjaXNpb24uXG5mdW5jdGlvbiBjaXJjbGVTdHJlYW0oc3RyZWFtLCByYWRpdXMsIGRlbHRhLCBkaXJlY3Rpb24sIHQwLCB0MSkge1xuICBpZiAoIWRlbHRhKSByZXR1cm47XG4gIHZhciBjb3NSYWRpdXMgPSBjb3MocmFkaXVzKSxcbiAgICAgIHNpblJhZGl1cyA9IHNpbihyYWRpdXMpLFxuICAgICAgc3RlcCA9IGRpcmVjdGlvbiAqIGRlbHRhO1xuICBpZiAodDAgPT0gbnVsbCkge1xuICAgIHQwID0gcmFkaXVzICsgZGlyZWN0aW9uICogdGF1O1xuICAgIHQxID0gcmFkaXVzIC0gc3RlcCAvIDI7XG4gIH0gZWxzZSB7XG4gICAgdDAgPSBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCB0MCk7XG4gICAgdDEgPSBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCB0MSk7XG4gICAgaWYgKGRpcmVjdGlvbiA+IDAgPyB0MCA8IHQxIDogdDAgPiB0MSkgdDAgKz0gZGlyZWN0aW9uICogdGF1O1xuICB9XG4gIGZvciAodmFyIHBvaW50LCB0ID0gdDA7IGRpcmVjdGlvbiA+IDAgPyB0ID4gdDEgOiB0IDwgdDE7IHQgLT0gc3RlcCkge1xuICAgIHBvaW50ID0gc3BoZXJpY2FsKFtjb3NSYWRpdXMsIC1zaW5SYWRpdXMgKiBjb3ModCksIC1zaW5SYWRpdXMgKiBzaW4odCldKTtcbiAgICBzdHJlYW0ucG9pbnQocG9pbnRbMF0sIHBvaW50WzFdKTtcbiAgfVxufVxuXG4vLyBSZXR1cm5zIHRoZSBzaWduZWQgYW5nbGUgb2YgYSBjYXJ0ZXNpYW4gcG9pbnQgcmVsYXRpdmUgdG8gW2Nvc1JhZGl1cywgMCwgMF0uXG5mdW5jdGlvbiBjaXJjbGVSYWRpdXMoY29zUmFkaXVzLCBwb2ludCkge1xuICBwb2ludCA9IGNhcnRlc2lhbihwb2ludCksIHBvaW50WzBdIC09IGNvc1JhZGl1cztcbiAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShwb2ludCk7XG4gIHZhciByYWRpdXMgPSBhY29zKC1wb2ludFsxXSk7XG4gIHJldHVybiAoKC1wb2ludFsyXSA8IDAgPyAtcmFkaXVzIDogcmFkaXVzKSArIHRhdSAtIGVwc2lsb24pICUgdGF1O1xufVxuXG52YXIgY2lyY2xlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjZW50ZXIgPSBjb25zdGFudChbMCwgMF0pLFxuICAgICAgcmFkaXVzID0gY29uc3RhbnQoOTApLFxuICAgICAgcHJlY2lzaW9uID0gY29uc3RhbnQoNiksXG4gICAgICByaW5nLFxuICAgICAgcm90YXRlLFxuICAgICAgc3RyZWFtID0ge3BvaW50OiBwb2ludH07XG5cbiAgZnVuY3Rpb24gcG9pbnQoeCwgeSkge1xuICAgIHJpbmcucHVzaCh4ID0gcm90YXRlKHgsIHkpKTtcbiAgICB4WzBdICo9IGRlZ3JlZXMsIHhbMV0gKj0gZGVncmVlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNpcmNsZSgpIHtcbiAgICB2YXIgYyA9IGNlbnRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICByID0gcmFkaXVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgKiByYWRpYW5zLFxuICAgICAgICBwID0gcHJlY2lzaW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgKiByYWRpYW5zO1xuICAgIHJpbmcgPSBbXTtcbiAgICByb3RhdGUgPSByb3RhdGVSYWRpYW5zKC1jWzBdICogcmFkaWFucywgLWNbMV0gKiByYWRpYW5zLCAwKS5pbnZlcnQ7XG4gICAgY2lyY2xlU3RyZWFtKHN0cmVhbSwgciwgcCwgMSk7XG4gICAgYyA9IHt0eXBlOiBcIlBvbHlnb25cIiwgY29vcmRpbmF0ZXM6IFtyaW5nXX07XG4gICAgcmluZyA9IHJvdGF0ZSA9IG51bGw7XG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICBjaXJjbGUuY2VudGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNlbnRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoWytfWzBdLCArX1sxXV0pLCBjaXJjbGUpIDogY2VudGVyO1xuICB9O1xuXG4gIGNpcmNsZS5yYWRpdXMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFkaXVzID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGNpcmNsZSkgOiByYWRpdXM7XG4gIH07XG5cbiAgY2lyY2xlLnByZWNpc2lvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwcmVjaXNpb24gPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgY2lyY2xlKSA6IHByZWNpc2lvbjtcbiAgfTtcblxuICByZXR1cm4gY2lyY2xlO1xufTtcblxudmFyIGNsaXBCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxpbmVzID0gW10sXG4gICAgICBsaW5lO1xuICByZXR1cm4ge1xuICAgIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICBsaW5lLnB1c2goW3gsIHldKTtcbiAgICB9LFxuICAgIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBsaW5lcy5wdXNoKGxpbmUgPSBbXSk7XG4gICAgfSxcbiAgICBsaW5lRW5kOiBub29wLFxuICAgIHJlam9pbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAobGluZXMubGVuZ3RoID4gMSkgbGluZXMucHVzaChsaW5lcy5wb3AoKS5jb25jYXQobGluZXMuc2hpZnQoKSkpO1xuICAgIH0sXG4gICAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXN1bHQgPSBsaW5lcztcbiAgICAgIGxpbmVzID0gW107XG4gICAgICBsaW5lID0gbnVsbDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xufTtcblxudmFyIGNsaXBMaW5lID0gZnVuY3Rpb24oYSwgYiwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdmFyIGF4ID0gYVswXSxcbiAgICAgIGF5ID0gYVsxXSxcbiAgICAgIGJ4ID0gYlswXSxcbiAgICAgIGJ5ID0gYlsxXSxcbiAgICAgIHQwID0gMCxcbiAgICAgIHQxID0gMSxcbiAgICAgIGR4ID0gYnggLSBheCxcbiAgICAgIGR5ID0gYnkgLSBheSxcbiAgICAgIHI7XG5cbiAgciA9IHgwIC0gYXg7XG4gIGlmICghZHggJiYgciA+IDApIHJldHVybjtcbiAgciAvPSBkeDtcbiAgaWYgKGR4IDwgMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH0gZWxzZSBpZiAoZHggPiAwKSB7XG4gICAgaWYgKHIgPiB0MSkgcmV0dXJuO1xuICAgIGlmIChyID4gdDApIHQwID0gcjtcbiAgfVxuXG4gIHIgPSB4MSAtIGF4O1xuICBpZiAoIWR4ICYmIHIgPCAwKSByZXR1cm47XG4gIHIgLz0gZHg7XG4gIGlmIChkeCA8IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9IGVsc2UgaWYgKGR4ID4gMCkge1xuICAgIGlmIChyIDwgdDApIHJldHVybjtcbiAgICBpZiAociA8IHQxKSB0MSA9IHI7XG4gIH1cblxuICByID0geTAgLSBheTtcbiAgaWYgKCFkeSAmJiByID4gMCkgcmV0dXJuO1xuICByIC89IGR5O1xuICBpZiAoZHkgPCAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfSBlbHNlIGlmIChkeSA+IDApIHtcbiAgICBpZiAociA+IHQxKSByZXR1cm47XG4gICAgaWYgKHIgPiB0MCkgdDAgPSByO1xuICB9XG5cbiAgciA9IHkxIC0gYXk7XG4gIGlmICghZHkgJiYgciA8IDApIHJldHVybjtcbiAgciAvPSBkeTtcbiAgaWYgKGR5IDwgMCkge1xuICAgIGlmIChyID4gdDEpIHJldHVybjtcbiAgICBpZiAociA+IHQwKSB0MCA9IHI7XG4gIH0gZWxzZSBpZiAoZHkgPiAwKSB7XG4gICAgaWYgKHIgPCB0MCkgcmV0dXJuO1xuICAgIGlmIChyIDwgdDEpIHQxID0gcjtcbiAgfVxuXG4gIGlmICh0MCA+IDApIGFbMF0gPSBheCArIHQwICogZHgsIGFbMV0gPSBheSArIHQwICogZHk7XG4gIGlmICh0MSA8IDEpIGJbMF0gPSBheCArIHQxICogZHgsIGJbMV0gPSBheSArIHQxICogZHk7XG4gIHJldHVybiB0cnVlO1xufTtcblxudmFyIHBvaW50RXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhYnMoYVswXSAtIGJbMF0pIDwgZXBzaWxvbiAmJiBhYnMoYVsxXSAtIGJbMV0pIDwgZXBzaWxvbjtcbn07XG5cbmZ1bmN0aW9uIEludGVyc2VjdGlvbihwb2ludCwgcG9pbnRzLCBvdGhlciwgZW50cnkpIHtcbiAgdGhpcy54ID0gcG9pbnQ7XG4gIHRoaXMueiA9IHBvaW50cztcbiAgdGhpcy5vID0gb3RoZXI7IC8vIGFub3RoZXIgaW50ZXJzZWN0aW9uXG4gIHRoaXMuZSA9IGVudHJ5OyAvLyBpcyBhbiBlbnRyeT9cbiAgdGhpcy52ID0gZmFsc2U7IC8vIHZpc2l0ZWRcbiAgdGhpcy5uID0gdGhpcy5wID0gbnVsbDsgLy8gbmV4dCAmIHByZXZpb3VzXG59XG5cbi8vIEEgZ2VuZXJhbGl6ZWQgcG9seWdvbiBjbGlwcGluZyBhbGdvcml0aG06IGdpdmVuIGEgcG9seWdvbiB0aGF0IGhhcyBiZWVuIGN1dFxuLy8gaW50byBpdHMgdmlzaWJsZSBsaW5lIHNlZ21lbnRzLCBhbmQgcmVqb2lucyB0aGUgc2VnbWVudHMgYnkgaW50ZXJwb2xhdGluZ1xuLy8gYWxvbmcgdGhlIGNsaXAgZWRnZS5cbnZhciBjbGlwUG9seWdvbiA9IGZ1bmN0aW9uKHNlZ21lbnRzLCBjb21wYXJlSW50ZXJzZWN0aW9uLCBzdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIHN0cmVhbSkge1xuICB2YXIgc3ViamVjdCA9IFtdLFxuICAgICAgY2xpcCA9IFtdLFxuICAgICAgaSxcbiAgICAgIG47XG5cbiAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbihzZWdtZW50KSB7XG4gICAgaWYgKChuID0gc2VnbWVudC5sZW5ndGggLSAxKSA8PSAwKSByZXR1cm47XG4gICAgdmFyIG4sIHAwID0gc2VnbWVudFswXSwgcDEgPSBzZWdtZW50W25dLCB4O1xuXG4gICAgLy8gSWYgdGhlIGZpcnN0IGFuZCBsYXN0IHBvaW50cyBvZiBhIHNlZ21lbnQgYXJlIGNvaW5jaWRlbnQsIHRoZW4gdHJlYXQgYXMgYVxuICAgIC8vIGNsb3NlZCByaW5nLiBUT0RPIGlmIGFsbCByaW5ncyBhcmUgY2xvc2VkLCB0aGVuIHRoZSB3aW5kaW5nIG9yZGVyIG9mIHRoZVxuICAgIC8vIGV4dGVyaW9yIHJpbmcgc2hvdWxkIGJlIGNoZWNrZWQuXG4gICAgaWYgKHBvaW50RXF1YWwocDAsIHAxKSkge1xuICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgc3RyZWFtLnBvaW50KChwMCA9IHNlZ21lbnRbaV0pWzBdLCBwMFsxXSk7XG4gICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN1YmplY3QucHVzaCh4ID0gbmV3IEludGVyc2VjdGlvbihwMCwgc2VnbWVudCwgbnVsbCwgdHJ1ZSkpO1xuICAgIGNsaXAucHVzaCh4Lm8gPSBuZXcgSW50ZXJzZWN0aW9uKHAwLCBudWxsLCB4LCBmYWxzZSkpO1xuICAgIHN1YmplY3QucHVzaCh4ID0gbmV3IEludGVyc2VjdGlvbihwMSwgc2VnbWVudCwgbnVsbCwgZmFsc2UpKTtcbiAgICBjbGlwLnB1c2goeC5vID0gbmV3IEludGVyc2VjdGlvbihwMSwgbnVsbCwgeCwgdHJ1ZSkpO1xuICB9KTtcblxuICBpZiAoIXN1YmplY3QubGVuZ3RoKSByZXR1cm47XG5cbiAgY2xpcC5zb3J0KGNvbXBhcmVJbnRlcnNlY3Rpb24pO1xuICBsaW5rKHN1YmplY3QpO1xuICBsaW5rKGNsaXApO1xuXG4gIGZvciAoaSA9IDAsIG4gPSBjbGlwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGNsaXBbaV0uZSA9IHN0YXJ0SW5zaWRlID0gIXN0YXJ0SW5zaWRlO1xuICB9XG5cbiAgdmFyIHN0YXJ0ID0gc3ViamVjdFswXSxcbiAgICAgIHBvaW50cyxcbiAgICAgIHBvaW50O1xuXG4gIHdoaWxlICgxKSB7XG4gICAgLy8gRmluZCBmaXJzdCB1bnZpc2l0ZWQgaW50ZXJzZWN0aW9uLlxuICAgIHZhciBjdXJyZW50ID0gc3RhcnQsXG4gICAgICAgIGlzU3ViamVjdCA9IHRydWU7XG4gICAgd2hpbGUgKGN1cnJlbnQudikgaWYgKChjdXJyZW50ID0gY3VycmVudC5uKSA9PT0gc3RhcnQpIHJldHVybjtcbiAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgIGRvIHtcbiAgICAgIGN1cnJlbnQudiA9IGN1cnJlbnQuby52ID0gdHJ1ZTtcbiAgICAgIGlmIChjdXJyZW50LmUpIHtcbiAgICAgICAgaWYgKGlzU3ViamVjdCkge1xuICAgICAgICAgIGZvciAoaSA9IDAsIG4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbjsgKytpKSBzdHJlYW0ucG9pbnQoKHBvaW50ID0gcG9pbnRzW2ldKVswXSwgcG9pbnRbMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGludGVycG9sYXRlKGN1cnJlbnQueCwgY3VycmVudC5uLngsIDEsIHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc1N1YmplY3QpIHtcbiAgICAgICAgICBwb2ludHMgPSBjdXJyZW50LnAuejtcbiAgICAgICAgICBmb3IgKGkgPSBwb2ludHMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHN0cmVhbS5wb2ludCgocG9pbnQgPSBwb2ludHNbaV0pWzBdLCBwb2ludFsxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW50ZXJwb2xhdGUoY3VycmVudC54LCBjdXJyZW50LnAueCwgLTEsIHN0cmVhbSk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucDtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm87XG4gICAgICBwb2ludHMgPSBjdXJyZW50Lno7XG4gICAgICBpc1N1YmplY3QgPSAhaXNTdWJqZWN0O1xuICAgIH0gd2hpbGUgKCFjdXJyZW50LnYpO1xuICAgIHN0cmVhbS5saW5lRW5kKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGxpbmsoYXJyYXkpIHtcbiAgaWYgKCEobiA9IGFycmF5Lmxlbmd0aCkpIHJldHVybjtcbiAgdmFyIG4sXG4gICAgICBpID0gMCxcbiAgICAgIGEgPSBhcnJheVswXSxcbiAgICAgIGI7XG4gIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgYS5uID0gYiA9IGFycmF5W2ldO1xuICAgIGIucCA9IGE7XG4gICAgYSA9IGI7XG4gIH1cbiAgYS5uID0gYiA9IGFycmF5WzBdO1xuICBiLnAgPSBhO1xufVxuXG52YXIgY2xpcE1heCA9IDFlOTtcbnZhciBjbGlwTWluID0gLWNsaXBNYXg7XG5cbi8vIFRPRE8gVXNlIGQzLXBvbHlnb27igJlzIHBvbHlnb25Db250YWlucyBoZXJlIGZvciB0aGUgcmluZyBjaGVjaz9cbi8vIFRPRE8gRWxpbWluYXRlIGR1cGxpY2F0ZSBidWZmZXJpbmcgaW4gY2xpcEJ1ZmZlciBhbmQgcG9seWdvbi5wdXNoP1xuXG5mdW5jdGlvbiBjbGlwRXh0ZW50KHgwLCB5MCwgeDEsIHkxKSB7XG5cbiAgZnVuY3Rpb24gdmlzaWJsZSh4LCB5KSB7XG4gICAgcmV0dXJuIHgwIDw9IHggJiYgeCA8PSB4MSAmJiB5MCA8PSB5ICYmIHkgPD0geTE7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBzdHJlYW0pIHtcbiAgICB2YXIgYSA9IDAsIGExID0gMDtcbiAgICBpZiAoZnJvbSA9PSBudWxsXG4gICAgICAgIHx8IChhID0gY29ybmVyKGZyb20sIGRpcmVjdGlvbikpICE9PSAoYTEgPSBjb3JuZXIodG8sIGRpcmVjdGlvbikpXG4gICAgICAgIHx8IGNvbXBhcmVQb2ludChmcm9tLCB0bykgPCAwIF4gZGlyZWN0aW9uID4gMCkge1xuICAgICAgZG8gc3RyZWFtLnBvaW50KGEgPT09IDAgfHwgYSA9PT0gMyA/IHgwIDogeDEsIGEgPiAxID8geTEgOiB5MCk7XG4gICAgICB3aGlsZSAoKGEgPSAoYSArIGRpcmVjdGlvbiArIDQpICUgNCkgIT09IGExKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyZWFtLnBvaW50KHRvWzBdLCB0b1sxXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29ybmVyKHAsIGRpcmVjdGlvbikge1xuICAgIHJldHVybiBhYnMocFswXSAtIHgwKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMCA6IDNcbiAgICAgICAgOiBhYnMocFswXSAtIHgxKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMiA6IDFcbiAgICAgICAgOiBhYnMocFsxXSAtIHkwKSA8IGVwc2lsb24gPyBkaXJlY3Rpb24gPiAwID8gMSA6IDBcbiAgICAgICAgOiBkaXJlY3Rpb24gPiAwID8gMyA6IDI7IC8vIGFicyhwWzFdIC0geTEpIDwgZXBzaWxvblxuICB9XG5cbiAgZnVuY3Rpb24gY29tcGFyZUludGVyc2VjdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGNvbXBhcmVQb2ludChhLngsIGIueCk7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wYXJlUG9pbnQoYSwgYikge1xuICAgIHZhciBjYSA9IGNvcm5lcihhLCAxKSxcbiAgICAgICAgY2IgPSBjb3JuZXIoYiwgMSk7XG4gICAgcmV0dXJuIGNhICE9PSBjYiA/IGNhIC0gY2JcbiAgICAgICAgOiBjYSA9PT0gMCA/IGJbMV0gLSBhWzFdXG4gICAgICAgIDogY2EgPT09IDEgPyBhWzBdIC0gYlswXVxuICAgICAgICA6IGNhID09PSAyID8gYVsxXSAtIGJbMV1cbiAgICAgICAgOiBiWzBdIC0gYVswXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICB2YXIgYWN0aXZlU3RyZWFtID0gc3RyZWFtLFxuICAgICAgICBidWZmZXJTdHJlYW0gPSBjbGlwQnVmZmVyKCksXG4gICAgICAgIHNlZ21lbnRzLFxuICAgICAgICBwb2x5Z29uLFxuICAgICAgICByaW5nLFxuICAgICAgICB4X18sIHlfXywgdl9fLCAvLyBmaXJzdCBwb2ludFxuICAgICAgICB4XywgeV8sIHZfLCAvLyBwcmV2aW91cyBwb2ludFxuICAgICAgICBmaXJzdCxcbiAgICAgICAgY2xlYW47XG5cbiAgICB2YXIgY2xpcFN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogcG9seWdvblN0YXJ0LFxuICAgICAgcG9seWdvbkVuZDogcG9seWdvbkVuZFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gICAgICBpZiAodmlzaWJsZSh4LCB5KSkgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvbHlnb25JbnNpZGUoKSB7XG4gICAgICB2YXIgd2luZGluZyA9IDA7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgZm9yICh2YXIgcmluZyA9IHBvbHlnb25baV0sIGogPSAxLCBtID0gcmluZy5sZW5ndGgsIHBvaW50ID0gcmluZ1swXSwgYTAsIGExLCBiMCA9IHBvaW50WzBdLCBiMSA9IHBvaW50WzFdOyBqIDwgbTsgKytqKSB7XG4gICAgICAgICAgYTAgPSBiMCwgYTEgPSBiMSwgcG9pbnQgPSByaW5nW2pdLCBiMCA9IHBvaW50WzBdLCBiMSA9IHBvaW50WzFdO1xuICAgICAgICAgIGlmIChhMSA8PSB5MSkgeyBpZiAoYjEgPiB5MSAmJiAoYjAgLSBhMCkgKiAoeTEgLSBhMSkgPiAoYjEgLSBhMSkgKiAoeDAgLSBhMCkpICsrd2luZGluZzsgfVxuICAgICAgICAgIGVsc2UgeyBpZiAoYjEgPD0geTEgJiYgKGIwIC0gYTApICogKHkxIC0gYTEpIDwgKGIxIC0gYTEpICogKHgwIC0gYTApKSAtLXdpbmRpbmc7IH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gd2luZGluZztcbiAgICB9XG5cbiAgICAvLyBCdWZmZXIgZ2VvbWV0cnkgd2l0aGluIGEgcG9seWdvbiBhbmQgdGhlbiBjbGlwIGl0IGVuIG1hc3NlLlxuICAgIGZ1bmN0aW9uIHBvbHlnb25TdGFydCgpIHtcbiAgICAgIGFjdGl2ZVN0cmVhbSA9IGJ1ZmZlclN0cmVhbSwgc2VnbWVudHMgPSBbXSwgcG9seWdvbiA9IFtdLCBjbGVhbiA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9seWdvbkVuZCgpIHtcbiAgICAgIHZhciBzdGFydEluc2lkZSA9IHBvbHlnb25JbnNpZGUoKSxcbiAgICAgICAgICBjbGVhbkluc2lkZSA9IGNsZWFuICYmIHN0YXJ0SW5zaWRlLFxuICAgICAgICAgIHZpc2libGUgPSAoc2VnbWVudHMgPSBkM0FycmF5Lm1lcmdlKHNlZ21lbnRzKSkubGVuZ3RoO1xuICAgICAgaWYgKGNsZWFuSW5zaWRlIHx8IHZpc2libGUpIHtcbiAgICAgICAgc3RyZWFtLnBvbHlnb25TdGFydCgpO1xuICAgICAgICBpZiAoY2xlYW5JbnNpZGUpIHtcbiAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgc3RyZWFtKTtcbiAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgICAgY2xpcFBvbHlnb24oc2VnbWVudHMsIGNvbXBhcmVJbnRlcnNlY3Rpb24sIHN0YXJ0SW5zaWRlLCBpbnRlcnBvbGF0ZSwgc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJlYW0ucG9seWdvbkVuZCgpO1xuICAgICAgfVxuICAgICAgYWN0aXZlU3RyZWFtID0gc3RyZWFtLCBzZWdtZW50cyA9IHBvbHlnb24gPSByaW5nID0gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICBjbGlwU3RyZWFtLnBvaW50ID0gbGluZVBvaW50O1xuICAgICAgaWYgKHBvbHlnb24pIHBvbHlnb24ucHVzaChyaW5nID0gW10pO1xuICAgICAgZmlyc3QgPSB0cnVlO1xuICAgICAgdl8gPSBmYWxzZTtcbiAgICAgIHhfID0geV8gPSBOYU47XG4gICAgfVxuXG4gICAgLy8gVE9ETyByYXRoZXIgdGhhbiBzcGVjaWFsLWNhc2UgcG9seWdvbnMsIHNpbXBseSBoYW5kbGUgdGhlbSBzZXBhcmF0ZWx5LlxuICAgIC8vIElkZWFsbHksIGNvaW5jaWRlbnQgaW50ZXJzZWN0aW9uIHBvaW50cyBzaG91bGQgYmUgaml0dGVyZWQgdG8gYXZvaWRcbiAgICAvLyBjbGlwcGluZyBpc3N1ZXMuXG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIGlmIChzZWdtZW50cykge1xuICAgICAgICBsaW5lUG9pbnQoeF9fLCB5X18pO1xuICAgICAgICBpZiAodl9fICYmIHZfKSBidWZmZXJTdHJlYW0ucmVqb2luKCk7XG4gICAgICAgIHNlZ21lbnRzLnB1c2goYnVmZmVyU3RyZWFtLnJlc3VsdCgpKTtcbiAgICAgIH1cbiAgICAgIGNsaXBTdHJlYW0ucG9pbnQgPSBwb2ludDtcbiAgICAgIGlmICh2XykgYWN0aXZlU3RyZWFtLmxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lUG9pbnQoeCwgeSkge1xuICAgICAgdmFyIHYgPSB2aXNpYmxlKHgsIHkpO1xuICAgICAgaWYgKHBvbHlnb24pIHJpbmcucHVzaChbeCwgeV0pO1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIHhfXyA9IHgsIHlfXyA9IHksIHZfXyA9IHY7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHYgJiYgdl8pIGFjdGl2ZVN0cmVhbS5wb2ludCh4LCB5KTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGEgPSBbeF8gPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB4XykpLCB5XyA9IE1hdGgubWF4KGNsaXBNaW4sIE1hdGgubWluKGNsaXBNYXgsIHlfKSldLFxuICAgICAgICAgICAgICBiID0gW3ggPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB4KSksIHkgPSBNYXRoLm1heChjbGlwTWluLCBNYXRoLm1pbihjbGlwTWF4LCB5KSldO1xuICAgICAgICAgIGlmIChjbGlwTGluZShhLCBiLCB4MCwgeTAsIHgxLCB5MSkpIHtcbiAgICAgICAgICAgIGlmICghdl8pIHtcbiAgICAgICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoYVswXSwgYVsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3RpdmVTdHJlYW0ucG9pbnQoYlswXSwgYlsxXSk7XG4gICAgICAgICAgICBpZiAoIXYpIGFjdGl2ZVN0cmVhbS5saW5lRW5kKCk7XG4gICAgICAgICAgICBjbGVhbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAodikge1xuICAgICAgICAgICAgYWN0aXZlU3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICAgICAgYWN0aXZlU3RyZWFtLnBvaW50KHgsIHkpO1xuICAgICAgICAgICAgY2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHhfID0geCwgeV8gPSB5LCB2XyA9IHY7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsaXBTdHJlYW07XG4gIH07XG59XG5cbnZhciBleHRlbnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHgwID0gMCxcbiAgICAgIHkwID0gMCxcbiAgICAgIHgxID0gOTYwLFxuICAgICAgeTEgPSA1MDAsXG4gICAgICBjYWNoZSxcbiAgICAgIGNhY2hlU3RyZWFtLFxuICAgICAgY2xpcDtcblxuICByZXR1cm4gY2xpcCA9IHtcbiAgICBzdHJlYW06IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgcmV0dXJuIGNhY2hlICYmIGNhY2hlU3RyZWFtID09PSBzdHJlYW0gPyBjYWNoZSA6IGNhY2hlID0gY2xpcEV4dGVudCh4MCwgeTAsIHgxLCB5MSkoY2FjaGVTdHJlYW0gPSBzdHJlYW0pO1xuICAgIH0sXG4gICAgZXh0ZW50OiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4MCA9ICtfWzBdWzBdLCB5MCA9ICtfWzBdWzFdLCB4MSA9ICtfWzFdWzBdLCB5MSA9ICtfWzFdWzFdLCBjYWNoZSA9IGNhY2hlU3RyZWFtID0gbnVsbCwgY2xpcCkgOiBbW3gwLCB5MF0sIFt4MSwgeTFdXTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgc3VtID0gYWRkZXIoKTtcblxudmFyIHBvbHlnb25Db250YWlucyA9IGZ1bmN0aW9uKHBvbHlnb24sIHBvaW50KSB7XG4gIHZhciBsYW1iZGEgPSBwb2ludFswXSxcbiAgICAgIHBoaSA9IHBvaW50WzFdLFxuICAgICAgbm9ybWFsID0gW3NpbihsYW1iZGEpLCAtY29zKGxhbWJkYSksIDBdLFxuICAgICAgYW5nbGUgPSAwLFxuICAgICAgd2luZGluZyA9IDA7XG5cbiAgc3VtLnJlc2V0KCk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICghKG0gPSAocmluZyA9IHBvbHlnb25baV0pLmxlbmd0aCkpIGNvbnRpbnVlO1xuICAgIHZhciByaW5nLFxuICAgICAgICBtLFxuICAgICAgICBwb2ludDAgPSByaW5nW20gLSAxXSxcbiAgICAgICAgbGFtYmRhMCA9IHBvaW50MFswXSxcbiAgICAgICAgcGhpMCA9IHBvaW50MFsxXSAvIDIgKyBxdWFydGVyUGksXG4gICAgICAgIHNpblBoaTAgPSBzaW4ocGhpMCksXG4gICAgICAgIGNvc1BoaTAgPSBjb3MocGhpMCk7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG07ICsraiwgbGFtYmRhMCA9IGxhbWJkYTEsIHNpblBoaTAgPSBzaW5QaGkxLCBjb3NQaGkwID0gY29zUGhpMSwgcG9pbnQwID0gcG9pbnQxKSB7XG4gICAgICB2YXIgcG9pbnQxID0gcmluZ1tqXSxcbiAgICAgICAgICBsYW1iZGExID0gcG9pbnQxWzBdLFxuICAgICAgICAgIHBoaTEgPSBwb2ludDFbMV0gLyAyICsgcXVhcnRlclBpLFxuICAgICAgICAgIHNpblBoaTEgPSBzaW4ocGhpMSksXG4gICAgICAgICAgY29zUGhpMSA9IGNvcyhwaGkxKSxcbiAgICAgICAgICBkZWx0YSA9IGxhbWJkYTEgLSBsYW1iZGEwLFxuICAgICAgICAgIHNpZ24kJDEgPSBkZWx0YSA+PSAwID8gMSA6IC0xLFxuICAgICAgICAgIGFic0RlbHRhID0gc2lnbiQkMSAqIGRlbHRhLFxuICAgICAgICAgIGFudGltZXJpZGlhbiA9IGFic0RlbHRhID4gcGksXG4gICAgICAgICAgayA9IHNpblBoaTAgKiBzaW5QaGkxO1xuXG4gICAgICBzdW0uYWRkKGF0YW4yKGsgKiBzaWduJCQxICogc2luKGFic0RlbHRhKSwgY29zUGhpMCAqIGNvc1BoaTEgKyBrICogY29zKGFic0RlbHRhKSkpO1xuICAgICAgYW5nbGUgKz0gYW50aW1lcmlkaWFuID8gZGVsdGEgKyBzaWduJCQxICogdGF1IDogZGVsdGE7XG5cbiAgICAgIC8vIEFyZSB0aGUgbG9uZ2l0dWRlcyBlaXRoZXIgc2lkZSBvZiB0aGUgcG9pbnTigJlzIG1lcmlkaWFuIChsYW1iZGEpLFxuICAgICAgLy8gYW5kIGFyZSB0aGUgbGF0aXR1ZGVzIHNtYWxsZXIgdGhhbiB0aGUgcGFyYWxsZWwgKHBoaSk/XG4gICAgICBpZiAoYW50aW1lcmlkaWFuIF4gbGFtYmRhMCA+PSBsYW1iZGEgXiBsYW1iZGExID49IGxhbWJkYSkge1xuICAgICAgICB2YXIgYXJjID0gY2FydGVzaWFuQ3Jvc3MoY2FydGVzaWFuKHBvaW50MCksIGNhcnRlc2lhbihwb2ludDEpKTtcbiAgICAgICAgY2FydGVzaWFuTm9ybWFsaXplSW5QbGFjZShhcmMpO1xuICAgICAgICB2YXIgaW50ZXJzZWN0aW9uID0gY2FydGVzaWFuQ3Jvc3Mobm9ybWFsLCBhcmMpO1xuICAgICAgICBjYXJ0ZXNpYW5Ob3JtYWxpemVJblBsYWNlKGludGVyc2VjdGlvbik7XG4gICAgICAgIHZhciBwaGlBcmMgPSAoYW50aW1lcmlkaWFuIF4gZGVsdGEgPj0gMCA/IC0xIDogMSkgKiBhc2luKGludGVyc2VjdGlvblsyXSk7XG4gICAgICAgIGlmIChwaGkgPiBwaGlBcmMgfHwgcGhpID09PSBwaGlBcmMgJiYgKGFyY1swXSB8fCBhcmNbMV0pKSB7XG4gICAgICAgICAgd2luZGluZyArPSBhbnRpbWVyaWRpYW4gXiBkZWx0YSA+PSAwID8gMSA6IC0xO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRmlyc3QsIGRldGVybWluZSB3aGV0aGVyIHRoZSBTb3V0aCBwb2xlIGlzIGluc2lkZSBvciBvdXRzaWRlOlxuICAvL1xuICAvLyBJdCBpcyBpbnNpZGUgaWY6XG4gIC8vICogdGhlIHBvbHlnb24gd2luZHMgYXJvdW5kIGl0IGluIGEgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgLy8gKiB0aGUgcG9seWdvbiBkb2VzIG5vdCAoY3VtdWxhdGl2ZWx5KSB3aW5kIGFyb3VuZCBpdCwgYnV0IGhhcyBhIG5lZ2F0aXZlXG4gIC8vICAgKGNvdW50ZXItY2xvY2t3aXNlKSBhcmVhLlxuICAvL1xuICAvLyBTZWNvbmQsIGNvdW50IHRoZSAoc2lnbmVkKSBudW1iZXIgb2YgdGltZXMgYSBzZWdtZW50IGNyb3NzZXMgYSBsYW1iZGFcbiAgLy8gZnJvbSB0aGUgcG9pbnQgdG8gdGhlIFNvdXRoIHBvbGUuICBJZiBpdCBpcyB6ZXJvLCB0aGVuIHRoZSBwb2ludCBpcyB0aGVcbiAgLy8gc2FtZSBzaWRlIGFzIHRoZSBTb3V0aCBwb2xlLlxuXG4gIHJldHVybiAoYW5nbGUgPCAtZXBzaWxvbiB8fCBhbmdsZSA8IGVwc2lsb24gJiYgc3VtIDwgLWVwc2lsb24pIF4gKHdpbmRpbmcgJiAxKTtcbn07XG5cbnZhciBsZW5ndGhTdW0gPSBhZGRlcigpO1xudmFyIGxhbWJkYTAkMjtcbnZhciBzaW5QaGkwJDE7XG52YXIgY29zUGhpMCQxO1xuXG52YXIgbGVuZ3RoU3RyZWFtID0ge1xuICBzcGhlcmU6IG5vb3AsXG4gIHBvaW50OiBub29wLFxuICBsaW5lU3RhcnQ6IGxlbmd0aExpbmVTdGFydCxcbiAgbGluZUVuZDogbm9vcCxcbiAgcG9seWdvblN0YXJ0OiBub29wLFxuICBwb2x5Z29uRW5kOiBub29wXG59O1xuXG5mdW5jdGlvbiBsZW5ndGhMaW5lU3RhcnQoKSB7XG4gIGxlbmd0aFN0cmVhbS5wb2ludCA9IGxlbmd0aFBvaW50Rmlyc3Q7XG4gIGxlbmd0aFN0cmVhbS5saW5lRW5kID0gbGVuZ3RoTGluZUVuZDtcbn1cblxuZnVuY3Rpb24gbGVuZ3RoTGluZUVuZCgpIHtcbiAgbGVuZ3RoU3RyZWFtLnBvaW50ID0gbGVuZ3RoU3RyZWFtLmxpbmVFbmQgPSBub29wO1xufVxuXG5mdW5jdGlvbiBsZW5ndGhQb2ludEZpcnN0KGxhbWJkYSwgcGhpKSB7XG4gIGxhbWJkYSAqPSByYWRpYW5zLCBwaGkgKj0gcmFkaWFucztcbiAgbGFtYmRhMCQyID0gbGFtYmRhLCBzaW5QaGkwJDEgPSBzaW4ocGhpKSwgY29zUGhpMCQxID0gY29zKHBoaSk7XG4gIGxlbmd0aFN0cmVhbS5wb2ludCA9IGxlbmd0aFBvaW50O1xufVxuXG5mdW5jdGlvbiBsZW5ndGhQb2ludChsYW1iZGEsIHBoaSkge1xuICBsYW1iZGEgKj0gcmFkaWFucywgcGhpICo9IHJhZGlhbnM7XG4gIHZhciBzaW5QaGkgPSBzaW4ocGhpKSxcbiAgICAgIGNvc1BoaSA9IGNvcyhwaGkpLFxuICAgICAgZGVsdGEgPSBhYnMobGFtYmRhIC0gbGFtYmRhMCQyKSxcbiAgICAgIGNvc0RlbHRhID0gY29zKGRlbHRhKSxcbiAgICAgIHNpbkRlbHRhID0gc2luKGRlbHRhKSxcbiAgICAgIHggPSBjb3NQaGkgKiBzaW5EZWx0YSxcbiAgICAgIHkgPSBjb3NQaGkwJDEgKiBzaW5QaGkgLSBzaW5QaGkwJDEgKiBjb3NQaGkgKiBjb3NEZWx0YSxcbiAgICAgIHogPSBzaW5QaGkwJDEgKiBzaW5QaGkgKyBjb3NQaGkwJDEgKiBjb3NQaGkgKiBjb3NEZWx0YTtcbiAgbGVuZ3RoU3VtLmFkZChhdGFuMihzcXJ0KHggKiB4ICsgeSAqIHkpLCB6KSk7XG4gIGxhbWJkYTAkMiA9IGxhbWJkYSwgc2luUGhpMCQxID0gc2luUGhpLCBjb3NQaGkwJDEgPSBjb3NQaGk7XG59XG5cbnZhciBsZW5ndGggPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgbGVuZ3RoU3VtLnJlc2V0KCk7XG4gIGdlb1N0cmVhbShvYmplY3QsIGxlbmd0aFN0cmVhbSk7XG4gIHJldHVybiArbGVuZ3RoU3VtO1xufTtcblxudmFyIGNvb3JkaW5hdGVzID0gW251bGwsIG51bGxdO1xudmFyIG9iamVjdCA9IHt0eXBlOiBcIkxpbmVTdHJpbmdcIiwgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzfTtcblxudmFyIGRpc3RhbmNlID0gZnVuY3Rpb24oYSwgYikge1xuICBjb29yZGluYXRlc1swXSA9IGE7XG4gIGNvb3JkaW5hdGVzWzFdID0gYjtcbiAgcmV0dXJuIGxlbmd0aChvYmplY3QpO1xufTtcblxudmFyIGNvbnRhaW5zT2JqZWN0VHlwZSA9IHtcbiAgRmVhdHVyZTogZnVuY3Rpb24ob2JqZWN0LCBwb2ludCkge1xuICAgIHJldHVybiBjb250YWluc0dlb21ldHJ5KG9iamVjdC5nZW9tZXRyeSwgcG9pbnQpO1xuICB9LFxuICBGZWF0dXJlQ29sbGVjdGlvbjogZnVuY3Rpb24ob2JqZWN0LCBwb2ludCkge1xuICAgIHZhciBmZWF0dXJlcyA9IG9iamVjdC5mZWF0dXJlcywgaSA9IC0xLCBuID0gZmVhdHVyZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoY29udGFpbnNHZW9tZXRyeShmZWF0dXJlc1tpXS5nZW9tZXRyeSwgcG9pbnQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnZhciBjb250YWluc0dlb21ldHJ5VHlwZSA9IHtcbiAgU3BoZXJlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgUG9pbnQ6IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgICByZXR1cm4gY29udGFpbnNQb2ludChvYmplY3QuY29vcmRpbmF0ZXMsIHBvaW50KTtcbiAgfSxcbiAgTXVsdGlQb2ludDogZnVuY3Rpb24ob2JqZWN0LCBwb2ludCkge1xuICAgIHZhciBjb29yZGluYXRlcyA9IG9iamVjdC5jb29yZGluYXRlcywgaSA9IC0xLCBuID0gY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoY29udGFpbnNQb2ludChjb29yZGluYXRlc1tpXSwgcG9pbnQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIExpbmVTdHJpbmc6IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgICByZXR1cm4gY29udGFpbnNMaW5lKG9iamVjdC5jb29yZGluYXRlcywgcG9pbnQpO1xuICB9LFxuICBNdWx0aUxpbmVTdHJpbmc6IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKGNvbnRhaW5zTGluZShjb29yZGluYXRlc1tpXSwgcG9pbnQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgICByZXR1cm4gY29udGFpbnNQb2x5Z29uKG9iamVjdC5jb29yZGluYXRlcywgcG9pbnQpO1xuICB9LFxuICBNdWx0aVBvbHlnb246IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSBvYmplY3QuY29vcmRpbmF0ZXMsIGkgPSAtMSwgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKGNvbnRhaW5zUG9seWdvbihjb29yZGluYXRlc1tpXSwgcG9pbnQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIEdlb21ldHJ5Q29sbGVjdGlvbjogZnVuY3Rpb24ob2JqZWN0LCBwb2ludCkge1xuICAgIHZhciBnZW9tZXRyaWVzID0gb2JqZWN0Lmdlb21ldHJpZXMsIGkgPSAtMSwgbiA9IGdlb21ldHJpZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoY29udGFpbnNHZW9tZXRyeShnZW9tZXRyaWVzW2ldLCBwb2ludCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY29udGFpbnNHZW9tZXRyeShnZW9tZXRyeSwgcG9pbnQpIHtcbiAgcmV0dXJuIGdlb21ldHJ5ICYmIGNvbnRhaW5zR2VvbWV0cnlUeXBlLmhhc093blByb3BlcnR5KGdlb21ldHJ5LnR5cGUpXG4gICAgICA/IGNvbnRhaW5zR2VvbWV0cnlUeXBlW2dlb21ldHJ5LnR5cGVdKGdlb21ldHJ5LCBwb2ludClcbiAgICAgIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zUG9pbnQoY29vcmRpbmF0ZXMsIHBvaW50KSB7XG4gIHJldHVybiBkaXN0YW5jZShjb29yZGluYXRlcywgcG9pbnQpID09PSAwO1xufVxuXG5mdW5jdGlvbiBjb250YWluc0xpbmUoY29vcmRpbmF0ZXMsIHBvaW50KSB7XG4gIHZhciBhYiA9IGRpc3RhbmNlKGNvb3JkaW5hdGVzWzBdLCBjb29yZGluYXRlc1sxXSksXG4gICAgICBhbyA9IGRpc3RhbmNlKGNvb3JkaW5hdGVzWzBdLCBwb2ludCksXG4gICAgICBvYiA9IGRpc3RhbmNlKHBvaW50LCBjb29yZGluYXRlc1sxXSk7XG4gIHJldHVybiBhbyArIG9iIDw9IGFiICsgZXBzaWxvbjtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNQb2x5Z29uKGNvb3JkaW5hdGVzLCBwb2ludCkge1xuICByZXR1cm4gISFwb2x5Z29uQ29udGFpbnMoY29vcmRpbmF0ZXMubWFwKHJpbmdSYWRpYW5zKSwgcG9pbnRSYWRpYW5zKHBvaW50KSk7XG59XG5cbmZ1bmN0aW9uIHJpbmdSYWRpYW5zKHJpbmcpIHtcbiAgcmV0dXJuIHJpbmcgPSByaW5nLm1hcChwb2ludFJhZGlhbnMpLCByaW5nLnBvcCgpLCByaW5nO1xufVxuXG5mdW5jdGlvbiBwb2ludFJhZGlhbnMocG9pbnQpIHtcbiAgcmV0dXJuIFtwb2ludFswXSAqIHJhZGlhbnMsIHBvaW50WzFdICogcmFkaWFuc107XG59XG5cbnZhciBjb250YWlucyA9IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcbiAgcmV0dXJuIChvYmplY3QgJiYgY29udGFpbnNPYmplY3RUeXBlLmhhc093blByb3BlcnR5KG9iamVjdC50eXBlKVxuICAgICAgPyBjb250YWluc09iamVjdFR5cGVbb2JqZWN0LnR5cGVdXG4gICAgICA6IGNvbnRhaW5zR2VvbWV0cnkpKG9iamVjdCwgcG9pbnQpO1xufTtcblxuZnVuY3Rpb24gZ3JhdGljdWxlWCh5MCwgeTEsIGR5KSB7XG4gIHZhciB5ID0gZDNBcnJheS5yYW5nZSh5MCwgeTEgLSBlcHNpbG9uLCBkeSkuY29uY2F0KHkxKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHkubWFwKGZ1bmN0aW9uKHkpIHsgcmV0dXJuIFt4LCB5XTsgfSk7IH07XG59XG5cbmZ1bmN0aW9uIGdyYXRpY3VsZVkoeDAsIHgxLCBkeCkge1xuICB2YXIgeCA9IGQzQXJyYXkucmFuZ2UoeDAsIHgxIC0gZXBzaWxvbiwgZHgpLmNvbmNhdCh4MSk7XG4gIHJldHVybiBmdW5jdGlvbih5KSB7IHJldHVybiB4Lm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBbeCwgeV07IH0pOyB9O1xufVxuXG5mdW5jdGlvbiBncmF0aWN1bGUoKSB7XG4gIHZhciB4MSwgeDAsIFgxLCBYMCxcbiAgICAgIHkxLCB5MCwgWTEsIFkwLFxuICAgICAgZHggPSAxMCwgZHkgPSBkeCwgRFggPSA5MCwgRFkgPSAzNjAsXG4gICAgICB4LCB5LCBYLCBZLFxuICAgICAgcHJlY2lzaW9uID0gMi41O1xuXG4gIGZ1bmN0aW9uIGdyYXRpY3VsZSgpIHtcbiAgICByZXR1cm4ge3R5cGU6IFwiTXVsdGlMaW5lU3RyaW5nXCIsIGNvb3JkaW5hdGVzOiBsaW5lcygpfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpbmVzKCkge1xuICAgIHJldHVybiBkM0FycmF5LnJhbmdlKGNlaWwoWDAgLyBEWCkgKiBEWCwgWDEsIERYKS5tYXAoWClcbiAgICAgICAgLmNvbmNhdChkM0FycmF5LnJhbmdlKGNlaWwoWTAgLyBEWSkgKiBEWSwgWTEsIERZKS5tYXAoWSkpXG4gICAgICAgIC5jb25jYXQoZDNBcnJheS5yYW5nZShjZWlsKHgwIC8gZHgpICogZHgsIHgxLCBkeCkuZmlsdGVyKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGFicyh4ICUgRFgpID4gZXBzaWxvbjsgfSkubWFwKHgpKVxuICAgICAgICAuY29uY2F0KGQzQXJyYXkucmFuZ2UoY2VpbCh5MCAvIGR5KSAqIGR5LCB5MSwgZHkpLmZpbHRlcihmdW5jdGlvbih5KSB7IHJldHVybiBhYnMoeSAlIERZKSA+IGVwc2lsb247IH0pLm1hcCh5KSk7XG4gIH1cblxuICBncmF0aWN1bGUubGluZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbGluZXMoKS5tYXAoZnVuY3Rpb24oY29vcmRpbmF0ZXMpIHsgcmV0dXJuIHt0eXBlOiBcIkxpbmVTdHJpbmdcIiwgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzfTsgfSk7XG4gIH07XG5cbiAgZ3JhdGljdWxlLm91dGxpbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogXCJQb2x5Z29uXCIsXG4gICAgICBjb29yZGluYXRlczogW1xuICAgICAgICBYKFgwKS5jb25jYXQoXG4gICAgICAgIFkoWTEpLnNsaWNlKDEpLFxuICAgICAgICBYKFgxKS5yZXZlcnNlKCkuc2xpY2UoMSksXG4gICAgICAgIFkoWTApLnJldmVyc2UoKS5zbGljZSgxKSlcbiAgICAgIF1cbiAgICB9O1xuICB9O1xuXG4gIGdyYXRpY3VsZS5leHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZ3JhdGljdWxlLmV4dGVudE1pbm9yKCk7XG4gICAgcmV0dXJuIGdyYXRpY3VsZS5leHRlbnRNYWpvcihfKS5leHRlbnRNaW5vcihfKTtcbiAgfTtcblxuICBncmF0aWN1bGUuZXh0ZW50TWFqb3IgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gW1tYMCwgWTBdLCBbWDEsIFkxXV07XG4gICAgWDAgPSArX1swXVswXSwgWDEgPSArX1sxXVswXTtcbiAgICBZMCA9ICtfWzBdWzFdLCBZMSA9ICtfWzFdWzFdO1xuICAgIGlmIChYMCA+IFgxKSBfID0gWDAsIFgwID0gWDEsIFgxID0gXztcbiAgICBpZiAoWTAgPiBZMSkgXyA9IFkwLCBZMCA9IFkxLCBZMSA9IF87XG4gICAgcmV0dXJuIGdyYXRpY3VsZS5wcmVjaXNpb24ocHJlY2lzaW9uKTtcbiAgfTtcblxuICBncmF0aWN1bGUuZXh0ZW50TWlub3IgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gW1t4MCwgeTBdLCBbeDEsIHkxXV07XG4gICAgeDAgPSArX1swXVswXSwgeDEgPSArX1sxXVswXTtcbiAgICB5MCA9ICtfWzBdWzFdLCB5MSA9ICtfWzFdWzFdO1xuICAgIGlmICh4MCA+IHgxKSBfID0geDAsIHgwID0geDEsIHgxID0gXztcbiAgICBpZiAoeTAgPiB5MSkgXyA9IHkwLCB5MCA9IHkxLCB5MSA9IF87XG4gICAgcmV0dXJuIGdyYXRpY3VsZS5wcmVjaXNpb24ocHJlY2lzaW9uKTtcbiAgfTtcblxuICBncmF0aWN1bGUuc3RlcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBncmF0aWN1bGUuc3RlcE1pbm9yKCk7XG4gICAgcmV0dXJuIGdyYXRpY3VsZS5zdGVwTWFqb3IoXykuc3RlcE1pbm9yKF8pO1xuICB9O1xuXG4gIGdyYXRpY3VsZS5zdGVwTWFqb3IgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gW0RYLCBEWV07XG4gICAgRFggPSArX1swXSwgRFkgPSArX1sxXTtcbiAgICByZXR1cm4gZ3JhdGljdWxlO1xuICB9O1xuXG4gIGdyYXRpY3VsZS5zdGVwTWlub3IgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gW2R4LCBkeV07XG4gICAgZHggPSArX1swXSwgZHkgPSArX1sxXTtcbiAgICByZXR1cm4gZ3JhdGljdWxlO1xuICB9O1xuXG4gIGdyYXRpY3VsZS5wcmVjaXNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcHJlY2lzaW9uO1xuICAgIHByZWNpc2lvbiA9ICtfO1xuICAgIHggPSBncmF0aWN1bGVYKHkwLCB5MSwgOTApO1xuICAgIHkgPSBncmF0aWN1bGVZKHgwLCB4MSwgcHJlY2lzaW9uKTtcbiAgICBYID0gZ3JhdGljdWxlWChZMCwgWTEsIDkwKTtcbiAgICBZID0gZ3JhdGljdWxlWShYMCwgWDEsIHByZWNpc2lvbik7XG4gICAgcmV0dXJuIGdyYXRpY3VsZTtcbiAgfTtcblxuICByZXR1cm4gZ3JhdGljdWxlXG4gICAgICAuZXh0ZW50TWFqb3IoW1stMTgwLCAtOTAgKyBlcHNpbG9uXSwgWzE4MCwgOTAgLSBlcHNpbG9uXV0pXG4gICAgICAuZXh0ZW50TWlub3IoW1stMTgwLCAtODAgLSBlcHNpbG9uXSwgWzE4MCwgODAgKyBlcHNpbG9uXV0pO1xufVxuXG5mdW5jdGlvbiBncmF0aWN1bGUxMCgpIHtcbiAgcmV0dXJuIGdyYXRpY3VsZSgpKCk7XG59XG5cbnZhciBpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIHgwID0gYVswXSAqIHJhZGlhbnMsXG4gICAgICB5MCA9IGFbMV0gKiByYWRpYW5zLFxuICAgICAgeDEgPSBiWzBdICogcmFkaWFucyxcbiAgICAgIHkxID0gYlsxXSAqIHJhZGlhbnMsXG4gICAgICBjeTAgPSBjb3MoeTApLFxuICAgICAgc3kwID0gc2luKHkwKSxcbiAgICAgIGN5MSA9IGNvcyh5MSksXG4gICAgICBzeTEgPSBzaW4oeTEpLFxuICAgICAga3gwID0gY3kwICogY29zKHgwKSxcbiAgICAgIGt5MCA9IGN5MCAqIHNpbih4MCksXG4gICAgICBreDEgPSBjeTEgKiBjb3MoeDEpLFxuICAgICAga3kxID0gY3kxICogc2luKHgxKSxcbiAgICAgIGQgPSAyICogYXNpbihzcXJ0KGhhdmVyc2luKHkxIC0geTApICsgY3kwICogY3kxICogaGF2ZXJzaW4oeDEgLSB4MCkpKSxcbiAgICAgIGsgPSBzaW4oZCk7XG5cbiAgdmFyIGludGVycG9sYXRlID0gZCA/IGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgQiA9IHNpbih0ICo9IGQpIC8gayxcbiAgICAgICAgQSA9IHNpbihkIC0gdCkgLyBrLFxuICAgICAgICB4ID0gQSAqIGt4MCArIEIgKiBreDEsXG4gICAgICAgIHkgPSBBICoga3kwICsgQiAqIGt5MSxcbiAgICAgICAgeiA9IEEgKiBzeTAgKyBCICogc3kxO1xuICAgIHJldHVybiBbXG4gICAgICBhdGFuMih5LCB4KSAqIGRlZ3JlZXMsXG4gICAgICBhdGFuMih6LCBzcXJ0KHggKiB4ICsgeSAqIHkpKSAqIGRlZ3JlZXNcbiAgICBdO1xuICB9IDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt4MCAqIGRlZ3JlZXMsIHkwICogZGVncmVlc107XG4gIH07XG5cbiAgaW50ZXJwb2xhdGUuZGlzdGFuY2UgPSBkO1xuXG4gIHJldHVybiBpbnRlcnBvbGF0ZTtcbn07XG5cbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHg7XG59O1xuXG52YXIgYXJlYVN1bSQxID0gYWRkZXIoKTtcbnZhciBhcmVhUmluZ1N1bSQxID0gYWRkZXIoKTtcbnZhciB4MDA7XG52YXIgeTAwO1xudmFyIHgwJDE7XG52YXIgeTAkMTtcblxudmFyIGFyZWFTdHJlYW0kMSA9IHtcbiAgcG9pbnQ6IG5vb3AsXG4gIGxpbmVTdGFydDogbm9vcCxcbiAgbGluZUVuZDogbm9vcCxcbiAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICBhcmVhU3RyZWFtJDEubGluZVN0YXJ0ID0gYXJlYVJpbmdTdGFydCQxO1xuICAgIGFyZWFTdHJlYW0kMS5saW5lRW5kID0gYXJlYVJpbmdFbmQkMTtcbiAgfSxcbiAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgYXJlYVN0cmVhbSQxLmxpbmVTdGFydCA9IGFyZWFTdHJlYW0kMS5saW5lRW5kID0gYXJlYVN0cmVhbSQxLnBvaW50ID0gbm9vcDtcbiAgICBhcmVhU3VtJDEuYWRkKGFicyhhcmVhUmluZ1N1bSQxKSk7XG4gICAgYXJlYVJpbmdTdW0kMS5yZXNldCgpO1xuICB9LFxuICByZXN1bHQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmVhID0gYXJlYVN1bSQxIC8gMjtcbiAgICBhcmVhU3VtJDEucmVzZXQoKTtcbiAgICByZXR1cm4gYXJlYTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYXJlYVJpbmdTdGFydCQxKCkge1xuICBhcmVhU3RyZWFtJDEucG9pbnQgPSBhcmVhUG9pbnRGaXJzdCQxO1xufVxuXG5mdW5jdGlvbiBhcmVhUG9pbnRGaXJzdCQxKHgsIHkpIHtcbiAgYXJlYVN0cmVhbSQxLnBvaW50ID0gYXJlYVBvaW50JDE7XG4gIHgwMCA9IHgwJDEgPSB4LCB5MDAgPSB5MCQxID0geTtcbn1cblxuZnVuY3Rpb24gYXJlYVBvaW50JDEoeCwgeSkge1xuICBhcmVhUmluZ1N1bSQxLmFkZCh5MCQxICogeCAtIHgwJDEgKiB5KTtcbiAgeDAkMSA9IHgsIHkwJDEgPSB5O1xufVxuXG5mdW5jdGlvbiBhcmVhUmluZ0VuZCQxKCkge1xuICBhcmVhUG9pbnQkMSh4MDAsIHkwMCk7XG59XG5cbnZhciB4MCQyID0gSW5maW5pdHk7XG52YXIgeTAkMiA9IHgwJDI7XG52YXIgeDEgPSAteDAkMjtcbnZhciB5MSA9IHgxO1xuXG52YXIgYm91bmRzU3RyZWFtJDEgPSB7XG4gIHBvaW50OiBib3VuZHNQb2ludCQxLFxuICBsaW5lU3RhcnQ6IG5vb3AsXG4gIGxpbmVFbmQ6IG5vb3AsXG4gIHBvbHlnb25TdGFydDogbm9vcCxcbiAgcG9seWdvbkVuZDogbm9vcCxcbiAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm91bmRzID0gW1t4MCQyLCB5MCQyXSwgW3gxLCB5MV1dO1xuICAgIHgxID0geTEgPSAtKHkwJDIgPSB4MCQyID0gSW5maW5pdHkpO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJvdW5kc1BvaW50JDEoeCwgeSkge1xuICBpZiAoeCA8IHgwJDIpIHgwJDIgPSB4O1xuICBpZiAoeCA+IHgxKSB4MSA9IHg7XG4gIGlmICh5IDwgeTAkMikgeTAkMiA9IHk7XG4gIGlmICh5ID4geTEpIHkxID0geTtcbn1cblxuLy8gVE9ETyBFbmZvcmNlIHBvc2l0aXZlIGFyZWEgZm9yIGV4dGVyaW9yLCBuZWdhdGl2ZSBhcmVhIGZvciBpbnRlcmlvcj9cblxudmFyIFgwJDEgPSAwO1xudmFyIFkwJDEgPSAwO1xudmFyIFowJDEgPSAwO1xudmFyIFgxJDEgPSAwO1xudmFyIFkxJDEgPSAwO1xudmFyIFoxJDEgPSAwO1xudmFyIFgyJDEgPSAwO1xudmFyIFkyJDEgPSAwO1xudmFyIFoyJDEgPSAwO1xudmFyIHgwMCQxO1xudmFyIHkwMCQxO1xudmFyIHgwJDM7XG52YXIgeTAkMztcblxudmFyIGNlbnRyb2lkU3RyZWFtJDEgPSB7XG4gIHBvaW50OiBjZW50cm9pZFBvaW50JDEsXG4gIGxpbmVTdGFydDogY2VudHJvaWRMaW5lU3RhcnQkMSxcbiAgbGluZUVuZDogY2VudHJvaWRMaW5lRW5kJDEsXG4gIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgY2VudHJvaWRTdHJlYW0kMS5saW5lU3RhcnQgPSBjZW50cm9pZFJpbmdTdGFydCQxO1xuICAgIGNlbnRyb2lkU3RyZWFtJDEubGluZUVuZCA9IGNlbnRyb2lkUmluZ0VuZCQxO1xuICB9LFxuICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICBjZW50cm9pZFN0cmVhbSQxLnBvaW50ID0gY2VudHJvaWRQb2ludCQxO1xuICAgIGNlbnRyb2lkU3RyZWFtJDEubGluZVN0YXJ0ID0gY2VudHJvaWRMaW5lU3RhcnQkMTtcbiAgICBjZW50cm9pZFN0cmVhbSQxLmxpbmVFbmQgPSBjZW50cm9pZExpbmVFbmQkMTtcbiAgfSxcbiAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2VudHJvaWQgPSBaMiQxID8gW1gyJDEgLyBaMiQxLCBZMiQxIC8gWjIkMV1cbiAgICAgICAgOiBaMSQxID8gW1gxJDEgLyBaMSQxLCBZMSQxIC8gWjEkMV1cbiAgICAgICAgOiBaMCQxID8gW1gwJDEgLyBaMCQxLCBZMCQxIC8gWjAkMV1cbiAgICAgICAgOiBbTmFOLCBOYU5dO1xuICAgIFgwJDEgPSBZMCQxID0gWjAkMSA9XG4gICAgWDEkMSA9IFkxJDEgPSBaMSQxID1cbiAgICBYMiQxID0gWTIkMSA9IFoyJDEgPSAwO1xuICAgIHJldHVybiBjZW50cm9pZDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY2VudHJvaWRQb2ludCQxKHgsIHkpIHtcbiAgWDAkMSArPSB4O1xuICBZMCQxICs9IHk7XG4gICsrWjAkMTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWRMaW5lU3RhcnQkMSgpIHtcbiAgY2VudHJvaWRTdHJlYW0kMS5wb2ludCA9IGNlbnRyb2lkUG9pbnRGaXJzdExpbmU7XG59XG5cbmZ1bmN0aW9uIGNlbnRyb2lkUG9pbnRGaXJzdExpbmUoeCwgeSkge1xuICBjZW50cm9pZFN0cmVhbSQxLnBvaW50ID0gY2VudHJvaWRQb2ludExpbmU7XG4gIGNlbnRyb2lkUG9pbnQkMSh4MCQzID0geCwgeTAkMyA9IHkpO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZFBvaW50TGluZSh4LCB5KSB7XG4gIHZhciBkeCA9IHggLSB4MCQzLCBkeSA9IHkgLSB5MCQzLCB6ID0gc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gIFgxJDEgKz0geiAqICh4MCQzICsgeCkgLyAyO1xuICBZMSQxICs9IHogKiAoeTAkMyArIHkpIC8gMjtcbiAgWjEkMSArPSB6O1xuICBjZW50cm9pZFBvaW50JDEoeDAkMyA9IHgsIHkwJDMgPSB5KTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWRMaW5lRW5kJDEoKSB7XG4gIGNlbnRyb2lkU3RyZWFtJDEucG9pbnQgPSBjZW50cm9pZFBvaW50JDE7XG59XG5cbmZ1bmN0aW9uIGNlbnRyb2lkUmluZ1N0YXJ0JDEoKSB7XG4gIGNlbnRyb2lkU3RyZWFtJDEucG9pbnQgPSBjZW50cm9pZFBvaW50Rmlyc3RSaW5nO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZFJpbmdFbmQkMSgpIHtcbiAgY2VudHJvaWRQb2ludFJpbmcoeDAwJDEsIHkwMCQxKTtcbn1cblxuZnVuY3Rpb24gY2VudHJvaWRQb2ludEZpcnN0UmluZyh4LCB5KSB7XG4gIGNlbnRyb2lkU3RyZWFtJDEucG9pbnQgPSBjZW50cm9pZFBvaW50UmluZztcbiAgY2VudHJvaWRQb2ludCQxKHgwMCQxID0geDAkMyA9IHgsIHkwMCQxID0geTAkMyA9IHkpO1xufVxuXG5mdW5jdGlvbiBjZW50cm9pZFBvaW50UmluZyh4LCB5KSB7XG4gIHZhciBkeCA9IHggLSB4MCQzLFxuICAgICAgZHkgPSB5IC0geTAkMyxcbiAgICAgIHogPSBzcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICBYMSQxICs9IHogKiAoeDAkMyArIHgpIC8gMjtcbiAgWTEkMSArPSB6ICogKHkwJDMgKyB5KSAvIDI7XG4gIFoxJDEgKz0gejtcblxuICB6ID0geTAkMyAqIHggLSB4MCQzICogeTtcbiAgWDIkMSArPSB6ICogKHgwJDMgKyB4KTtcbiAgWTIkMSArPSB6ICogKHkwJDMgKyB5KTtcbiAgWjIkMSArPSB6ICogMztcbiAgY2VudHJvaWRQb2ludCQxKHgwJDMgPSB4LCB5MCQzID0geSk7XG59XG5cbmZ1bmN0aW9uIFBhdGhDb250ZXh0KGNvbnRleHQpIHtcbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG59XG5cblBhdGhDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgX3JhZGl1czogNC41LFxuICBwb2ludFJhZGl1czogZnVuY3Rpb24oXykge1xuICAgIHJldHVybiB0aGlzLl9yYWRpdXMgPSBfLCB0aGlzO1xuICB9LFxuICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2xpbmUgPSAwO1xuICB9LFxuICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9saW5lID0gTmFOO1xuICB9LFxuICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3BvaW50ID0gMDtcbiAgfSxcbiAgbGluZUVuZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2xpbmUgPT09IDApIHRoaXMuX2NvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgdGhpcy5fcG9pbnQgPSBOYU47XG4gIH0sXG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgc3dpdGNoICh0aGlzLl9wb2ludCkge1xuICAgICAgY2FzZSAwOiB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQubW92ZVRvKHgsIHkpO1xuICAgICAgICB0aGlzLl9wb2ludCA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQubGluZVRvKHgsIHkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgdGhpcy5fY29udGV4dC5tb3ZlVG8oeCArIHRoaXMuX3JhZGl1cywgeSk7XG4gICAgICAgIHRoaXMuX2NvbnRleHQuYXJjKHgsIHksIHRoaXMuX3JhZGl1cywgMCwgdGF1KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXN1bHQ6IG5vb3Bcbn07XG5cbnZhciBsZW5ndGhTdW0kMSA9IGFkZGVyKCk7XG52YXIgbGVuZ3RoUmluZztcbnZhciB4MDAkMjtcbnZhciB5MDAkMjtcbnZhciB4MCQ0O1xudmFyIHkwJDQ7XG5cbnZhciBsZW5ndGhTdHJlYW0kMSA9IHtcbiAgcG9pbnQ6IG5vb3AsXG4gIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgbGVuZ3RoU3RyZWFtJDEucG9pbnQgPSBsZW5ndGhQb2ludEZpcnN0JDE7XG4gIH0sXG4gIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChsZW5ndGhSaW5nKSBsZW5ndGhQb2ludCQxKHgwMCQyLCB5MDAkMik7XG4gICAgbGVuZ3RoU3RyZWFtJDEucG9pbnQgPSBub29wO1xuICB9LFxuICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIGxlbmd0aFJpbmcgPSB0cnVlO1xuICB9LFxuICBwb2x5Z29uRW5kOiBmdW5jdGlvbigpIHtcbiAgICBsZW5ndGhSaW5nID0gbnVsbDtcbiAgfSxcbiAgcmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gK2xlbmd0aFN1bSQxO1xuICAgIGxlbmd0aFN1bSQxLnJlc2V0KCk7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfVxufTtcblxuZnVuY3Rpb24gbGVuZ3RoUG9pbnRGaXJzdCQxKHgsIHkpIHtcbiAgbGVuZ3RoU3RyZWFtJDEucG9pbnQgPSBsZW5ndGhQb2ludCQxO1xuICB4MDAkMiA9IHgwJDQgPSB4LCB5MDAkMiA9IHkwJDQgPSB5O1xufVxuXG5mdW5jdGlvbiBsZW5ndGhQb2ludCQxKHgsIHkpIHtcbiAgeDAkNCAtPSB4LCB5MCQ0IC09IHk7XG4gIGxlbmd0aFN1bSQxLmFkZChzcXJ0KHgwJDQgKiB4MCQ0ICsgeTAkNCAqIHkwJDQpKTtcbiAgeDAkNCA9IHgsIHkwJDQgPSB5O1xufVxuXG5mdW5jdGlvbiBQYXRoU3RyaW5nKCkge1xuICB0aGlzLl9zdHJpbmcgPSBbXTtcbn1cblxuUGF0aFN0cmluZy5wcm90b3R5cGUgPSB7XG4gIF9yYWRpdXM6IDQuNSxcbiAgX2NpcmNsZTogY2lyY2xlJDEoNC41KSxcbiAgcG9pbnRSYWRpdXM6IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoKF8gPSArXykgIT09IHRoaXMuX3JhZGl1cykgdGhpcy5fcmFkaXVzID0gXywgdGhpcy5fY2lyY2xlID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcG9seWdvblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9saW5lID0gMDtcbiAgfSxcbiAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbGluZSA9IE5hTjtcbiAgfSxcbiAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9wb2ludCA9IDA7XG4gIH0sXG4gIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9saW5lID09PSAwKSB0aGlzLl9zdHJpbmcucHVzaChcIlpcIik7XG4gICAgdGhpcy5fcG9pbnQgPSBOYU47XG4gIH0sXG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgc3dpdGNoICh0aGlzLl9wb2ludCkge1xuICAgICAgY2FzZSAwOiB7XG4gICAgICAgIHRoaXMuX3N0cmluZy5wdXNoKFwiTVwiLCB4LCBcIixcIiwgeSk7XG4gICAgICAgIHRoaXMuX3BvaW50ID0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDE6IHtcbiAgICAgICAgdGhpcy5fc3RyaW5nLnB1c2goXCJMXCIsIHgsIFwiLFwiLCB5KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLl9jaXJjbGUgPT0gbnVsbCkgdGhpcy5fY2lyY2xlID0gY2lyY2xlJDEodGhpcy5fcmFkaXVzKTtcbiAgICAgICAgdGhpcy5fc3RyaW5nLnB1c2goXCJNXCIsIHgsIFwiLFwiLCB5LCB0aGlzLl9jaXJjbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHJlc3VsdDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX3N0cmluZy5sZW5ndGgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9zdHJpbmcuam9pbihcIlwiKTtcbiAgICAgIHRoaXMuX3N0cmluZyA9IFtdO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBjaXJjbGUkMShyYWRpdXMpIHtcbiAgcmV0dXJuIFwibTAsXCIgKyByYWRpdXNcbiAgICAgICsgXCJhXCIgKyByYWRpdXMgKyBcIixcIiArIHJhZGl1cyArIFwiIDAgMSwxIDAsXCIgKyAtMiAqIHJhZGl1c1xuICAgICAgKyBcImFcIiArIHJhZGl1cyArIFwiLFwiICsgcmFkaXVzICsgXCIgMCAxLDEgMCxcIiArIDIgKiByYWRpdXNcbiAgICAgICsgXCJ6XCI7XG59XG5cbnZhciBpbmRleCA9IGZ1bmN0aW9uKHByb2plY3Rpb24sIGNvbnRleHQpIHtcbiAgdmFyIHBvaW50UmFkaXVzID0gNC41LFxuICAgICAgcHJvamVjdGlvblN0cmVhbSxcbiAgICAgIGNvbnRleHRTdHJlYW07XG5cbiAgZnVuY3Rpb24gcGF0aChvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0KSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50UmFkaXVzID09PSBcImZ1bmN0aW9uXCIpIGNvbnRleHRTdHJlYW0ucG9pbnRSYWRpdXMoK3BvaW50UmFkaXVzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgZ2VvU3RyZWFtKG9iamVjdCwgcHJvamVjdGlvblN0cmVhbShjb250ZXh0U3RyZWFtKSk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0U3RyZWFtLnJlc3VsdCgpO1xuICB9XG5cbiAgcGF0aC5hcmVhID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgZ2VvU3RyZWFtKG9iamVjdCwgcHJvamVjdGlvblN0cmVhbShhcmVhU3RyZWFtJDEpKTtcbiAgICByZXR1cm4gYXJlYVN0cmVhbSQxLnJlc3VsdCgpO1xuICB9O1xuXG4gIHBhdGgubWVhc3VyZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGdlb1N0cmVhbShvYmplY3QsIHByb2plY3Rpb25TdHJlYW0obGVuZ3RoU3RyZWFtJDEpKTtcbiAgICByZXR1cm4gbGVuZ3RoU3RyZWFtJDEucmVzdWx0KCk7XG4gIH07XG5cbiAgcGF0aC5ib3VuZHMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBnZW9TdHJlYW0ob2JqZWN0LCBwcm9qZWN0aW9uU3RyZWFtKGJvdW5kc1N0cmVhbSQxKSk7XG4gICAgcmV0dXJuIGJvdW5kc1N0cmVhbSQxLnJlc3VsdCgpO1xuICB9O1xuXG4gIHBhdGguY2VudHJvaWQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBnZW9TdHJlYW0ob2JqZWN0LCBwcm9qZWN0aW9uU3RyZWFtKGNlbnRyb2lkU3RyZWFtJDEpKTtcbiAgICByZXR1cm4gY2VudHJvaWRTdHJlYW0kMS5yZXN1bHQoKTtcbiAgfTtcblxuICBwYXRoLnByb2plY3Rpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJvamVjdGlvblN0cmVhbSA9IF8gPT0gbnVsbCA/IChwcm9qZWN0aW9uID0gbnVsbCwgaWRlbnRpdHkpIDogKHByb2plY3Rpb24gPSBfKS5zdHJlYW0sIHBhdGgpIDogcHJvamVjdGlvbjtcbiAgfTtcblxuICBwYXRoLmNvbnRleHQgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29udGV4dDtcbiAgICBjb250ZXh0U3RyZWFtID0gXyA9PSBudWxsID8gKGNvbnRleHQgPSBudWxsLCBuZXcgUGF0aFN0cmluZykgOiBuZXcgUGF0aENvbnRleHQoY29udGV4dCA9IF8pO1xuICAgIGlmICh0eXBlb2YgcG9pbnRSYWRpdXMgIT09IFwiZnVuY3Rpb25cIikgY29udGV4dFN0cmVhbS5wb2ludFJhZGl1cyhwb2ludFJhZGl1cyk7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH07XG5cbiAgcGF0aC5wb2ludFJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBwb2ludFJhZGl1cztcbiAgICBwb2ludFJhZGl1cyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogKGNvbnRleHRTdHJlYW0ucG9pbnRSYWRpdXMoK18pLCArXyk7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH07XG5cbiAgcmV0dXJuIHBhdGgucHJvamVjdGlvbihwcm9qZWN0aW9uKS5jb250ZXh0KGNvbnRleHQpO1xufTtcblxudmFyIGNsaXAgPSBmdW5jdGlvbihwb2ludFZpc2libGUsIGNsaXBMaW5lLCBpbnRlcnBvbGF0ZSwgc3RhcnQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJvdGF0ZSwgc2luaykge1xuICAgIHZhciBsaW5lID0gY2xpcExpbmUoc2luayksXG4gICAgICAgIHJvdGF0ZWRTdGFydCA9IHJvdGF0ZS5pbnZlcnQoc3RhcnRbMF0sIHN0YXJ0WzFdKSxcbiAgICAgICAgcmluZ0J1ZmZlciA9IGNsaXBCdWZmZXIoKSxcbiAgICAgICAgcmluZ1NpbmsgPSBjbGlwTGluZShyaW5nQnVmZmVyKSxcbiAgICAgICAgcG9seWdvblN0YXJ0ZWQgPSBmYWxzZSxcbiAgICAgICAgcG9seWdvbixcbiAgICAgICAgc2VnbWVudHMsXG4gICAgICAgIHJpbmc7XG5cbiAgICB2YXIgY2xpcCA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBwb2ludFJpbmc7XG4gICAgICAgIGNsaXAubGluZVN0YXJ0ID0gcmluZ1N0YXJ0O1xuICAgICAgICBjbGlwLmxpbmVFbmQgPSByaW5nRW5kO1xuICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICBwb2x5Z29uID0gW107XG4gICAgICB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsaXAucG9pbnQgPSBwb2ludDtcbiAgICAgICAgY2xpcC5saW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG4gICAgICAgIGNsaXAubGluZUVuZCA9IGxpbmVFbmQ7XG4gICAgICAgIHNlZ21lbnRzID0gZDNBcnJheS5tZXJnZShzZWdtZW50cyk7XG4gICAgICAgIHZhciBzdGFydEluc2lkZSA9IHBvbHlnb25Db250YWlucyhwb2x5Z29uLCByb3RhdGVkU3RhcnQpO1xuICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNsaXBQb2x5Z29uKHNlZ21lbnRzLCBjb21wYXJlSW50ZXJzZWN0aW9uLCBzdGFydEluc2lkZSwgaW50ZXJwb2xhdGUsIHNpbmspO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0SW5zaWRlKSB7XG4gICAgICAgICAgaWYgKCFwb2x5Z29uU3RhcnRlZCkgc2luay5wb2x5Z29uU3RhcnQoKSwgcG9seWdvblN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgIHNpbmsubGluZVN0YXJ0KCk7XG4gICAgICAgICAgaW50ZXJwb2xhdGUobnVsbCwgbnVsbCwgMSwgc2luayk7XG4gICAgICAgICAgc2luay5saW5lRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvbHlnb25TdGFydGVkKSBzaW5rLnBvbHlnb25FbmQoKSwgcG9seWdvblN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2VnbWVudHMgPSBwb2x5Z29uID0gbnVsbDtcbiAgICAgIH0sXG4gICAgICBzcGhlcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzaW5rLnBvbHlnb25TdGFydCgpO1xuICAgICAgICBzaW5rLmxpbmVTdGFydCgpO1xuICAgICAgICBpbnRlcnBvbGF0ZShudWxsLCBudWxsLCAxLCBzaW5rKTtcbiAgICAgICAgc2luay5saW5lRW5kKCk7XG4gICAgICAgIHNpbmsucG9seWdvbkVuZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludChsYW1iZGEsIHBoaSkge1xuICAgICAgdmFyIHBvaW50ID0gcm90YXRlKGxhbWJkYSwgcGhpKTtcbiAgICAgIGlmIChwb2ludFZpc2libGUobGFtYmRhID0gcG9pbnRbMF0sIHBoaSA9IHBvaW50WzFdKSkgc2luay5wb2ludChsYW1iZGEsIHBoaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9pbnRMaW5lKGxhbWJkYSwgcGhpKSB7XG4gICAgICB2YXIgcG9pbnQgPSByb3RhdGUobGFtYmRhLCBwaGkpO1xuICAgICAgbGluZS5wb2ludChwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVTdGFydCgpIHtcbiAgICAgIGNsaXAucG9pbnQgPSBwb2ludExpbmU7XG4gICAgICBsaW5lLmxpbmVTdGFydCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVFbmQoKSB7XG4gICAgICBjbGlwLnBvaW50ID0gcG9pbnQ7XG4gICAgICBsaW5lLmxpbmVFbmQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb2ludFJpbmcobGFtYmRhLCBwaGkpIHtcbiAgICAgIHJpbmcucHVzaChbbGFtYmRhLCBwaGldKTtcbiAgICAgIHZhciBwb2ludCA9IHJvdGF0ZShsYW1iZGEsIHBoaSk7XG4gICAgICByaW5nU2luay5wb2ludChwb2ludFswXSwgcG9pbnRbMV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdTdGFydCgpIHtcbiAgICAgIHJpbmdTaW5rLmxpbmVTdGFydCgpO1xuICAgICAgcmluZyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdFbmQoKSB7XG4gICAgICBwb2ludFJpbmcocmluZ1swXVswXSwgcmluZ1swXVsxXSk7XG4gICAgICByaW5nU2luay5saW5lRW5kKCk7XG5cbiAgICAgIHZhciBjbGVhbiA9IHJpbmdTaW5rLmNsZWFuKCksXG4gICAgICAgICAgcmluZ1NlZ21lbnRzID0gcmluZ0J1ZmZlci5yZXN1bHQoKSxcbiAgICAgICAgICBpLCBuID0gcmluZ1NlZ21lbnRzLmxlbmd0aCwgbSxcbiAgICAgICAgICBzZWdtZW50LFxuICAgICAgICAgIHBvaW50O1xuXG4gICAgICByaW5nLnBvcCgpO1xuICAgICAgcG9seWdvbi5wdXNoKHJpbmcpO1xuICAgICAgcmluZyA9IG51bGw7XG5cbiAgICAgIGlmICghbikgcmV0dXJuO1xuXG4gICAgICAvLyBObyBpbnRlcnNlY3Rpb25zLlxuICAgICAgaWYgKGNsZWFuICYgMSkge1xuICAgICAgICBzZWdtZW50ID0gcmluZ1NlZ21lbnRzWzBdO1xuICAgICAgICBpZiAoKG0gPSBzZWdtZW50Lmxlbmd0aCAtIDEpID4gMCkge1xuICAgICAgICAgIGlmICghcG9seWdvblN0YXJ0ZWQpIHNpbmsucG9seWdvblN0YXJ0KCksIHBvbHlnb25TdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICBzaW5rLmxpbmVTdGFydCgpO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHNpbmsucG9pbnQoKHBvaW50ID0gc2VnbWVudFtpXSlbMF0sIHBvaW50WzFdKTtcbiAgICAgICAgICBzaW5rLmxpbmVFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlam9pbiBjb25uZWN0ZWQgc2VnbWVudHMuXG4gICAgICAvLyBUT0RPIHJldXNlIHJpbmdCdWZmZXIucmVqb2luKCk/XG4gICAgICBpZiAobiA+IDEgJiYgY2xlYW4gJiAyKSByaW5nU2VnbWVudHMucHVzaChyaW5nU2VnbWVudHMucG9wKCkuY29uY2F0KHJpbmdTZWdtZW50cy5zaGlmdCgpKSk7XG5cbiAgICAgIHNlZ21lbnRzLnB1c2gocmluZ1NlZ21lbnRzLmZpbHRlcih2YWxpZFNlZ21lbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xpcDtcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHZhbGlkU2VnbWVudChzZWdtZW50KSB7XG4gIHJldHVybiBzZWdtZW50Lmxlbmd0aCA+IDE7XG59XG5cbi8vIEludGVyc2VjdGlvbnMgYXJlIHNvcnRlZCBhbG9uZyB0aGUgY2xpcCBlZGdlLiBGb3IgYm90aCBhbnRpbWVyaWRpYW4gY3V0dGluZ1xuLy8gYW5kIGNpcmNsZSBjbGlwcGluZywgdGhlIHNhbWUgY29tcGFyaXNvbiBpcyB1c2VkLlxuZnVuY3Rpb24gY29tcGFyZUludGVyc2VjdGlvbihhLCBiKSB7XG4gIHJldHVybiAoKGEgPSBhLngpWzBdIDwgMCA/IGFbMV0gLSBoYWxmUGkgLSBlcHNpbG9uIDogaGFsZlBpIC0gYVsxXSlcbiAgICAgICAtICgoYiA9IGIueClbMF0gPCAwID8gYlsxXSAtIGhhbGZQaSAtIGVwc2lsb24gOiBoYWxmUGkgLSBiWzFdKTtcbn1cblxudmFyIGNsaXBBbnRpbWVyaWRpYW4gPSBjbGlwKFxuICBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWU7IH0sXG4gIGNsaXBBbnRpbWVyaWRpYW5MaW5lLFxuICBjbGlwQW50aW1lcmlkaWFuSW50ZXJwb2xhdGUsXG4gIFstcGksIC1oYWxmUGldXG4pO1xuXG4vLyBUYWtlcyBhIGxpbmUgYW5kIGN1dHMgaW50byB2aXNpYmxlIHNlZ21lbnRzLiBSZXR1cm4gdmFsdWVzOiAwIC0gdGhlcmUgd2VyZVxuLy8gaW50ZXJzZWN0aW9ucyBvciB0aGUgbGluZSB3YXMgZW1wdHk7IDEgLSBubyBpbnRlcnNlY3Rpb25zOyAyIC0gdGhlcmUgd2VyZVxuLy8gaW50ZXJzZWN0aW9ucywgYW5kIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBzaG91bGQgYmUgcmVqb2luZWQuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuTGluZShzdHJlYW0pIHtcbiAgdmFyIGxhbWJkYTAgPSBOYU4sXG4gICAgICBwaGkwID0gTmFOLFxuICAgICAgc2lnbjAgPSBOYU4sXG4gICAgICBjbGVhbjsgLy8gbm8gaW50ZXJzZWN0aW9uc1xuXG4gIHJldHVybiB7XG4gICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHN0cmVhbS5saW5lU3RhcnQoKTtcbiAgICAgIGNsZWFuID0gMTtcbiAgICB9LFxuICAgIHBvaW50OiBmdW5jdGlvbihsYW1iZGExLCBwaGkxKSB7XG4gICAgICB2YXIgc2lnbjEgPSBsYW1iZGExID4gMCA/IHBpIDogLXBpLFxuICAgICAgICAgIGRlbHRhID0gYWJzKGxhbWJkYTEgLSBsYW1iZGEwKTtcbiAgICAgIGlmIChhYnMoZGVsdGEgLSBwaSkgPCBlcHNpbG9uKSB7IC8vIGxpbmUgY3Jvc3NlcyBhIHBvbGVcbiAgICAgICAgc3RyZWFtLnBvaW50KGxhbWJkYTAsIHBoaTAgPSAocGhpMCArIHBoaTEpIC8gMiA+IDAgPyBoYWxmUGkgOiAtaGFsZlBpKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHNpZ24wLCBwaGkwKTtcbiAgICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjEsIHBoaTApO1xuICAgICAgICBzdHJlYW0ucG9pbnQobGFtYmRhMSwgcGhpMCk7XG4gICAgICAgIGNsZWFuID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoc2lnbjAgIT09IHNpZ24xICYmIGRlbHRhID49IHBpKSB7IC8vIGxpbmUgY3Jvc3NlcyBhbnRpbWVyaWRpYW5cbiAgICAgICAgaWYgKGFicyhsYW1iZGEwIC0gc2lnbjApIDwgZXBzaWxvbikgbGFtYmRhMCAtPSBzaWduMCAqIGVwc2lsb247IC8vIGhhbmRsZSBkZWdlbmVyYWNpZXNcbiAgICAgICAgaWYgKGFicyhsYW1iZGExIC0gc2lnbjEpIDwgZXBzaWxvbikgbGFtYmRhMSAtPSBzaWduMSAqIGVwc2lsb247XG4gICAgICAgIHBoaTAgPSBjbGlwQW50aW1lcmlkaWFuSW50ZXJzZWN0KGxhbWJkYTAsIHBoaTAsIGxhbWJkYTEsIHBoaTEpO1xuICAgICAgICBzdHJlYW0ucG9pbnQoc2lnbjAsIHBoaTApO1xuICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIHN0cmVhbS5wb2ludChzaWduMSwgcGhpMCk7XG4gICAgICAgIGNsZWFuID0gMDtcbiAgICAgIH1cbiAgICAgIHN0cmVhbS5wb2ludChsYW1iZGEwID0gbGFtYmRhMSwgcGhpMCA9IHBoaTEpO1xuICAgICAgc2lnbjAgPSBzaWduMTtcbiAgICB9LFxuICAgIGxpbmVFbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3RyZWFtLmxpbmVFbmQoKTtcbiAgICAgIGxhbWJkYTAgPSBwaGkwID0gTmFOO1xuICAgIH0sXG4gICAgY2xlYW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIDIgLSBjbGVhbjsgLy8gaWYgaW50ZXJzZWN0aW9ucywgcmVqb2luIGZpcnN0IGFuZCBsYXN0IHNlZ21lbnRzXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuSW50ZXJzZWN0KGxhbWJkYTAsIHBoaTAsIGxhbWJkYTEsIHBoaTEpIHtcbiAgdmFyIGNvc1BoaTAsXG4gICAgICBjb3NQaGkxLFxuICAgICAgc2luTGFtYmRhMExhbWJkYTEgPSBzaW4obGFtYmRhMCAtIGxhbWJkYTEpO1xuICByZXR1cm4gYWJzKHNpbkxhbWJkYTBMYW1iZGExKSA+IGVwc2lsb25cbiAgICAgID8gYXRhbigoc2luKHBoaTApICogKGNvc1BoaTEgPSBjb3MocGhpMSkpICogc2luKGxhbWJkYTEpXG4gICAgICAgICAgLSBzaW4ocGhpMSkgKiAoY29zUGhpMCA9IGNvcyhwaGkwKSkgKiBzaW4obGFtYmRhMCkpXG4gICAgICAgICAgLyAoY29zUGhpMCAqIGNvc1BoaTEgKiBzaW5MYW1iZGEwTGFtYmRhMSkpXG4gICAgICA6IChwaGkwICsgcGhpMSkgLyAyO1xufVxuXG5mdW5jdGlvbiBjbGlwQW50aW1lcmlkaWFuSW50ZXJwb2xhdGUoZnJvbSwgdG8sIGRpcmVjdGlvbiwgc3RyZWFtKSB7XG4gIHZhciBwaGk7XG4gIGlmIChmcm9tID09IG51bGwpIHtcbiAgICBwaGkgPSBkaXJlY3Rpb24gKiBoYWxmUGk7XG4gICAgc3RyZWFtLnBvaW50KC1waSwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoMCwgcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQocGksIHBoaSk7XG4gICAgc3RyZWFtLnBvaW50KHBpLCAwKTtcbiAgICBzdHJlYW0ucG9pbnQocGksIC1waGkpO1xuICAgIHN0cmVhbS5wb2ludCgwLCAtcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCAtcGhpKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCAwKTtcbiAgICBzdHJlYW0ucG9pbnQoLXBpLCBwaGkpO1xuICB9IGVsc2UgaWYgKGFicyhmcm9tWzBdIC0gdG9bMF0pID4gZXBzaWxvbikge1xuICAgIHZhciBsYW1iZGEgPSBmcm9tWzBdIDwgdG9bMF0gPyBwaSA6IC1waTtcbiAgICBwaGkgPSBkaXJlY3Rpb24gKiBsYW1iZGEgLyAyO1xuICAgIHN0cmVhbS5wb2ludCgtbGFtYmRhLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludCgwLCBwaGkpO1xuICAgIHN0cmVhbS5wb2ludChsYW1iZGEsIHBoaSk7XG4gIH0gZWxzZSB7XG4gICAgc3RyZWFtLnBvaW50KHRvWzBdLCB0b1sxXSk7XG4gIH1cbn1cblxudmFyIGNsaXBDaXJjbGUgPSBmdW5jdGlvbihyYWRpdXMsIGRlbHRhKSB7XG4gIHZhciBjciA9IGNvcyhyYWRpdXMpLFxuICAgICAgc21hbGxSYWRpdXMgPSBjciA+IDAsXG4gICAgICBub3RIZW1pc3BoZXJlID0gYWJzKGNyKSA+IGVwc2lsb247IC8vIFRPRE8gb3B0aW1pc2UgZm9yIHRoaXMgY29tbW9uIGNhc2VcblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShmcm9tLCB0bywgZGlyZWN0aW9uLCBzdHJlYW0pIHtcbiAgICBjaXJjbGVTdHJlYW0oc3RyZWFtLCByYWRpdXMsIGRlbHRhLCBkaXJlY3Rpb24sIGZyb20sIHRvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZpc2libGUobGFtYmRhLCBwaGkpIHtcbiAgICByZXR1cm4gY29zKGxhbWJkYSkgKiBjb3MocGhpKSA+IGNyO1xuICB9XG5cbiAgLy8gVGFrZXMgYSBsaW5lIGFuZCBjdXRzIGludG8gdmlzaWJsZSBzZWdtZW50cy4gUmV0dXJuIHZhbHVlcyB1c2VkIGZvciBwb2x5Z29uXG4gIC8vIGNsaXBwaW5nOiAwIC0gdGhlcmUgd2VyZSBpbnRlcnNlY3Rpb25zIG9yIHRoZSBsaW5lIHdhcyBlbXB0eTsgMSAtIG5vXG4gIC8vIGludGVyc2VjdGlvbnMgMiAtIHRoZXJlIHdlcmUgaW50ZXJzZWN0aW9ucywgYW5kIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWdtZW50c1xuICAvLyBzaG91bGQgYmUgcmVqb2luZWQuXG4gIGZ1bmN0aW9uIGNsaXBMaW5lKHN0cmVhbSkge1xuICAgIHZhciBwb2ludDAsIC8vIHByZXZpb3VzIHBvaW50XG4gICAgICAgIGMwLCAvLyBjb2RlIGZvciBwcmV2aW91cyBwb2ludFxuICAgICAgICB2MCwgLy8gdmlzaWJpbGl0eSBvZiBwcmV2aW91cyBwb2ludFxuICAgICAgICB2MDAsIC8vIHZpc2liaWxpdHkgb2YgZmlyc3QgcG9pbnRcbiAgICAgICAgY2xlYW47IC8vIG5vIGludGVyc2VjdGlvbnNcbiAgICByZXR1cm4ge1xuICAgICAgbGluZVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdjAwID0gdjAgPSBmYWxzZTtcbiAgICAgICAgY2xlYW4gPSAxO1xuICAgICAgfSxcbiAgICAgIHBvaW50OiBmdW5jdGlvbihsYW1iZGEsIHBoaSkge1xuICAgICAgICB2YXIgcG9pbnQxID0gW2xhbWJkYSwgcGhpXSxcbiAgICAgICAgICAgIHBvaW50MixcbiAgICAgICAgICAgIHYgPSB2aXNpYmxlKGxhbWJkYSwgcGhpKSxcbiAgICAgICAgICAgIGMgPSBzbWFsbFJhZGl1c1xuICAgICAgICAgICAgICA/IHYgPyAwIDogY29kZShsYW1iZGEsIHBoaSlcbiAgICAgICAgICAgICAgOiB2ID8gY29kZShsYW1iZGEgKyAobGFtYmRhIDwgMCA/IHBpIDogLXBpKSwgcGhpKSA6IDA7XG4gICAgICAgIGlmICghcG9pbnQwICYmICh2MDAgPSB2MCA9IHYpKSBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgIC8vIEhhbmRsZSBkZWdlbmVyYWNpZXMuXG4gICAgICAgIC8vIFRPRE8gaWdub3JlIGlmIG5vdCBjbGlwcGluZyBwb2x5Z29ucy5cbiAgICAgICAgaWYgKHYgIT09IHYwKSB7XG4gICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICBpZiAoIXBvaW50MiB8fCBwb2ludEVxdWFsKHBvaW50MCwgcG9pbnQyKSB8fCBwb2ludEVxdWFsKHBvaW50MSwgcG9pbnQyKSkge1xuICAgICAgICAgICAgcG9pbnQxWzBdICs9IGVwc2lsb247XG4gICAgICAgICAgICBwb2ludDFbMV0gKz0gZXBzaWxvbjtcbiAgICAgICAgICAgIHYgPSB2aXNpYmxlKHBvaW50MVswXSwgcG9pbnQxWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYgIT09IHYwKSB7XG4gICAgICAgICAgY2xlYW4gPSAwO1xuICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAvLyBvdXRzaWRlIGdvaW5nIGluXG4gICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBwb2ludDIgPSBpbnRlcnNlY3QocG9pbnQxLCBwb2ludDApO1xuICAgICAgICAgICAgc3RyZWFtLnBvaW50KHBvaW50MlswXSwgcG9pbnQyWzFdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW5zaWRlIGdvaW5nIG91dFxuICAgICAgICAgICAgcG9pbnQyID0gaW50ZXJzZWN0KHBvaW50MCwgcG9pbnQxKTtcbiAgICAgICAgICAgIHN0cmVhbS5wb2ludChwb2ludDJbMF0sIHBvaW50MlsxXSk7XG4gICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb2ludDAgPSBwb2ludDI7XG4gICAgICAgIH0gZWxzZSBpZiAobm90SGVtaXNwaGVyZSAmJiBwb2ludDAgJiYgc21hbGxSYWRpdXMgXiB2KSB7XG4gICAgICAgICAgdmFyIHQ7XG4gICAgICAgICAgLy8gSWYgdGhlIGNvZGVzIGZvciB0d28gcG9pbnRzIGFyZSBkaWZmZXJlbnQsIG9yIGFyZSBib3RoIHplcm8sXG4gICAgICAgICAgLy8gYW5kIHRoZXJlIHRoaXMgc2VnbWVudCBpbnRlcnNlY3RzIHdpdGggdGhlIHNtYWxsIGNpcmNsZS5cbiAgICAgICAgICBpZiAoIShjICYgYzApICYmICh0ID0gaW50ZXJzZWN0KHBvaW50MSwgcG9pbnQwLCB0cnVlKSkpIHtcbiAgICAgICAgICAgIGNsZWFuID0gMDtcbiAgICAgICAgICAgIGlmIChzbWFsbFJhZGl1cykge1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzBdWzBdLCB0WzBdWzFdKTtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMV1bMF0sIHRbMV1bMV0pO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyZWFtLnBvaW50KHRbMV1bMF0sIHRbMV1bMV0pO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICAgICAgICBzdHJlYW0ubGluZVN0YXJ0KCk7XG4gICAgICAgICAgICAgIHN0cmVhbS5wb2ludCh0WzBdWzBdLCB0WzBdWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHYgJiYgKCFwb2ludDAgfHwgIXBvaW50RXF1YWwocG9pbnQwLCBwb2ludDEpKSkge1xuICAgICAgICAgIHN0cmVhbS5wb2ludChwb2ludDFbMF0sIHBvaW50MVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnQwID0gcG9pbnQxLCB2MCA9IHYsIGMwID0gYztcbiAgICAgIH0sXG4gICAgICBsaW5lRW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHYwKSBzdHJlYW0ubGluZUVuZCgpO1xuICAgICAgICBwb2ludDAgPSBudWxsO1xuICAgICAgfSxcbiAgICAgIC8vIFJlam9pbiBmaXJzdCBhbmQgbGFzdCBzZWdtZW50cyBpZiB0aGVyZSB3ZXJlIGludGVyc2VjdGlvbnMgYW5kIHRoZSBmaXJzdFxuICAgICAgLy8gYW5kIGxhc3QgcG9pbnRzIHdlcmUgdmlzaWJsZS5cbiAgICAgIGNsZWFuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFuIHwgKCh2MDAgJiYgdjApIDw8IDEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBJbnRlcnNlY3RzIHRoZSBncmVhdCBjaXJjbGUgYmV0d2VlbiBhIGFuZCBiIHdpdGggdGhlIGNsaXAgY2lyY2xlLlxuICBmdW5jdGlvbiBpbnRlcnNlY3QoYSwgYiwgdHdvKSB7XG4gICAgdmFyIHBhID0gY2FydGVzaWFuKGEpLFxuICAgICAgICBwYiA9IGNhcnRlc2lhbihiKTtcblxuICAgIC8vIFdlIGhhdmUgdHdvIHBsYW5lcywgbjEucCA9IGQxIGFuZCBuMi5wID0gZDIuXG4gICAgLy8gRmluZCBpbnRlcnNlY3Rpb24gbGluZSBwKHQpID0gYzEgbjEgKyBjMiBuMiArIHQgKG4xIOKoryBuMikuXG4gICAgdmFyIG4xID0gWzEsIDAsIDBdLCAvLyBub3JtYWxcbiAgICAgICAgbjIgPSBjYXJ0ZXNpYW5Dcm9zcyhwYSwgcGIpLFxuICAgICAgICBuMm4yID0gY2FydGVzaWFuRG90KG4yLCBuMiksXG4gICAgICAgIG4xbjIgPSBuMlswXSwgLy8gY2FydGVzaWFuRG90KG4xLCBuMiksXG4gICAgICAgIGRldGVybWluYW50ID0gbjJuMiAtIG4xbjIgKiBuMW4yO1xuXG4gICAgLy8gVHdvIHBvbGFyIHBvaW50cy5cbiAgICBpZiAoIWRldGVybWluYW50KSByZXR1cm4gIXR3byAmJiBhO1xuXG4gICAgdmFyIGMxID0gIGNyICogbjJuMiAvIGRldGVybWluYW50LFxuICAgICAgICBjMiA9IC1jciAqIG4xbjIgLyBkZXRlcm1pbmFudCxcbiAgICAgICAgbjF4bjIgPSBjYXJ0ZXNpYW5Dcm9zcyhuMSwgbjIpLFxuICAgICAgICBBID0gY2FydGVzaWFuU2NhbGUobjEsIGMxKSxcbiAgICAgICAgQiA9IGNhcnRlc2lhblNjYWxlKG4yLCBjMik7XG4gICAgY2FydGVzaWFuQWRkSW5QbGFjZShBLCBCKTtcblxuICAgIC8vIFNvbHZlIHxwKHQpfF4yID0gMS5cbiAgICB2YXIgdSA9IG4xeG4yLFxuICAgICAgICB3ID0gY2FydGVzaWFuRG90KEEsIHUpLFxuICAgICAgICB1dSA9IGNhcnRlc2lhbkRvdCh1LCB1KSxcbiAgICAgICAgdDIgPSB3ICogdyAtIHV1ICogKGNhcnRlc2lhbkRvdChBLCBBKSAtIDEpO1xuXG4gICAgaWYgKHQyIDwgMCkgcmV0dXJuO1xuXG4gICAgdmFyIHQgPSBzcXJ0KHQyKSxcbiAgICAgICAgcSA9IGNhcnRlc2lhblNjYWxlKHUsICgtdyAtIHQpIC8gdXUpO1xuICAgIGNhcnRlc2lhbkFkZEluUGxhY2UocSwgQSk7XG4gICAgcSA9IHNwaGVyaWNhbChxKTtcblxuICAgIGlmICghdHdvKSByZXR1cm4gcTtcblxuICAgIC8vIFR3byBpbnRlcnNlY3Rpb24gcG9pbnRzLlxuICAgIHZhciBsYW1iZGEwID0gYVswXSxcbiAgICAgICAgbGFtYmRhMSA9IGJbMF0sXG4gICAgICAgIHBoaTAgPSBhWzFdLFxuICAgICAgICBwaGkxID0gYlsxXSxcbiAgICAgICAgejtcblxuICAgIGlmIChsYW1iZGExIDwgbGFtYmRhMCkgeiA9IGxhbWJkYTAsIGxhbWJkYTAgPSBsYW1iZGExLCBsYW1iZGExID0gejtcblxuICAgIHZhciBkZWx0YSA9IGxhbWJkYTEgLSBsYW1iZGEwLFxuICAgICAgICBwb2xhciA9IGFicyhkZWx0YSAtIHBpKSA8IGVwc2lsb24sXG4gICAgICAgIG1lcmlkaWFuID0gcG9sYXIgfHwgZGVsdGEgPCBlcHNpbG9uO1xuXG4gICAgaWYgKCFwb2xhciAmJiBwaGkxIDwgcGhpMCkgeiA9IHBoaTAsIHBoaTAgPSBwaGkxLCBwaGkxID0gejtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGZpcnN0IHBvaW50IGlzIGJldHdlZW4gYSBhbmQgYi5cbiAgICBpZiAobWVyaWRpYW5cbiAgICAgICAgPyBwb2xhclxuICAgICAgICAgID8gcGhpMCArIHBoaTEgPiAwIF4gcVsxXSA8IChhYnMocVswXSAtIGxhbWJkYTApIDwgZXBzaWxvbiA/IHBoaTAgOiBwaGkxKVxuICAgICAgICAgIDogcGhpMCA8PSBxWzFdICYmIHFbMV0gPD0gcGhpMVxuICAgICAgICA6IGRlbHRhID4gcGkgXiAobGFtYmRhMCA8PSBxWzBdICYmIHFbMF0gPD0gbGFtYmRhMSkpIHtcbiAgICAgIHZhciBxMSA9IGNhcnRlc2lhblNjYWxlKHUsICgtdyArIHQpIC8gdXUpO1xuICAgICAgY2FydGVzaWFuQWRkSW5QbGFjZShxMSwgQSk7XG4gICAgICByZXR1cm4gW3EsIHNwaGVyaWNhbChxMSldO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdlbmVyYXRlcyBhIDQtYml0IHZlY3RvciByZXByZXNlbnRpbmcgdGhlIGxvY2F0aW9uIG9mIGEgcG9pbnQgcmVsYXRpdmUgdG9cbiAgLy8gdGhlIHNtYWxsIGNpcmNsZSdzIGJvdW5kaW5nIGJveC5cbiAgZnVuY3Rpb24gY29kZShsYW1iZGEsIHBoaSkge1xuICAgIHZhciByID0gc21hbGxSYWRpdXMgPyByYWRpdXMgOiBwaSAtIHJhZGl1cyxcbiAgICAgICAgY29kZSA9IDA7XG4gICAgaWYgKGxhbWJkYSA8IC1yKSBjb2RlIHw9IDE7IC8vIGxlZnRcbiAgICBlbHNlIGlmIChsYW1iZGEgPiByKSBjb2RlIHw9IDI7IC8vIHJpZ2h0XG4gICAgaWYgKHBoaSA8IC1yKSBjb2RlIHw9IDQ7IC8vIGJlbG93XG4gICAgZWxzZSBpZiAocGhpID4gcikgY29kZSB8PSA4OyAvLyBhYm92ZVxuICAgIHJldHVybiBjb2RlO1xuICB9XG5cbiAgcmV0dXJuIGNsaXAodmlzaWJsZSwgY2xpcExpbmUsIGludGVycG9sYXRlLCBzbWFsbFJhZGl1cyA/IFswLCAtcmFkaXVzXSA6IFstcGksIHJhZGl1cyAtIHBpXSk7XG59O1xuXG52YXIgdHJhbnNmb3JtID0gZnVuY3Rpb24obWV0aG9kcykge1xuICByZXR1cm4ge1xuICAgIHN0cmVhbTogdHJhbnNmb3JtZXIobWV0aG9kcylcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybWVyKG1ldGhvZHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBzID0gbmV3IFRyYW5zZm9ybVN0cmVhbTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykgc1trZXldID0gbWV0aG9kc1trZXldO1xuICAgIHMuc3RyZWFtID0gc3RyZWFtO1xuICAgIHJldHVybiBzO1xuICB9O1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW0oKSB7fVxuXG5UcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogVHJhbnNmb3JtU3RyZWFtLFxuICBwb2ludDogZnVuY3Rpb24oeCwgeSkgeyB0aGlzLnN0cmVhbS5wb2ludCh4LCB5KTsgfSxcbiAgc3BoZXJlOiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0uc3BoZXJlKCk7IH0sXG4gIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLmxpbmVTdGFydCgpOyB9LFxuICBsaW5lRW5kOiBmdW5jdGlvbigpIHsgdGhpcy5zdHJlYW0ubGluZUVuZCgpOyB9LFxuICBwb2x5Z29uU3RhcnQ6IGZ1bmN0aW9uKCkgeyB0aGlzLnN0cmVhbS5wb2x5Z29uU3RhcnQoKTsgfSxcbiAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7IHRoaXMuc3RyZWFtLnBvbHlnb25FbmQoKTsgfVxufTtcblxuZnVuY3Rpb24gZml0RXh0ZW50KHByb2plY3Rpb24sIGV4dGVudCwgb2JqZWN0KSB7XG4gIHZhciB3ID0gZXh0ZW50WzFdWzBdIC0gZXh0ZW50WzBdWzBdLFxuICAgICAgaCA9IGV4dGVudFsxXVsxXSAtIGV4dGVudFswXVsxXSxcbiAgICAgIGNsaXAgPSBwcm9qZWN0aW9uLmNsaXBFeHRlbnQgJiYgcHJvamVjdGlvbi5jbGlwRXh0ZW50KCk7XG5cbiAgcHJvamVjdGlvblxuICAgICAgLnNjYWxlKDE1MClcbiAgICAgIC50cmFuc2xhdGUoWzAsIDBdKTtcblxuICBpZiAoY2xpcCAhPSBudWxsKSBwcm9qZWN0aW9uLmNsaXBFeHRlbnQobnVsbCk7XG5cbiAgZ2VvU3RyZWFtKG9iamVjdCwgcHJvamVjdGlvbi5zdHJlYW0oYm91bmRzU3RyZWFtJDEpKTtcblxuICB2YXIgYiA9IGJvdW5kc1N0cmVhbSQxLnJlc3VsdCgpLFxuICAgICAgayA9IE1hdGgubWluKHcgLyAoYlsxXVswXSAtIGJbMF1bMF0pLCBoIC8gKGJbMV1bMV0gLSBiWzBdWzFdKSksXG4gICAgICB4ID0gK2V4dGVudFswXVswXSArICh3IC0gayAqIChiWzFdWzBdICsgYlswXVswXSkpIC8gMixcbiAgICAgIHkgPSArZXh0ZW50WzBdWzFdICsgKGggLSBrICogKGJbMV1bMV0gKyBiWzBdWzFdKSkgLyAyO1xuXG4gIGlmIChjbGlwICE9IG51bGwpIHByb2plY3Rpb24uY2xpcEV4dGVudChjbGlwKTtcblxuICByZXR1cm4gcHJvamVjdGlvblxuICAgICAgLnNjYWxlKGsgKiAxNTApXG4gICAgICAudHJhbnNsYXRlKFt4LCB5XSk7XG59XG5cbmZ1bmN0aW9uIGZpdFNpemUocHJvamVjdGlvbiwgc2l6ZSwgb2JqZWN0KSB7XG4gIHJldHVybiBmaXRFeHRlbnQocHJvamVjdGlvbiwgW1swLCAwXSwgc2l6ZV0sIG9iamVjdCk7XG59XG5cbnZhciBtYXhEZXB0aCA9IDE2O1xudmFyIGNvc01pbkRpc3RhbmNlID0gY29zKDMwICogcmFkaWFucyk7IC8vIGNvcyhtaW5pbXVtIGFuZ3VsYXIgZGlzdGFuY2UpXG5cbnZhciByZXNhbXBsZSA9IGZ1bmN0aW9uKHByb2plY3QsIGRlbHRhMikge1xuICByZXR1cm4gK2RlbHRhMiA/IHJlc2FtcGxlJDEocHJvamVjdCwgZGVsdGEyKSA6IHJlc2FtcGxlTm9uZShwcm9qZWN0KTtcbn07XG5cbmZ1bmN0aW9uIHJlc2FtcGxlTm9uZShwcm9qZWN0KSB7XG4gIHJldHVybiB0cmFuc2Zvcm1lcih7XG4gICAgcG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHggPSBwcm9qZWN0KHgsIHkpO1xuICAgICAgdGhpcy5zdHJlYW0ucG9pbnQoeFswXSwgeFsxXSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzYW1wbGUkMShwcm9qZWN0LCBkZWx0YTIpIHtcblxuICBmdW5jdGlvbiByZXNhbXBsZUxpbmVUbyh4MCwgeTAsIGxhbWJkYTAsIGEwLCBiMCwgYzAsIHgxLCB5MSwgbGFtYmRhMSwgYTEsIGIxLCBjMSwgZGVwdGgsIHN0cmVhbSkge1xuICAgIHZhciBkeCA9IHgxIC0geDAsXG4gICAgICAgIGR5ID0geTEgLSB5MCxcbiAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICBpZiAoZDIgPiA0ICogZGVsdGEyICYmIGRlcHRoLS0pIHtcbiAgICAgIHZhciBhID0gYTAgKyBhMSxcbiAgICAgICAgICBiID0gYjAgKyBiMSxcbiAgICAgICAgICBjID0gYzAgKyBjMSxcbiAgICAgICAgICBtID0gc3FydChhICogYSArIGIgKiBiICsgYyAqIGMpLFxuICAgICAgICAgIHBoaTIgPSBhc2luKGMgLz0gbSksXG4gICAgICAgICAgbGFtYmRhMiA9IGFicyhhYnMoYykgLSAxKSA8IGVwc2lsb24gfHwgYWJzKGxhbWJkYTAgLSBsYW1iZGExKSA8IGVwc2lsb24gPyAobGFtYmRhMCArIGxhbWJkYTEpIC8gMiA6IGF0YW4yKGIsIGEpLFxuICAgICAgICAgIHAgPSBwcm9qZWN0KGxhbWJkYTIsIHBoaTIpLFxuICAgICAgICAgIHgyID0gcFswXSxcbiAgICAgICAgICB5MiA9IHBbMV0sXG4gICAgICAgICAgZHgyID0geDIgLSB4MCxcbiAgICAgICAgICBkeTIgPSB5MiAtIHkwLFxuICAgICAgICAgIGR6ID0gZHkgKiBkeDIgLSBkeCAqIGR5MjtcbiAgICAgIGlmIChkeiAqIGR6IC8gZDIgPiBkZWx0YTIgLy8gcGVycGVuZGljdWxhciBwcm9qZWN0ZWQgZGlzdGFuY2VcbiAgICAgICAgICB8fCBhYnMoKGR4ICogZHgyICsgZHkgKiBkeTIpIC8gZDIgLSAwLjUpID4gMC4zIC8vIG1pZHBvaW50IGNsb3NlIHRvIGFuIGVuZFxuICAgICAgICAgIHx8IGEwICogYTEgKyBiMCAqIGIxICsgYzAgKiBjMSA8IGNvc01pbkRpc3RhbmNlKSB7IC8vIGFuZ3VsYXIgZGlzdGFuY2VcbiAgICAgICAgcmVzYW1wbGVMaW5lVG8oeDAsIHkwLCBsYW1iZGEwLCBhMCwgYjAsIGMwLCB4MiwgeTIsIGxhbWJkYTIsIGEgLz0gbSwgYiAvPSBtLCBjLCBkZXB0aCwgc3RyZWFtKTtcbiAgICAgICAgc3RyZWFtLnBvaW50KHgyLCB5Mik7XG4gICAgICAgIHJlc2FtcGxlTGluZVRvKHgyLCB5MiwgbGFtYmRhMiwgYSwgYiwgYywgeDEsIHkxLCBsYW1iZGExLCBhMSwgYjEsIGMxLCBkZXB0aCwgc3RyZWFtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHZhciBsYW1iZGEwMCwgeDAwLCB5MDAsIGEwMCwgYjAwLCBjMDAsIC8vIGZpcnN0IHBvaW50XG4gICAgICAgIGxhbWJkYTAsIHgwLCB5MCwgYTAsIGIwLCBjMDsgLy8gcHJldmlvdXMgcG9pbnRcblxuICAgIHZhciByZXNhbXBsZVN0cmVhbSA9IHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgbGluZUVuZDogbGluZUVuZCxcbiAgICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7IHN0cmVhbS5wb2x5Z29uU3RhcnQoKTsgcmVzYW1wbGVTdHJlYW0ubGluZVN0YXJ0ID0gcmluZ1N0YXJ0OyB9LFxuICAgICAgcG9seWdvbkVuZDogZnVuY3Rpb24oKSB7IHN0cmVhbS5wb2x5Z29uRW5kKCk7IHJlc2FtcGxlU3RyZWFtLmxpbmVTdGFydCA9IGxpbmVTdGFydDsgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBwb2ludCh4LCB5KSB7XG4gICAgICB4ID0gcHJvamVjdCh4LCB5KTtcbiAgICAgIHN0cmVhbS5wb2ludCh4WzBdLCB4WzFdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaW5lU3RhcnQoKSB7XG4gICAgICB4MCA9IE5hTjtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gbGluZVBvaW50O1xuICAgICAgc3RyZWFtLmxpbmVTdGFydCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpbmVQb2ludChsYW1iZGEsIHBoaSkge1xuICAgICAgdmFyIGMgPSBjYXJ0ZXNpYW4oW2xhbWJkYSwgcGhpXSksIHAgPSBwcm9qZWN0KGxhbWJkYSwgcGhpKTtcbiAgICAgIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDAgPSBwWzBdLCB5MCA9IHBbMV0sIGxhbWJkYTAgPSBsYW1iZGEsIGEwID0gY1swXSwgYjAgPSBjWzFdLCBjMCA9IGNbMl0sIG1heERlcHRoLCBzdHJlYW0pO1xuICAgICAgc3RyZWFtLnBvaW50KHgwLCB5MCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGluZUVuZCgpIHtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLnBvaW50ID0gcG9pbnQ7XG4gICAgICBzdHJlYW0ubGluZUVuZCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJpbmdTdGFydCgpIHtcbiAgICAgIGxpbmVTdGFydCgpO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSByaW5nUG9pbnQ7XG4gICAgICByZXNhbXBsZVN0cmVhbS5saW5lRW5kID0gcmluZ0VuZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByaW5nUG9pbnQobGFtYmRhLCBwaGkpIHtcbiAgICAgIGxpbmVQb2ludChsYW1iZGEwMCA9IGxhbWJkYSwgcGhpKSwgeDAwID0geDAsIHkwMCA9IHkwLCBhMDAgPSBhMCwgYjAwID0gYjAsIGMwMCA9IGMwO1xuICAgICAgcmVzYW1wbGVTdHJlYW0ucG9pbnQgPSBsaW5lUG9pbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmluZ0VuZCgpIHtcbiAgICAgIHJlc2FtcGxlTGluZVRvKHgwLCB5MCwgbGFtYmRhMCwgYTAsIGIwLCBjMCwgeDAwLCB5MDAsIGxhbWJkYTAwLCBhMDAsIGIwMCwgYzAwLCBtYXhEZXB0aCwgc3RyZWFtKTtcbiAgICAgIHJlc2FtcGxlU3RyZWFtLmxpbmVFbmQgPSBsaW5lRW5kO1xuICAgICAgbGluZUVuZCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXNhbXBsZVN0cmVhbTtcbiAgfTtcbn1cblxudmFyIHRyYW5zZm9ybVJhZGlhbnMgPSB0cmFuc2Zvcm1lcih7XG4gIHBvaW50OiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy5zdHJlYW0ucG9pbnQoeCAqIHJhZGlhbnMsIHkgKiByYWRpYW5zKTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIHByb2plY3Rpb24ocHJvamVjdCkge1xuICByZXR1cm4gcHJvamVjdGlvbk11dGF0b3IoZnVuY3Rpb24oKSB7IHJldHVybiBwcm9qZWN0OyB9KSgpO1xufVxuXG5mdW5jdGlvbiBwcm9qZWN0aW9uTXV0YXRvcihwcm9qZWN0QXQpIHtcbiAgdmFyIHByb2plY3QsXG4gICAgICBrID0gMTUwLCAvLyBzY2FsZVxuICAgICAgeCA9IDQ4MCwgeSA9IDI1MCwgLy8gdHJhbnNsYXRlXG4gICAgICBkeCwgZHksIGxhbWJkYSA9IDAsIHBoaSA9IDAsIC8vIGNlbnRlclxuICAgICAgZGVsdGFMYW1iZGEgPSAwLCBkZWx0YVBoaSA9IDAsIGRlbHRhR2FtbWEgPSAwLCByb3RhdGUsIHByb2plY3RSb3RhdGUsIC8vIHJvdGF0ZVxuICAgICAgdGhldGEgPSBudWxsLCBwcmVjbGlwID0gY2xpcEFudGltZXJpZGlhbiwgLy8gY2xpcCBhbmdsZVxuICAgICAgeDAgPSBudWxsLCB5MCwgeDEsIHkxLCBwb3N0Y2xpcCA9IGlkZW50aXR5LCAvLyBjbGlwIGV4dGVudFxuICAgICAgZGVsdGEyID0gMC41LCBwcm9qZWN0UmVzYW1wbGUgPSByZXNhbXBsZShwcm9qZWN0VHJhbnNmb3JtLCBkZWx0YTIpLCAvLyBwcmVjaXNpb25cbiAgICAgIGNhY2hlLFxuICAgICAgY2FjaGVTdHJlYW07XG5cbiAgZnVuY3Rpb24gcHJvamVjdGlvbihwb2ludCkge1xuICAgIHBvaW50ID0gcHJvamVjdFJvdGF0ZShwb2ludFswXSAqIHJhZGlhbnMsIHBvaW50WzFdICogcmFkaWFucyk7XG4gICAgcmV0dXJuIFtwb2ludFswXSAqIGsgKyBkeCwgZHkgLSBwb2ludFsxXSAqIGtdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52ZXJ0KHBvaW50KSB7XG4gICAgcG9pbnQgPSBwcm9qZWN0Um90YXRlLmludmVydCgocG9pbnRbMF0gLSBkeCkgLyBrLCAoZHkgLSBwb2ludFsxXSkgLyBrKTtcbiAgICByZXR1cm4gcG9pbnQgJiYgW3BvaW50WzBdICogZGVncmVlcywgcG9pbnRbMV0gKiBkZWdyZWVzXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2plY3RUcmFuc2Zvcm0oeCwgeSkge1xuICAgIHJldHVybiB4ID0gcHJvamVjdCh4LCB5KSwgW3hbMF0gKiBrICsgZHgsIGR5IC0geFsxXSAqIGtdO1xuICB9XG5cbiAgcHJvamVjdGlvbi5zdHJlYW0gPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgICByZXR1cm4gY2FjaGUgJiYgY2FjaGVTdHJlYW0gPT09IHN0cmVhbSA/IGNhY2hlIDogY2FjaGUgPSB0cmFuc2Zvcm1SYWRpYW5zKHByZWNsaXAocm90YXRlLCBwcm9qZWN0UmVzYW1wbGUocG9zdGNsaXAoY2FjaGVTdHJlYW0gPSBzdHJlYW0pKSkpO1xuICB9O1xuXG4gIHByb2plY3Rpb24uY2xpcEFuZ2xlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHByZWNsaXAgPSArXyA/IGNsaXBDaXJjbGUodGhldGEgPSBfICogcmFkaWFucywgNiAqIHJhZGlhbnMpIDogKHRoZXRhID0gbnVsbCwgY2xpcEFudGltZXJpZGlhbiksIHJlc2V0KCkpIDogdGhldGEgKiBkZWdyZWVzO1xuICB9O1xuXG4gIHByb2plY3Rpb24uY2xpcEV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwb3N0Y2xpcCA9IF8gPT0gbnVsbCA/ICh4MCA9IHkwID0geDEgPSB5MSA9IG51bGwsIGlkZW50aXR5KSA6IGNsaXBFeHRlbnQoeDAgPSArX1swXVswXSwgeTAgPSArX1swXVsxXSwgeDEgPSArX1sxXVswXSwgeTEgPSArX1sxXVsxXSksIHJlc2V0KCkpIDogeDAgPT0gbnVsbCA/IG51bGwgOiBbW3gwLCB5MF0sIFt4MSwgeTFdXTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLnNjYWxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGsgPSArXywgcmVjZW50ZXIoKSkgOiBrO1xuICB9O1xuXG4gIHByb2plY3Rpb24udHJhbnNsYXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHggPSArX1swXSwgeSA9ICtfWzFdLCByZWNlbnRlcigpKSA6IFt4LCB5XTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmNlbnRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChsYW1iZGEgPSBfWzBdICUgMzYwICogcmFkaWFucywgcGhpID0gX1sxXSAlIDM2MCAqIHJhZGlhbnMsIHJlY2VudGVyKCkpIDogW2xhbWJkYSAqIGRlZ3JlZXMsIHBoaSAqIGRlZ3JlZXNdO1xuICB9O1xuXG4gIHByb2plY3Rpb24ucm90YXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRlbHRhTGFtYmRhID0gX1swXSAlIDM2MCAqIHJhZGlhbnMsIGRlbHRhUGhpID0gX1sxXSAlIDM2MCAqIHJhZGlhbnMsIGRlbHRhR2FtbWEgPSBfLmxlbmd0aCA+IDIgPyBfWzJdICUgMzYwICogcmFkaWFucyA6IDAsIHJlY2VudGVyKCkpIDogW2RlbHRhTGFtYmRhICogZGVncmVlcywgZGVsdGFQaGkgKiBkZWdyZWVzLCBkZWx0YUdhbW1hICogZGVncmVlc107XG4gIH07XG5cbiAgcHJvamVjdGlvbi5wcmVjaXNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocHJvamVjdFJlc2FtcGxlID0gcmVzYW1wbGUocHJvamVjdFRyYW5zZm9ybSwgZGVsdGEyID0gXyAqIF8pLCByZXNldCgpKSA6IHNxcnQoZGVsdGEyKTtcbiAgfTtcblxuICBwcm9qZWN0aW9uLmZpdEV4dGVudCA9IGZ1bmN0aW9uKGV4dGVudCwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdEV4dGVudChwcm9qZWN0aW9uLCBleHRlbnQsIG9iamVjdCk7XG4gIH07XG5cbiAgcHJvamVjdGlvbi5maXRTaXplID0gZnVuY3Rpb24oc2l6ZSwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdFNpemUocHJvamVjdGlvbiwgc2l6ZSwgb2JqZWN0KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZWNlbnRlcigpIHtcbiAgICBwcm9qZWN0Um90YXRlID0gY29tcG9zZShyb3RhdGUgPSByb3RhdGVSYWRpYW5zKGRlbHRhTGFtYmRhLCBkZWx0YVBoaSwgZGVsdGFHYW1tYSksIHByb2plY3QpO1xuICAgIHZhciBjZW50ZXIgPSBwcm9qZWN0KGxhbWJkYSwgcGhpKTtcbiAgICBkeCA9IHggLSBjZW50ZXJbMF0gKiBrO1xuICAgIGR5ID0geSArIGNlbnRlclsxXSAqIGs7XG4gICAgcmV0dXJuIHJlc2V0KCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBjYWNoZSA9IGNhY2hlU3RyZWFtID0gbnVsbDtcbiAgICByZXR1cm4gcHJvamVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBwcm9qZWN0ID0gcHJvamVjdEF0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcHJvamVjdGlvbi5pbnZlcnQgPSBwcm9qZWN0LmludmVydCAmJiBpbnZlcnQ7XG4gICAgcmV0dXJuIHJlY2VudGVyKCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbmljUHJvamVjdGlvbihwcm9qZWN0QXQpIHtcbiAgdmFyIHBoaTAgPSAwLFxuICAgICAgcGhpMSA9IHBpIC8gMyxcbiAgICAgIG0gPSBwcm9qZWN0aW9uTXV0YXRvcihwcm9qZWN0QXQpLFxuICAgICAgcCA9IG0ocGhpMCwgcGhpMSk7XG5cbiAgcC5wYXJhbGxlbHMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyBtKHBoaTAgPSBfWzBdICogcmFkaWFucywgcGhpMSA9IF9bMV0gKiByYWRpYW5zKSA6IFtwaGkwICogZGVncmVlcywgcGhpMSAqIGRlZ3JlZXNdO1xuICB9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBjeWxpbmRyaWNhbEVxdWFsQXJlYVJhdyhwaGkwKSB7XG4gIHZhciBjb3NQaGkwID0gY29zKHBoaTApO1xuXG4gIGZ1bmN0aW9uIGZvcndhcmQobGFtYmRhLCBwaGkpIHtcbiAgICByZXR1cm4gW2xhbWJkYSAqIGNvc1BoaTAsIHNpbihwaGkpIC8gY29zUGhpMF07XG4gIH1cblxuICBmb3J3YXJkLmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4gW3ggLyBjb3NQaGkwLCBhc2luKHkgKiBjb3NQaGkwKV07XG4gIH07XG5cbiAgcmV0dXJuIGZvcndhcmQ7XG59XG5cbmZ1bmN0aW9uIGNvbmljRXF1YWxBcmVhUmF3KHkwLCB5MSkge1xuICB2YXIgc3kwID0gc2luKHkwKSwgbiA9IChzeTAgKyBzaW4oeTEpKSAvIDI7XG5cbiAgLy8gQXJlIHRoZSBwYXJhbGxlbHMgc3ltbWV0cmljYWwgYXJvdW5kIHRoZSBFcXVhdG9yP1xuICBpZiAoYWJzKG4pIDwgZXBzaWxvbikgcmV0dXJuIGN5bGluZHJpY2FsRXF1YWxBcmVhUmF3KHkwKTtcblxuICB2YXIgYyA9IDEgKyBzeTAgKiAoMiAqIG4gLSBzeTApLCByMCA9IHNxcnQoYykgLyBuO1xuXG4gIGZ1bmN0aW9uIHByb2plY3QoeCwgeSkge1xuICAgIHZhciByID0gc3FydChjIC0gMiAqIG4gKiBzaW4oeSkpIC8gbjtcbiAgICByZXR1cm4gW3IgKiBzaW4oeCAqPSBuKSwgcjAgLSByICogY29zKHgpXTtcbiAgfVxuXG4gIHByb2plY3QuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciByMHkgPSByMCAtIHk7XG4gICAgcmV0dXJuIFthdGFuMih4LCBhYnMocjB5KSkgLyBuICogc2lnbihyMHkpLCBhc2luKChjIC0gKHggKiB4ICsgcjB5ICogcjB5KSAqIG4gKiBuKSAvICgyICogbikpXTtcbiAgfTtcblxuICByZXR1cm4gcHJvamVjdDtcbn1cblxudmFyIGNvbmljRXF1YWxBcmVhID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb25pY1Byb2plY3Rpb24oY29uaWNFcXVhbEFyZWFSYXcpXG4gICAgICAuc2NhbGUoMTU1LjQyNClcbiAgICAgIC5jZW50ZXIoWzAsIDMzLjY0NDJdKTtcbn07XG5cbnZhciBhbGJlcnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNvbmljRXF1YWxBcmVhKClcbiAgICAgIC5wYXJhbGxlbHMoWzI5LjUsIDQ1LjVdKVxuICAgICAgLnNjYWxlKDEwNzApXG4gICAgICAudHJhbnNsYXRlKFs0ODAsIDI1MF0pXG4gICAgICAucm90YXRlKFs5NiwgMF0pXG4gICAgICAuY2VudGVyKFstMC42LCAzOC43XSk7XG59O1xuXG4vLyBUaGUgcHJvamVjdGlvbnMgbXVzdCBoYXZlIG11dHVhbGx5IGV4Y2x1c2l2ZSBjbGlwIHJlZ2lvbnMgb24gdGhlIHNwaGVyZSxcbi8vIGFzIHRoaXMgd2lsbCBhdm9pZCBlbWl0dGluZyBpbnRlcmxlYXZpbmcgbGluZXMgYW5kIHBvbHlnb25zLlxuZnVuY3Rpb24gbXVsdGlwbGV4KHN0cmVhbXMpIHtcbiAgdmFyIG4gPSBzdHJlYW1zLmxlbmd0aDtcbiAgcmV0dXJuIHtcbiAgICBwb2ludDogZnVuY3Rpb24oeCwgeSkgeyB2YXIgaSA9IC0xOyB3aGlsZSAoKytpIDwgbikgc3RyZWFtc1tpXS5wb2ludCh4LCB5KTsgfSxcbiAgICBzcGhlcmU6IGZ1bmN0aW9uKCkgeyB2YXIgaSA9IC0xOyB3aGlsZSAoKytpIDwgbikgc3RyZWFtc1tpXS5zcGhlcmUoKTsgfSxcbiAgICBsaW5lU3RhcnQ6IGZ1bmN0aW9uKCkgeyB2YXIgaSA9IC0xOyB3aGlsZSAoKytpIDwgbikgc3RyZWFtc1tpXS5saW5lU3RhcnQoKTsgfSxcbiAgICBsaW5lRW5kOiBmdW5jdGlvbigpIHsgdmFyIGkgPSAtMTsgd2hpbGUgKCsraSA8IG4pIHN0cmVhbXNbaV0ubGluZUVuZCgpOyB9LFxuICAgIHBvbHlnb25TdGFydDogZnVuY3Rpb24oKSB7IHZhciBpID0gLTE7IHdoaWxlICgrK2kgPCBuKSBzdHJlYW1zW2ldLnBvbHlnb25TdGFydCgpOyB9LFxuICAgIHBvbHlnb25FbmQ6IGZ1bmN0aW9uKCkgeyB2YXIgaSA9IC0xOyB3aGlsZSAoKytpIDwgbikgc3RyZWFtc1tpXS5wb2x5Z29uRW5kKCk7IH1cbiAgfTtcbn1cblxuLy8gQSBjb21wb3NpdGUgcHJvamVjdGlvbiBmb3IgdGhlIFVuaXRlZCBTdGF0ZXMsIGNvbmZpZ3VyZWQgYnkgZGVmYXVsdCBmb3Jcbi8vIDk2MMOXNTAwLiBUaGUgcHJvamVjdGlvbiBhbHNvIHdvcmtzIHF1aXRlIHdlbGwgYXQgOTYww5c2MDAgaWYgeW91IGNoYW5nZSB0aGVcbi8vIHNjYWxlIHRvIDEyODUgYW5kIGFkanVzdCB0aGUgdHJhbnNsYXRlIGFjY29yZGluZ2x5LiBUaGUgc2V0IG9mIHN0YW5kYXJkXG4vLyBwYXJhbGxlbHMgZm9yIGVhY2ggcmVnaW9uIGNvbWVzIGZyb20gVVNHUywgd2hpY2ggaXMgcHVibGlzaGVkIGhlcmU6XG4vLyBodHRwOi8vZWdzYy51c2dzLmdvdi9pc2IvcHVicy9NYXBQcm9qZWN0aW9ucy9wcm9qZWN0aW9ucy5odG1sI2FsYmVyc1xudmFyIGFsYmVyc1VzYSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FjaGUsXG4gICAgICBjYWNoZVN0cmVhbSxcbiAgICAgIGxvd2VyNDggPSBhbGJlcnMoKSwgbG93ZXI0OFBvaW50LFxuICAgICAgYWxhc2thID0gY29uaWNFcXVhbEFyZWEoKS5yb3RhdGUoWzE1NCwgMF0pLmNlbnRlcihbLTIsIDU4LjVdKS5wYXJhbGxlbHMoWzU1LCA2NV0pLCBhbGFza2FQb2ludCwgLy8gRVBTRzozMzM4XG4gICAgICBoYXdhaWkgPSBjb25pY0VxdWFsQXJlYSgpLnJvdGF0ZShbMTU3LCAwXSkuY2VudGVyKFstMywgMTkuOV0pLnBhcmFsbGVscyhbOCwgMThdKSwgaGF3YWlpUG9pbnQsIC8vIEVTUkk6MTAyMDA3XG4gICAgICBwb2ludCwgcG9pbnRTdHJlYW0gPSB7cG9pbnQ6IGZ1bmN0aW9uKHgsIHkpIHsgcG9pbnQgPSBbeCwgeV07IH19O1xuXG4gIGZ1bmN0aW9uIGFsYmVyc1VzYShjb29yZGluYXRlcykge1xuICAgIHZhciB4ID0gY29vcmRpbmF0ZXNbMF0sIHkgPSBjb29yZGluYXRlc1sxXTtcbiAgICByZXR1cm4gcG9pbnQgPSBudWxsLFxuICAgICAgICAobG93ZXI0OFBvaW50LnBvaW50KHgsIHkpLCBwb2ludClcbiAgICAgICAgfHwgKGFsYXNrYVBvaW50LnBvaW50KHgsIHkpLCBwb2ludClcbiAgICAgICAgfHwgKGhhd2FpaVBvaW50LnBvaW50KHgsIHkpLCBwb2ludCk7XG4gIH1cblxuICBhbGJlcnNVc2EuaW52ZXJ0ID0gZnVuY3Rpb24oY29vcmRpbmF0ZXMpIHtcbiAgICB2YXIgayA9IGxvd2VyNDguc2NhbGUoKSxcbiAgICAgICAgdCA9IGxvd2VyNDgudHJhbnNsYXRlKCksXG4gICAgICAgIHggPSAoY29vcmRpbmF0ZXNbMF0gLSB0WzBdKSAvIGssXG4gICAgICAgIHkgPSAoY29vcmRpbmF0ZXNbMV0gLSB0WzFdKSAvIGs7XG4gICAgcmV0dXJuICh5ID49IDAuMTIwICYmIHkgPCAwLjIzNCAmJiB4ID49IC0wLjQyNSAmJiB4IDwgLTAuMjE0ID8gYWxhc2thXG4gICAgICAgIDogeSA+PSAwLjE2NiAmJiB5IDwgMC4yMzQgJiYgeCA+PSAtMC4yMTQgJiYgeCA8IC0wLjExNSA/IGhhd2FpaVxuICAgICAgICA6IGxvd2VyNDgpLmludmVydChjb29yZGluYXRlcyk7XG4gIH07XG5cbiAgYWxiZXJzVXNhLnN0cmVhbSA9IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgIHJldHVybiBjYWNoZSAmJiBjYWNoZVN0cmVhbSA9PT0gc3RyZWFtID8gY2FjaGUgOiBjYWNoZSA9IG11bHRpcGxleChbbG93ZXI0OC5zdHJlYW0oY2FjaGVTdHJlYW0gPSBzdHJlYW0pLCBhbGFza2Euc3RyZWFtKHN0cmVhbSksIGhhd2FpaS5zdHJlYW0oc3RyZWFtKV0pO1xuICB9O1xuXG4gIGFsYmVyc1VzYS5wcmVjaXNpb24gPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbG93ZXI0OC5wcmVjaXNpb24oKTtcbiAgICBsb3dlcjQ4LnByZWNpc2lvbihfKSwgYWxhc2thLnByZWNpc2lvbihfKSwgaGF3YWlpLnByZWNpc2lvbihfKTtcbiAgICByZXR1cm4gcmVzZXQoKTtcbiAgfTtcblxuICBhbGJlcnNVc2Euc2NhbGUgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbG93ZXI0OC5zY2FsZSgpO1xuICAgIGxvd2VyNDguc2NhbGUoXyksIGFsYXNrYS5zY2FsZShfICogMC4zNSksIGhhd2FpaS5zY2FsZShfKTtcbiAgICByZXR1cm4gYWxiZXJzVXNhLnRyYW5zbGF0ZShsb3dlcjQ4LnRyYW5zbGF0ZSgpKTtcbiAgfTtcblxuICBhbGJlcnNVc2EudHJhbnNsYXRlID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGxvd2VyNDgudHJhbnNsYXRlKCk7XG4gICAgdmFyIGsgPSBsb3dlcjQ4LnNjYWxlKCksIHggPSArX1swXSwgeSA9ICtfWzFdO1xuXG4gICAgbG93ZXI0OFBvaW50ID0gbG93ZXI0OFxuICAgICAgICAudHJhbnNsYXRlKF8pXG4gICAgICAgIC5jbGlwRXh0ZW50KFtbeCAtIDAuNDU1ICogaywgeSAtIDAuMjM4ICoga10sIFt4ICsgMC40NTUgKiBrLCB5ICsgMC4yMzggKiBrXV0pXG4gICAgICAgIC5zdHJlYW0ocG9pbnRTdHJlYW0pO1xuXG4gICAgYWxhc2thUG9pbnQgPSBhbGFza2FcbiAgICAgICAgLnRyYW5zbGF0ZShbeCAtIDAuMzA3ICogaywgeSArIDAuMjAxICoga10pXG4gICAgICAgIC5jbGlwRXh0ZW50KFtbeCAtIDAuNDI1ICogayArIGVwc2lsb24sIHkgKyAwLjEyMCAqIGsgKyBlcHNpbG9uXSwgW3ggLSAwLjIxNCAqIGsgLSBlcHNpbG9uLCB5ICsgMC4yMzQgKiBrIC0gZXBzaWxvbl1dKVxuICAgICAgICAuc3RyZWFtKHBvaW50U3RyZWFtKTtcblxuICAgIGhhd2FpaVBvaW50ID0gaGF3YWlpXG4gICAgICAgIC50cmFuc2xhdGUoW3ggLSAwLjIwNSAqIGssIHkgKyAwLjIxMiAqIGtdKVxuICAgICAgICAuY2xpcEV4dGVudChbW3ggLSAwLjIxNCAqIGsgKyBlcHNpbG9uLCB5ICsgMC4xNjYgKiBrICsgZXBzaWxvbl0sIFt4IC0gMC4xMTUgKiBrIC0gZXBzaWxvbiwgeSArIDAuMjM0ICogayAtIGVwc2lsb25dXSlcbiAgICAgICAgLnN0cmVhbShwb2ludFN0cmVhbSk7XG5cbiAgICByZXR1cm4gcmVzZXQoKTtcbiAgfTtcblxuICBhbGJlcnNVc2EuZml0RXh0ZW50ID0gZnVuY3Rpb24oZXh0ZW50LCBvYmplY3QpIHtcbiAgICByZXR1cm4gZml0RXh0ZW50KGFsYmVyc1VzYSwgZXh0ZW50LCBvYmplY3QpO1xuICB9O1xuXG4gIGFsYmVyc1VzYS5maXRTaXplID0gZnVuY3Rpb24oc2l6ZSwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGZpdFNpemUoYWxiZXJzVXNhLCBzaXplLCBvYmplY3QpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGNhY2hlID0gY2FjaGVTdHJlYW0gPSBudWxsO1xuICAgIHJldHVybiBhbGJlcnNVc2E7XG4gIH1cblxuICByZXR1cm4gYWxiZXJzVXNhLnNjYWxlKDEwNzApO1xufTtcblxuZnVuY3Rpb24gYXppbXV0aGFsUmF3KHNjYWxlKSB7XG4gIHJldHVybiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIGN4ID0gY29zKHgpLFxuICAgICAgICBjeSA9IGNvcyh5KSxcbiAgICAgICAgayA9IHNjYWxlKGN4ICogY3kpO1xuICAgIHJldHVybiBbXG4gICAgICBrICogY3kgKiBzaW4oeCksXG4gICAgICBrICogc2luKHkpXG4gICAgXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhemltdXRoYWxJbnZlcnQoYW5nbGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgeiA9IHNxcnQoeCAqIHggKyB5ICogeSksXG4gICAgICAgIGMgPSBhbmdsZSh6KSxcbiAgICAgICAgc2MgPSBzaW4oYyksXG4gICAgICAgIGNjID0gY29zKGMpO1xuICAgIHJldHVybiBbXG4gICAgICBhdGFuMih4ICogc2MsIHogKiBjYyksXG4gICAgICBhc2luKHogJiYgeSAqIHNjIC8geilcbiAgICBdO1xuICB9XG59XG5cbnZhciBhemltdXRoYWxFcXVhbEFyZWFSYXcgPSBhemltdXRoYWxSYXcoZnVuY3Rpb24oY3hjeSkge1xuICByZXR1cm4gc3FydCgyIC8gKDEgKyBjeGN5KSk7XG59KTtcblxuYXppbXV0aGFsRXF1YWxBcmVhUmF3LmludmVydCA9IGF6aW11dGhhbEludmVydChmdW5jdGlvbih6KSB7XG4gIHJldHVybiAyICogYXNpbih6IC8gMik7XG59KTtcblxudmFyIGF6aW11dGhhbEVxdWFsQXJlYSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcHJvamVjdGlvbihhemltdXRoYWxFcXVhbEFyZWFSYXcpXG4gICAgICAuc2NhbGUoMTI0Ljc1KVxuICAgICAgLmNsaXBBbmdsZSgxODAgLSAxZS0zKTtcbn07XG5cbnZhciBhemltdXRoYWxFcXVpZGlzdGFudFJhdyA9IGF6aW11dGhhbFJhdyhmdW5jdGlvbihjKSB7XG4gIHJldHVybiAoYyA9IGFjb3MoYykpICYmIGMgLyBzaW4oYyk7XG59KTtcblxuYXppbXV0aGFsRXF1aWRpc3RhbnRSYXcuaW52ZXJ0ID0gYXppbXV0aGFsSW52ZXJ0KGZ1bmN0aW9uKHopIHtcbiAgcmV0dXJuIHo7XG59KTtcblxudmFyIGF6aW11dGhhbEVxdWlkaXN0YW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBwcm9qZWN0aW9uKGF6aW11dGhhbEVxdWlkaXN0YW50UmF3KVxuICAgICAgLnNjYWxlKDc5LjQxODgpXG4gICAgICAuY2xpcEFuZ2xlKDE4MCAtIDFlLTMpO1xufTtcblxuZnVuY3Rpb24gbWVyY2F0b3JSYXcobGFtYmRhLCBwaGkpIHtcbiAgcmV0dXJuIFtsYW1iZGEsIGxvZyh0YW4oKGhhbGZQaSArIHBoaSkgLyAyKSldO1xufVxuXG5tZXJjYXRvclJhdy5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBbeCwgMiAqIGF0YW4oZXhwKHkpKSAtIGhhbGZQaV07XG59O1xuXG52YXIgbWVyY2F0b3IgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG1lcmNhdG9yUHJvamVjdGlvbihtZXJjYXRvclJhdylcbiAgICAgIC5zY2FsZSg5NjEgLyB0YXUpO1xufTtcblxuZnVuY3Rpb24gbWVyY2F0b3JQcm9qZWN0aW9uKHByb2plY3QpIHtcbiAgdmFyIG0gPSBwcm9qZWN0aW9uKHByb2plY3QpLFxuICAgICAgY2VudGVyID0gbS5jZW50ZXIsXG4gICAgICBzY2FsZSA9IG0uc2NhbGUsXG4gICAgICB0cmFuc2xhdGUgPSBtLnRyYW5zbGF0ZSxcbiAgICAgIGNsaXBFeHRlbnQgPSBtLmNsaXBFeHRlbnQsXG4gICAgICB4MCA9IG51bGwsIHkwLCB4MSwgeTE7IC8vIGNsaXAgZXh0ZW50XG5cbiAgbS5zY2FsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzY2FsZShfKSwgcmVjbGlwKCkpIDogc2NhbGUoKTtcbiAgfTtcblxuICBtLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2xhdGUoXyksIHJlY2xpcCgpKSA6IHRyYW5zbGF0ZSgpO1xuICB9O1xuXG4gIG0uY2VudGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNlbnRlcihfKSwgcmVjbGlwKCkpIDogY2VudGVyKCk7XG4gIH07XG5cbiAgbS5jbGlwRXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKChfID09IG51bGwgPyB4MCA9IHkwID0geDEgPSB5MSA9IG51bGwgOiAoeDAgPSArX1swXVswXSwgeTAgPSArX1swXVsxXSwgeDEgPSArX1sxXVswXSwgeTEgPSArX1sxXVsxXSkpLCByZWNsaXAoKSkgOiB4MCA9PSBudWxsID8gbnVsbCA6IFtbeDAsIHkwXSwgW3gxLCB5MV1dO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlY2xpcCgpIHtcbiAgICB2YXIgayA9IHBpICogc2NhbGUoKSxcbiAgICAgICAgdCA9IG0ocm90YXRpb24obS5yb3RhdGUoKSkuaW52ZXJ0KFswLCAwXSkpO1xuICAgIHJldHVybiBjbGlwRXh0ZW50KHgwID09IG51bGxcbiAgICAgICAgPyBbW3RbMF0gLSBrLCB0WzFdIC0ga10sIFt0WzBdICsgaywgdFsxXSArIGtdXSA6IHByb2plY3QgPT09IG1lcmNhdG9yUmF3XG4gICAgICAgID8gW1tNYXRoLm1heCh0WzBdIC0gaywgeDApLCB5MF0sIFtNYXRoLm1pbih0WzBdICsgaywgeDEpLCB5MV1dXG4gICAgICAgIDogW1t4MCwgTWF0aC5tYXgodFsxXSAtIGssIHkwKV0sIFt4MSwgTWF0aC5taW4odFsxXSArIGssIHkxKV1dKTtcbiAgfVxuXG4gIHJldHVybiByZWNsaXAoKTtcbn1cblxuZnVuY3Rpb24gdGFueSh5KSB7XG4gIHJldHVybiB0YW4oKGhhbGZQaSArIHkpIC8gMik7XG59XG5cbmZ1bmN0aW9uIGNvbmljQ29uZm9ybWFsUmF3KHkwLCB5MSkge1xuICB2YXIgY3kwID0gY29zKHkwKSxcbiAgICAgIG4gPSB5MCA9PT0geTEgPyBzaW4oeTApIDogbG9nKGN5MCAvIGNvcyh5MSkpIC8gbG9nKHRhbnkoeTEpIC8gdGFueSh5MCkpLFxuICAgICAgZiA9IGN5MCAqIHBvdyh0YW55KHkwKSwgbikgLyBuO1xuXG4gIGlmICghbikgcmV0dXJuIG1lcmNhdG9yUmF3O1xuXG4gIGZ1bmN0aW9uIHByb2plY3QoeCwgeSkge1xuICAgIGlmIChmID4gMCkgeyBpZiAoeSA8IC1oYWxmUGkgKyBlcHNpbG9uKSB5ID0gLWhhbGZQaSArIGVwc2lsb247IH1cbiAgICBlbHNlIHsgaWYgKHkgPiBoYWxmUGkgLSBlcHNpbG9uKSB5ID0gaGFsZlBpIC0gZXBzaWxvbjsgfVxuICAgIHZhciByID0gZiAvIHBvdyh0YW55KHkpLCBuKTtcbiAgICByZXR1cm4gW3IgKiBzaW4obiAqIHgpLCBmIC0gciAqIGNvcyhuICogeCldO1xuICB9XG5cbiAgcHJvamVjdC5pbnZlcnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIGZ5ID0gZiAtIHksIHIgPSBzaWduKG4pICogc3FydCh4ICogeCArIGZ5ICogZnkpO1xuICAgIHJldHVybiBbYXRhbjIoeCwgYWJzKGZ5KSkgLyBuICogc2lnbihmeSksIDIgKiBhdGFuKHBvdyhmIC8gciwgMSAvIG4pKSAtIGhhbGZQaV07XG4gIH07XG5cbiAgcmV0dXJuIHByb2plY3Q7XG59XG5cbnZhciBjb25pY0NvbmZvcm1hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29uaWNQcm9qZWN0aW9uKGNvbmljQ29uZm9ybWFsUmF3KVxuICAgICAgLnNjYWxlKDEwOS41KVxuICAgICAgLnBhcmFsbGVscyhbMzAsIDMwXSk7XG59O1xuXG5mdW5jdGlvbiBlcXVpcmVjdGFuZ3VsYXJSYXcobGFtYmRhLCBwaGkpIHtcbiAgcmV0dXJuIFtsYW1iZGEsIHBoaV07XG59XG5cbmVxdWlyZWN0YW5ndWxhclJhdy5pbnZlcnQgPSBlcXVpcmVjdGFuZ3VsYXJSYXc7XG5cbnZhciBlcXVpcmVjdGFuZ3VsYXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHByb2plY3Rpb24oZXF1aXJlY3Rhbmd1bGFyUmF3KVxuICAgICAgLnNjYWxlKDE1Mi42Myk7XG59O1xuXG5mdW5jdGlvbiBjb25pY0VxdWlkaXN0YW50UmF3KHkwLCB5MSkge1xuICB2YXIgY3kwID0gY29zKHkwKSxcbiAgICAgIG4gPSB5MCA9PT0geTEgPyBzaW4oeTApIDogKGN5MCAtIGNvcyh5MSkpIC8gKHkxIC0geTApLFxuICAgICAgZyA9IGN5MCAvIG4gKyB5MDtcblxuICBpZiAoYWJzKG4pIDwgZXBzaWxvbikgcmV0dXJuIGVxdWlyZWN0YW5ndWxhclJhdztcblxuICBmdW5jdGlvbiBwcm9qZWN0KHgsIHkpIHtcbiAgICB2YXIgZ3kgPSBnIC0geSwgbnggPSBuICogeDtcbiAgICByZXR1cm4gW2d5ICogc2luKG54KSwgZyAtIGd5ICogY29zKG54KV07XG4gIH1cblxuICBwcm9qZWN0LmludmVydCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgZ3kgPSBnIC0geTtcbiAgICByZXR1cm4gW2F0YW4yKHgsIGFicyhneSkpIC8gbiAqIHNpZ24oZ3kpLCBnIC0gc2lnbihuKSAqIHNxcnQoeCAqIHggKyBneSAqIGd5KV07XG4gIH07XG5cbiAgcmV0dXJuIHByb2plY3Q7XG59XG5cbnZhciBjb25pY0VxdWlkaXN0YW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb25pY1Byb2plY3Rpb24oY29uaWNFcXVpZGlzdGFudFJhdylcbiAgICAgIC5zY2FsZSgxMzEuMTU0KVxuICAgICAgLmNlbnRlcihbMCwgMTMuOTM4OV0pO1xufTtcblxuZnVuY3Rpb24gZ25vbW9uaWNSYXcoeCwgeSkge1xuICB2YXIgY3kgPSBjb3MoeSksIGsgPSBjb3MoeCkgKiBjeTtcbiAgcmV0dXJuIFtjeSAqIHNpbih4KSAvIGssIHNpbih5KSAvIGtdO1xufVxuXG5nbm9tb25pY1Jhdy5pbnZlcnQgPSBhemltdXRoYWxJbnZlcnQoYXRhbik7XG5cbnZhciBnbm9tb25pYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcHJvamVjdGlvbihnbm9tb25pY1JhdylcbiAgICAgIC5zY2FsZSgxNDQuMDQ5KVxuICAgICAgLmNsaXBBbmdsZSg2MCk7XG59O1xuXG5mdW5jdGlvbiBzY2FsZVRyYW5zbGF0ZShreCwga3ksIHR4LCB0eSkge1xuICByZXR1cm4ga3ggPT09IDEgJiYga3kgPT09IDEgJiYgdHggPT09IDAgJiYgdHkgPT09IDAgPyBpZGVudGl0eSA6IHRyYW5zZm9ybWVyKHtcbiAgICBwb2ludDogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgdGhpcy5zdHJlYW0ucG9pbnQoeCAqIGt4ICsgdHgsIHkgKiBreSArIHR5KTtcbiAgICB9XG4gIH0pO1xufVxuXG52YXIgaWRlbnRpdHkkMSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgayA9IDEsIHR4ID0gMCwgdHkgPSAwLCBzeCA9IDEsIHN5ID0gMSwgdHJhbnNmb3JtID0gaWRlbnRpdHksIC8vIHNjYWxlLCB0cmFuc2xhdGUgYW5kIHJlZmxlY3RcbiAgICAgIHgwID0gbnVsbCwgeTAsIHgxLCB5MSwgY2xpcCA9IGlkZW50aXR5LCAvLyBjbGlwIGV4dGVudFxuICAgICAgY2FjaGUsXG4gICAgICBjYWNoZVN0cmVhbSxcbiAgICAgIHByb2plY3Rpb247XG5cbiAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgY2FjaGUgPSBjYWNoZVN0cmVhbSA9IG51bGw7XG4gICAgcmV0dXJuIHByb2plY3Rpb247XG4gIH1cblxuICByZXR1cm4gcHJvamVjdGlvbiA9IHtcbiAgICBzdHJlYW06IGZ1bmN0aW9uKHN0cmVhbSkge1xuICAgICAgcmV0dXJuIGNhY2hlICYmIGNhY2hlU3RyZWFtID09PSBzdHJlYW0gPyBjYWNoZSA6IGNhY2hlID0gdHJhbnNmb3JtKGNsaXAoY2FjaGVTdHJlYW0gPSBzdHJlYW0pKTtcbiAgICB9LFxuICAgIGNsaXBFeHRlbnQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsaXAgPSBfID09IG51bGwgPyAoeDAgPSB5MCA9IHgxID0geTEgPSBudWxsLCBpZGVudGl0eSkgOiBjbGlwRXh0ZW50KHgwID0gK19bMF1bMF0sIHkwID0gK19bMF1bMV0sIHgxID0gK19bMV1bMF0sIHkxID0gK19bMV1bMV0pLCByZXNldCgpKSA6IHgwID09IG51bGwgPyBudWxsIDogW1t4MCwgeTBdLCBbeDEsIHkxXV07XG4gICAgfSxcbiAgICBzY2FsZTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNmb3JtID0gc2NhbGVUcmFuc2xhdGUoKGsgPSArXykgKiBzeCwgayAqIHN5LCB0eCwgdHkpLCByZXNldCgpKSA6IGs7XG4gICAgfSxcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zZm9ybSA9IHNjYWxlVHJhbnNsYXRlKGsgKiBzeCwgayAqIHN5LCB0eCA9ICtfWzBdLCB0eSA9ICtfWzFdKSwgcmVzZXQoKSkgOiBbdHgsIHR5XTtcbiAgICB9LFxuICAgIHJlZmxlY3RYOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2Zvcm0gPSBzY2FsZVRyYW5zbGF0ZShrICogKHN4ID0gXyA/IC0xIDogMSksIGsgKiBzeSwgdHgsIHR5KSwgcmVzZXQoKSkgOiBzeCA8IDA7XG4gICAgfSxcbiAgICByZWZsZWN0WTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodHJhbnNmb3JtID0gc2NhbGVUcmFuc2xhdGUoayAqIHN4LCBrICogKHN5ID0gXyA/IC0xIDogMSksIHR4LCB0eSksIHJlc2V0KCkpIDogc3kgPCAwO1xuICAgIH0sXG4gICAgZml0RXh0ZW50OiBmdW5jdGlvbihleHRlbnQsIG9iamVjdCkge1xuICAgICAgcmV0dXJuIGZpdEV4dGVudChwcm9qZWN0aW9uLCBleHRlbnQsIG9iamVjdCk7XG4gICAgfSxcbiAgICBmaXRTaXplOiBmdW5jdGlvbihzaXplLCBvYmplY3QpIHtcbiAgICAgIHJldHVybiBmaXRTaXplKHByb2plY3Rpb24sIHNpemUsIG9iamVjdCk7XG4gICAgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gb3J0aG9ncmFwaGljUmF3KHgsIHkpIHtcbiAgcmV0dXJuIFtjb3MoeSkgKiBzaW4oeCksIHNpbih5KV07XG59XG5cbm9ydGhvZ3JhcGhpY1Jhdy5pbnZlcnQgPSBhemltdXRoYWxJbnZlcnQoYXNpbik7XG5cbnZhciBvcnRob2dyYXBoaWMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHByb2plY3Rpb24ob3J0aG9ncmFwaGljUmF3KVxuICAgICAgLnNjYWxlKDI0OS41KVxuICAgICAgLmNsaXBBbmdsZSg5MCArIGVwc2lsb24pO1xufTtcblxuZnVuY3Rpb24gc3RlcmVvZ3JhcGhpY1Jhdyh4LCB5KSB7XG4gIHZhciBjeSA9IGNvcyh5KSwgayA9IDEgKyBjb3MoeCkgKiBjeTtcbiAgcmV0dXJuIFtjeSAqIHNpbih4KSAvIGssIHNpbih5KSAvIGtdO1xufVxuXG5zdGVyZW9ncmFwaGljUmF3LmludmVydCA9IGF6aW11dGhhbEludmVydChmdW5jdGlvbih6KSB7XG4gIHJldHVybiAyICogYXRhbih6KTtcbn0pO1xuXG52YXIgc3RlcmVvZ3JhcGhpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcHJvamVjdGlvbihzdGVyZW9ncmFwaGljUmF3KVxuICAgICAgLnNjYWxlKDI1MClcbiAgICAgIC5jbGlwQW5nbGUoMTQyKTtcbn07XG5cbmZ1bmN0aW9uIHRyYW5zdmVyc2VNZXJjYXRvclJhdyhsYW1iZGEsIHBoaSkge1xuICByZXR1cm4gW2xvZyh0YW4oKGhhbGZQaSArIHBoaSkgLyAyKSksIC1sYW1iZGFdO1xufVxuXG50cmFuc3ZlcnNlTWVyY2F0b3JSYXcuaW52ZXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gWy15LCAyICogYXRhbihleHAoeCkpIC0gaGFsZlBpXTtcbn07XG5cbnZhciB0cmFuc3ZlcnNlTWVyY2F0b3IgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG0gPSBtZXJjYXRvclByb2plY3Rpb24odHJhbnN2ZXJzZU1lcmNhdG9yUmF3KSxcbiAgICAgIGNlbnRlciA9IG0uY2VudGVyLFxuICAgICAgcm90YXRlID0gbS5yb3RhdGU7XG5cbiAgbS5jZW50ZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyBjZW50ZXIoWy1fWzFdLCBfWzBdXSkgOiAoXyA9IGNlbnRlcigpLCBbX1sxXSwgLV9bMF1dKTtcbiAgfTtcblxuICBtLnJvdGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IHJvdGF0ZShbX1swXSwgX1sxXSwgXy5sZW5ndGggPiAyID8gX1syXSArIDkwIDogOTBdKSA6IChfID0gcm90YXRlKCksIFtfWzBdLCBfWzFdLCBfWzJdIC0gOTBdKTtcbiAgfTtcblxuICByZXR1cm4gcm90YXRlKFswLCAwLCA5MF0pXG4gICAgICAuc2NhbGUoMTU5LjE1NSk7XG59O1xuXG5leHBvcnRzLmdlb0FyZWEgPSBhcmVhO1xuZXhwb3J0cy5nZW9Cb3VuZHMgPSBib3VuZHM7XG5leHBvcnRzLmdlb0NlbnRyb2lkID0gY2VudHJvaWQ7XG5leHBvcnRzLmdlb0NpcmNsZSA9IGNpcmNsZTtcbmV4cG9ydHMuZ2VvQ2xpcEV4dGVudCA9IGV4dGVudDtcbmV4cG9ydHMuZ2VvQ29udGFpbnMgPSBjb250YWlucztcbmV4cG9ydHMuZ2VvRGlzdGFuY2UgPSBkaXN0YW5jZTtcbmV4cG9ydHMuZ2VvR3JhdGljdWxlID0gZ3JhdGljdWxlO1xuZXhwb3J0cy5nZW9HcmF0aWN1bGUxMCA9IGdyYXRpY3VsZTEwO1xuZXhwb3J0cy5nZW9JbnRlcnBvbGF0ZSA9IGludGVycG9sYXRlO1xuZXhwb3J0cy5nZW9MZW5ndGggPSBsZW5ndGg7XG5leHBvcnRzLmdlb1BhdGggPSBpbmRleDtcbmV4cG9ydHMuZ2VvQWxiZXJzID0gYWxiZXJzO1xuZXhwb3J0cy5nZW9BbGJlcnNVc2EgPSBhbGJlcnNVc2E7XG5leHBvcnRzLmdlb0F6aW11dGhhbEVxdWFsQXJlYSA9IGF6aW11dGhhbEVxdWFsQXJlYTtcbmV4cG9ydHMuZ2VvQXppbXV0aGFsRXF1YWxBcmVhUmF3ID0gYXppbXV0aGFsRXF1YWxBcmVhUmF3O1xuZXhwb3J0cy5nZW9BemltdXRoYWxFcXVpZGlzdGFudCA9IGF6aW11dGhhbEVxdWlkaXN0YW50O1xuZXhwb3J0cy5nZW9BemltdXRoYWxFcXVpZGlzdGFudFJhdyA9IGF6aW11dGhhbEVxdWlkaXN0YW50UmF3O1xuZXhwb3J0cy5nZW9Db25pY0NvbmZvcm1hbCA9IGNvbmljQ29uZm9ybWFsO1xuZXhwb3J0cy5nZW9Db25pY0NvbmZvcm1hbFJhdyA9IGNvbmljQ29uZm9ybWFsUmF3O1xuZXhwb3J0cy5nZW9Db25pY0VxdWFsQXJlYSA9IGNvbmljRXF1YWxBcmVhO1xuZXhwb3J0cy5nZW9Db25pY0VxdWFsQXJlYVJhdyA9IGNvbmljRXF1YWxBcmVhUmF3O1xuZXhwb3J0cy5nZW9Db25pY0VxdWlkaXN0YW50ID0gY29uaWNFcXVpZGlzdGFudDtcbmV4cG9ydHMuZ2VvQ29uaWNFcXVpZGlzdGFudFJhdyA9IGNvbmljRXF1aWRpc3RhbnRSYXc7XG5leHBvcnRzLmdlb0VxdWlyZWN0YW5ndWxhciA9IGVxdWlyZWN0YW5ndWxhcjtcbmV4cG9ydHMuZ2VvRXF1aXJlY3Rhbmd1bGFyUmF3ID0gZXF1aXJlY3Rhbmd1bGFyUmF3O1xuZXhwb3J0cy5nZW9Hbm9tb25pYyA9IGdub21vbmljO1xuZXhwb3J0cy5nZW9Hbm9tb25pY1JhdyA9IGdub21vbmljUmF3O1xuZXhwb3J0cy5nZW9JZGVudGl0eSA9IGlkZW50aXR5JDE7XG5leHBvcnRzLmdlb1Byb2plY3Rpb24gPSBwcm9qZWN0aW9uO1xuZXhwb3J0cy5nZW9Qcm9qZWN0aW9uTXV0YXRvciA9IHByb2plY3Rpb25NdXRhdG9yO1xuZXhwb3J0cy5nZW9NZXJjYXRvciA9IG1lcmNhdG9yO1xuZXhwb3J0cy5nZW9NZXJjYXRvclJhdyA9IG1lcmNhdG9yUmF3O1xuZXhwb3J0cy5nZW9PcnRob2dyYXBoaWMgPSBvcnRob2dyYXBoaWM7XG5leHBvcnRzLmdlb09ydGhvZ3JhcGhpY1JhdyA9IG9ydGhvZ3JhcGhpY1JhdztcbmV4cG9ydHMuZ2VvU3RlcmVvZ3JhcGhpYyA9IHN0ZXJlb2dyYXBoaWM7XG5leHBvcnRzLmdlb1N0ZXJlb2dyYXBoaWNSYXcgPSBzdGVyZW9ncmFwaGljUmF3O1xuZXhwb3J0cy5nZW9UcmFuc3ZlcnNlTWVyY2F0b3IgPSB0cmFuc3ZlcnNlTWVyY2F0b3I7XG5leHBvcnRzLmdlb1RyYW5zdmVyc2VNZXJjYXRvclJhdyA9IHRyYW5zdmVyc2VNZXJjYXRvclJhdztcbmV4cG9ydHMuZ2VvUm90YXRpb24gPSByb3RhdGlvbjtcbmV4cG9ydHMuZ2VvU3RyZWFtID0gZ2VvU3RyZWFtO1xuZXhwb3J0cy5nZW9UcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKSk7XG4iLCIvLyBodHRwczovL2QzanMub3JnL2QzLWludGVycG9sYXRlLyBWZXJzaW9uIDEuMS41LiBDb3B5cmlnaHQgMjAxNyBNaWtlIEJvc3RvY2suXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMsIHJlcXVpcmUoJ2QzLWNvbG9yJykpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cycsICdkMy1jb2xvciddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pLGdsb2JhbC5kMykpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMsZDNDb2xvcikgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGJhc2lzKHQxLCB2MCwgdjEsIHYyLCB2Mykge1xuICB2YXIgdDIgPSB0MSAqIHQxLCB0MyA9IHQyICogdDE7XG4gIHJldHVybiAoKDEgLSAzICogdDEgKyAzICogdDIgLSB0MykgKiB2MFxuICAgICAgKyAoNCAtIDYgKiB0MiArIDMgKiB0MykgKiB2MVxuICAgICAgKyAoMSArIDMgKiB0MSArIDMgKiB0MiAtIDMgKiB0MykgKiB2MlxuICAgICAgKyB0MyAqIHYzKSAvIDY7XG59XG5cbnZhciBiYXNpcyQxID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCAtIDE7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSB0IDw9IDAgPyAodCA9IDApIDogdCA+PSAxID8gKHQgPSAxLCBuIC0gMSkgOiBNYXRoLmZsb29yKHQgKiBuKSxcbiAgICAgICAgdjEgPSB2YWx1ZXNbaV0sXG4gICAgICAgIHYyID0gdmFsdWVzW2kgKyAxXSxcbiAgICAgICAgdjAgPSBpID4gMCA/IHZhbHVlc1tpIC0gMV0gOiAyICogdjEgLSB2MixcbiAgICAgICAgdjMgPSBpIDwgbiAtIDEgPyB2YWx1ZXNbaSArIDJdIDogMiAqIHYyIC0gdjE7XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufTtcblxudmFyIGJhc2lzQ2xvc2VkID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoKCh0ICU9IDEpIDwgMCA/ICsrdCA6IHQpICogbiksXG4gICAgICAgIHYwID0gdmFsdWVzWyhpICsgbiAtIDEpICUgbl0sXG4gICAgICAgIHYxID0gdmFsdWVzW2kgJSBuXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbKGkgKyAxKSAlIG5dLFxuICAgICAgICB2MyA9IHZhbHVlc1soaSArIDIpICUgbl07XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufTtcblxudmFyIGNvbnN0YW50ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBsaW5lYXIoYSwgZCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgdCAqIGQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4cG9uZW50aWFsKGEsIGIsIHkpIHtcbiAgcmV0dXJuIGEgPSBNYXRoLnBvdyhhLCB5KSwgYiA9IE1hdGgucG93KGIsIHkpIC0gYSwgeSA9IDEgLyB5LCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGEgKyB0ICogYiwgeSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh1ZShhLCBiKSB7XG4gIHZhciBkID0gYiAtIGE7XG4gIHJldHVybiBkID8gbGluZWFyKGEsIGQgPiAxODAgfHwgZCA8IC0xODAgPyBkIC0gMzYwICogTWF0aC5yb3VuZChkIC8gMzYwKSA6IGQpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG59XG5cbmZ1bmN0aW9uIGdhbW1hKHkpIHtcbiAgcmV0dXJuICh5ID0gK3kpID09PSAxID8gbm9nYW1tYSA6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYiAtIGEgPyBleHBvbmVudGlhbChhLCBiLCB5KSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub2dhbW1hKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cblxudmFyIHJnYiQxID0gKChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciQkMSA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYiQkMShzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvciQkMSgoc3RhcnQgPSBkM0NvbG9yLnJnYihzdGFydCkpLnIsIChlbmQgPSBkM0NvbG9yLnJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yJCQxKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yJCQxKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IG5vZ2FtbWEoc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBzdGFydC5yID0gcih0KTtcbiAgICAgIHN0YXJ0LmcgPSBnKHQpO1xuICAgICAgc3RhcnQuYiA9IGIodCk7XG4gICAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHJnYiQkMS5nYW1tYSA9IHJnYkdhbW1hO1xuXG4gIHJldHVybiByZ2IkJDE7XG59KSkoMSk7XG5cbmZ1bmN0aW9uIHJnYlNwbGluZShzcGxpbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9ycykge1xuICAgIHZhciBuID0gY29sb3JzLmxlbmd0aCxcbiAgICAgICAgciA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgZyA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgYiA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgaSwgY29sb3IkJDE7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgY29sb3IkJDEgPSBkM0NvbG9yLnJnYihjb2xvcnNbaV0pO1xuICAgICAgcltpXSA9IGNvbG9yJCQxLnIgfHwgMDtcbiAgICAgIGdbaV0gPSBjb2xvciQkMS5nIHx8IDA7XG4gICAgICBiW2ldID0gY29sb3IkJDEuYiB8fCAwO1xuICAgIH1cbiAgICByID0gc3BsaW5lKHIpO1xuICAgIGcgPSBzcGxpbmUoZyk7XG4gICAgYiA9IHNwbGluZShiKTtcbiAgICBjb2xvciQkMS5vcGFjaXR5ID0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgY29sb3IkJDEuciA9IHIodCk7XG4gICAgICBjb2xvciQkMS5nID0gZyh0KTtcbiAgICAgIGNvbG9yJCQxLmIgPSBiKHQpO1xuICAgICAgcmV0dXJuIGNvbG9yJCQxICsgXCJcIjtcbiAgICB9O1xuICB9O1xufVxuXG52YXIgcmdiQmFzaXMgPSByZ2JTcGxpbmUoYmFzaXMkMSk7XG52YXIgcmdiQmFzaXNDbG9zZWQgPSByZ2JTcGxpbmUoYmFzaXNDbG9zZWQpO1xuXG52YXIgYXJyYXkgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBuYiA9IGIgPyBiLmxlbmd0aCA6IDAsXG4gICAgICBuYSA9IGEgPyBNYXRoLm1pbihuYiwgYS5sZW5ndGgpIDogMCxcbiAgICAgIHggPSBuZXcgQXJyYXkobmIpLFxuICAgICAgYyA9IG5ldyBBcnJheShuYiksXG4gICAgICBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBuYTsgKytpKSB4W2ldID0gdmFsdWUoYVtpXSwgYltpXSk7XG4gIGZvciAoOyBpIDwgbmI7ICsraSkgY1tpXSA9IGJbaV07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbmE7ICsraSkgY1tpXSA9IHhbaV0odCk7XG4gICAgcmV0dXJuIGM7XG4gIH07XG59O1xuXG52YXIgZGF0ZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGEgPSArYSwgYiAtPSBhLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGQuc2V0VGltZShhICsgYiAqIHQpLCBkO1xuICB9O1xufTtcblxudmFyIG51bWJlciA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPSArYSwgYiAtPSBhLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGEgKyBiICogdDtcbiAgfTtcbn07XG5cbnZhciBvYmplY3QgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBpID0ge30sXG4gICAgICBjID0ge30sXG4gICAgICBrO1xuXG4gIGlmIChhID09PSBudWxsIHx8IHR5cGVvZiBhICE9PSBcIm9iamVjdFwiKSBhID0ge307XG4gIGlmIChiID09PSBudWxsIHx8IHR5cGVvZiBiICE9PSBcIm9iamVjdFwiKSBiID0ge307XG5cbiAgZm9yIChrIGluIGIpIHtcbiAgICBpZiAoayBpbiBhKSB7XG4gICAgICBpW2tdID0gdmFsdWUoYVtrXSwgYltrXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNba10gPSBiW2tdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgZm9yIChrIGluIGkpIGNba10gPSBpW2tdKHQpO1xuICAgIHJldHVybiBjO1xuICB9O1xufTtcblxudmFyIHJlQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZztcbnZhciByZUIgPSBuZXcgUmVnRXhwKHJlQS5zb3VyY2UsIFwiZ1wiKTtcblxuZnVuY3Rpb24gemVybyhiKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25lKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYih0KSArIFwiXCI7XG4gIH07XG59XG5cbnZhciBzdHJpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBiaSA9IHJlQS5sYXN0SW5kZXggPSByZUIubGFzdEluZGV4ID0gMCwgLy8gc2NhbiBpbmRleCBmb3IgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgYm0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYlxuICAgICAgYnMsIC8vIHN0cmluZyBwcmVjZWRpbmcgY3VycmVudCBudW1iZXIgaW4gYiwgaWYgYW55XG4gICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICBxID0gW107IC8vIG51bWJlciBpbnRlcnBvbGF0b3JzXG5cbiAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcblxuICAvLyBJbnRlcnBvbGF0ZSBwYWlycyBvZiBudW1iZXJzIGluIGEgJiBiLlxuICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAmJiAoYm0gPSByZUIuZXhlYyhiKSkpIHtcbiAgICBpZiAoKGJzID0gYm0uaW5kZXgpID4gYmkpIHsgLy8gYSBzdHJpbmcgcHJlY2VkZXMgdGhlIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJzO1xuICAgIH1cbiAgICBpZiAoKGFtID0gYW1bMF0pID09PSAoYm0gPSBibVswXSkpIHsgLy8gbnVtYmVycyBpbiBhICYgYiBtYXRjaFxuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYm07IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgIH0gZWxzZSB7IC8vIGludGVycG9sYXRlIG5vbi1tYXRjaGluZyBudW1iZXJzXG4gICAgICBzWysraV0gPSBudWxsO1xuICAgICAgcS5wdXNoKHtpOiBpLCB4OiBudW1iZXIoYW0sIGJtKX0pO1xuICAgIH1cbiAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gIH1cblxuICAvLyBBZGQgcmVtYWlucyBvZiBiLlxuICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgIGJzID0gYi5zbGljZShiaSk7XG4gICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgZWxzZSBzWysraV0gPSBicztcbiAgfVxuXG4gIC8vIFNwZWNpYWwgb3B0aW1pemF0aW9uIGZvciBvbmx5IGEgc2luZ2xlIG1hdGNoLlxuICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICByZXR1cm4gcy5sZW5ndGggPCAyID8gKHFbMF1cbiAgICAgID8gb25lKHFbMF0ueClcbiAgICAgIDogemVybyhiKSlcbiAgICAgIDogKGIgPSBxLmxlbmd0aCwgZnVuY3Rpb24odCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICAgICAgfSk7XG59O1xuXG52YXIgdmFsdWUgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciB0ID0gdHlwZW9mIGIsIGM7XG4gIHJldHVybiBiID09IG51bGwgfHwgdCA9PT0gXCJib29sZWFuXCIgPyBjb25zdGFudChiKVxuICAgICAgOiAodCA9PT0gXCJudW1iZXJcIiA/IG51bWJlclxuICAgICAgOiB0ID09PSBcInN0cmluZ1wiID8gKChjID0gZDNDb2xvci5jb2xvcihiKSkgPyAoYiA9IGMsIHJnYiQxKSA6IHN0cmluZylcbiAgICAgIDogYiBpbnN0YW5jZW9mIGQzQ29sb3IuY29sb3IgPyByZ2IkMVxuICAgICAgOiBiIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVcbiAgICAgIDogQXJyYXkuaXNBcnJheShiKSA/IGFycmF5XG4gICAgICA6IHR5cGVvZiBiLnZhbHVlT2YgIT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgYi50b1N0cmluZyAhPT0gXCJmdW5jdGlvblwiIHx8IGlzTmFOKGIpID8gb2JqZWN0XG4gICAgICA6IG51bWJlcikoYSwgYik7XG59O1xuXG52YXIgcm91bmQgPSBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgLT0gYSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGEgKyBiICogdCk7XG4gIH07XG59O1xuXG52YXIgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbnZhciBpZGVudGl0eSA9IHtcbiAgdHJhbnNsYXRlWDogMCxcbiAgdHJhbnNsYXRlWTogMCxcbiAgcm90YXRlOiAwLFxuICBza2V3WDogMCxcbiAgc2NhbGVYOiAxLFxuICBzY2FsZVk6IDFcbn07XG5cbnZhciBkZWNvbXBvc2UgPSBmdW5jdGlvbihhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhciBzY2FsZVgsIHNjYWxlWSwgc2tld1g7XG4gIGlmIChzY2FsZVggPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYikpIGEgLz0gc2NhbGVYLCBiIC89IHNjYWxlWDtcbiAgaWYgKHNrZXdYID0gYSAqIGMgKyBiICogZCkgYyAtPSBhICogc2tld1gsIGQgLT0gYiAqIHNrZXdYO1xuICBpZiAoc2NhbGVZID0gTWF0aC5zcXJ0KGMgKiBjICsgZCAqIGQpKSBjIC89IHNjYWxlWSwgZCAvPSBzY2FsZVksIHNrZXdYIC89IHNjYWxlWTtcbiAgaWYgKGEgKiBkIDwgYiAqIGMpIGEgPSAtYSwgYiA9IC1iLCBza2V3WCA9IC1za2V3WCwgc2NhbGVYID0gLXNjYWxlWDtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2xhdGVYOiBlLFxuICAgIHRyYW5zbGF0ZVk6IGYsXG4gICAgcm90YXRlOiBNYXRoLmF0YW4yKGIsIGEpICogZGVncmVlcyxcbiAgICBza2V3WDogTWF0aC5hdGFuKHNrZXdYKSAqIGRlZ3JlZXMsXG4gICAgc2NhbGVYOiBzY2FsZVgsXG4gICAgc2NhbGVZOiBzY2FsZVlcbiAgfTtcbn07XG5cbnZhciBjc3NOb2RlO1xudmFyIGNzc1Jvb3Q7XG52YXIgY3NzVmlldztcbnZhciBzdmdOb2RlO1xuXG5mdW5jdGlvbiBwYXJzZUNzcyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IFwibm9uZVwiKSByZXR1cm4gaWRlbnRpdHk7XG4gIGlmICghY3NzTm9kZSkgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIiksIGNzc1Jvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIGNzc1ZpZXcgPSBkb2N1bWVudC5kZWZhdWx0VmlldztcbiAgY3NzTm9kZS5zdHlsZS50cmFuc2Zvcm0gPSB2YWx1ZTtcbiAgdmFsdWUgPSBjc3NWaWV3LmdldENvbXB1dGVkU3R5bGUoY3NzUm9vdC5hcHBlbmRDaGlsZChjc3NOb2RlKSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcbiAgY3NzUm9vdC5yZW1vdmVDaGlsZChjc3NOb2RlKTtcbiAgdmFsdWUgPSB2YWx1ZS5zbGljZSg3LCAtMSkuc3BsaXQoXCIsXCIpO1xuICByZXR1cm4gZGVjb21wb3NlKCt2YWx1ZVswXSwgK3ZhbHVlWzFdLCArdmFsdWVbMl0sICt2YWx1ZVszXSwgK3ZhbHVlWzRdLCArdmFsdWVbNV0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZVN2Zyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGlkZW50aXR5O1xuICBpZiAoIXN2Z05vZGUpIHN2Z05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImdcIik7XG4gIHN2Z05vZGUuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIHZhbHVlKTtcbiAgaWYgKCEodmFsdWUgPSBzdmdOb2RlLnRyYW5zZm9ybS5iYXNlVmFsLmNvbnNvbGlkYXRlKCkpKSByZXR1cm4gaWRlbnRpdHk7XG4gIHZhbHVlID0gdmFsdWUubWF0cml4O1xuICByZXR1cm4gZGVjb21wb3NlKHZhbHVlLmEsIHZhbHVlLmIsIHZhbHVlLmMsIHZhbHVlLmQsIHZhbHVlLmUsIHZhbHVlLmYpO1xufVxuXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZVRyYW5zZm9ybShwYXJzZSwgcHhDb21tYSwgcHhQYXJlbiwgZGVnUGFyZW4pIHtcblxuICBmdW5jdGlvbiBwb3Aocykge1xuICAgIHJldHVybiBzLmxlbmd0aCA/IHMucG9wKCkgKyBcIiBcIiA6IFwiXCI7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2xhdGUoeGEsIHlhLCB4YiwgeWIsIHMsIHEpIHtcbiAgICBpZiAoeGEgIT09IHhiIHx8IHlhICE9PSB5Yikge1xuICAgICAgdmFyIGkgPSBzLnB1c2goXCJ0cmFuc2xhdGUoXCIsIG51bGwsIHB4Q29tbWEsIG51bGwsIHB4UGFyZW4pO1xuICAgICAgcS5wdXNoKHtpOiBpIC0gNCwgeDogbnVtYmVyKHhhLCB4Yil9LCB7aTogaSAtIDIsIHg6IG51bWJlcih5YSwgeWIpfSk7XG4gICAgfSBlbHNlIGlmICh4YiB8fCB5Yikge1xuICAgICAgcy5wdXNoKFwidHJhbnNsYXRlKFwiICsgeGIgKyBweENvbW1hICsgeWIgKyBweFBhcmVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGUoYSwgYiwgcywgcSkge1xuICAgIGlmIChhICE9PSBiKSB7XG4gICAgICBpZiAoYSAtIGIgPiAxODApIGIgKz0gMzYwOyBlbHNlIGlmIChiIC0gYSA+IDE4MCkgYSArPSAzNjA7IC8vIHNob3J0ZXN0IHBhdGhcbiAgICAgIHEucHVzaCh7aTogcy5wdXNoKHBvcChzKSArIFwicm90YXRlKFwiLCBudWxsLCBkZWdQYXJlbikgLSAyLCB4OiBudW1iZXIoYSwgYil9KTtcbiAgICB9IGVsc2UgaWYgKGIpIHtcbiAgICAgIHMucHVzaChwb3AocykgKyBcInJvdGF0ZShcIiArIGIgKyBkZWdQYXJlbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2tld1goYSwgYiwgcywgcSkge1xuICAgIGlmIChhICE9PSBiKSB7XG4gICAgICBxLnB1c2goe2k6IHMucHVzaChwb3AocykgKyBcInNrZXdYKFwiLCBudWxsLCBkZWdQYXJlbikgLSAyLCB4OiBudW1iZXIoYSwgYil9KTtcbiAgICB9IGVsc2UgaWYgKGIpIHtcbiAgICAgIHMucHVzaChwb3AocykgKyBcInNrZXdYKFwiICsgYiArIGRlZ1BhcmVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzY2FsZSh4YSwgeWEsIHhiLCB5YiwgcywgcSkge1xuICAgIGlmICh4YSAhPT0geGIgfHwgeWEgIT09IHliKSB7XG4gICAgICB2YXIgaSA9IHMucHVzaChwb3AocykgKyBcInNjYWxlKFwiLCBudWxsLCBcIixcIiwgbnVsbCwgXCIpXCIpO1xuICAgICAgcS5wdXNoKHtpOiBpIC0gNCwgeDogbnVtYmVyKHhhLCB4Yil9LCB7aTogaSAtIDIsIHg6IG51bWJlcih5YSwgeWIpfSk7XG4gICAgfSBlbHNlIGlmICh4YiAhPT0gMSB8fCB5YiAhPT0gMSkge1xuICAgICAgcy5wdXNoKHBvcChzKSArIFwic2NhbGUoXCIgKyB4YiArIFwiLFwiICsgeWIgKyBcIilcIik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuICAgIGEgPSBwYXJzZShhKSwgYiA9IHBhcnNlKGIpO1xuICAgIHRyYW5zbGF0ZShhLnRyYW5zbGF0ZVgsIGEudHJhbnNsYXRlWSwgYi50cmFuc2xhdGVYLCBiLnRyYW5zbGF0ZVksIHMsIHEpO1xuICAgIHJvdGF0ZShhLnJvdGF0ZSwgYi5yb3RhdGUsIHMsIHEpO1xuICAgIHNrZXdYKGEuc2tld1gsIGIuc2tld1gsIHMsIHEpO1xuICAgIHNjYWxlKGEuc2NhbGVYLCBhLnNjYWxlWSwgYi5zY2FsZVgsIGIuc2NhbGVZLCBzLCBxKTtcbiAgICBhID0gYiA9IG51bGw7IC8vIGdjXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHZhciBpID0gLTEsIG4gPSBxLmxlbmd0aCwgbztcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgIH07XG4gIH07XG59XG5cbnZhciBpbnRlcnBvbGF0ZVRyYW5zZm9ybUNzcyA9IGludGVycG9sYXRlVHJhbnNmb3JtKHBhcnNlQ3NzLCBcInB4LCBcIiwgXCJweClcIiwgXCJkZWcpXCIpO1xudmFyIGludGVycG9sYXRlVHJhbnNmb3JtU3ZnID0gaW50ZXJwb2xhdGVUcmFuc2Zvcm0ocGFyc2VTdmcsIFwiLCBcIiwgXCIpXCIsIFwiKVwiKTtcblxudmFyIHJobyA9IE1hdGguU1FSVDI7XG52YXIgcmhvMiA9IDI7XG52YXIgcmhvNCA9IDQ7XG52YXIgZXBzaWxvbjIgPSAxZS0xMjtcblxuZnVuY3Rpb24gY29zaCh4KSB7XG4gIHJldHVybiAoKHggPSBNYXRoLmV4cCh4KSkgKyAxIC8geCkgLyAyO1xufVxuXG5mdW5jdGlvbiBzaW5oKHgpIHtcbiAgcmV0dXJuICgoeCA9IE1hdGguZXhwKHgpKSAtIDEgLyB4KSAvIDI7XG59XG5cbmZ1bmN0aW9uIHRhbmgoeCkge1xuICByZXR1cm4gKCh4ID0gTWF0aC5leHAoMiAqIHgpKSAtIDEpIC8gKHggKyAxKTtcbn1cblxuLy8gcDAgPSBbdXgwLCB1eTAsIHcwXVxuLy8gcDEgPSBbdXgxLCB1eTEsIHcxXVxudmFyIHpvb20gPSBmdW5jdGlvbihwMCwgcDEpIHtcbiAgdmFyIHV4MCA9IHAwWzBdLCB1eTAgPSBwMFsxXSwgdzAgPSBwMFsyXSxcbiAgICAgIHV4MSA9IHAxWzBdLCB1eTEgPSBwMVsxXSwgdzEgPSBwMVsyXSxcbiAgICAgIGR4ID0gdXgxIC0gdXgwLFxuICAgICAgZHkgPSB1eTEgLSB1eTAsXG4gICAgICBkMiA9IGR4ICogZHggKyBkeSAqIGR5LFxuICAgICAgaSxcbiAgICAgIFM7XG5cbiAgLy8gU3BlY2lhbCBjYXNlIGZvciB1MCDiiYUgdTEuXG4gIGlmIChkMiA8IGVwc2lsb24yKSB7XG4gICAgUyA9IE1hdGgubG9nKHcxIC8gdzApIC8gcmhvO1xuICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB1eDAgKyB0ICogZHgsXG4gICAgICAgIHV5MCArIHQgKiBkeSxcbiAgICAgICAgdzAgKiBNYXRoLmV4cChyaG8gKiB0ICogUylcbiAgICAgIF07XG4gICAgfTtcbiAgfVxuXG4gIC8vIEdlbmVyYWwgY2FzZS5cbiAgZWxzZSB7XG4gICAgdmFyIGQxID0gTWF0aC5zcXJ0KGQyKSxcbiAgICAgICAgYjAgPSAodzEgKiB3MSAtIHcwICogdzAgKyByaG80ICogZDIpIC8gKDIgKiB3MCAqIHJobzIgKiBkMSksXG4gICAgICAgIGIxID0gKHcxICogdzEgLSB3MCAqIHcwIC0gcmhvNCAqIGQyKSAvICgyICogdzEgKiByaG8yICogZDEpLFxuICAgICAgICByMCA9IE1hdGgubG9nKE1hdGguc3FydChiMCAqIGIwICsgMSkgLSBiMCksXG4gICAgICAgIHIxID0gTWF0aC5sb2coTWF0aC5zcXJ0KGIxICogYjEgKyAxKSAtIGIxKTtcbiAgICBTID0gKHIxIC0gcjApIC8gcmhvO1xuICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICB2YXIgcyA9IHQgKiBTLFxuICAgICAgICAgIGNvc2hyMCA9IGNvc2gocjApLFxuICAgICAgICAgIHUgPSB3MCAvIChyaG8yICogZDEpICogKGNvc2hyMCAqIHRhbmgocmhvICogcyArIHIwKSAtIHNpbmgocjApKTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHV4MCArIHUgKiBkeCxcbiAgICAgICAgdXkwICsgdSAqIGR5LFxuICAgICAgICB3MCAqIGNvc2hyMCAvIGNvc2gocmhvICogcyArIHIwKVxuICAgICAgXTtcbiAgICB9O1xuICB9XG5cbiAgaS5kdXJhdGlvbiA9IFMgKiAxMDAwO1xuXG4gIHJldHVybiBpO1xufTtcblxuZnVuY3Rpb24gaHNsJDEoaHVlJCQxKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgdmFyIGggPSBodWUkJDEoKHN0YXJ0ID0gZDNDb2xvci5oc2woc3RhcnQpKS5oLCAoZW5kID0gZDNDb2xvci5oc2woZW5kKSkuaCksXG4gICAgICAgIHMgPSBub2dhbW1hKHN0YXJ0LnMsIGVuZC5zKSxcbiAgICAgICAgbCA9IG5vZ2FtbWEoc3RhcnQubCwgZW5kLmwpLFxuICAgICAgICBvcGFjaXR5ID0gbm9nYW1tYShzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHN0YXJ0LmggPSBoKHQpO1xuICAgICAgc3RhcnQucyA9IHModCk7XG4gICAgICBzdGFydC5sID0gbCh0KTtcbiAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgXCJcIjtcbiAgICB9O1xuICB9XG59XG5cbnZhciBoc2wkMiA9IGhzbCQxKGh1ZSk7XG52YXIgaHNsTG9uZyA9IGhzbCQxKG5vZ2FtbWEpO1xuXG5mdW5jdGlvbiBsYWIkMShzdGFydCwgZW5kKSB7XG4gIHZhciBsID0gbm9nYW1tYSgoc3RhcnQgPSBkM0NvbG9yLmxhYihzdGFydCkpLmwsIChlbmQgPSBkM0NvbG9yLmxhYihlbmQpKS5sKSxcbiAgICAgIGEgPSBub2dhbW1hKHN0YXJ0LmEsIGVuZC5hKSxcbiAgICAgIGIgPSBub2dhbW1hKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgIG9wYWNpdHkgPSBub2dhbW1hKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICBzdGFydC5sID0gbCh0KTtcbiAgICBzdGFydC5hID0gYSh0KTtcbiAgICBzdGFydC5iID0gYih0KTtcbiAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICB9O1xufVxuXG5mdW5jdGlvbiBoY2wkMShodWUkJDEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgaCA9IGh1ZSQkMSgoc3RhcnQgPSBkM0NvbG9yLmhjbChzdGFydCkpLmgsIChlbmQgPSBkM0NvbG9yLmhjbChlbmQpKS5oKSxcbiAgICAgICAgYyA9IG5vZ2FtbWEoc3RhcnQuYywgZW5kLmMpLFxuICAgICAgICBsID0gbm9nYW1tYShzdGFydC5sLCBlbmQubCksXG4gICAgICAgIG9wYWNpdHkgPSBub2dhbW1hKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgc3RhcnQuaCA9IGgodCk7XG4gICAgICBzdGFydC5jID0gYyh0KTtcbiAgICAgIHN0YXJ0LmwgPSBsKHQpO1xuICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgIH07XG4gIH1cbn1cblxudmFyIGhjbCQyID0gaGNsJDEoaHVlKTtcbnZhciBoY2xMb25nID0gaGNsJDEobm9nYW1tYSk7XG5cbmZ1bmN0aW9uIGN1YmVoZWxpeCQxKGh1ZSQkMSkge1xuICByZXR1cm4gKGZ1bmN0aW9uIGN1YmVoZWxpeEdhbW1hKHkpIHtcbiAgICB5ID0gK3k7XG5cbiAgICBmdW5jdGlvbiBjdWJlaGVsaXgkJDEoc3RhcnQsIGVuZCkge1xuICAgICAgdmFyIGggPSBodWUkJDEoKHN0YXJ0ID0gZDNDb2xvci5jdWJlaGVsaXgoc3RhcnQpKS5oLCAoZW5kID0gZDNDb2xvci5jdWJlaGVsaXgoZW5kKSkuaCksXG4gICAgICAgICAgcyA9IG5vZ2FtbWEoc3RhcnQucywgZW5kLnMpLFxuICAgICAgICAgIGwgPSBub2dhbW1hKHN0YXJ0LmwsIGVuZC5sKSxcbiAgICAgICAgICBvcGFjaXR5ID0gbm9nYW1tYShzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICBzdGFydC5oID0gaCh0KTtcbiAgICAgICAgc3RhcnQucyA9IHModCk7XG4gICAgICAgIHN0YXJ0LmwgPSBsKE1hdGgucG93KHQsIHkpKTtcbiAgICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGN1YmVoZWxpeCQkMS5nYW1tYSA9IGN1YmVoZWxpeEdhbW1hO1xuXG4gICAgcmV0dXJuIGN1YmVoZWxpeCQkMTtcbiAgfSkoMSk7XG59XG5cbnZhciBjdWJlaGVsaXgkMiA9IGN1YmVoZWxpeCQxKGh1ZSk7XG52YXIgY3ViZWhlbGl4TG9uZyA9IGN1YmVoZWxpeCQxKG5vZ2FtbWEpO1xuXG52YXIgcXVhbnRpemUgPSBmdW5jdGlvbihpbnRlcnBvbGF0b3IsIG4pIHtcbiAgdmFyIHNhbXBsZXMgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKSBzYW1wbGVzW2ldID0gaW50ZXJwb2xhdG9yKGkgLyAobiAtIDEpKTtcbiAgcmV0dXJuIHNhbXBsZXM7XG59O1xuXG5leHBvcnRzLmludGVycG9sYXRlID0gdmFsdWU7XG5leHBvcnRzLmludGVycG9sYXRlQXJyYXkgPSBhcnJheTtcbmV4cG9ydHMuaW50ZXJwb2xhdGVCYXNpcyA9IGJhc2lzJDE7XG5leHBvcnRzLmludGVycG9sYXRlQmFzaXNDbG9zZWQgPSBiYXNpc0Nsb3NlZDtcbmV4cG9ydHMuaW50ZXJwb2xhdGVEYXRlID0gZGF0ZTtcbmV4cG9ydHMuaW50ZXJwb2xhdGVOdW1iZXIgPSBudW1iZXI7XG5leHBvcnRzLmludGVycG9sYXRlT2JqZWN0ID0gb2JqZWN0O1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVJvdW5kID0gcm91bmQ7XG5leHBvcnRzLmludGVycG9sYXRlU3RyaW5nID0gc3RyaW5nO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVRyYW5zZm9ybUNzcyA9IGludGVycG9sYXRlVHJhbnNmb3JtQ3NzO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVRyYW5zZm9ybVN2ZyA9IGludGVycG9sYXRlVHJhbnNmb3JtU3ZnO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVpvb20gPSB6b29tO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVJnYiA9IHJnYiQxO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVJnYkJhc2lzID0gcmdiQmFzaXM7XG5leHBvcnRzLmludGVycG9sYXRlUmdiQmFzaXNDbG9zZWQgPSByZ2JCYXNpc0Nsb3NlZDtcbmV4cG9ydHMuaW50ZXJwb2xhdGVIc2wgPSBoc2wkMjtcbmV4cG9ydHMuaW50ZXJwb2xhdGVIc2xMb25nID0gaHNsTG9uZztcbmV4cG9ydHMuaW50ZXJwb2xhdGVMYWIgPSBsYWIkMTtcbmV4cG9ydHMuaW50ZXJwb2xhdGVIY2wgPSBoY2wkMjtcbmV4cG9ydHMuaW50ZXJwb2xhdGVIY2xMb25nID0gaGNsTG9uZztcbmV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXggPSBjdWJlaGVsaXgkMjtcbmV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nID0gY3ViZWhlbGl4TG9uZztcbmV4cG9ydHMucXVhbnRpemUgPSBxdWFudGl6ZTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtcGF0aC8gVmVyc2lvbiAxLjAuNS4gQ29weXJpZ2h0IDIwMTcgTWlrZSBCb3N0b2NrLlxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuXHQoZmFjdG9yeSgoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGkgPSBNYXRoLlBJO1xudmFyIHRhdSA9IDIgKiBwaTtcbnZhciBlcHNpbG9uID0gMWUtNjtcbnZhciB0YXVFcHNpbG9uID0gdGF1IC0gZXBzaWxvbjtcblxuZnVuY3Rpb24gUGF0aCgpIHtcbiAgdGhpcy5feDAgPSB0aGlzLl95MCA9IC8vIHN0YXJ0IG9mIGN1cnJlbnQgc3VicGF0aFxuICB0aGlzLl94MSA9IHRoaXMuX3kxID0gbnVsbDsgLy8gZW5kIG9mIGN1cnJlbnQgc3VicGF0aFxuICB0aGlzLl8gPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBwYXRoKCkge1xuICByZXR1cm4gbmV3IFBhdGg7XG59XG5cblBhdGgucHJvdG90eXBlID0gcGF0aC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQYXRoLFxuICBtb3ZlVG86IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLl8gKz0gXCJNXCIgKyAodGhpcy5feDAgPSB0aGlzLl94MSA9ICt4KSArIFwiLFwiICsgKHRoaXMuX3kwID0gdGhpcy5feTEgPSAreSk7XG4gIH0sXG4gIGNsb3NlUGF0aDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX3gxICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl94MSA9IHRoaXMuX3gwLCB0aGlzLl95MSA9IHRoaXMuX3kwO1xuICAgICAgdGhpcy5fICs9IFwiWlwiO1xuICAgIH1cbiAgfSxcbiAgbGluZVRvOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy5fICs9IFwiTFwiICsgKHRoaXMuX3gxID0gK3gpICsgXCIsXCIgKyAodGhpcy5feTEgPSAreSk7XG4gIH0sXG4gIHF1YWRyYXRpY0N1cnZlVG86IGZ1bmN0aW9uKHgxLCB5MSwgeCwgeSkge1xuICAgIHRoaXMuXyArPSBcIlFcIiArICgreDEpICsgXCIsXCIgKyAoK3kxKSArIFwiLFwiICsgKHRoaXMuX3gxID0gK3gpICsgXCIsXCIgKyAodGhpcy5feTEgPSAreSk7XG4gIH0sXG4gIGJlemllckN1cnZlVG86IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyLCB4LCB5KSB7XG4gICAgdGhpcy5fICs9IFwiQ1wiICsgKCt4MSkgKyBcIixcIiArICgreTEpICsgXCIsXCIgKyAoK3gyKSArIFwiLFwiICsgKCt5MikgKyBcIixcIiArICh0aGlzLl94MSA9ICt4KSArIFwiLFwiICsgKHRoaXMuX3kxID0gK3kpO1xuICB9LFxuICBhcmNUbzogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIsIHIpIHtcbiAgICB4MSA9ICt4MSwgeTEgPSAreTEsIHgyID0gK3gyLCB5MiA9ICt5MiwgciA9ICtyO1xuICAgIHZhciB4MCA9IHRoaXMuX3gxLFxuICAgICAgICB5MCA9IHRoaXMuX3kxLFxuICAgICAgICB4MjEgPSB4MiAtIHgxLFxuICAgICAgICB5MjEgPSB5MiAtIHkxLFxuICAgICAgICB4MDEgPSB4MCAtIHgxLFxuICAgICAgICB5MDEgPSB5MCAtIHkxLFxuICAgICAgICBsMDFfMiA9IHgwMSAqIHgwMSArIHkwMSAqIHkwMTtcblxuICAgIC8vIElzIHRoZSByYWRpdXMgbmVnYXRpdmU/IEVycm9yLlxuICAgIGlmIChyIDwgMCkgdGhyb3cgbmV3IEVycm9yKFwibmVnYXRpdmUgcmFkaXVzOiBcIiArIHIpO1xuXG4gICAgLy8gSXMgdGhpcyBwYXRoIGVtcHR5PyBNb3ZlIHRvICh4MSx5MSkuXG4gICAgaWYgKHRoaXMuX3gxID09PSBudWxsKSB7XG4gICAgICB0aGlzLl8gKz0gXCJNXCIgKyAodGhpcy5feDEgPSB4MSkgKyBcIixcIiArICh0aGlzLl95MSA9IHkxKTtcbiAgICB9XG5cbiAgICAvLyBPciwgaXMgKHgxLHkxKSBjb2luY2lkZW50IHdpdGggKHgwLHkwKT8gRG8gbm90aGluZy5cbiAgICBlbHNlIGlmICghKGwwMV8yID4gZXBzaWxvbikpIHt9XG5cbiAgICAvLyBPciwgYXJlICh4MCx5MCksICh4MSx5MSkgYW5kICh4Mix5MikgY29sbGluZWFyP1xuICAgIC8vIEVxdWl2YWxlbnRseSwgaXMgKHgxLHkxKSBjb2luY2lkZW50IHdpdGggKHgyLHkyKT9cbiAgICAvLyBPciwgaXMgdGhlIHJhZGl1cyB6ZXJvPyBMaW5lIHRvICh4MSx5MSkuXG4gICAgZWxzZSBpZiAoIShNYXRoLmFicyh5MDEgKiB4MjEgLSB5MjEgKiB4MDEpID4gZXBzaWxvbikgfHwgIXIpIHtcbiAgICAgIHRoaXMuXyArPSBcIkxcIiArICh0aGlzLl94MSA9IHgxKSArIFwiLFwiICsgKHRoaXMuX3kxID0geTEpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgZHJhdyBhbiBhcmMhXG4gICAgZWxzZSB7XG4gICAgICB2YXIgeDIwID0geDIgLSB4MCxcbiAgICAgICAgICB5MjAgPSB5MiAtIHkwLFxuICAgICAgICAgIGwyMV8yID0geDIxICogeDIxICsgeTIxICogeTIxLFxuICAgICAgICAgIGwyMF8yID0geDIwICogeDIwICsgeTIwICogeTIwLFxuICAgICAgICAgIGwyMSA9IE1hdGguc3FydChsMjFfMiksXG4gICAgICAgICAgbDAxID0gTWF0aC5zcXJ0KGwwMV8yKSxcbiAgICAgICAgICBsID0gciAqIE1hdGgudGFuKChwaSAtIE1hdGguYWNvcygobDIxXzIgKyBsMDFfMiAtIGwyMF8yKSAvICgyICogbDIxICogbDAxKSkpIC8gMiksXG4gICAgICAgICAgdDAxID0gbCAvIGwwMSxcbiAgICAgICAgICB0MjEgPSBsIC8gbDIxO1xuXG4gICAgICAvLyBJZiB0aGUgc3RhcnQgdGFuZ2VudCBpcyBub3QgY29pbmNpZGVudCB3aXRoICh4MCx5MCksIGxpbmUgdG8uXG4gICAgICBpZiAoTWF0aC5hYnModDAxIC0gMSkgPiBlcHNpbG9uKSB7XG4gICAgICAgIHRoaXMuXyArPSBcIkxcIiArICh4MSArIHQwMSAqIHgwMSkgKyBcIixcIiArICh5MSArIHQwMSAqIHkwMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyArPSBcIkFcIiArIHIgKyBcIixcIiArIHIgKyBcIiwwLDAsXCIgKyAoKyh5MDEgKiB4MjAgPiB4MDEgKiB5MjApKSArIFwiLFwiICsgKHRoaXMuX3gxID0geDEgKyB0MjEgKiB4MjEpICsgXCIsXCIgKyAodGhpcy5feTEgPSB5MSArIHQyMSAqIHkyMSk7XG4gICAgfVxuICB9LFxuICBhcmM6IGZ1bmN0aW9uKHgsIHksIHIsIGEwLCBhMSwgY2N3KSB7XG4gICAgeCA9ICt4LCB5ID0gK3ksIHIgPSArcjtcbiAgICB2YXIgZHggPSByICogTWF0aC5jb3MoYTApLFxuICAgICAgICBkeSA9IHIgKiBNYXRoLnNpbihhMCksXG4gICAgICAgIHgwID0geCArIGR4LFxuICAgICAgICB5MCA9IHkgKyBkeSxcbiAgICAgICAgY3cgPSAxIF4gY2N3LFxuICAgICAgICBkYSA9IGNjdyA/IGEwIC0gYTEgOiBhMSAtIGEwO1xuXG4gICAgLy8gSXMgdGhlIHJhZGl1cyBuZWdhdGl2ZT8gRXJyb3IuXG4gICAgaWYgKHIgPCAwKSB0aHJvdyBuZXcgRXJyb3IoXCJuZWdhdGl2ZSByYWRpdXM6IFwiICsgcik7XG5cbiAgICAvLyBJcyB0aGlzIHBhdGggZW1wdHk/IE1vdmUgdG8gKHgwLHkwKS5cbiAgICBpZiAodGhpcy5feDEgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuXyArPSBcIk1cIiArIHgwICsgXCIsXCIgKyB5MDtcbiAgICB9XG5cbiAgICAvLyBPciwgaXMgKHgwLHkwKSBub3QgY29pbmNpZGVudCB3aXRoIHRoZSBwcmV2aW91cyBwb2ludD8gTGluZSB0byAoeDAseTApLlxuICAgIGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuX3gxIC0geDApID4gZXBzaWxvbiB8fCBNYXRoLmFicyh0aGlzLl95MSAtIHkwKSA+IGVwc2lsb24pIHtcbiAgICAgIHRoaXMuXyArPSBcIkxcIiArIHgwICsgXCIsXCIgKyB5MDtcbiAgICB9XG5cbiAgICAvLyBJcyB0aGlzIGFyYyBlbXB0eT8gV2XigJlyZSBkb25lLlxuICAgIGlmICghcikgcmV0dXJuO1xuXG4gICAgLy8gRG9lcyB0aGUgYW5nbGUgZ28gdGhlIHdyb25nIHdheT8gRmxpcCB0aGUgZGlyZWN0aW9uLlxuICAgIGlmIChkYSA8IDApIGRhID0gZGEgJSB0YXUgKyB0YXU7XG5cbiAgICAvLyBJcyB0aGlzIGEgY29tcGxldGUgY2lyY2xlPyBEcmF3IHR3byBhcmNzIHRvIGNvbXBsZXRlIHRoZSBjaXJjbGUuXG4gICAgaWYgKGRhID4gdGF1RXBzaWxvbikge1xuICAgICAgdGhpcy5fICs9IFwiQVwiICsgciArIFwiLFwiICsgciArIFwiLDAsMSxcIiArIGN3ICsgXCIsXCIgKyAoeCAtIGR4KSArIFwiLFwiICsgKHkgLSBkeSkgKyBcIkFcIiArIHIgKyBcIixcIiArIHIgKyBcIiwwLDEsXCIgKyBjdyArIFwiLFwiICsgKHRoaXMuX3gxID0geDApICsgXCIsXCIgKyAodGhpcy5feTEgPSB5MCk7XG4gICAgfVxuXG4gICAgLy8gSXMgdGhpcyBhcmMgbm9uLWVtcHR5PyBEcmF3IGFuIGFyYyFcbiAgICBlbHNlIGlmIChkYSA+IGVwc2lsb24pIHtcbiAgICAgIHRoaXMuXyArPSBcIkFcIiArIHIgKyBcIixcIiArIHIgKyBcIiwwLFwiICsgKCsoZGEgPj0gcGkpKSArIFwiLFwiICsgY3cgKyBcIixcIiArICh0aGlzLl94MSA9IHggKyByICogTWF0aC5jb3MoYTEpKSArIFwiLFwiICsgKHRoaXMuX3kxID0geSArIHIgKiBNYXRoLnNpbihhMSkpO1xuICAgIH1cbiAgfSxcbiAgcmVjdDogZnVuY3Rpb24oeCwgeSwgdywgaCkge1xuICAgIHRoaXMuXyArPSBcIk1cIiArICh0aGlzLl94MCA9IHRoaXMuX3gxID0gK3gpICsgXCIsXCIgKyAodGhpcy5feTAgPSB0aGlzLl95MSA9ICt5KSArIFwiaFwiICsgKCt3KSArIFwidlwiICsgKCtoKSArIFwiaFwiICsgKC13KSArIFwiWlwiO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuXztcbiAgfVxufTtcblxuZXhwb3J0cy5wYXRoID0gcGF0aDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtcmVxdWVzdC8gVmVyc2lvbiAxLjAuNS4gQ29weXJpZ2h0IDIwMTcgTWlrZSBCb3N0b2NrLlxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCdkMy1jb2xsZWN0aW9uJyksIHJlcXVpcmUoJ2QzLWRpc3BhdGNoJyksIHJlcXVpcmUoJ2QzLWRzdicpKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAnZDMtY29sbGVjdGlvbicsICdkMy1kaXNwYXRjaCcsICdkMy1kc3YnXSwgZmFjdG9yeSkgOlxuXHQoZmFjdG9yeSgoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSxnbG9iYWwuZDMsZ2xvYmFsLmQzLGdsb2JhbC5kMykpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMsZDNDb2xsZWN0aW9uLGQzRGlzcGF0Y2gsZDNEc3YpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVxdWVzdCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QsXG4gICAgICBldmVudCA9IGQzRGlzcGF0Y2guZGlzcGF0Y2goXCJiZWZvcmVzZW5kXCIsIFwicHJvZ3Jlc3NcIiwgXCJsb2FkXCIsIFwiZXJyb3JcIiksXG4gICAgICBtaW1lVHlwZSxcbiAgICAgIGhlYWRlcnMgPSBkM0NvbGxlY3Rpb24ubWFwKCksXG4gICAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QsXG4gICAgICB1c2VyID0gbnVsbCxcbiAgICAgIHBhc3N3b3JkID0gbnVsbCxcbiAgICAgIHJlc3BvbnNlLFxuICAgICAgcmVzcG9uc2VUeXBlLFxuICAgICAgdGltZW91dCA9IDA7XG5cbiAgLy8gSWYgSUUgZG9lcyBub3Qgc3VwcG9ydCBDT1JTLCB1c2UgWERvbWFpblJlcXVlc3QuXG4gIGlmICh0eXBlb2YgWERvbWFpblJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICYmICEoXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiB4aHIpXG4gICAgICAmJiAvXihodHRwKHMpPzopP1xcL1xcLy8udGVzdCh1cmwpKSB4aHIgPSBuZXcgWERvbWFpblJlcXVlc3Q7XG5cbiAgXCJvbmxvYWRcIiBpbiB4aHJcbiAgICAgID8geGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0geGhyLm9udGltZW91dCA9IHJlc3BvbmRcbiAgICAgIDogeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKG8pIHsgeGhyLnJlYWR5U3RhdGUgPiAzICYmIHJlc3BvbmQobyk7IH07XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChvKSB7XG4gICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXMsIHJlc3VsdDtcbiAgICBpZiAoIXN0YXR1cyAmJiBoYXNSZXNwb25zZSh4aHIpXG4gICAgICAgIHx8IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwXG4gICAgICAgIHx8IHN0YXR1cyA9PT0gMzA0KSB7XG4gICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSByZXNwb25zZS5jYWxsKHJlcXVlc3QsIHhocik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBldmVudC5jYWxsKFwiZXJyb3JcIiwgcmVxdWVzdCwgZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB4aHI7XG4gICAgICB9XG4gICAgICBldmVudC5jYWxsKFwibG9hZFwiLCByZXF1ZXN0LCByZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudC5jYWxsKFwiZXJyb3JcIiwgcmVxdWVzdCwgbyk7XG4gICAgfVxuICB9XG5cbiAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgZXZlbnQuY2FsbChcInByb2dyZXNzXCIsIHJlcXVlc3QsIGUpO1xuICB9O1xuXG4gIHJlcXVlc3QgPSB7XG4gICAgaGVhZGVyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgICAgbmFtZSA9IChuYW1lICsgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIGhlYWRlcnMuZ2V0KG5hbWUpO1xuICAgICAgaWYgKHZhbHVlID09IG51bGwpIGhlYWRlcnMucmVtb3ZlKG5hbWUpO1xuICAgICAgZWxzZSBoZWFkZXJzLnNldChuYW1lLCB2YWx1ZSArIFwiXCIpO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfSxcblxuICAgIC8vIElmIG1pbWVUeXBlIGlzIG5vbi1udWxsIGFuZCBubyBBY2NlcHQgaGVhZGVyIGlzIHNldCwgYSBkZWZhdWx0IGlzIHVzZWQuXG4gICAgbWltZVR5cGU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBtaW1lVHlwZTtcbiAgICAgIG1pbWVUeXBlID0gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZSArIFwiXCI7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgLy8gU3BlY2lmaWVzIHdoYXQgdHlwZSB0aGUgcmVzcG9uc2UgdmFsdWUgc2hvdWxkIHRha2U7XG4gICAgLy8gZm9yIGluc3RhbmNlLCBhcnJheWJ1ZmZlciwgYmxvYiwgZG9jdW1lbnQsIG9yIHRleHQuXG4gICAgcmVzcG9uc2VUeXBlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmVzcG9uc2VUeXBlO1xuICAgICAgcmVzcG9uc2VUeXBlID0gdmFsdWU7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgdGltZW91dDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRpbWVvdXQ7XG4gICAgICB0aW1lb3V0ID0gK3ZhbHVlO1xuICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgfSxcblxuICAgIHVzZXI6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDEgPyB1c2VyIDogKHVzZXIgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHZhbHVlICsgXCJcIiwgcmVxdWVzdCk7XG4gICAgfSxcblxuICAgIHBhc3N3b3JkOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAxID8gcGFzc3dvcmQgOiAocGFzc3dvcmQgPSB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHZhbHVlICsgXCJcIiwgcmVxdWVzdCk7XG4gICAgfSxcblxuICAgIC8vIFNwZWNpZnkgaG93IHRvIGNvbnZlcnQgdGhlIHJlc3BvbnNlIGNvbnRlbnQgdG8gYSBzcGVjaWZpYyB0eXBlO1xuICAgIC8vIGNoYW5nZXMgdGhlIGNhbGxiYWNrIHZhbHVlIG9uIFwibG9hZFwiIGV2ZW50cy5cbiAgICByZXNwb25zZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJlc3BvbnNlID0gdmFsdWU7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgLy8gQWxpYXMgZm9yIHNlbmQoXCJHRVRcIiwg4oCmKS5cbiAgICBnZXQ6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdC5zZW5kKFwiR0VUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8gQWxpYXMgZm9yIHNlbmQoXCJQT1NUXCIsIOKApikuXG4gICAgcG9zdDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiByZXF1ZXN0LnNlbmQoXCJQT1NUXCIsIGRhdGEsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLy8gSWYgY2FsbGJhY2sgaXMgbm9uLW51bGwsIGl0IHdpbGwgYmUgdXNlZCBmb3IgZXJyb3IgYW5kIGxvYWQgZXZlbnRzLlxuICAgIHNlbmQ6IGZ1bmN0aW9uKG1ldGhvZCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlLCB1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAobWltZVR5cGUgIT0gbnVsbCAmJiAhaGVhZGVycy5oYXMoXCJhY2NlcHRcIikpIGhlYWRlcnMuc2V0KFwiYWNjZXB0XCIsIG1pbWVUeXBlICsgXCIsKi8qXCIpO1xuICAgICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSBoZWFkZXJzLmVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpOyB9KTtcbiAgICAgIGlmIChtaW1lVHlwZSAhPSBudWxsICYmIHhoci5vdmVycmlkZU1pbWVUeXBlKSB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lVHlwZSk7XG4gICAgICBpZiAocmVzcG9uc2VUeXBlICE9IG51bGwpIHhoci5yZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGU7XG4gICAgICBpZiAodGltZW91dCA+IDApIHhoci50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIHR5cGVvZiBkYXRhID09PSBcImZ1bmN0aW9uXCIpIGNhbGxiYWNrID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiBjYWxsYmFjay5sZW5ndGggPT09IDEpIGNhbGxiYWNrID0gZml4Q2FsbGJhY2soY2FsbGJhY2spO1xuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHJlcXVlc3Qub24oXCJlcnJvclwiLCBjYWxsYmFjaykub24oXCJsb2FkXCIsIGZ1bmN0aW9uKHhocikgeyBjYWxsYmFjayhudWxsLCB4aHIpOyB9KTtcbiAgICAgIGV2ZW50LmNhbGwoXCJiZWZvcmVzZW5kXCIsIHJlcXVlc3QsIHhocik7XG4gICAgICB4aHIuc2VuZChkYXRhID09IG51bGwgPyBudWxsIDogZGF0YSk7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgeGhyLmFib3J0KCk7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gZXZlbnQub24uYXBwbHkoZXZlbnQsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IGV2ZW50ID8gcmVxdWVzdCA6IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0O1xufTtcblxuZnVuY3Rpb24gZml4Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCB4aHIpIHtcbiAgICBjYWxsYmFjayhlcnJvciA9PSBudWxsID8geGhyIDogbnVsbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGhhc1Jlc3BvbnNlKHhocikge1xuICB2YXIgdHlwZSA9IHhoci5yZXNwb25zZVR5cGU7XG4gIHJldHVybiB0eXBlICYmIHR5cGUgIT09IFwidGV4dFwiXG4gICAgICA/IHhoci5yZXNwb25zZSAvLyBudWxsIG9uIGVycm9yXG4gICAgICA6IHhoci5yZXNwb25zZVRleHQ7IC8vIFwiXCIgb24gZXJyb3Jcbn1cblxudmFyIHR5cGUgPSBmdW5jdGlvbihkZWZhdWx0TWltZVR5cGUsIHJlc3BvbnNlKSB7XG4gIHJldHVybiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHIgPSByZXF1ZXN0KHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKS5yZXNwb25zZShyZXNwb25zZSk7XG4gICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgICByZXR1cm4gci5nZXQoY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfTtcbn07XG5cbnZhciBodG1sID0gdHlwZShcInRleHQvaHRtbFwiLCBmdW5jdGlvbih4aHIpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHhoci5yZXNwb25zZVRleHQpO1xufSk7XG5cbnZhciBqc29uID0gdHlwZShcImFwcGxpY2F0aW9uL2pzb25cIiwgZnVuY3Rpb24oeGhyKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xufSk7XG5cbnZhciB0ZXh0ID0gdHlwZShcInRleHQvcGxhaW5cIiwgZnVuY3Rpb24oeGhyKSB7XG4gIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xufSk7XG5cbnZhciB4bWwgPSB0eXBlKFwiYXBwbGljYXRpb24veG1sXCIsIGZ1bmN0aW9uKHhocikge1xuICB2YXIgeG1sID0geGhyLnJlc3BvbnNlWE1MO1xuICBpZiAoIXhtbCkgdGhyb3cgbmV3IEVycm9yKFwicGFyc2UgZXJyb3JcIik7XG4gIHJldHVybiB4bWw7XG59KTtcblxudmFyIGRzdiA9IGZ1bmN0aW9uKGRlZmF1bHRNaW1lVHlwZSwgcGFyc2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHVybCwgcm93LCBjYWxsYmFjaykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgY2FsbGJhY2sgPSByb3csIHJvdyA9IG51bGw7XG4gICAgdmFyIHIgPSByZXF1ZXN0KHVybCkubWltZVR5cGUoZGVmYXVsdE1pbWVUeXBlKTtcbiAgICByLnJvdyA9IGZ1bmN0aW9uKF8pIHsgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyByLnJlc3BvbnNlKHJlc3BvbnNlT2YocGFyc2UsIHJvdyA9IF8pKSA6IHJvdzsgfTtcbiAgICByLnJvdyhyb3cpO1xuICAgIHJldHVybiBjYWxsYmFjayA/IHIuZ2V0KGNhbGxiYWNrKSA6IHI7XG4gIH07XG59O1xuXG5mdW5jdGlvbiByZXNwb25zZU9mKHBhcnNlLCByb3cpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHJlcXVlc3QkJDEpIHtcbiAgICByZXR1cm4gcGFyc2UocmVxdWVzdCQkMS5yZXNwb25zZVRleHQsIHJvdyk7XG4gIH07XG59XG5cbnZhciBjc3YgPSBkc3YoXCJ0ZXh0L2NzdlwiLCBkM0Rzdi5jc3ZQYXJzZSk7XG5cbnZhciB0c3YgPSBkc3YoXCJ0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzXCIsIGQzRHN2LnRzdlBhcnNlKTtcblxuZXhwb3J0cy5yZXF1ZXN0ID0gcmVxdWVzdDtcbmV4cG9ydHMuaHRtbCA9IGh0bWw7XG5leHBvcnRzLmpzb24gPSBqc29uO1xuZXhwb3J0cy50ZXh0ID0gdGV4dDtcbmV4cG9ydHMueG1sID0geG1sO1xuZXhwb3J0cy5jc3YgPSBjc3Y7XG5leHBvcnRzLnRzdiA9IHRzdjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtc2NhbGUvIFZlcnNpb24gMS4wLjYuIENvcHlyaWdodCAyMDE3IE1pa2UgQm9zdG9jay5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cywgcmVxdWlyZSgnZDMtYXJyYXknKSwgcmVxdWlyZSgnZDMtY29sbGVjdGlvbicpLCByZXF1aXJlKCdkMy1pbnRlcnBvbGF0ZScpLCByZXF1aXJlKCdkMy1mb3JtYXQnKSwgcmVxdWlyZSgnZDMtdGltZScpLCByZXF1aXJlKCdkMy10aW1lLWZvcm1hdCcpLCByZXF1aXJlKCdkMy1jb2xvcicpKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAnZDMtYXJyYXknLCAnZDMtY29sbGVjdGlvbicsICdkMy1pbnRlcnBvbGF0ZScsICdkMy1mb3JtYXQnLCAnZDMtdGltZScsICdkMy10aW1lLWZvcm1hdCcsICdkMy1jb2xvciddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pLGdsb2JhbC5kMyxnbG9iYWwuZDMsZ2xvYmFsLmQzLGdsb2JhbC5kMyxnbG9iYWwuZDMsZ2xvYmFsLmQzLGdsb2JhbC5kMykpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMsZDNBcnJheSxkM0NvbGxlY3Rpb24sZDNJbnRlcnBvbGF0ZSxkM0Zvcm1hdCxkM1RpbWUsZDNUaW1lRm9ybWF0LGQzQ29sb3IpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyYXkgPSBBcnJheS5wcm90b3R5cGU7XG5cbnZhciBtYXAkMSA9IGFycmF5Lm1hcDtcbnZhciBzbGljZSA9IGFycmF5LnNsaWNlO1xuXG52YXIgaW1wbGljaXQgPSB7bmFtZTogXCJpbXBsaWNpdFwifTtcblxuZnVuY3Rpb24gb3JkaW5hbChyYW5nZSQkMSkge1xuICB2YXIgaW5kZXggPSBkM0NvbGxlY3Rpb24ubWFwKCksXG4gICAgICBkb21haW4gPSBbXSxcbiAgICAgIHVua25vd24gPSBpbXBsaWNpdDtcblxuICByYW5nZSQkMSA9IHJhbmdlJCQxID09IG51bGwgPyBbXSA6IHNsaWNlLmNhbGwocmFuZ2UkJDEpO1xuXG4gIGZ1bmN0aW9uIHNjYWxlKGQpIHtcbiAgICB2YXIga2V5ID0gZCArIFwiXCIsIGkgPSBpbmRleC5nZXQoa2V5KTtcbiAgICBpZiAoIWkpIHtcbiAgICAgIGlmICh1bmtub3duICE9PSBpbXBsaWNpdCkgcmV0dXJuIHVua25vd247XG4gICAgICBpbmRleC5zZXQoa2V5LCBpID0gZG9tYWluLnB1c2goZCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmFuZ2UkJDFbKGkgLSAxKSAlIHJhbmdlJCQxLmxlbmd0aF07XG4gIH1cblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgZG9tYWluID0gW10sIGluZGV4ID0gZDNDb2xsZWN0aW9uLm1hcCgpO1xuICAgIHZhciBpID0gLTEsIG4gPSBfLmxlbmd0aCwgZCwga2V5O1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWluZGV4LmhhcyhrZXkgPSAoZCA9IF9baV0pICsgXCJcIikpIGluZGV4LnNldChrZXksIGRvbWFpbi5wdXNoKGQpKTtcbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UkJDEgPSBzbGljZS5jYWxsKF8pLCBzY2FsZSkgOiByYW5nZSQkMS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnVua25vd24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodW5rbm93biA9IF8sIHNjYWxlKSA6IHVua25vd247XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBvcmRpbmFsKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSQkMSlcbiAgICAgICAgLnVua25vd24odW5rbm93bik7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5mdW5jdGlvbiBiYW5kKCkge1xuICB2YXIgc2NhbGUgPSBvcmRpbmFsKCkudW5rbm93bih1bmRlZmluZWQpLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluLFxuICAgICAgb3JkaW5hbFJhbmdlID0gc2NhbGUucmFuZ2UsXG4gICAgICByYW5nZSQkMSA9IFswLCAxXSxcbiAgICAgIHN0ZXAsXG4gICAgICBiYW5kd2lkdGgsXG4gICAgICByb3VuZCA9IGZhbHNlLFxuICAgICAgcGFkZGluZ0lubmVyID0gMCxcbiAgICAgIHBhZGRpbmdPdXRlciA9IDAsXG4gICAgICBhbGlnbiA9IDAuNTtcblxuICBkZWxldGUgc2NhbGUudW5rbm93bjtcblxuICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgIHZhciBuID0gZG9tYWluKCkubGVuZ3RoLFxuICAgICAgICByZXZlcnNlID0gcmFuZ2UkJDFbMV0gPCByYW5nZSQkMVswXSxcbiAgICAgICAgc3RhcnQgPSByYW5nZSQkMVtyZXZlcnNlIC0gMF0sXG4gICAgICAgIHN0b3AgPSByYW5nZSQkMVsxIC0gcmV2ZXJzZV07XG4gICAgc3RlcCA9IChzdG9wIC0gc3RhcnQpIC8gTWF0aC5tYXgoMSwgbiAtIHBhZGRpbmdJbm5lciArIHBhZGRpbmdPdXRlciAqIDIpO1xuICAgIGlmIChyb3VuZCkgc3RlcCA9IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgc3RhcnQgKz0gKHN0b3AgLSBzdGFydCAtIHN0ZXAgKiAobiAtIHBhZGRpbmdJbm5lcikpICogYWxpZ247XG4gICAgYmFuZHdpZHRoID0gc3RlcCAqICgxIC0gcGFkZGluZ0lubmVyKTtcbiAgICBpZiAocm91bmQpIHN0YXJ0ID0gTWF0aC5yb3VuZChzdGFydCksIGJhbmR3aWR0aCA9IE1hdGgucm91bmQoYmFuZHdpZHRoKTtcbiAgICB2YXIgdmFsdWVzID0gZDNBcnJheS5yYW5nZShuKS5tYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gc3RhcnQgKyBzdGVwICogaTsgfSk7XG4gICAgcmV0dXJuIG9yZGluYWxSYW5nZShyZXZlcnNlID8gdmFsdWVzLnJldmVyc2UoKSA6IHZhbHVlcyk7XG4gIH1cblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZG9tYWluKF8pLCByZXNjYWxlKCkpIDogZG9tYWluKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UkJDEgPSBbK19bMF0sICtfWzFdXSwgcmVzY2FsZSgpKSA6IHJhbmdlJCQxLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2VSb3VuZCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gcmFuZ2UkJDEgPSBbK19bMF0sICtfWzFdXSwgcm91bmQgPSB0cnVlLCByZXNjYWxlKCk7XG4gIH07XG5cbiAgc2NhbGUuYmFuZHdpZHRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJhbmR3aWR0aDtcbiAgfTtcblxuICBzY2FsZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN0ZXA7XG4gIH07XG5cbiAgc2NhbGUucm91bmQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocm91bmQgPSAhIV8sIHJlc2NhbGUoKSkgOiByb3VuZDtcbiAgfTtcblxuICBzY2FsZS5wYWRkaW5nID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHBhZGRpbmdJbm5lciA9IHBhZGRpbmdPdXRlciA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIF8pKSwgcmVzY2FsZSgpKSA6IHBhZGRpbmdJbm5lcjtcbiAgfTtcblxuICBzY2FsZS5wYWRkaW5nSW5uZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocGFkZGluZ0lubmVyID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgXykpLCByZXNjYWxlKCkpIDogcGFkZGluZ0lubmVyO1xuICB9O1xuXG4gIHNjYWxlLnBhZGRpbmdPdXRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChwYWRkaW5nT3V0ZXIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBfKSksIHJlc2NhbGUoKSkgOiBwYWRkaW5nT3V0ZXI7XG4gIH07XG5cbiAgc2NhbGUuYWxpZ24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoYWxpZ24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBfKSksIHJlc2NhbGUoKSkgOiBhbGlnbjtcbiAgfTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJhbmQoKVxuICAgICAgICAuZG9tYWluKGRvbWFpbigpKVxuICAgICAgICAucmFuZ2UocmFuZ2UkJDEpXG4gICAgICAgIC5yb3VuZChyb3VuZClcbiAgICAgICAgLnBhZGRpbmdJbm5lcihwYWRkaW5nSW5uZXIpXG4gICAgICAgIC5wYWRkaW5nT3V0ZXIocGFkZGluZ091dGVyKVxuICAgICAgICAuYWxpZ24oYWxpZ24pO1xuICB9O1xuXG4gIHJldHVybiByZXNjYWxlKCk7XG59XG5cbmZ1bmN0aW9uIHBvaW50aXNoKHNjYWxlKSB7XG4gIHZhciBjb3B5ID0gc2NhbGUuY29weTtcblxuICBzY2FsZS5wYWRkaW5nID0gc2NhbGUucGFkZGluZ091dGVyO1xuICBkZWxldGUgc2NhbGUucGFkZGluZ0lubmVyO1xuICBkZWxldGUgc2NhbGUucGFkZGluZ091dGVyO1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcG9pbnRpc2goY29weSgpKTtcbiAgfTtcblxuICByZXR1cm4gc2NhbGU7XG59XG5cbmZ1bmN0aW9uIHBvaW50KCkge1xuICByZXR1cm4gcG9pbnRpc2goYmFuZCgpLnBhZGRpbmdJbm5lcigxKSk7XG59XG5cbnZhciBjb25zdGFudCA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufTtcblxudmFyIG51bWJlciA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuICt4O1xufTtcblxudmFyIHVuaXQgPSBbMCwgMV07XG5cbmZ1bmN0aW9uIGRlaW50ZXJwb2xhdGVMaW5lYXIoYSwgYikge1xuICByZXR1cm4gKGIgLT0gKGEgPSArYSkpXG4gICAgICA/IGZ1bmN0aW9uKHgpIHsgcmV0dXJuICh4IC0gYSkgLyBiOyB9XG4gICAgICA6IGNvbnN0YW50KGIpO1xufVxuXG5mdW5jdGlvbiBkZWludGVycG9sYXRlQ2xhbXAoZGVpbnRlcnBvbGF0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBkID0gZGVpbnRlcnBvbGF0ZShhID0gK2EsIGIgPSArYik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPD0gYSA/IDAgOiB4ID49IGIgPyAxIDogZCh4KTsgfTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVpbnRlcnBvbGF0ZUNsYW1wKHJlaW50ZXJwb2xhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgciA9IHJlaW50ZXJwb2xhdGUoYSA9ICthLCBiID0gK2IpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiB0IDw9IDAgPyBhIDogdCA+PSAxID8gYiA6IHIodCk7IH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJpbWFwKGRvbWFpbiwgcmFuZ2UkJDEsIGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpIHtcbiAgdmFyIGQwID0gZG9tYWluWzBdLCBkMSA9IGRvbWFpblsxXSwgcjAgPSByYW5nZSQkMVswXSwgcjEgPSByYW5nZSQkMVsxXTtcbiAgaWYgKGQxIDwgZDApIGQwID0gZGVpbnRlcnBvbGF0ZShkMSwgZDApLCByMCA9IHJlaW50ZXJwb2xhdGUocjEsIHIwKTtcbiAgZWxzZSBkMCA9IGRlaW50ZXJwb2xhdGUoZDAsIGQxKSwgcjAgPSByZWludGVycG9sYXRlKHIwLCByMSk7XG4gIHJldHVybiBmdW5jdGlvbih4KSB7IHJldHVybiByMChkMCh4KSk7IH07XG59XG5cbmZ1bmN0aW9uIHBvbHltYXAoZG9tYWluLCByYW5nZSQkMSwgZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSkge1xuICB2YXIgaiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlJCQxLmxlbmd0aCkgLSAxLFxuICAgICAgZCA9IG5ldyBBcnJheShqKSxcbiAgICAgIHIgPSBuZXcgQXJyYXkoaiksXG4gICAgICBpID0gLTE7XG5cbiAgLy8gUmV2ZXJzZSBkZXNjZW5kaW5nIGRvbWFpbnMuXG4gIGlmIChkb21haW5bal0gPCBkb21haW5bMF0pIHtcbiAgICBkb21haW4gPSBkb21haW4uc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgcmFuZ2UkJDEgPSByYW5nZSQkMS5zbGljZSgpLnJldmVyc2UoKTtcbiAgfVxuXG4gIHdoaWxlICgrK2kgPCBqKSB7XG4gICAgZFtpXSA9IGRlaW50ZXJwb2xhdGUoZG9tYWluW2ldLCBkb21haW5baSArIDFdKTtcbiAgICByW2ldID0gcmVpbnRlcnBvbGF0ZShyYW5nZSQkMVtpXSwgcmFuZ2UkJDFbaSArIDFdKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGkgPSBkM0FycmF5LmJpc2VjdChkb21haW4sIHgsIDEsIGopIC0gMTtcbiAgICByZXR1cm4gcltpXShkW2ldKHgpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29weShzb3VyY2UsIHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0XG4gICAgICAuZG9tYWluKHNvdXJjZS5kb21haW4oKSlcbiAgICAgIC5yYW5nZShzb3VyY2UucmFuZ2UoKSlcbiAgICAgIC5pbnRlcnBvbGF0ZShzb3VyY2UuaW50ZXJwb2xhdGUoKSlcbiAgICAgIC5jbGFtcChzb3VyY2UuY2xhbXAoKSk7XG59XG5cbi8vIGRlaW50ZXJwb2xhdGUoYSwgYikoeCkgdGFrZXMgYSBkb21haW4gdmFsdWUgeCBpbiBbYSxiXSBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBwYXJhbWV0ZXIgdCBpbiBbMCwxXS5cbi8vIHJlaW50ZXJwb2xhdGUoYSwgYikodCkgdGFrZXMgYSBwYXJhbWV0ZXIgdCBpbiBbMCwxXSBhbmQgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBkb21haW4gdmFsdWUgeCBpbiBbYSxiXS5cbmZ1bmN0aW9uIGNvbnRpbnVvdXMoZGVpbnRlcnBvbGF0ZSwgcmVpbnRlcnBvbGF0ZSkge1xuICB2YXIgZG9tYWluID0gdW5pdCxcbiAgICAgIHJhbmdlJCQxID0gdW5pdCxcbiAgICAgIGludGVycG9sYXRlJCQxID0gZDNJbnRlcnBvbGF0ZS5pbnRlcnBvbGF0ZSxcbiAgICAgIGNsYW1wID0gZmFsc2UsXG4gICAgICBwaWVjZXdpc2UsXG4gICAgICBvdXRwdXQsXG4gICAgICBpbnB1dDtcblxuICBmdW5jdGlvbiByZXNjYWxlKCkge1xuICAgIHBpZWNld2lzZSA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlJCQxLmxlbmd0aCkgPiAyID8gcG9seW1hcCA6IGJpbWFwO1xuICAgIG91dHB1dCA9IGlucHV0ID0gbnVsbDtcbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgcmV0dXJuIChvdXRwdXQgfHwgKG91dHB1dCA9IHBpZWNld2lzZShkb21haW4sIHJhbmdlJCQxLCBjbGFtcCA/IGRlaW50ZXJwb2xhdGVDbGFtcChkZWludGVycG9sYXRlKSA6IGRlaW50ZXJwb2xhdGUsIGludGVycG9sYXRlJCQxKSkpKCt4KTtcbiAgfVxuXG4gIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4gKGlucHV0IHx8IChpbnB1dCA9IHBpZWNld2lzZShyYW5nZSQkMSwgZG9tYWluLCBkZWludGVycG9sYXRlTGluZWFyLCBjbGFtcCA/IHJlaW50ZXJwb2xhdGVDbGFtcChyZWludGVycG9sYXRlKSA6IHJlaW50ZXJwb2xhdGUpKSkoK3kpO1xuICB9O1xuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkb21haW4gPSBtYXAkMS5jYWxsKF8sIG51bWJlciksIHJlc2NhbGUoKSkgOiBkb21haW4uc2xpY2UoKTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSQkMSA9IHNsaWNlLmNhbGwoXyksIHJlc2NhbGUoKSkgOiByYW5nZSQkMS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlUm91bmQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIHJhbmdlJCQxID0gc2xpY2UuY2FsbChfKSwgaW50ZXJwb2xhdGUkJDEgPSBkM0ludGVycG9sYXRlLmludGVycG9sYXRlUm91bmQsIHJlc2NhbGUoKTtcbiAgfTtcblxuICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGFtcCA9ICEhXywgcmVzY2FsZSgpKSA6IGNsYW1wO1xuICB9O1xuXG4gIHNjYWxlLmludGVycG9sYXRlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGludGVycG9sYXRlJCQxID0gXywgcmVzY2FsZSgpKSA6IGludGVycG9sYXRlJCQxO1xuICB9O1xuXG4gIHJldHVybiByZXNjYWxlKCk7XG59XG5cbnZhciB0aWNrRm9ybWF0ID0gZnVuY3Rpb24oZG9tYWluLCBjb3VudCwgc3BlY2lmaWVyKSB7XG4gIHZhciBzdGFydCA9IGRvbWFpblswXSxcbiAgICAgIHN0b3AgPSBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdLFxuICAgICAgc3RlcCA9IGQzQXJyYXkudGlja1N0ZXAoc3RhcnQsIHN0b3AsIGNvdW50ID09IG51bGwgPyAxMCA6IGNvdW50KSxcbiAgICAgIHByZWNpc2lvbjtcbiAgc3BlY2lmaWVyID0gZDNGb3JtYXQuZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciA9PSBudWxsID8gXCIsZlwiIDogc3BlY2lmaWVyKTtcbiAgc3dpdGNoIChzcGVjaWZpZXIudHlwZSkge1xuICAgIGNhc2UgXCJzXCI6IHtcbiAgICAgIHZhciB2YWx1ZSA9IE1hdGgubWF4KE1hdGguYWJzKHN0YXJ0KSwgTWF0aC5hYnMoc3RvcCkpO1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gZDNGb3JtYXQucHJlY2lzaW9uUHJlZml4KHN0ZXAsIHZhbHVlKSkpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb247XG4gICAgICByZXR1cm4gZDNGb3JtYXQuZm9ybWF0UHJlZml4KHNwZWNpZmllciwgdmFsdWUpO1xuICAgIH1cbiAgICBjYXNlIFwiXCI6XG4gICAgY2FzZSBcImVcIjpcbiAgICBjYXNlIFwiZ1wiOlxuICAgIGNhc2UgXCJwXCI6XG4gICAgY2FzZSBcInJcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gZDNGb3JtYXQucHJlY2lzaW9uUm91bmQoc3RlcCwgTWF0aC5tYXgoTWF0aC5hYnMoc3RhcnQpLCBNYXRoLmFicyhzdG9wKSkpKSkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvbiAtIChzcGVjaWZpZXIudHlwZSA9PT0gXCJlXCIpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJmXCI6XG4gICAgY2FzZSBcIiVcIjoge1xuICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCAmJiAhaXNOYU4ocHJlY2lzaW9uID0gZDNGb3JtYXQucHJlY2lzaW9uRml4ZWQoc3RlcCkpKSBzcGVjaWZpZXIucHJlY2lzaW9uID0gcHJlY2lzaW9uIC0gKHNwZWNpZmllci50eXBlID09PSBcIiVcIikgKiAyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBkM0Zvcm1hdC5mb3JtYXQoc3BlY2lmaWVyKTtcbn07XG5cbmZ1bmN0aW9uIGxpbmVhcmlzaChzY2FsZSkge1xuICB2YXIgZG9tYWluID0gc2NhbGUuZG9tYWluO1xuXG4gIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICB2YXIgZCA9IGRvbWFpbigpO1xuICAgIHJldHVybiBkM0FycmF5LnRpY2tzKGRbMF0sIGRbZC5sZW5ndGggLSAxXSwgY291bnQgPT0gbnVsbCA/IDEwIDogY291bnQpO1xuICB9O1xuXG4gIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIHRpY2tGb3JtYXQoZG9tYWluKCksIGNvdW50LCBzcGVjaWZpZXIpO1xuICB9O1xuXG4gIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsKSBjb3VudCA9IDEwO1xuXG4gICAgdmFyIGQgPSBkb21haW4oKSxcbiAgICAgICAgaTAgPSAwLFxuICAgICAgICBpMSA9IGQubGVuZ3RoIC0gMSxcbiAgICAgICAgc3RhcnQgPSBkW2kwXSxcbiAgICAgICAgc3RvcCA9IGRbaTFdLFxuICAgICAgICBzdGVwO1xuXG4gICAgaWYgKHN0b3AgPCBzdGFydCkge1xuICAgICAgc3RlcCA9IHN0YXJ0LCBzdGFydCA9IHN0b3AsIHN0b3AgPSBzdGVwO1xuICAgICAgc3RlcCA9IGkwLCBpMCA9IGkxLCBpMSA9IHN0ZXA7XG4gICAgfVxuXG4gICAgc3RlcCA9IGQzQXJyYXkudGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpO1xuXG4gICAgaWYgKHN0ZXAgPiAwKSB7XG4gICAgICBzdGFydCA9IE1hdGguZmxvb3Ioc3RhcnQgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICBzdG9wID0gTWF0aC5jZWlsKHN0b3AgLyBzdGVwKSAqIHN0ZXA7XG4gICAgICBzdGVwID0gZDNBcnJheS50aWNrSW5jcmVtZW50KHN0YXJ0LCBzdG9wLCBjb3VudCk7XG4gICAgfSBlbHNlIGlmIChzdGVwIDwgMCkge1xuICAgICAgc3RhcnQgPSBNYXRoLmNlaWwoc3RhcnQgKiBzdGVwKSAvIHN0ZXA7XG4gICAgICBzdG9wID0gTWF0aC5mbG9vcihzdG9wICogc3RlcCkgLyBzdGVwO1xuICAgICAgc3RlcCA9IGQzQXJyYXkudGlja0luY3JlbWVudChzdGFydCwgc3RvcCwgY291bnQpO1xuICAgIH1cblxuICAgIGlmIChzdGVwID4gMCkge1xuICAgICAgZFtpMF0gPSBNYXRoLmZsb29yKHN0YXJ0IC8gc3RlcCkgKiBzdGVwO1xuICAgICAgZFtpMV0gPSBNYXRoLmNlaWwoc3RvcCAvIHN0ZXApICogc3RlcDtcbiAgICAgIGRvbWFpbihkKTtcbiAgICB9IGVsc2UgaWYgKHN0ZXAgPCAwKSB7XG4gICAgICBkW2kwXSA9IE1hdGguY2VpbChzdGFydCAqIHN0ZXApIC8gc3RlcDtcbiAgICAgIGRbaTFdID0gTWF0aC5mbG9vcihzdG9wICogc3RlcCkgLyBzdGVwO1xuICAgICAgZG9tYWluKGQpO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfTtcblxuICByZXR1cm4gc2NhbGU7XG59XG5cbmZ1bmN0aW9uIGxpbmVhcigpIHtcbiAgdmFyIHNjYWxlID0gY29udGludW91cyhkZWludGVycG9sYXRlTGluZWFyLCBkM0ludGVycG9sYXRlLmludGVycG9sYXRlTnVtYmVyKTtcblxuICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvcHkoc2NhbGUsIGxpbmVhcigpKTtcbiAgfTtcblxuICByZXR1cm4gbGluZWFyaXNoKHNjYWxlKTtcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkoKSB7XG4gIHZhciBkb21haW4gPSBbMCwgMV07XG5cbiAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgIHJldHVybiAreDtcbiAgfVxuXG4gIHNjYWxlLmludmVydCA9IHNjYWxlO1xuXG4gIHNjYWxlLmRvbWFpbiA9IHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRvbWFpbiA9IG1hcCQxLmNhbGwoXywgbnVtYmVyKSwgc2NhbGUpIDogZG9tYWluLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBpZGVudGl0eSgpLmRvbWFpbihkb21haW4pO1xuICB9O1xuXG4gIHJldHVybiBsaW5lYXJpc2goc2NhbGUpO1xufVxuXG52YXIgbmljZSA9IGZ1bmN0aW9uKGRvbWFpbiwgaW50ZXJ2YWwpIHtcbiAgZG9tYWluID0gZG9tYWluLnNsaWNlKCk7XG5cbiAgdmFyIGkwID0gMCxcbiAgICAgIGkxID0gZG9tYWluLmxlbmd0aCAtIDEsXG4gICAgICB4MCA9IGRvbWFpbltpMF0sXG4gICAgICB4MSA9IGRvbWFpbltpMV0sXG4gICAgICB0O1xuXG4gIGlmICh4MSA8IHgwKSB7XG4gICAgdCA9IGkwLCBpMCA9IGkxLCBpMSA9IHQ7XG4gICAgdCA9IHgwLCB4MCA9IHgxLCB4MSA9IHQ7XG4gIH1cblxuICBkb21haW5baTBdID0gaW50ZXJ2YWwuZmxvb3IoeDApO1xuICBkb21haW5baTFdID0gaW50ZXJ2YWwuY2VpbCh4MSk7XG4gIHJldHVybiBkb21haW47XG59O1xuXG5mdW5jdGlvbiBkZWludGVycG9sYXRlKGEsIGIpIHtcbiAgcmV0dXJuIChiID0gTWF0aC5sb2coYiAvIGEpKVxuICAgICAgPyBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLmxvZyh4IC8gYSkgLyBiOyB9XG4gICAgICA6IGNvbnN0YW50KGIpO1xufVxuXG5mdW5jdGlvbiByZWludGVycG9sYXRlKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCAwXG4gICAgICA/IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIC1NYXRoLnBvdygtYiwgdCkgKiBNYXRoLnBvdygtYSwgMSAtIHQpOyB9XG4gICAgICA6IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIE1hdGgucG93KGIsIHQpICogTWF0aC5wb3coYSwgMSAtIHQpOyB9O1xufVxuXG5mdW5jdGlvbiBwb3cxMCh4KSB7XG4gIHJldHVybiBpc0Zpbml0ZSh4KSA/ICsoXCIxZVwiICsgeCkgOiB4IDwgMCA/IDAgOiB4O1xufVxuXG5mdW5jdGlvbiBwb3dwKGJhc2UpIHtcbiAgcmV0dXJuIGJhc2UgPT09IDEwID8gcG93MTBcbiAgICAgIDogYmFzZSA9PT0gTWF0aC5FID8gTWF0aC5leHBcbiAgICAgIDogZnVuY3Rpb24oeCkgeyByZXR1cm4gTWF0aC5wb3coYmFzZSwgeCk7IH07XG59XG5cbmZ1bmN0aW9uIGxvZ3AoYmFzZSkge1xuICByZXR1cm4gYmFzZSA9PT0gTWF0aC5FID8gTWF0aC5sb2dcbiAgICAgIDogYmFzZSA9PT0gMTAgJiYgTWF0aC5sb2cxMFxuICAgICAgfHwgYmFzZSA9PT0gMiAmJiBNYXRoLmxvZzJcbiAgICAgIHx8IChiYXNlID0gTWF0aC5sb2coYmFzZSksIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgubG9nKHgpIC8gYmFzZTsgfSk7XG59XG5cbmZ1bmN0aW9uIHJlZmxlY3QoZikge1xuICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAtZigteCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgdmFyIHNjYWxlID0gY29udGludW91cyhkZWludGVycG9sYXRlLCByZWludGVycG9sYXRlKS5kb21haW4oWzEsIDEwXSksXG4gICAgICBkb21haW4gPSBzY2FsZS5kb21haW4sXG4gICAgICBiYXNlID0gMTAsXG4gICAgICBsb2dzID0gbG9ncCgxMCksXG4gICAgICBwb3dzID0gcG93cCgxMCk7XG5cbiAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICBsb2dzID0gbG9ncChiYXNlKSwgcG93cyA9IHBvd3AoYmFzZSk7XG4gICAgaWYgKGRvbWFpbigpWzBdIDwgMCkgbG9ncyA9IHJlZmxlY3QobG9ncyksIHBvd3MgPSByZWZsZWN0KHBvd3MpO1xuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIHNjYWxlLmJhc2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoYmFzZSA9ICtfLCByZXNjYWxlKCkpIDogYmFzZTtcbiAgfTtcblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZG9tYWluKF8pLCByZXNjYWxlKCkpIDogZG9tYWluKCk7XG4gIH07XG5cbiAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBkID0gZG9tYWluKCksXG4gICAgICAgIHUgPSBkWzBdLFxuICAgICAgICB2ID0gZFtkLmxlbmd0aCAtIDFdLFxuICAgICAgICByO1xuXG4gICAgaWYgKHIgPSB2IDwgdSkgaSA9IHUsIHUgPSB2LCB2ID0gaTtcblxuICAgIHZhciBpID0gbG9ncyh1KSxcbiAgICAgICAgaiA9IGxvZ3ModiksXG4gICAgICAgIHAsXG4gICAgICAgIGssXG4gICAgICAgIHQsXG4gICAgICAgIG4gPSBjb3VudCA9PSBudWxsID8gMTAgOiArY291bnQsXG4gICAgICAgIHogPSBbXTtcblxuICAgIGlmICghKGJhc2UgJSAxKSAmJiBqIC0gaSA8IG4pIHtcbiAgICAgIGkgPSBNYXRoLnJvdW5kKGkpIC0gMSwgaiA9IE1hdGgucm91bmQoaikgKyAxO1xuICAgICAgaWYgKHUgPiAwKSBmb3IgKDsgaSA8IGo7ICsraSkge1xuICAgICAgICBmb3IgKGsgPSAxLCBwID0gcG93cyhpKTsgayA8IGJhc2U7ICsraykge1xuICAgICAgICAgIHQgPSBwICogaztcbiAgICAgICAgICBpZiAodCA8IHUpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmICh0ID4gdikgYnJlYWs7XG4gICAgICAgICAgei5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgZm9yICg7IGkgPCBqOyArK2kpIHtcbiAgICAgICAgZm9yIChrID0gYmFzZSAtIDEsIHAgPSBwb3dzKGkpOyBrID49IDE7IC0taykge1xuICAgICAgICAgIHQgPSBwICogaztcbiAgICAgICAgICBpZiAodCA8IHUpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmICh0ID4gdikgYnJlYWs7XG4gICAgICAgICAgei5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHogPSBkM0FycmF5LnRpY2tzKGksIGosIE1hdGgubWluKGogLSBpLCBuKSkubWFwKHBvd3MpO1xuICAgIH1cblxuICAgIHJldHVybiByID8gei5yZXZlcnNlKCkgOiB6O1xuICB9O1xuXG4gIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgaWYgKHNwZWNpZmllciA9PSBudWxsKSBzcGVjaWZpZXIgPSBiYXNlID09PSAxMCA/IFwiLjBlXCIgOiBcIixcIjtcbiAgICBpZiAodHlwZW9mIHNwZWNpZmllciAhPT0gXCJmdW5jdGlvblwiKSBzcGVjaWZpZXIgPSBkM0Zvcm1hdC5mb3JtYXQoc3BlY2lmaWVyKTtcbiAgICBpZiAoY291bnQgPT09IEluZmluaXR5KSByZXR1cm4gc3BlY2lmaWVyO1xuICAgIGlmIChjb3VudCA9PSBudWxsKSBjb3VudCA9IDEwO1xuICAgIHZhciBrID0gTWF0aC5tYXgoMSwgYmFzZSAqIGNvdW50IC8gc2NhbGUudGlja3MoKS5sZW5ndGgpOyAvLyBUT0RPIGZhc3QgZXN0aW1hdGU/XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcbiAgICAgIHZhciBpID0gZCAvIHBvd3MoTWF0aC5yb3VuZChsb2dzKGQpKSk7XG4gICAgICBpZiAoaSAqIGJhc2UgPCBiYXNlIC0gMC41KSBpICo9IGJhc2U7XG4gICAgICByZXR1cm4gaSA8PSBrID8gc3BlY2lmaWVyKGQpIDogXCJcIjtcbiAgICB9O1xuICB9O1xuXG4gIHNjYWxlLm5pY2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9tYWluKG5pY2UoZG9tYWluKCksIHtcbiAgICAgIGZsb29yOiBmdW5jdGlvbih4KSB7IHJldHVybiBwb3dzKE1hdGguZmxvb3IobG9ncyh4KSkpOyB9LFxuICAgICAgY2VpbDogZnVuY3Rpb24oeCkgeyByZXR1cm4gcG93cyhNYXRoLmNlaWwobG9ncyh4KSkpOyB9XG4gICAgfSkpO1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29weShzY2FsZSwgbG9nKCkuYmFzZShiYXNlKSk7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5mdW5jdGlvbiByYWlzZSh4LCBleHBvbmVudCkge1xuICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIGV4cG9uZW50KTtcbn1cblxuZnVuY3Rpb24gcG93KCkge1xuICB2YXIgZXhwb25lbnQgPSAxLFxuICAgICAgc2NhbGUgPSBjb250aW51b3VzKGRlaW50ZXJwb2xhdGUsIHJlaW50ZXJwb2xhdGUpLFxuICAgICAgZG9tYWluID0gc2NhbGUuZG9tYWluO1xuXG4gIGZ1bmN0aW9uIGRlaW50ZXJwb2xhdGUoYSwgYikge1xuICAgIHJldHVybiAoYiA9IHJhaXNlKGIsIGV4cG9uZW50KSAtIChhID0gcmFpc2UoYSwgZXhwb25lbnQpKSlcbiAgICAgICAgPyBmdW5jdGlvbih4KSB7IHJldHVybiAocmFpc2UoeCwgZXhwb25lbnQpIC0gYSkgLyBiOyB9XG4gICAgICAgIDogY29uc3RhbnQoYik7XG4gIH1cblxuICBmdW5jdGlvbiByZWludGVycG9sYXRlKGEsIGIpIHtcbiAgICBiID0gcmFpc2UoYiwgZXhwb25lbnQpIC0gKGEgPSByYWlzZShhLCBleHBvbmVudCkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7IHJldHVybiByYWlzZShhICsgYiAqIHQsIDEgLyBleHBvbmVudCk7IH07XG4gIH1cblxuICBzY2FsZS5leHBvbmVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleHBvbmVudCA9ICtfLCBkb21haW4oZG9tYWluKCkpKSA6IGV4cG9uZW50O1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29weShzY2FsZSwgcG93KCkuZXhwb25lbnQoZXhwb25lbnQpKTtcbiAgfTtcblxuICByZXR1cm4gbGluZWFyaXNoKHNjYWxlKTtcbn1cblxuZnVuY3Rpb24gc3FydCgpIHtcbiAgcmV0dXJuIHBvdygpLmV4cG9uZW50KDAuNSk7XG59XG5cbmZ1bmN0aW9uIHF1YW50aWxlJDEoKSB7XG4gIHZhciBkb21haW4gPSBbXSxcbiAgICAgIHJhbmdlJCQxID0gW10sXG4gICAgICB0aHJlc2hvbGRzID0gW107XG5cbiAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICB2YXIgaSA9IDAsIG4gPSBNYXRoLm1heCgxLCByYW5nZSQkMS5sZW5ndGgpO1xuICAgIHRocmVzaG9sZHMgPSBuZXcgQXJyYXkobiAtIDEpO1xuICAgIHdoaWxlICgrK2kgPCBuKSB0aHJlc2hvbGRzW2kgLSAxXSA9IGQzQXJyYXkucXVhbnRpbGUoZG9tYWluLCBpIC8gbik7XG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgIGlmICghaXNOYU4oeCA9ICt4KSkgcmV0dXJuIHJhbmdlJCQxW2QzQXJyYXkuYmlzZWN0KHRocmVzaG9sZHMsIHgpXTtcbiAgfVxuXG4gIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaSA9IHJhbmdlJCQxLmluZGV4T2YoeSk7XG4gICAgcmV0dXJuIGkgPCAwID8gW05hTiwgTmFOXSA6IFtcbiAgICAgIGkgPiAwID8gdGhyZXNob2xkc1tpIC0gMV0gOiBkb21haW5bMF0sXG4gICAgICBpIDwgdGhyZXNob2xkcy5sZW5ndGggPyB0aHJlc2hvbGRzW2ldIDogZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXVxuICAgIF07XG4gIH07XG5cbiAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgIGRvbWFpbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gXy5sZW5ndGgsIGQ7IGkgPCBuOyArK2kpIGlmIChkID0gX1tpXSwgZCAhPSBudWxsICYmICFpc05hTihkID0gK2QpKSBkb21haW4ucHVzaChkKTtcbiAgICBkb21haW4uc29ydChkM0FycmF5LmFzY2VuZGluZyk7XG4gICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgfTtcblxuICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5nZSQkMSA9IHNsaWNlLmNhbGwoXyksIHJlc2NhbGUoKSkgOiByYW5nZSQkMS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnF1YW50aWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aHJlc2hvbGRzLnNsaWNlKCk7XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBxdWFudGlsZSQxKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSQkMSk7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG5mdW5jdGlvbiBxdWFudGl6ZSgpIHtcbiAgdmFyIHgwID0gMCxcbiAgICAgIHgxID0gMSxcbiAgICAgIG4gPSAxLFxuICAgICAgZG9tYWluID0gWzAuNV0sXG4gICAgICByYW5nZSQkMSA9IFswLCAxXTtcblxuICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgaWYgKHggPD0geCkgcmV0dXJuIHJhbmdlJCQxW2QzQXJyYXkuYmlzZWN0KGRvbWFpbiwgeCwgMCwgbildO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIGRvbWFpbiA9IG5ldyBBcnJheShuKTtcbiAgICB3aGlsZSAoKytpIDwgbikgZG9tYWluW2ldID0gKChpICsgMSkgKiB4MSAtIChpIC0gbikgKiB4MCkgLyAobiArIDEpO1xuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4MCA9ICtfWzBdLCB4MSA9ICtfWzFdLCByZXNjYWxlKCkpIDogW3gwLCB4MV07XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobiA9IChyYW5nZSQkMSA9IHNsaWNlLmNhbGwoXykpLmxlbmd0aCAtIDEsIHJlc2NhbGUoKSkgOiByYW5nZSQkMS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaSA9IHJhbmdlJCQxLmluZGV4T2YoeSk7XG4gICAgcmV0dXJuIGkgPCAwID8gW05hTiwgTmFOXVxuICAgICAgICA6IGkgPCAxID8gW3gwLCBkb21haW5bMF1dXG4gICAgICAgIDogaSA+PSBuID8gW2RvbWFpbltuIC0gMV0sIHgxXVxuICAgICAgICA6IFtkb21haW5baSAtIDFdLCBkb21haW5baV1dO1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcXVhbnRpemUoKVxuICAgICAgICAuZG9tYWluKFt4MCwgeDFdKVxuICAgICAgICAucmFuZ2UocmFuZ2UkJDEpO1xuICB9O1xuXG4gIHJldHVybiBsaW5lYXJpc2goc2NhbGUpO1xufVxuXG5mdW5jdGlvbiB0aHJlc2hvbGQoKSB7XG4gIHZhciBkb21haW4gPSBbMC41XSxcbiAgICAgIHJhbmdlJCQxID0gWzAsIDFdLFxuICAgICAgbiA9IDE7XG5cbiAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgIGlmICh4IDw9IHgpIHJldHVybiByYW5nZSQkMVtkM0FycmF5LmJpc2VjdChkb21haW4sIHgsIDAsIG4pXTtcbiAgfVxuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkb21haW4gPSBzbGljZS5jYWxsKF8pLCBuID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UkJDEubGVuZ3RoIC0gMSksIHNjYWxlKSA6IGRvbWFpbi5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhbmdlJCQxID0gc2xpY2UuY2FsbChfKSwgbiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlJCQxLmxlbmd0aCAtIDEpLCBzY2FsZSkgOiByYW5nZSQkMS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLmludmVydEV4dGVudCA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgaSA9IHJhbmdlJCQxLmluZGV4T2YoeSk7XG4gICAgcmV0dXJuIFtkb21haW5baSAtIDFdLCBkb21haW5baV1dO1xuICB9O1xuXG4gIHNjYWxlLmNvcHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhyZXNob2xkKClcbiAgICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAgIC5yYW5nZShyYW5nZSQkMSk7XG4gIH07XG5cbiAgcmV0dXJuIHNjYWxlO1xufVxuXG52YXIgZHVyYXRpb25TZWNvbmQgPSAxMDAwO1xudmFyIGR1cmF0aW9uTWludXRlID0gZHVyYXRpb25TZWNvbmQgKiA2MDtcbnZhciBkdXJhdGlvbkhvdXIgPSBkdXJhdGlvbk1pbnV0ZSAqIDYwO1xudmFyIGR1cmF0aW9uRGF5ID0gZHVyYXRpb25Ib3VyICogMjQ7XG52YXIgZHVyYXRpb25XZWVrID0gZHVyYXRpb25EYXkgKiA3O1xudmFyIGR1cmF0aW9uTW9udGggPSBkdXJhdGlvbkRheSAqIDMwO1xudmFyIGR1cmF0aW9uWWVhciA9IGR1cmF0aW9uRGF5ICogMzY1O1xuXG5mdW5jdGlvbiBkYXRlKHQpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKHQpO1xufVxuXG5mdW5jdGlvbiBudW1iZXIkMSh0KSB7XG4gIHJldHVybiB0IGluc3RhbmNlb2YgRGF0ZSA/ICt0IDogK25ldyBEYXRlKCt0KTtcbn1cblxuZnVuY3Rpb24gY2FsZW5kYXIoeWVhciwgbW9udGgsIHdlZWssIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kLCBmb3JtYXQkJDEpIHtcbiAgdmFyIHNjYWxlID0gY29udGludW91cyhkZWludGVycG9sYXRlTGluZWFyLCBkM0ludGVycG9sYXRlLmludGVycG9sYXRlTnVtYmVyKSxcbiAgICAgIGludmVydCA9IHNjYWxlLmludmVydCxcbiAgICAgIGRvbWFpbiA9IHNjYWxlLmRvbWFpbjtcblxuICB2YXIgZm9ybWF0TWlsbGlzZWNvbmQgPSBmb3JtYXQkJDEoXCIuJUxcIiksXG4gICAgICBmb3JtYXRTZWNvbmQgPSBmb3JtYXQkJDEoXCI6JVNcIiksXG4gICAgICBmb3JtYXRNaW51dGUgPSBmb3JtYXQkJDEoXCIlSTolTVwiKSxcbiAgICAgIGZvcm1hdEhvdXIgPSBmb3JtYXQkJDEoXCIlSSAlcFwiKSxcbiAgICAgIGZvcm1hdERheSA9IGZvcm1hdCQkMShcIiVhICVkXCIpLFxuICAgICAgZm9ybWF0V2VlayA9IGZvcm1hdCQkMShcIiViICVkXCIpLFxuICAgICAgZm9ybWF0TW9udGggPSBmb3JtYXQkJDEoXCIlQlwiKSxcbiAgICAgIGZvcm1hdFllYXIgPSBmb3JtYXQkJDEoXCIlWVwiKTtcblxuICB2YXIgdGlja0ludGVydmFscyA9IFtcbiAgICBbc2Vjb25kLCAgMSwgICAgICBkdXJhdGlvblNlY29uZF0sXG4gICAgW3NlY29uZCwgIDUsICA1ICogZHVyYXRpb25TZWNvbmRdLFxuICAgIFtzZWNvbmQsIDE1LCAxNSAqIGR1cmF0aW9uU2Vjb25kXSxcbiAgICBbc2Vjb25kLCAzMCwgMzAgKiBkdXJhdGlvblNlY29uZF0sXG4gICAgW21pbnV0ZSwgIDEsICAgICAgZHVyYXRpb25NaW51dGVdLFxuICAgIFttaW51dGUsICA1LCAgNSAqIGR1cmF0aW9uTWludXRlXSxcbiAgICBbbWludXRlLCAxNSwgMTUgKiBkdXJhdGlvbk1pbnV0ZV0sXG4gICAgW21pbnV0ZSwgMzAsIDMwICogZHVyYXRpb25NaW51dGVdLFxuICAgIFsgIGhvdXIsICAxLCAgICAgIGR1cmF0aW9uSG91ciAgXSxcbiAgICBbICBob3VyLCAgMywgIDMgKiBkdXJhdGlvbkhvdXIgIF0sXG4gICAgWyAgaG91ciwgIDYsICA2ICogZHVyYXRpb25Ib3VyICBdLFxuICAgIFsgIGhvdXIsIDEyLCAxMiAqIGR1cmF0aW9uSG91ciAgXSxcbiAgICBbICAgZGF5LCAgMSwgICAgICBkdXJhdGlvbkRheSAgIF0sXG4gICAgWyAgIGRheSwgIDIsICAyICogZHVyYXRpb25EYXkgICBdLFxuICAgIFsgIHdlZWssICAxLCAgICAgIGR1cmF0aW9uV2VlayAgXSxcbiAgICBbIG1vbnRoLCAgMSwgICAgICBkdXJhdGlvbk1vbnRoIF0sXG4gICAgWyBtb250aCwgIDMsICAzICogZHVyYXRpb25Nb250aCBdLFxuICAgIFsgIHllYXIsICAxLCAgICAgIGR1cmF0aW9uWWVhciAgXVxuICBdO1xuXG4gIGZ1bmN0aW9uIHRpY2tGb3JtYXQoZGF0ZSkge1xuICAgIHJldHVybiAoc2Vjb25kKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdE1pbGxpc2Vjb25kXG4gICAgICAgIDogbWludXRlKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFNlY29uZFxuICAgICAgICA6IGhvdXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0TWludXRlXG4gICAgICAgIDogZGF5KGRhdGUpIDwgZGF0ZSA/IGZvcm1hdEhvdXJcbiAgICAgICAgOiBtb250aChkYXRlKSA8IGRhdGUgPyAod2VlayhkYXRlKSA8IGRhdGUgPyBmb3JtYXREYXkgOiBmb3JtYXRXZWVrKVxuICAgICAgICA6IHllYXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0TW9udGhcbiAgICAgICAgOiBmb3JtYXRZZWFyKShkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpY2tJbnRlcnZhbChpbnRlcnZhbCwgc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoaW50ZXJ2YWwgPT0gbnVsbCkgaW50ZXJ2YWwgPSAxMDtcblxuICAgIC8vIElmIGEgZGVzaXJlZCB0aWNrIGNvdW50IGlzIHNwZWNpZmllZCwgcGljayBhIHJlYXNvbmFibGUgdGljayBpbnRlcnZhbFxuICAgIC8vIGJhc2VkIG9uIHRoZSBleHRlbnQgb2YgdGhlIGRvbWFpbiBhbmQgYSByb3VnaCBlc3RpbWF0ZSBvZiB0aWNrIHNpemUuXG4gICAgLy8gT3RoZXJ3aXNlLCBhc3N1bWUgaW50ZXJ2YWwgaXMgYWxyZWFkeSBhIHRpbWUgaW50ZXJ2YWwgYW5kIHVzZSBpdC5cbiAgICBpZiAodHlwZW9mIGludGVydmFsID09PSBcIm51bWJlclwiKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gTWF0aC5hYnMoc3RvcCAtIHN0YXJ0KSAvIGludGVydmFsLFxuICAgICAgICAgIGkgPSBkM0FycmF5LmJpc2VjdG9yKGZ1bmN0aW9uKGkpIHsgcmV0dXJuIGlbMl07IH0pLnJpZ2h0KHRpY2tJbnRlcnZhbHMsIHRhcmdldCk7XG4gICAgICBpZiAoaSA9PT0gdGlja0ludGVydmFscy5sZW5ndGgpIHtcbiAgICAgICAgc3RlcCA9IGQzQXJyYXkudGlja1N0ZXAoc3RhcnQgLyBkdXJhdGlvblllYXIsIHN0b3AgLyBkdXJhdGlvblllYXIsIGludGVydmFsKTtcbiAgICAgICAgaW50ZXJ2YWwgPSB5ZWFyO1xuICAgICAgfSBlbHNlIGlmIChpKSB7XG4gICAgICAgIGkgPSB0aWNrSW50ZXJ2YWxzW3RhcmdldCAvIHRpY2tJbnRlcnZhbHNbaSAtIDFdWzJdIDwgdGlja0ludGVydmFsc1tpXVsyXSAvIHRhcmdldCA/IGkgLSAxIDogaV07XG4gICAgICAgIHN0ZXAgPSBpWzFdO1xuICAgICAgICBpbnRlcnZhbCA9IGlbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGVwID0gZDNBcnJheS50aWNrU3RlcChzdGFydCwgc3RvcCwgaW50ZXJ2YWwpO1xuICAgICAgICBpbnRlcnZhbCA9IG1pbGxpc2Vjb25kO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGVwID09IG51bGwgPyBpbnRlcnZhbCA6IGludGVydmFsLmV2ZXJ5KHN0ZXApO1xuICB9XG5cbiAgc2NhbGUuaW52ZXJ0ID0gZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiBuZXcgRGF0ZShpbnZlcnQoeSkpO1xuICB9O1xuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IGRvbWFpbihtYXAkMS5jYWxsKF8sIG51bWJlciQxKSkgOiBkb21haW4oKS5tYXAoZGF0ZSk7XG4gIH07XG5cbiAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihpbnRlcnZhbCwgc3RlcCkge1xuICAgIHZhciBkID0gZG9tYWluKCksXG4gICAgICAgIHQwID0gZFswXSxcbiAgICAgICAgdDEgPSBkW2QubGVuZ3RoIC0gMV0sXG4gICAgICAgIHIgPSB0MSA8IHQwLFxuICAgICAgICB0O1xuICAgIGlmIChyKSB0ID0gdDAsIHQwID0gdDEsIHQxID0gdDtcbiAgICB0ID0gdGlja0ludGVydmFsKGludGVydmFsLCB0MCwgdDEsIHN0ZXApO1xuICAgIHQgPSB0ID8gdC5yYW5nZSh0MCwgdDEgKyAxKSA6IFtdOyAvLyBpbmNsdXNpdmUgc3RvcFxuICAgIHJldHVybiByID8gdC5yZXZlcnNlKCkgOiB0O1xuICB9O1xuXG4gIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllciA9PSBudWxsID8gdGlja0Zvcm1hdCA6IGZvcm1hdCQkMShzcGVjaWZpZXIpO1xuICB9O1xuXG4gIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihpbnRlcnZhbCwgc3RlcCkge1xuICAgIHZhciBkID0gZG9tYWluKCk7XG4gICAgcmV0dXJuIChpbnRlcnZhbCA9IHRpY2tJbnRlcnZhbChpbnRlcnZhbCwgZFswXSwgZFtkLmxlbmd0aCAtIDFdLCBzdGVwKSlcbiAgICAgICAgPyBkb21haW4obmljZShkLCBpbnRlcnZhbCkpXG4gICAgICAgIDogc2NhbGU7XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb3B5KHNjYWxlLCBjYWxlbmRhcih5ZWFyLCBtb250aCwgd2VlaywgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmQsIGZvcm1hdCQkMSkpO1xuICB9O1xuXG4gIHJldHVybiBzY2FsZTtcbn1cblxudmFyIHRpbWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNhbGVuZGFyKGQzVGltZS50aW1lWWVhciwgZDNUaW1lLnRpbWVNb250aCwgZDNUaW1lLnRpbWVXZWVrLCBkM1RpbWUudGltZURheSwgZDNUaW1lLnRpbWVIb3VyLCBkM1RpbWUudGltZU1pbnV0ZSwgZDNUaW1lLnRpbWVTZWNvbmQsIGQzVGltZS50aW1lTWlsbGlzZWNvbmQsIGQzVGltZUZvcm1hdC50aW1lRm9ybWF0KS5kb21haW4oW25ldyBEYXRlKDIwMDAsIDAsIDEpLCBuZXcgRGF0ZSgyMDAwLCAwLCAyKV0pO1xufTtcblxudmFyIHV0Y1RpbWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNhbGVuZGFyKGQzVGltZS51dGNZZWFyLCBkM1RpbWUudXRjTW9udGgsIGQzVGltZS51dGNXZWVrLCBkM1RpbWUudXRjRGF5LCBkM1RpbWUudXRjSG91ciwgZDNUaW1lLnV0Y01pbnV0ZSwgZDNUaW1lLnV0Y1NlY29uZCwgZDNUaW1lLnV0Y01pbGxpc2Vjb25kLCBkM1RpbWVGb3JtYXQudXRjRm9ybWF0KS5kb21haW4oW0RhdGUuVVRDKDIwMDAsIDAsIDEpLCBEYXRlLlVUQygyMDAwLCAwLCAyKV0pO1xufTtcblxudmFyIGNvbG9ycyA9IGZ1bmN0aW9uKHMpIHtcbiAgcmV0dXJuIHMubWF0Y2goLy57Nn0vZykubWFwKGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gXCIjXCIgKyB4O1xuICB9KTtcbn07XG5cbnZhciBjYXRlZ29yeTEwID0gY29sb3JzKFwiMWY3N2I0ZmY3ZjBlMmNhMDJjZDYyNzI4OTQ2N2JkOGM1NjRiZTM3N2MyN2Y3ZjdmYmNiZDIyMTdiZWNmXCIpO1xuXG52YXIgY2F0ZWdvcnkyMGIgPSBjb2xvcnMoXCIzOTNiNzk1MjU0YTM2YjZlY2Y5YzllZGU2Mzc5Mzk4Y2EyNTJiNWNmNmJjZWRiOWM4YzZkMzFiZDllMzllN2JhNTJlN2NiOTQ4NDNjMzlhZDQ5NGFkNjYxNmJlNzk2OWM3YjQxNzNhNTUxOTRjZTZkYmRkZTllZDZcIik7XG5cbnZhciBjYXRlZ29yeTIwYyA9IGNvbG9ycyhcIjMxODJiZDZiYWVkNjllY2FlMWM2ZGJlZmU2NTUwZGZkOGQzY2ZkYWU2YmZkZDBhMjMxYTM1NDc0YzQ3NmExZDk5YmM3ZTljMDc1NmJiMTllOWFjOGJjYmRkY2RhZGFlYjYzNjM2Mzk2OTY5NmJkYmRiZGQ5ZDlkOVwiKTtcblxudmFyIGNhdGVnb3J5MjAgPSBjb2xvcnMoXCIxZjc3YjRhZWM3ZThmZjdmMGVmZmJiNzgyY2EwMmM5OGRmOGFkNjI3MjhmZjk4OTY5NDY3YmRjNWIwZDU4YzU2NGJjNDljOTRlMzc3YzJmN2I2ZDI3ZjdmN2ZjN2M3YzdiY2JkMjJkYmRiOGQxN2JlY2Y5ZWRhZTVcIik7XG5cbnZhciBjdWJlaGVsaXgkMSA9IGQzSW50ZXJwb2xhdGUuaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nKGQzQ29sb3IuY3ViZWhlbGl4KDMwMCwgMC41LCAwLjApLCBkM0NvbG9yLmN1YmVoZWxpeCgtMjQwLCAwLjUsIDEuMCkpO1xuXG52YXIgd2FybSA9IGQzSW50ZXJwb2xhdGUuaW50ZXJwb2xhdGVDdWJlaGVsaXhMb25nKGQzQ29sb3IuY3ViZWhlbGl4KC0xMDAsIDAuNzUsIDAuMzUpLCBkM0NvbG9yLmN1YmVoZWxpeCg4MCwgMS41MCwgMC44KSk7XG5cbnZhciBjb29sID0gZDNJbnRlcnBvbGF0ZS5pbnRlcnBvbGF0ZUN1YmVoZWxpeExvbmcoZDNDb2xvci5jdWJlaGVsaXgoMjYwLCAwLjc1LCAwLjM1KSwgZDNDb2xvci5jdWJlaGVsaXgoODAsIDEuNTAsIDAuOCkpO1xuXG52YXIgcmFpbmJvdyA9IGQzQ29sb3IuY3ViZWhlbGl4KCk7XG5cbnZhciByYWluYm93JDEgPSBmdW5jdGlvbih0KSB7XG4gIGlmICh0IDwgMCB8fCB0ID4gMSkgdCAtPSBNYXRoLmZsb29yKHQpO1xuICB2YXIgdHMgPSBNYXRoLmFicyh0IC0gMC41KTtcbiAgcmFpbmJvdy5oID0gMzYwICogdCAtIDEwMDtcbiAgcmFpbmJvdy5zID0gMS41IC0gMS41ICogdHM7XG4gIHJhaW5ib3cubCA9IDAuOCAtIDAuOSAqIHRzO1xuICByZXR1cm4gcmFpbmJvdyArIFwiXCI7XG59O1xuXG5mdW5jdGlvbiByYW1wKHJhbmdlJCQxKSB7XG4gIHZhciBuID0gcmFuZ2UkJDEubGVuZ3RoO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiByYW5nZSQkMVtNYXRoLm1heCgwLCBNYXRoLm1pbihuIC0gMSwgTWF0aC5mbG9vcih0ICogbikpKV07XG4gIH07XG59XG5cbnZhciB2aXJpZGlzID0gcmFtcChjb2xvcnMoXCI0NDAxNTQ0NDAyNTY0NTA0NTc0NTA1NTk0NjA3NWE0NjA4NWM0NjBhNWQ0NjBiNWU0NzBkNjA0NzBlNjE0NzEwNjM0NzExNjQ0NzEzNjU0ODE0Njc0ODE2Njg0ODE3Njk0ODE4NmE0ODFhNmM0ODFiNmQ0ODFjNmU0ODFkNmY0ODFmNzA0ODIwNzE0ODIxNzM0ODIzNzQ0ODI0NzU0ODI1NzY0ODI2Nzc0ODI4Nzg0ODI5Nzk0NzJhN2E0NzJjN2E0NzJkN2I0NzJlN2M0NzJmN2Q0NjMwN2U0NjMyN2U0NjMzN2Y0NjM0ODA0NTM1ODE0NTM3ODE0NTM4ODI0NDM5ODM0NDNhODM0NDNiODQ0MzNkODQ0MzNlODU0MjNmODU0MjQwODY0MjQxODY0MTQyODc0MTQ0ODc0MDQ1ODg0MDQ2ODgzZjQ3ODgzZjQ4ODkzZTQ5ODkzZTRhODkzZTRjOGEzZDRkOGEzZDRlOGEzYzRmOGEzYzUwOGIzYjUxOGIzYjUyOGIzYTUzOGIzYTU0OGMzOTU1OGMzOTU2OGMzODU4OGMzODU5OGMzNzVhOGMzNzViOGQzNjVjOGQzNjVkOGQzNTVlOGQzNTVmOGQzNDYwOGQzNDYxOGQzMzYyOGQzMzYzOGQzMjY0OGUzMjY1OGUzMTY2OGUzMTY3OGUzMTY4OGUzMDY5OGUzMDZhOGUyZjZiOGUyZjZjOGUyZTZkOGUyZTZlOGUyZTZmOGUyZDcwOGUyZDcxOGUyYzcxOGUyYzcyOGUyYzczOGUyYjc0OGUyYjc1OGUyYTc2OGUyYTc3OGUyYTc4OGUyOTc5OGUyOTdhOGUyOTdiOGUyODdjOGUyODdkOGUyNzdlOGUyNzdmOGUyNzgwOGUyNjgxOGUyNjgyOGUyNjgyOGUyNTgzOGUyNTg0OGUyNTg1OGUyNDg2OGUyNDg3OGUyMzg4OGUyMzg5OGUyMzhhOGQyMjhiOGQyMjhjOGQyMjhkOGQyMThlOGQyMThmOGQyMTkwOGQyMTkxOGMyMDkyOGMyMDkyOGMyMDkzOGMxZjk0OGMxZjk1OGIxZjk2OGIxZjk3OGIxZjk4OGIxZjk5OGExZjlhOGExZTliOGExZTljODkxZTlkODkxZjllODkxZjlmODgxZmEwODgxZmExODgxZmExODcxZmEyODcyMGEzODYyMGE0ODYyMWE1ODUyMWE2ODUyMmE3ODUyMmE4ODQyM2E5ODMyNGFhODMyNWFiODIyNWFjODIyNmFkODEyN2FkODEyOGFlODAyOWFmN2YyYWIwN2YyY2IxN2UyZGIyN2QyZWIzN2MyZmI0N2MzMWI1N2IzMmI2N2EzNGI2NzkzNWI3NzkzN2I4NzgzOGI5NzczYWJhNzYzYmJiNzUzZGJjNzQzZmJjNzM0MGJkNzI0MmJlNzE0NGJmNzA0NmMwNmY0OGMxNmU0YWMxNmQ0Y2MyNmM0ZWMzNmI1MGM0NmE1MmM1Njk1NGM1Njg1NmM2Njc1OGM3NjU1YWM4NjQ1Y2M4NjM1ZWM5NjI2MGNhNjA2M2NiNWY2NWNiNWU2N2NjNWM2OWNkNWI2Y2NkNWE2ZWNlNTg3MGNmNTc3M2QwNTY3NWQwNTQ3N2QxNTM3YWQxNTE3Y2QyNTA3ZmQzNGU4MWQzNGQ4NGQ0NGI4NmQ1NDk4OWQ1NDg4YmQ2NDY4ZWQ2NDU5MGQ3NDM5M2Q3NDE5NWQ4NDA5OGQ4M2U5YmQ5M2M5ZGQ5M2JhMGRhMzlhMmRhMzdhNWRiMzZhOGRiMzRhYWRjMzJhZGRjMzBiMGRkMmZiMmRkMmRiNWRlMmJiOGRlMjliYWRlMjhiZGRmMjZjMGRmMjVjMmRmMjNjNWUwMjFjOGUwMjBjYWUxMWZjZGUxMWRkMGUxMWNkMmUyMWJkNWUyMWFkOGUyMTlkYWUzMTlkZGUzMThkZmUzMThlMmU0MThlNWU0MTllN2U0MTllYWU1MWFlY2U1MWJlZmU1MWNmMWU1MWRmNGU2MWVmNmU2MjBmOGU2MjFmYmU3MjNmZGU3MjVcIikpO1xuXG52YXIgbWFnbWEgPSByYW1wKGNvbG9ycyhcIjAwMDAwNDAxMDAwNTAxMDEwNjAxMDEwODAyMDEwOTAyMDIwYjAyMDIwZDAzMDMwZjAzMDMxMjA0MDQxNDA1MDQxNjA2MDUxODA2MDUxYTA3MDYxYzA4MDcxZTA5MDcyMDBhMDgyMjBiMDkyNDBjMDkyNjBkMGEyOTBlMGIyYjEwMGIyZDExMGMyZjEyMGQzMTEzMGQzNDE0MGUzNjE1MGUzODE2MGYzYjE4MGYzZDE5MTAzZjFhMTA0MjFjMTA0NDFkMTE0NzFlMTE0OTIwMTE0YjIxMTE0ZTIyMTE1MDI0MTI1MzI1MTI1NTI3MTI1ODI5MTE1YTJhMTE1YzJjMTE1ZjJkMTE2MTJmMTE2MzMxMTE2NTMzMTA2NzM0MTA2OTM2MTA2YjM4MTA2YzM5MGY2ZTNiMGY3MDNkMGY3MTNmMGY3MjQwMGY3NDQyMGY3NTQ0MGY3NjQ1MTA3NzQ3MTA3ODQ5MTA3ODRhMTA3OTRjMTE3YTRlMTE3YjRmMTI3YjUxMTI3YzUyMTM3YzU0MTM3ZDU2MTQ3ZDU3MTU3ZTU5MTU3ZTVhMTY3ZTVjMTY3ZjVkMTc3ZjVmMTg3ZjYwMTg4MDYyMTk4MDY0MWE4MDY1MWE4MDY3MWI4MDY4MWM4MTZhMWM4MTZiMWQ4MTZkMWQ4MTZlMWU4MTcwMWY4MTcyMWY4MTczMjA4MTc1MjE4MTc2MjE4MTc4MjI4MTc5MjI4MjdiMjM4MjdjMjM4MjdlMjQ4MjgwMjU4MjgxMjU4MTgzMjY4MTg0MjY4MTg2Mjc4MTg4Mjc4MTg5Mjg4MThiMjk4MThjMjk4MThlMmE4MTkwMmE4MTkxMmI4MTkzMmI4MDk0MmM4MDk2MmM4MDk4MmQ4MDk5MmQ4MDliMmU3ZjljMmU3ZjllMmY3ZmEwMmY3ZmExMzA3ZWEzMzA3ZWE1MzE3ZWE2MzE3ZGE4MzI3ZGFhMzM3ZGFiMzM3Y2FkMzQ3Y2FlMzQ3YmIwMzU3YmIyMzU3YmIzMzY3YWI1MzY3YWI3Mzc3OWI4Mzc3OWJhMzg3OGJjMzk3OGJkMzk3N2JmM2E3N2MwM2E3NmMyM2I3NWM0M2M3NWM1M2M3NGM3M2Q3M2M4M2U3M2NhM2U3MmNjM2Y3MWNkNDA3MWNmNDA3MGQwNDE2ZmQyNDI2ZmQzNDM2ZWQ1NDQ2ZGQ2NDU2Y2Q4NDU2Y2Q5NDY2YmRiNDc2YWRjNDg2OWRlNDk2OGRmNGE2OGUwNGM2N2UyNGQ2NmUzNGU2NWU0NGY2NGU1NTA2NGU3NTI2M2U4NTM2MmU5NTQ2MmVhNTY2MWViNTc2MGVjNTg2MGVkNWE1ZmVlNWI1ZWVmNWQ1ZWYwNWY1ZWYxNjA1ZGYyNjI1ZGYyNjQ1Y2YzNjU1Y2Y0Njc1Y2Y0Njk1Y2Y1NmI1Y2Y2NmM1Y2Y2NmU1Y2Y3NzA1Y2Y3NzI1Y2Y4NzQ1Y2Y4NzY1Y2Y5Nzg1ZGY5Nzk1ZGY5N2I1ZGZhN2Q1ZWZhN2Y1ZWZhODE1ZmZiODM1ZmZiODU2MGZiODc2MWZjODk2MWZjOGE2MmZjOGM2M2ZjOGU2NGZjOTA2NWZkOTI2NmZkOTQ2N2ZkOTY2OGZkOTg2OWZkOWE2YWZkOWI2YmZlOWQ2Y2ZlOWY2ZGZlYTE2ZWZlYTM2ZmZlYTU3MWZlYTc3MmZlYTk3M2ZlYWE3NGZlYWM3NmZlYWU3N2ZlYjA3OGZlYjI3YWZlYjQ3YmZlYjY3Y2ZlYjc3ZWZlYjk3ZmZlYmI4MWZlYmQ4MmZlYmY4NGZlYzE4NWZlYzI4N2ZlYzQ4OGZlYzY4YWZlYzg4Y2ZlY2E4ZGZlY2M4ZmZlY2Q5MGZlY2Y5MmZlZDE5NGZlZDM5NWZlZDU5N2ZlZDc5OWZlZDg5YWZkZGE5Y2ZkZGM5ZWZkZGVhMGZkZTBhMWZkZTJhM2ZkZTNhNWZkZTVhN2ZkZTdhOWZkZTlhYWZkZWJhY2ZjZWNhZWZjZWViMGZjZjBiMmZjZjJiNGZjZjRiNmZjZjZiOGZjZjdiOWZjZjliYmZjZmJiZGZjZmRiZlwiKSk7XG5cbnZhciBpbmZlcm5vID0gcmFtcChjb2xvcnMoXCIwMDAwMDQwMTAwMDUwMTAxMDYwMTAxMDgwMjAxMGEwMjAyMGMwMjAyMGUwMzAyMTAwNDAzMTIwNDAzMTQwNTA0MTcwNjA0MTkwNzA1MWIwODA1MWQwOTA2MWYwYTA3MjIwYjA3MjQwYzA4MjYwZDA4MjkwZTA5MmIxMDA5MmQxMTBhMzAxMjBhMzIxNDBiMzQxNTBiMzcxNjBiMzkxODBjM2MxOTBjM2UxYjBjNDExYzBjNDMxZTBjNDUxZjBjNDgyMTBjNGEyMzBjNGMyNDBjNGYyNjBjNTEyODBiNTMyOTBiNTUyYjBiNTcyZDBiNTkyZjBhNWIzMTBhNWMzMjBhNWUzNDBhNWYzNjA5NjEzODA5NjIzOTA5NjMzYjA5NjQzZDA5NjUzZTA5NjY0MDBhNjc0MjBhNjg0NDBhNjg0NTBhNjk0NzBiNmE0OTBiNmE0YTBjNmI0YzBjNmI0ZDBkNmM0ZjBkNmM1MTBlNmM1MjBlNmQ1NDBmNmQ1NTBmNmQ1NzEwNmU1OTEwNmU1YTExNmU1YzEyNmU1ZDEyNmU1ZjEzNmU2MTEzNmU2MjE0NmU2NDE1NmU2NTE1NmU2NzE2NmU2OTE2NmU2YTE3NmU2YzE4NmU2ZDE4NmU2ZjE5NmU3MTE5NmU3MjFhNmU3NDFhNmU3NTFiNmU3NzFjNmQ3ODFjNmQ3YTFkNmQ3YzFkNmQ3ZDFlNmQ3ZjFlNmM4MDFmNmM4MjIwNmM4NDIwNmI4NTIxNmI4NzIxNmI4ODIyNmE4YTIyNmE4YzIzNjk4ZDIzNjk4ZjI0Njk5MDI1Njg5MjI1Njg5MzI2Njc5NTI2Njc5NzI3NjY5ODI3NjY5YTI4NjU5YjI5NjQ5ZDI5NjQ5ZjJhNjNhMDJhNjNhMjJiNjJhMzJjNjFhNTJjNjBhNjJkNjBhODJlNWZhOTJlNWVhYjJmNWVhZDMwNWRhZTMwNWNiMDMxNWJiMTMyNWFiMzMyNWFiNDMzNTliNjM0NThiNzM1NTdiOTM1NTZiYTM2NTViYzM3NTRiZDM4NTNiZjM5NTJjMDNhNTFjMTNhNTBjMzNiNGZjNDNjNGVjNjNkNGRjNzNlNGNjODNmNGJjYTQwNGFjYjQxNDljYzQyNDhjZTQzNDdjZjQ0NDZkMDQ1NDVkMjQ2NDRkMzQ3NDNkNDQ4NDJkNTRhNDFkNzRiM2ZkODRjM2VkOTRkM2RkYTRlM2NkYjUwM2JkZDUxM2FkZTUyMzhkZjUzMzdlMDU1MzZlMTU2MzVlMjU3MzRlMzU5MzNlNDVhMzFlNTVjMzBlNjVkMmZlNzVlMmVlODYwMmRlOTYxMmJlYTYzMmFlYjY0MjllYjY2MjhlYzY3MjZlZDY5MjVlZTZhMjRlZjZjMjNlZjZlMjFmMDZmMjBmMTcxMWZmMTczMWRmMjc0MWNmMzc2MWJmMzc4MTlmNDc5MThmNTdiMTdmNTdkMTVmNjdlMTRmNjgwMTNmNzgyMTJmNzg0MTBmODg1MGZmODg3MGVmODg5MGNmOThiMGJmOThjMGFmOThlMDlmYTkwMDhmYTkyMDdmYTk0MDdmYjk2MDZmYjk3MDZmYjk5MDZmYjliMDZmYjlkMDdmYzlmMDdmY2ExMDhmY2EzMDlmY2E1MGFmY2E2MGNmY2E4MGRmY2FhMGZmY2FjMTFmY2FlMTJmY2IwMTRmY2IyMTZmY2I0MThmYmI2MWFmYmI4MWRmYmJhMWZmYmJjMjFmYmJlMjNmYWMwMjZmYWMyMjhmYWM0MmFmYWM2MmRmOWM3MmZmOWM5MzJmOWNiMzVmOGNkMzdmOGNmM2FmN2QxM2RmN2QzNDBmNmQ1NDNmNmQ3NDZmNWQ5NDlmNWRiNGNmNGRkNGZmNGRmNTNmNGUxNTZmM2UzNWFmM2U1NWRmMmU2NjFmMmU4NjVmMmVhNjlmMWVjNmRmMWVkNzFmMWVmNzVmMWYxNzlmMmYyN2RmMmY0ODJmM2Y1ODZmM2Y2OGFmNGY4OGVmNWY5OTJmNmZhOTZmOGZiOWFmOWZjOWRmYWZkYTFmY2ZmYTRcIikpO1xuXG52YXIgcGxhc21hID0gcmFtcChjb2xvcnMoXCIwZDA4ODcxMDA3ODgxMzA3ODkxNjA3OGExOTA2OGMxYjA2OGQxZDA2OGUyMDA2OGYyMjA2OTAyNDA2OTEyNjA1OTEyODA1OTIyYTA1OTMyYzA1OTQyZTA1OTUyZjA1OTYzMTA1OTczMzA1OTczNTA0OTgzNzA0OTkzODA0OWEzYTA0OWEzYzA0OWIzZTA0OWMzZjA0OWM0MTA0OWQ0MzAzOWU0NDAzOWU0NjAzOWY0ODAzOWY0OTAzYTA0YjAzYTE0YzAyYTE0ZTAyYTI1MDAyYTI1MTAyYTM1MzAyYTM1NTAyYTQ1NjAxYTQ1ODAxYTQ1OTAxYTU1YjAxYTU1YzAxYTY1ZTAxYTY2MDAxYTY2MTAwYTc2MzAwYTc2NDAwYTc2NjAwYTc2NzAwYTg2OTAwYTg2YTAwYTg2YzAwYTg2ZTAwYTg2ZjAwYTg3MTAwYTg3MjAxYTg3NDAxYTg3NTAxYTg3NzAxYTg3ODAxYTg3YTAyYTg3YjAyYTg3ZDAzYTg3ZTAzYTg4MDA0YTg4MTA0YTc4MzA1YTc4NDA1YTc4NjA2YTY4NzA3YTY4ODA4YTY4YTA5YTU4YjBhYTU4ZDBiYTU4ZTBjYTQ4ZjBkYTQ5MTBlYTM5MjBmYTM5NDEwYTI5NTExYTE5NjEzYTE5ODE0YTA5OTE1OWY5YTE2OWY5YzE3OWU5ZDE4OWQ5ZTE5OWRhMDFhOWNhMTFiOWJhMjFkOWFhMzFlOWFhNTFmOTlhNjIwOThhNzIxOTdhODIyOTZhYTIzOTVhYjI0OTRhYzI2OTRhZDI3OTNhZTI4OTJiMDI5OTFiMTJhOTBiMjJiOGZiMzJjOGViNDJlOGRiNTJmOGNiNjMwOGJiNzMxOGFiODMyODliYTMzODhiYjM0ODhiYzM1ODdiZDM3ODZiZTM4ODViZjM5ODRjMDNhODNjMTNiODJjMjNjODFjMzNkODBjNDNlN2ZjNTQwN2VjNjQxN2RjNzQyN2NjODQzN2JjOTQ0N2FjYTQ1N2FjYjQ2NzljYzQ3NzhjYzQ5NzdjZDRhNzZjZTRiNzVjZjRjNzRkMDRkNzNkMTRlNzJkMjRmNzFkMzUxNzFkNDUyNzBkNTUzNmZkNTU0NmVkNjU1NmRkNzU2NmNkODU3NmJkOTU4NmFkYTVhNmFkYTViNjlkYjVjNjhkYzVkNjdkZDVlNjZkZTVmNjVkZTYxNjRkZjYyNjNlMDYzNjNlMTY0NjJlMjY1NjFlMjY2NjBlMzY4NWZlNDY5NWVlNTZhNWRlNTZiNWRlNjZjNWNlNzZlNWJlNzZmNWFlODcwNTllOTcxNThlOTcyNTdlYTc0NTdlYjc1NTZlYjc2NTVlYzc3NTRlZDc5NTNlZDdhNTJlZTdiNTFlZjdjNTFlZjdlNTBmMDdmNGZmMDgwNGVmMTgxNGRmMTgzNGNmMjg0NGJmMzg1NGJmMzg3NGFmNDg4NDlmNDg5NDhmNThiNDdmNThjNDZmNjhkNDVmNjhmNDRmNzkwNDRmNzkxNDNmNzkzNDJmODk0NDFmODk1NDBmOTk3M2ZmOTk4M2VmOTlhM2VmYTliM2RmYTljM2NmYTllM2JmYjlmM2FmYmExMzlmYmEyMzhmY2EzMzhmY2E1MzdmY2E2MzZmY2E4MzVmY2E5MzRmZGFiMzNmZGFjMzNmZGFlMzJmZGFmMzFmZGIxMzBmZGIyMmZmZGI0MmZmZGI1MmVmZWI3MmRmZWI4MmNmZWJhMmNmZWJiMmJmZWJkMmFmZWJlMmFmZWMwMjlmZGMyMjlmZGMzMjhmZGM1MjdmZGM2MjdmZGM4MjdmZGNhMjZmZGNiMjZmY2NkMjVmY2NlMjVmY2QwMjVmY2QyMjVmYmQzMjRmYmQ1MjRmYmQ3MjRmYWQ4MjRmYWRhMjRmOWRjMjRmOWRkMjVmOGRmMjVmOGUxMjVmN2UyMjVmN2U0MjVmNmU2MjZmNmU4MjZmNWU5MjZmNWViMjdmNGVkMjdmM2VlMjdmM2YwMjdmMmYyMjdmMWY0MjZmMWY1MjVmMGY3MjRmMGY5MjFcIikpO1xuXG5mdW5jdGlvbiBzZXF1ZW50aWFsKGludGVycG9sYXRvcikge1xuICB2YXIgeDAgPSAwLFxuICAgICAgeDEgPSAxLFxuICAgICAgY2xhbXAgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgdmFyIHQgPSAoeCAtIHgwKSAvICh4MSAtIHgwKTtcbiAgICByZXR1cm4gaW50ZXJwb2xhdG9yKGNsYW1wID8gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdCkpIDogdCk7XG4gIH1cblxuICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeDAgPSArX1swXSwgeDEgPSArX1sxXSwgc2NhbGUpIDogW3gwLCB4MV07XG4gIH07XG5cbiAgc2NhbGUuY2xhbXAgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xhbXAgPSAhIV8sIHNjYWxlKSA6IGNsYW1wO1xuICB9O1xuXG4gIHNjYWxlLmludGVycG9sYXRvciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpbnRlcnBvbGF0b3IgPSBfLCBzY2FsZSkgOiBpbnRlcnBvbGF0b3I7XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzZXF1ZW50aWFsKGludGVycG9sYXRvcikuZG9tYWluKFt4MCwgeDFdKS5jbGFtcChjbGFtcCk7XG4gIH07XG5cbiAgcmV0dXJuIGxpbmVhcmlzaChzY2FsZSk7XG59XG5cbmV4cG9ydHMuc2NhbGVCYW5kID0gYmFuZDtcbmV4cG9ydHMuc2NhbGVQb2ludCA9IHBvaW50O1xuZXhwb3J0cy5zY2FsZUlkZW50aXR5ID0gaWRlbnRpdHk7XG5leHBvcnRzLnNjYWxlTGluZWFyID0gbGluZWFyO1xuZXhwb3J0cy5zY2FsZUxvZyA9IGxvZztcbmV4cG9ydHMuc2NhbGVPcmRpbmFsID0gb3JkaW5hbDtcbmV4cG9ydHMuc2NhbGVJbXBsaWNpdCA9IGltcGxpY2l0O1xuZXhwb3J0cy5zY2FsZVBvdyA9IHBvdztcbmV4cG9ydHMuc2NhbGVTcXJ0ID0gc3FydDtcbmV4cG9ydHMuc2NhbGVRdWFudGlsZSA9IHF1YW50aWxlJDE7XG5leHBvcnRzLnNjYWxlUXVhbnRpemUgPSBxdWFudGl6ZTtcbmV4cG9ydHMuc2NhbGVUaHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG5leHBvcnRzLnNjYWxlVGltZSA9IHRpbWU7XG5leHBvcnRzLnNjYWxlVXRjID0gdXRjVGltZTtcbmV4cG9ydHMuc2NoZW1lQ2F0ZWdvcnkxMCA9IGNhdGVnb3J5MTA7XG5leHBvcnRzLnNjaGVtZUNhdGVnb3J5MjBiID0gY2F0ZWdvcnkyMGI7XG5leHBvcnRzLnNjaGVtZUNhdGVnb3J5MjBjID0gY2F0ZWdvcnkyMGM7XG5leHBvcnRzLnNjaGVtZUNhdGVnb3J5MjAgPSBjYXRlZ29yeTIwO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeERlZmF1bHQgPSBjdWJlaGVsaXgkMTtcbmV4cG9ydHMuaW50ZXJwb2xhdGVSYWluYm93ID0gcmFpbmJvdyQxO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVdhcm0gPSB3YXJtO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZUNvb2wgPSBjb29sO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZVZpcmlkaXMgPSB2aXJpZGlzO1xuZXhwb3J0cy5pbnRlcnBvbGF0ZU1hZ21hID0gbWFnbWE7XG5leHBvcnRzLmludGVycG9sYXRlSW5mZXJubyA9IGluZmVybm87XG5leHBvcnRzLmludGVycG9sYXRlUGxhc21hID0gcGxhc21hO1xuZXhwb3J0cy5zY2FsZVNlcXVlbnRpYWwgPSBzZXF1ZW50aWFsO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiLy8gaHR0cHM6Ly9kM2pzLm9yZy9kMy1zZWxlY3Rpb24vIFZlcnNpb24gMS4xLjAuIENvcHlyaWdodCAyMDE3IE1pa2UgQm9zdG9jay5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcblx0KGZhY3RvcnkoKGdsb2JhbC5kMyA9IGdsb2JhbC5kMyB8fCB7fSkpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbnZhciBuYW1lc3BhY2VzID0ge1xuICBzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgeGh0bWw6IHhodG1sLFxuICB4bGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIixcbiAgeG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIlxufTtcblxudmFyIG5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHByZWZpeCA9IG5hbWUgKz0gXCJcIiwgaSA9IHByZWZpeC5pbmRleE9mKFwiOlwiKTtcbiAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzW3ByZWZpeF0sIGxvY2FsOiBuYW1lfSA6IG5hbWU7XG59O1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbnZhciBjcmVhdG9yID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG4gIHJldHVybiAoZnVsbG5hbWUubG9jYWxcbiAgICAgID8gY3JlYXRvckZpeGVkXG4gICAgICA6IGNyZWF0b3JJbmhlcml0KShmdWxsbmFtZSk7XG59O1xuXG52YXIgbmV4dElkID0gMDtcblxuZnVuY3Rpb24gbG9jYWwoKSB7XG4gIHJldHVybiBuZXcgTG9jYWw7XG59XG5cbmZ1bmN0aW9uIExvY2FsKCkge1xuICB0aGlzLl8gPSBcIkBcIiArICgrK25leHRJZCkudG9TdHJpbmcoMzYpO1xufVxuXG5Mb2NhbC5wcm90b3R5cGUgPSBsb2NhbC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBMb2NhbCxcbiAgZ2V0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIGlkID0gdGhpcy5fO1xuICAgIHdoaWxlICghKGlkIGluIG5vZGUpKSBpZiAoIShub2RlID0gbm9kZS5wYXJlbnROb2RlKSkgcmV0dXJuO1xuICAgIHJldHVybiBub2RlW2lkXTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihub2RlLCB2YWx1ZSkge1xuICAgIHJldHVybiBub2RlW3RoaXMuX10gPSB2YWx1ZTtcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuXyBpbiBub2RlICYmIGRlbGV0ZSBub2RlW3RoaXMuX107XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fO1xuICB9XG59O1xuXG52YXIgbWF0Y2hlciA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn07XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGlmICghZWxlbWVudC5tYXRjaGVzKSB7XG4gICAgdmFyIHZlbmRvck1hdGNoZXMgPSBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICAgICAgICB8fCBlbGVtZW50Lm1zTWF0Y2hlc1NlbGVjdG9yXG4gICAgICAgIHx8IGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yXG4gICAgICAgIHx8IGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcjtcbiAgICBtYXRjaGVyID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZlbmRvck1hdGNoZXMuY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cblxudmFyIG1hdGNoZXIkMSA9IG1hdGNoZXI7XG5cbnZhciBmaWx0ZXJFdmVudHMgPSB7fTtcblxuZXhwb3J0cy5ldmVudCA9IG51bGw7XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgdmFyIGVsZW1lbnQkMSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgaWYgKCEoXCJvbm1vdXNlZW50ZXJcIiBpbiBlbGVtZW50JDEpKSB7XG4gICAgZmlsdGVyRXZlbnRzID0ge21vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsIG1vdXNlbGVhdmU6IFwibW91c2VvdXRcIn07XG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyQ29udGV4dExpc3RlbmVyKGxpc3RlbmVyLCBpbmRleCwgZ3JvdXApIHtcbiAgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIsIGluZGV4LCBncm91cCk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldDtcbiAgICBpZiAoIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRoaXMgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRoaXMpICYgOCkpKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lciwgaW5kZXgsIGdyb3VwKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudDEpIHtcbiAgICB2YXIgZXZlbnQwID0gZXhwb3J0cy5ldmVudDsgLy8gRXZlbnRzIGNhbiBiZSByZWVudHJhbnQgKGUuZy4sIGZvY3VzKS5cbiAgICBleHBvcnRzLmV2ZW50ID0gZXZlbnQxO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHRoaXMuX19kYXRhX18sIGluZGV4LCBncm91cCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGV4cG9ydHMuZXZlbnQgPSBldmVudDA7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5jYXB0dXJlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBjYXB0dXJlKSB7XG4gIHZhciB3cmFwID0gZmlsdGVyRXZlbnRzLmhhc093blByb3BlcnR5KHR5cGVuYW1lLnR5cGUpID8gZmlsdGVyQ29udGV4dExpc3RlbmVyIDogY29udGV4dExpc3RlbmVyO1xuICByZXR1cm4gZnVuY3Rpb24oZCwgaSwgZ3JvdXApIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gd3JhcCh2YWx1ZSwgaSwgZ3JvdXApO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLmNhcHR1cmUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8uY2FwdHVyZSA9IGNhcHR1cmUpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBjYXB0dXJlOiBjYXB0dXJlfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG52YXIgc2VsZWN0aW9uX29uID0gZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBjYXB0dXJlKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBpZiAoY2FwdHVyZSA9PSBudWxsKSBjYXB0dXJlID0gZmFsc2U7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBjYXB0dXJlKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gY3VzdG9tRXZlbnQoZXZlbnQxLCBsaXN0ZW5lciwgdGhhdCwgYXJncykge1xuICB2YXIgZXZlbnQwID0gZXhwb3J0cy5ldmVudDtcbiAgZXZlbnQxLnNvdXJjZUV2ZW50ID0gZXhwb3J0cy5ldmVudDtcbiAgZXhwb3J0cy5ldmVudCA9IGV2ZW50MTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbGlzdGVuZXIuYXBwbHkodGhhdCwgYXJncyk7XG4gIH0gZmluYWxseSB7XG4gICAgZXhwb3J0cy5ldmVudCA9IGV2ZW50MDtcbiAgfVxufVxuXG52YXIgc291cmNlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnQgPSBleHBvcnRzLmV2ZW50LCBzb3VyY2U7XG4gIHdoaWxlIChzb3VyY2UgPSBjdXJyZW50LnNvdXJjZUV2ZW50KSBjdXJyZW50ID0gc291cmNlO1xuICByZXR1cm4gY3VycmVudDtcbn07XG5cbnZhciBwb2ludCA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50KSB7XG4gIHZhciBzdmcgPSBub2RlLm93bmVyU1ZHRWxlbWVudCB8fCBub2RlO1xuXG4gIGlmIChzdmcuY3JlYXRlU1ZHUG9pbnQpIHtcbiAgICB2YXIgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBwb2ludC54ID0gZXZlbnQuY2xpZW50WCwgcG9pbnQueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgcG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0obm9kZS5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICAgIHJldHVybiBbcG9pbnQueCwgcG9pbnQueV07XG4gIH1cblxuICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiBbZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIG5vZGUuY2xpZW50TGVmdCwgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gbm9kZS5jbGllbnRUb3BdO1xufTtcblxudmFyIG1vdXNlID0gZnVuY3Rpb24obm9kZSkge1xuICB2YXIgZXZlbnQgPSBzb3VyY2VFdmVudCgpO1xuICBpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMpIGV2ZW50ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gIHJldHVybiBwb2ludChub2RlLCBldmVudCk7XG59O1xuXG5mdW5jdGlvbiBub25lKCkge31cblxudmFyIHNlbGVjdG9yID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBub25lIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH07XG59O1xuXG52YXIgc2VsZWN0aW9uX3NlbGVjdCA9IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvcihzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIHN1Ym5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpKSB7XG4gICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIHN1Ymdyb3VwW2ldID0gc3Vibm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufTtcblxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxudmFyIHNlbGVjdG9yQWxsID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBlbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICB9O1xufTtcblxudmFyIHNlbGVjdGlvbl9zZWxlY3RBbGwgPSBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn07XG5cbnZhciBzZWxlY3Rpb25fZmlsdGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIkMShtYXRjaCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IFtdLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIG1hdGNoLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn07XG5cbnZhciBzcGFyc2UgPSBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn07XG5cbnZhciBzZWxlY3Rpb25fZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZW50ZXIgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn07XG5cbmZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gIHRoaXMuX25leHQgPSBudWxsO1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbn1cblxuRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEVudGVyTm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7IH1cbn07XG5cbnZhciBjb25zdGFudCA9IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufTtcblxudmFyIGtleVByZWZpeCA9IFwiJFwiOyAvLyBQcm90ZWN0IGFnYWluc3Qga2V5cyBsaWtlIOKAnF9fcHJvdG9fX+KAnS5cblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9u4oCZdCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSB7fSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKSxcbiAgICAgIGtleVZhbHVlO1xuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBub2RlLlxuICAvLyBJZiBtdWx0aXBsZSBub2RlcyBoYXZlIHRoZSBzYW1lIGtleSwgdGhlIGR1cGxpY2F0ZXMgYXJlIGFkZGVkIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgICBpZiAoa2V5VmFsdWUgaW4gbm9kZUJ5S2V5VmFsdWUpIHtcbiAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBkYXR1bS5cbiAgLy8gSWYgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleSwgam9pbiBhbmQgYWRkIGl0IHRvIHVwZGF0ZS5cbiAgLy8gSWYgdGhlcmUgaXMgbm90IChvciB0aGUga2V5IGlzIGEgZHVwbGljYXRlKSwgYWRkIGl0IHRvIGVudGVyLlxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChwYXJlbnQsIGRhdGFbaV0sIGksIGRhdGEpO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWVba2V5VmFsdWVdKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlW2tleVZhbHVlc1tpXV0gPT09IG5vZGUpKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxudmFyIHNlbGVjdGlvbl9kYXRhID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgZGF0YSA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGogPSAtMTtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oZCkgeyBkYXRhWysral0gPSBkOyB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59O1xuXG52YXIgc2VsZWN0aW9uX2V4aXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZXhpdCB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufTtcblxudmFyIHNlbGVjdGlvbl9tZXJnZSA9IGZ1bmN0aW9uKHNlbGVjdGlvbikge1xuXG4gIGZvciAodmFyIGdyb3VwczAgPSB0aGlzLl9ncm91cHMsIGdyb3VwczEgPSBzZWxlY3Rpb24uX2dyb3VwcywgbTAgPSBncm91cHMwLmxlbmd0aCwgbTEgPSBncm91cHMxLmxlbmd0aCwgbSA9IE1hdGgubWluKG0wLCBtMSksIG1lcmdlcyA9IG5ldyBBcnJheShtMCksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAwID0gZ3JvdXBzMFtqXSwgZ3JvdXAxID0gZ3JvdXBzMVtqXSwgbiA9IGdyb3VwMC5sZW5ndGgsIG1lcmdlID0gbWVyZ2VzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cDBbaV0gfHwgZ3JvdXAxW2ldKSB7XG4gICAgICAgIG1lcmdlW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKDsgaiA8IG0wOyArK2opIHtcbiAgICBtZXJnZXNbal0gPSBncm91cHMwW2pdO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24obWVyZ2VzLCB0aGlzLl9wYXJlbnRzKTtcbn07XG5cbnZhciBzZWxlY3Rpb25fb3JkZXIgPSBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSBub2RlLm5leHRTaWJsaW5nKSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbnZhciBzZWxlY3Rpb25fc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKCFjb21wYXJlKSBjb21wYXJlID0gYXNjZW5kaW5nO1xuXG4gIGZ1bmN0aW9uIGNvbXBhcmVOb2RlKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyZShhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH1cblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzb3J0Z3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzb3J0Z3JvdXAgPSBzb3J0Z3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzb3J0Z3JvdXBbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0Z3JvdXAuc29ydChjb21wYXJlTm9kZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzb3J0Z3JvdXBzLCB0aGlzLl9wYXJlbnRzKS5vcmRlcigpO1xufTtcblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuXG52YXIgc2VsZWN0aW9uX2NhbGwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICBhcmd1bWVudHNbMF0gPSB0aGlzO1xuICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnZhciBzZWxlY3Rpb25fbm9kZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5vZGVzID0gbmV3IEFycmF5KHRoaXMuc2l6ZSgpKSwgaSA9IC0xO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7IG5vZGVzWysraV0gPSB0aGlzOyB9KTtcbiAgcmV0dXJuIG5vZGVzO1xufTtcblxudmFyIHNlbGVjdGlvbl9ub2RlID0gZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG52YXIgc2VsZWN0aW9uX3NpemUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNpemUgPSAwO1xuICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7ICsrc2l6ZTsgfSk7XG4gIHJldHVybiBzaXplO1xufTtcblxudmFyIHNlbGVjdGlvbl9lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufTtcblxudmFyIHNlbGVjdGlvbl9lYWNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG52YXIgc2VsZWN0aW9uX2F0dHIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn07XG5cbnZhciBkZWZhdWx0VmlldyA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgfHwgbm9kZS5kZWZhdWx0VmlldzsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG59O1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxudmFyIHNlbGVjdGlvbl9zdHlsZSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHN0eWxlUmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gc3R5bGVGdW5jdGlvblxuICAgICAgICAgICAgOiBzdHlsZUNvbnN0YW50KShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpXG4gICAgICA6IHN0eWxlVmFsdWUodGhpcy5ub2RlKCksIG5hbWUpO1xufTtcblxuZnVuY3Rpb24gc3R5bGVWYWx1ZShub2RlLCBuYW1lKSB7XG4gIHJldHVybiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSlcbiAgICAgIHx8IGRlZmF1bHRWaWV3KG5vZGUpLmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbnZhciBzZWxlY3Rpb25fcHJvcGVydHkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBwcm9wZXJ0eVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uXG4gICAgICAgICAgOiBwcm9wZXJ0eUNvbnN0YW50KShuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpW25hbWVdO1xufTtcblxuZnVuY3Rpb24gY2xhc3NBcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG5mdW5jdGlvbiBjbGFzc0xpc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc0xpc3QgfHwgbmV3IENsYXNzTGlzdChub2RlKTtcbn1cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KG5vZGUpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX25hbWVzID0gY2xhc3NBcnJheShub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpO1xufVxuXG5DbGFzc0xpc3QucHJvdG90eXBlID0ge1xuICBhZGQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgdGhpcy5fbmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICBjb250YWluczogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpID49IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNsYXNzZWRBZGQobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QuYWRkKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFJlbW92ZShub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5yZW1vdmUobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkVHJ1ZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZEFkZCh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGYWxzZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZFJlbW92ZSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbihuYW1lcywgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICh2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpID8gY2xhc3NlZEFkZCA6IGNsYXNzZWRSZW1vdmUpKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxudmFyIHNlbGVjdGlvbl9jbGFzc2VkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIG5hbWVzID0gY2xhc3NBcnJheShuYW1lICsgXCJcIik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIGxpc3QgPSBjbGFzc0xpc3QodGhpcy5ub2RlKCkpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghbGlzdC5jb250YWlucyhuYW1lc1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvbiA6IHZhbHVlXG4gICAgICA/IGNsYXNzZWRUcnVlXG4gICAgICA6IGNsYXNzZWRGYWxzZSkobmFtZXMsIHZhbHVlKSk7XG59O1xuXG5mdW5jdGlvbiB0ZXh0UmVtb3ZlKCkge1xuICB0aGlzLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxudmFyIHNlbGVjdGlvbl90ZXh0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHRleHRSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHRleHRGdW5jdGlvblxuICAgICAgICAgIDogdGV4dENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufTtcblxuZnVuY3Rpb24gaHRtbFJlbW92ZSgpIHtcbiAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBodG1sQ29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWxGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbnZhciBzZWxlY3Rpb25faHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBodG1sUmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBodG1sRnVuY3Rpb25cbiAgICAgICAgICA6IGh0bWxDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59O1xuXG5mdW5jdGlvbiByYWlzZSgpIHtcbiAgaWYgKHRoaXMubmV4dFNpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKTtcbn1cblxudmFyIHNlbGVjdGlvbl9yYWlzZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJhaXNlKTtcbn07XG5cbmZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG52YXIgc2VsZWN0aW9uX2xvd2VyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufTtcblxudmFyIHNlbGVjdGlvbl9hcHBlbmQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gY29uc3RhbnROdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIHNlbGVjdGlvbl9pbnNlcnQgPSBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKSxcbiAgICAgIHNlbGVjdCA9IGJlZm9yZSA9PSBudWxsID8gY29uc3RhbnROdWxsIDogdHlwZW9mIGJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gYmVmb3JlIDogc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gcmVtb3ZlKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59XG5cbnZhciBzZWxlY3Rpb25fcmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn07XG5cbnZhciBzZWxlY3Rpb25fZGF0dW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufTtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgaWYgKHR5cGVvZiBldmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxudmFyIHNlbGVjdGlvbl9kaXNwYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZGlzcGF0Y2hGdW5jdGlvblxuICAgICAgOiBkaXNwYXRjaENvbnN0YW50KSh0eXBlLCBwYXJhbXMpKTtcbn07XG5cbnZhciByb290ID0gW251bGxdO1xuXG5mdW5jdGlvbiBTZWxlY3Rpb24oZ3JvdXBzLCBwYXJlbnRzKSB7XG4gIHRoaXMuX2dyb3VwcyA9IGdyb3VwcztcbiAgdGhpcy5fcGFyZW50cyA9IHBhcmVudHM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdXSwgcm9vdCk7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIG1lcmdlOiBzZWxlY3Rpb25fbWVyZ2UsXG4gIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzc2VkLFxuICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gIHJhaXNlOiBzZWxlY3Rpb25fcmFpc2UsXG4gIGxvd2VyOiBzZWxlY3Rpb25fbG93ZXIsXG4gIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgaW5zZXJ0OiBzZWxlY3Rpb25faW5zZXJ0LFxuICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gIG9uOiBzZWxlY3Rpb25fb24sXG4gIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2hcbn07XG5cbnZhciBzZWxlY3QgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKV1dLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbW3NlbGVjdG9yXV0sIHJvb3QpO1xufTtcblxudmFyIHNlbGVjdEFsbCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFNlbGVjdGlvbihbZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbc2VsZWN0b3IgPT0gbnVsbCA/IFtdIDogc2VsZWN0b3JdLCByb290KTtcbn07XG5cbnZhciB0b3VjaCA9IGZ1bmN0aW9uKG5vZGUsIHRvdWNoZXMsIGlkZW50aWZpZXIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBpZGVudGlmaWVyID0gdG91Y2hlcywgdG91Y2hlcyA9IHNvdXJjZUV2ZW50KCkuY2hhbmdlZFRvdWNoZXM7XG5cbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzID8gdG91Y2hlcy5sZW5ndGggOiAwLCB0b3VjaDsgaSA8IG47ICsraSkge1xuICAgIGlmICgodG91Y2ggPSB0b3VjaGVzW2ldKS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXR1cm4gcG9pbnQobm9kZSwgdG91Y2gpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxudmFyIHRvdWNoZXMgPSBmdW5jdGlvbihub2RlLCB0b3VjaGVzKSB7XG4gIGlmICh0b3VjaGVzID09IG51bGwpIHRvdWNoZXMgPSBzb3VyY2VFdmVudCgpLnRvdWNoZXM7XG5cbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzID8gdG91Y2hlcy5sZW5ndGggOiAwLCBwb2ludHMgPSBuZXcgQXJyYXkobik7IGkgPCBuOyArK2kpIHtcbiAgICBwb2ludHNbaV0gPSBwb2ludChub2RlLCB0b3VjaGVzW2ldKTtcbiAgfVxuXG4gIHJldHVybiBwb2ludHM7XG59O1xuXG5leHBvcnRzLmNyZWF0b3IgPSBjcmVhdG9yO1xuZXhwb3J0cy5sb2NhbCA9IGxvY2FsO1xuZXhwb3J0cy5tYXRjaGVyID0gbWF0Y2hlciQxO1xuZXhwb3J0cy5tb3VzZSA9IG1vdXNlO1xuZXhwb3J0cy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5leHBvcnRzLm5hbWVzcGFjZXMgPSBuYW1lc3BhY2VzO1xuZXhwb3J0cy5zZWxlY3QgPSBzZWxlY3Q7XG5leHBvcnRzLnNlbGVjdEFsbCA9IHNlbGVjdEFsbDtcbmV4cG9ydHMuc2VsZWN0aW9uID0gc2VsZWN0aW9uO1xuZXhwb3J0cy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuZXhwb3J0cy5zZWxlY3RvckFsbCA9IHNlbGVjdG9yQWxsO1xuZXhwb3J0cy5zdHlsZSA9IHN0eWxlVmFsdWU7XG5leHBvcnRzLnRvdWNoID0gdG91Y2g7XG5leHBvcnRzLnRvdWNoZXMgPSB0b3VjaGVzO1xuZXhwb3J0cy53aW5kb3cgPSBkZWZhdWx0VmlldztcbmV4cG9ydHMuY3VzdG9tRXZlbnQgPSBjdXN0b21FdmVudDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtdGltZS1mb3JtYXQvIFZlcnNpb24gMi4wLjUuIENvcHlyaWdodCAyMDE3IE1pa2UgQm9zdG9jay5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cywgcmVxdWlyZSgnZDMtdGltZScpKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnLCAnZDMtdGltZSddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pLGdsb2JhbC5kMykpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMsZDNUaW1lKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gbG9jYWxEYXRlKGQpIHtcbiAgaWYgKDAgPD0gZC55ICYmIGQueSA8IDEwMCkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoLTEsIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpO1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZC55KTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuICByZXR1cm4gbmV3IERhdGUoZC55LCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKTtcbn1cblxuZnVuY3Rpb24gdXRjRGF0ZShkKSB7XG4gIGlmICgwIDw9IGQueSAmJiBkLnkgPCAxMDApIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKC0xLCBkLm0sIGQuZCwgZC5ILCBkLk0sIGQuUywgZC5MKSk7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkLnkpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG4gIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyhkLnksIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbn1cblxuZnVuY3Rpb24gbmV3WWVhcih5KSB7XG4gIHJldHVybiB7eTogeSwgbTogMCwgZDogMSwgSDogMCwgTTogMCwgUzogMCwgTDogMH07XG59XG5cbmZ1bmN0aW9uIGZvcm1hdExvY2FsZShsb2NhbGUpIHtcbiAgdmFyIGxvY2FsZV9kYXRlVGltZSA9IGxvY2FsZS5kYXRlVGltZSxcbiAgICAgIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsXG4gICAgICBsb2NhbGVfdGltZSA9IGxvY2FsZS50aW1lLFxuICAgICAgbG9jYWxlX3BlcmlvZHMgPSBsb2NhbGUucGVyaW9kcyxcbiAgICAgIGxvY2FsZV93ZWVrZGF5cyA9IGxvY2FsZS5kYXlzLFxuICAgICAgbG9jYWxlX3Nob3J0V2Vla2RheXMgPSBsb2NhbGUuc2hvcnREYXlzLFxuICAgICAgbG9jYWxlX21vbnRocyA9IGxvY2FsZS5tb250aHMsXG4gICAgICBsb2NhbGVfc2hvcnRNb250aHMgPSBsb2NhbGUuc2hvcnRNb250aHM7XG5cbiAgdmFyIHBlcmlvZFJlID0gZm9ybWF0UmUobG9jYWxlX3BlcmlvZHMpLFxuICAgICAgcGVyaW9kTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgIHdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICB3ZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV93ZWVrZGF5cyksXG4gICAgICBzaG9ydFdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgIHNob3J0V2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRXZWVrZGF5cyksXG4gICAgICBtb250aFJlID0gZm9ybWF0UmUobG9jYWxlX21vbnRocyksXG4gICAgICBtb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfbW9udGhzKSxcbiAgICAgIHNob3J0TW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydE1vbnRocyksXG4gICAgICBzaG9ydE1vbnRoTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydE1vbnRocyk7XG5cbiAgdmFyIGZvcm1hdHMgPSB7XG4gICAgXCJhXCI6IGZvcm1hdFNob3J0V2Vla2RheSxcbiAgICBcIkFcIjogZm9ybWF0V2Vla2RheSxcbiAgICBcImJcIjogZm9ybWF0U2hvcnRNb250aCxcbiAgICBcIkJcIjogZm9ybWF0TW9udGgsXG4gICAgXCJjXCI6IG51bGwsXG4gICAgXCJkXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgXCJlXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgXCJIXCI6IGZvcm1hdEhvdXIyNCxcbiAgICBcIklcIjogZm9ybWF0SG91cjEyLFxuICAgIFwialwiOiBmb3JtYXREYXlPZlllYXIsXG4gICAgXCJMXCI6IGZvcm1hdE1pbGxpc2Vjb25kcyxcbiAgICBcIm1cIjogZm9ybWF0TW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IGZvcm1hdE1pbnV0ZXMsXG4gICAgXCJwXCI6IGZvcm1hdFBlcmlvZCxcbiAgICBcIlNcIjogZm9ybWF0U2Vjb25kcyxcbiAgICBcIlVcIjogZm9ybWF0V2Vla051bWJlclN1bmRheSxcbiAgICBcIndcIjogZm9ybWF0V2Vla2RheU51bWJlcixcbiAgICBcIldcIjogZm9ybWF0V2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogbnVsbCxcbiAgICBcIlhcIjogbnVsbCxcbiAgICBcInlcIjogZm9ybWF0WWVhcixcbiAgICBcIllcIjogZm9ybWF0RnVsbFllYXIsXG4gICAgXCJaXCI6IGZvcm1hdFpvbmUsXG4gICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgdmFyIHV0Y0Zvcm1hdHMgPSB7XG4gICAgXCJhXCI6IGZvcm1hdFVUQ1Nob3J0V2Vla2RheSxcbiAgICBcIkFcIjogZm9ybWF0VVRDV2Vla2RheSxcbiAgICBcImJcIjogZm9ybWF0VVRDU2hvcnRNb250aCxcbiAgICBcIkJcIjogZm9ybWF0VVRDTW9udGgsXG4gICAgXCJjXCI6IG51bGwsXG4gICAgXCJkXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgXCJlXCI6IGZvcm1hdFVUQ0RheU9mTW9udGgsXG4gICAgXCJIXCI6IGZvcm1hdFVUQ0hvdXIyNCxcbiAgICBcIklcIjogZm9ybWF0VVRDSG91cjEyLFxuICAgIFwialwiOiBmb3JtYXRVVENEYXlPZlllYXIsXG4gICAgXCJMXCI6IGZvcm1hdFVUQ01pbGxpc2Vjb25kcyxcbiAgICBcIm1cIjogZm9ybWF0VVRDTW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IGZvcm1hdFVUQ01pbnV0ZXMsXG4gICAgXCJwXCI6IGZvcm1hdFVUQ1BlcmlvZCxcbiAgICBcIlNcIjogZm9ybWF0VVRDU2Vjb25kcyxcbiAgICBcIlVcIjogZm9ybWF0VVRDV2Vla051bWJlclN1bmRheSxcbiAgICBcIndcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlcixcbiAgICBcIldcIjogZm9ybWF0VVRDV2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogbnVsbCxcbiAgICBcIlhcIjogbnVsbCxcbiAgICBcInlcIjogZm9ybWF0VVRDWWVhcixcbiAgICBcIllcIjogZm9ybWF0VVRDRnVsbFllYXIsXG4gICAgXCJaXCI6IGZvcm1hdFVUQ1pvbmUsXG4gICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgdmFyIHBhcnNlcyA9IHtcbiAgICBcImFcIjogcGFyc2VTaG9ydFdlZWtkYXksXG4gICAgXCJBXCI6IHBhcnNlV2Vla2RheSxcbiAgICBcImJcIjogcGFyc2VTaG9ydE1vbnRoLFxuICAgIFwiQlwiOiBwYXJzZU1vbnRoLFxuICAgIFwiY1wiOiBwYXJzZUxvY2FsZURhdGVUaW1lLFxuICAgIFwiZFwiOiBwYXJzZURheU9mTW9udGgsXG4gICAgXCJlXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICBcIkhcIjogcGFyc2VIb3VyMjQsXG4gICAgXCJJXCI6IHBhcnNlSG91cjI0LFxuICAgIFwialwiOiBwYXJzZURheU9mWWVhcixcbiAgICBcIkxcIjogcGFyc2VNaWxsaXNlY29uZHMsXG4gICAgXCJtXCI6IHBhcnNlTW9udGhOdW1iZXIsXG4gICAgXCJNXCI6IHBhcnNlTWludXRlcyxcbiAgICBcInBcIjogcGFyc2VQZXJpb2QsXG4gICAgXCJTXCI6IHBhcnNlU2Vjb25kcyxcbiAgICBcIlVcIjogcGFyc2VXZWVrTnVtYmVyU3VuZGF5LFxuICAgIFwid1wiOiBwYXJzZVdlZWtkYXlOdW1iZXIsXG4gICAgXCJXXCI6IHBhcnNlV2Vla051bWJlck1vbmRheSxcbiAgICBcInhcIjogcGFyc2VMb2NhbGVEYXRlLFxuICAgIFwiWFwiOiBwYXJzZUxvY2FsZVRpbWUsXG4gICAgXCJ5XCI6IHBhcnNlWWVhcixcbiAgICBcIllcIjogcGFyc2VGdWxsWWVhcixcbiAgICBcIlpcIjogcGFyc2Vab25lLFxuICAgIFwiJVwiOiBwYXJzZUxpdGVyYWxQZXJjZW50XG4gIH07XG5cbiAgLy8gVGhlc2UgcmVjdXJzaXZlIGRpcmVjdGl2ZSBkZWZpbml0aW9ucyBtdXN0IGJlIGRlZmVycmVkLlxuICBmb3JtYXRzLnggPSBuZXdGb3JtYXQobG9jYWxlX2RhdGUsIGZvcm1hdHMpO1xuICBmb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIGZvcm1hdHMpO1xuICBmb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCBmb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCB1dGNGb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCB1dGNGb3JtYXRzKTtcbiAgdXRjRm9ybWF0cy5jID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlVGltZSwgdXRjRm9ybWF0cyk7XG5cbiAgZnVuY3Rpb24gbmV3Rm9ybWF0KHNwZWNpZmllciwgZm9ybWF0cykge1xuICAgIHJldHVybiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgc3RyaW5nID0gW10sXG4gICAgICAgICAgaSA9IC0xLFxuICAgICAgICAgIGogPSAwLFxuICAgICAgICAgIG4gPSBzcGVjaWZpZXIubGVuZ3RoLFxuICAgICAgICAgIGMsXG4gICAgICAgICAgcGFkLFxuICAgICAgICAgIGZvcm1hdDtcblxuICAgICAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSBkYXRlID0gbmV3IERhdGUoK2RhdGUpO1xuXG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBpZiAoc3BlY2lmaWVyLmNoYXJDb2RlQXQoaSkgPT09IDM3KSB7XG4gICAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgICBpZiAoKHBhZCA9IHBhZHNbYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKV0pICE9IG51bGwpIGMgPSBzcGVjaWZpZXIuY2hhckF0KCsraSk7XG4gICAgICAgICAgZWxzZSBwYWQgPSBjID09PSBcImVcIiA/IFwiIFwiIDogXCIwXCI7XG4gICAgICAgICAgaWYgKGZvcm1hdCA9IGZvcm1hdHNbY10pIGMgPSBmb3JtYXQoZGF0ZSwgcGFkKTtcbiAgICAgICAgICBzdHJpbmcucHVzaChjKTtcbiAgICAgICAgICBqID0gaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgIHJldHVybiBzdHJpbmcuam9pbihcIlwiKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UGFyc2Uoc3BlY2lmaWVyLCBuZXdEYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgdmFyIGQgPSBuZXdZZWFyKDE5MDApLFxuICAgICAgICAgIGkgPSBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZyArPSBcIlwiLCAwKTtcbiAgICAgIGlmIChpICE9IHN0cmluZy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gICAgICAvLyBUaGUgYW0tcG0gZmxhZyBpcyAwIGZvciBBTSwgYW5kIDEgZm9yIFBNLlxuICAgICAgaWYgKFwicFwiIGluIGQpIGQuSCA9IGQuSCAlIDEyICsgZC5wICogMTI7XG5cbiAgICAgIC8vIENvbnZlcnQgZGF5LW9mLXdlZWsgYW5kIHdlZWstb2YteWVhciB0byBkYXktb2YteWVhci5cbiAgICAgIGlmIChcIldcIiBpbiBkIHx8IFwiVVwiIGluIGQpIHtcbiAgICAgICAgaWYgKCEoXCJ3XCIgaW4gZCkpIGQudyA9IFwiV1wiIGluIGQgPyAxIDogMDtcbiAgICAgICAgdmFyIGRheSA9IFwiWlwiIGluIGQgPyB1dGNEYXRlKG5ld1llYXIoZC55KSkuZ2V0VVRDRGF5KCkgOiBuZXdEYXRlKG5ld1llYXIoZC55KSkuZ2V0RGF5KCk7XG4gICAgICAgIGQubSA9IDA7XG4gICAgICAgIGQuZCA9IFwiV1wiIGluIGQgPyAoZC53ICsgNikgJSA3ICsgZC5XICogNyAtIChkYXkgKyA1KSAlIDcgOiBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgYSB0aW1lIHpvbmUgaXMgc3BlY2lmaWVkLCBhbGwgZmllbGRzIGFyZSBpbnRlcnByZXRlZCBhcyBVVEMgYW5kIHRoZW5cbiAgICAgIC8vIG9mZnNldCBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmllZCB0aW1lIHpvbmUuXG4gICAgICBpZiAoXCJaXCIgaW4gZCkge1xuICAgICAgICBkLkggKz0gZC5aIC8gMTAwIHwgMDtcbiAgICAgICAgZC5NICs9IGQuWiAlIDEwMDtcbiAgICAgICAgcmV0dXJuIHV0Y0RhdGUoZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE90aGVyd2lzZSwgYWxsIGZpZWxkcyBhcmUgaW4gbG9jYWwgdGltZS5cbiAgICAgIHJldHVybiBuZXdEYXRlKGQpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVNwZWNpZmllcihkLCBzcGVjaWZpZXIsIHN0cmluZywgaikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgIG0gPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICBjLFxuICAgICAgICBwYXJzZTtcblxuICAgIHdoaWxlIChpIDwgbikge1xuICAgICAgaWYgKGogPj0gbSkgcmV0dXJuIC0xO1xuICAgICAgYyA9IHNwZWNpZmllci5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICBpZiAoYyA9PT0gMzcpIHtcbiAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQXQoaSsrKTtcbiAgICAgICAgcGFyc2UgPSBwYXJzZXNbYyBpbiBwYWRzID8gc3BlY2lmaWVyLmNoYXJBdChpKyspIDogY107XG4gICAgICAgIGlmICghcGFyc2UgfHwgKChqID0gcGFyc2UoZCwgc3RyaW5nLCBqKSkgPCAwKSkgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChjICE9IHN0cmluZy5jaGFyQ29kZUF0KGorKykpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VQZXJpb2QoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBwZXJpb2RSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5wID0gcGVyaW9kTG9va3VwW25bMF0udG9Mb3dlckNhc2UoKV0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU2hvcnRXZWVrZGF5KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gc2hvcnRXZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9IHNob3J0V2Vla2RheUxvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSB3ZWVrZGF5UmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9IHdlZWtkYXlMb29rdXBbblswXS50b0xvd2VyQ2FzZSgpXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTaG9ydE1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gc2hvcnRNb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSBzaG9ydE1vbnRoTG9va3VwW25bMF0udG9Mb3dlckNhc2UoKV0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBtb250aFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSBtb250aExvb2t1cFtuWzBdLnRvTG93ZXJDYXNlKCldLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZVRpbWUsIHN0cmluZywgaSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUxvY2FsZURhdGUoZCwgc3RyaW5nLCBpKSB7XG4gICAgcmV0dXJuIHBhcnNlU3BlY2lmaWVyKGQsIGxvY2FsZV9kYXRlLCBzdHJpbmcsIGkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VMb2NhbGVUaW1lKGQsIHN0cmluZywgaSkge1xuICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfdGltZSwgc3RyaW5nLCBpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0RGF5KCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldERheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNob3J0TW9udGgoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldE1vbnRoKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UGVyaW9kKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldEhvdXJzKCkgPj0gMTIpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0V2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV9zaG9ydFdlZWtkYXlzW2QuZ2V0VVRDRGF5KCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheShkKSB7XG4gICAgcmV0dXJuIGxvY2FsZV93ZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1Nob3J0TW9udGgoZCkge1xuICAgIHJldHVybiBsb2NhbGVfc2hvcnRNb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ01vbnRoKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX21vbnRoc1tkLmdldFVUQ01vbnRoKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDUGVyaW9kKGQpIHtcbiAgICByZXR1cm4gbG9jYWxlX3BlcmlvZHNbKyhkLmdldFVUQ0hvdXJzKCkgPj0gMTIpXTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCBmb3JtYXRzKTtcbiAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBmO1xuICAgIH0sXG4gICAgcGFyc2U6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIHAgPSBuZXdQYXJzZShzcGVjaWZpZXIgKz0gXCJcIiwgbG9jYWxEYXRlKTtcbiAgICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0sXG4gICAgdXRjRm9ybWF0OiBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCB1dGNGb3JtYXRzKTtcbiAgICAgIGYudG9TdHJpbmcgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHNwZWNpZmllcjsgfTtcbiAgICAgIHJldHVybiBmO1xuICAgIH0sXG4gICAgdXRjUGFyc2U6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgdmFyIHAgPSBuZXdQYXJzZShzcGVjaWZpZXIsIHV0Y0RhdGUpO1xuICAgICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9O1xufVxuXG52YXIgcGFkcyA9IHtcIi1cIjogXCJcIiwgXCJfXCI6IFwiIFwiLCBcIjBcIjogXCIwXCJ9O1xudmFyIG51bWJlclJlID0gL15cXHMqXFxkKy87XG52YXIgcGVyY2VudFJlID0gL14lLztcbnZhciByZXF1b3RlUmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbmZ1bmN0aW9uIHBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgdmFyIHNpZ24gPSB2YWx1ZSA8IDAgPyBcIi1cIiA6IFwiXCIsXG4gICAgICBzdHJpbmcgPSAoc2lnbiA/IC12YWx1ZSA6IHZhbHVlKSArIFwiXCIsXG4gICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICByZXR1cm4gc2lnbiArIChsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgKyBzdHJpbmcgOiBzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiByZXF1b3RlKHMpIHtcbiAgcmV0dXJuIHMucmVwbGFjZShyZXF1b3RlUmUsIFwiXFxcXCQmXCIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRSZShuYW1lcykge1xuICByZXR1cm4gbmV3IFJlZ0V4cChcIl4oPzpcIiArIG5hbWVzLm1hcChyZXF1b3RlKS5qb2luKFwifFwiKSArIFwiKVwiLCBcImlcIik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICB2YXIgbWFwID0ge30sIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIG1hcFtuYW1lc1tpXS50b0xvd2VyQ2FzZSgpXSA9IGk7XG4gIHJldHVybiBtYXA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlV2Vla2RheU51bWJlcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMSkpO1xuICByZXR1cm4gbiA/IChkLncgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJTdW5kYXkoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICByZXR1cm4gbiA/IChkLlUgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJNb25kYXkoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSkpO1xuICByZXR1cm4gbiA/IChkLlcgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZ1bGxZZWFyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA0KSk7XG4gIHJldHVybiBuID8gKGQueSA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlWm9uZShkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSAvXihaKXwoWystXVxcZFxcZCkoPzpcXDo/KFxcZFxcZCkpPy8uZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDYpKTtcbiAgcmV0dXJuIG4gPyAoZC5aID0gblsxXSA/IDAgOiAtKG5bMl0gKyAoblszXSB8fCBcIjAwXCIpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1vbnRoTnVtYmVyKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQubSA9IG5bMF0gLSAxLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF5T2ZNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZURheU9mWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICByZXR1cm4gbiA/IChkLm0gPSAwLCBkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZUhvdXIyNChkLCBzdHJpbmcsIGkpIHtcbiAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMikpO1xuICByZXR1cm4gbiA/IChkLkggPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1pbnV0ZXMoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgcmV0dXJuIG4gPyAoZC5NID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gIHJldHVybiBuID8gKGQuUyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWlsbGlzZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAzKSk7XG4gIHJldHVybiBuID8gKGQuTCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTGl0ZXJhbFBlcmNlbnQoZCwgc3RyaW5nLCBpKSB7XG4gIHZhciBuID0gcGVyY2VudFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gIHJldHVybiBuID8gaSArIG5bMF0ubGVuZ3RoIDogLTE7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdERheU9mTW9udGgoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0RGF0ZSgpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0SG91cjI0KGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEhvdXJzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRIb3VyMTIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0SG91cnMoKSAlIDEyIHx8IDEyLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF5T2ZZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZCgxICsgZDNUaW1lLnRpbWVEYXkuY291bnQoZDNUaW1lLnRpbWVZZWFyKGQpLCBkKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1pbGxpc2Vjb25kcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdE1vbnRoTnVtYmVyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWludXRlcyhkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRNaW51dGVzKCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRTZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFNlY29uZHMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKGQzVGltZS50aW1lU3VuZGF5LmNvdW50KGQzVGltZS50aW1lWWVhcihkKSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRXZWVrZGF5TnVtYmVyKGQpIHtcbiAgcmV0dXJuIGQuZ2V0RGF5KCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKGQzVGltZS50aW1lTW9uZGF5LmNvdW50KGQzVGltZS50aW1lWWVhcihkKSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRZZWFyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRGdWxsWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRab25lKGQpIHtcbiAgdmFyIHogPSBkLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gIHJldHVybiAoeiA+IDAgPyBcIi1cIiA6ICh6ICo9IC0xLCBcIitcIikpXG4gICAgICArIHBhZCh6IC8gNjAgfCAwLCBcIjBcIiwgMilcbiAgICAgICsgcGFkKHogJSA2MCwgXCIwXCIsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENEYXlPZk1vbnRoKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0RhdGUoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0hvdXIyNChkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDSG91cjEyKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ0hvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoMSArIGQzVGltZS51dGNEYXkuY291bnQoZDNUaW1lLnV0Y1llYXIoZCksIGQpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTWlsbGlzZWNvbmRzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01pbGxpc2Vjb25kcygpLCBwLCAzKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEsIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENNaW51dGVzKGQsIHApIHtcbiAgcmV0dXJuIHBhZChkLmdldFVUQ01pbnV0ZXMoKSwgcCwgMik7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1NlY29uZHMoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDU2Vjb25kcygpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlclN1bmRheShkLCBwKSB7XG4gIHJldHVybiBwYWQoZDNUaW1lLnV0Y1N1bmRheS5jb3VudChkM1RpbWUudXRjWWVhcihkKSwgZCksIHAsIDIpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRVVENXZWVrZGF5TnVtYmVyKGQpIHtcbiAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVUQ1dlZWtOdW1iZXJNb25kYXkoZCwgcCkge1xuICByZXR1cm4gcGFkKGQzVGltZS51dGNNb25kYXkuY291bnQoZDNUaW1lLnV0Y1llYXIoZCksIGQpLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDWWVhcihkLCBwKSB7XG4gIHJldHVybiBwYWQoZC5nZXRVVENGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDRnVsbFllYXIoZCwgcCkge1xuICByZXR1cm4gcGFkKGQuZ2V0VVRDRnVsbFllYXIoKSAlIDEwMDAwLCBwLCA0KTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VVRDWm9uZSgpIHtcbiAgcmV0dXJuIFwiKzAwMDBcIjtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TGl0ZXJhbFBlcmNlbnQoKSB7XG4gIHJldHVybiBcIiVcIjtcbn1cblxudmFyIGxvY2FsZSQxO1xuXG5cblxuXG5cbmRlZmF1bHRMb2NhbGUoe1xuICBkYXRlVGltZTogXCIleCwgJVhcIixcbiAgZGF0ZTogXCIlLW0vJS1kLyVZXCIsXG4gIHRpbWU6IFwiJS1JOiVNOiVTICVwXCIsXG4gIHBlcmlvZHM6IFtcIkFNXCIsIFwiUE1cIl0sXG4gIGRheXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICBzaG9ydERheXM6IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXSxcbiAgbW9udGhzOiBbXCJKYW51YXJ5XCIsIFwiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCIsIFwiTWF5XCIsIFwiSnVuZVwiLCBcIkp1bHlcIiwgXCJBdWd1c3RcIiwgXCJTZXB0ZW1iZXJcIiwgXCJPY3RvYmVyXCIsIFwiTm92ZW1iZXJcIiwgXCJEZWNlbWJlclwiXSxcbiAgc2hvcnRNb250aHM6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXVxufSk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRMb2NhbGUoZGVmaW5pdGlvbikge1xuICBsb2NhbGUkMSA9IGZvcm1hdExvY2FsZShkZWZpbml0aW9uKTtcbiAgZXhwb3J0cy50aW1lRm9ybWF0ID0gbG9jYWxlJDEuZm9ybWF0O1xuICBleHBvcnRzLnRpbWVQYXJzZSA9IGxvY2FsZSQxLnBhcnNlO1xuICBleHBvcnRzLnV0Y0Zvcm1hdCA9IGxvY2FsZSQxLnV0Y0Zvcm1hdDtcbiAgZXhwb3J0cy51dGNQYXJzZSA9IGxvY2FsZSQxLnV0Y1BhcnNlO1xuICByZXR1cm4gbG9jYWxlJDE7XG59XG5cbnZhciBpc29TcGVjaWZpZXIgPSBcIiVZLSVtLSVkVCVIOiVNOiVTLiVMWlwiO1xuXG5mdW5jdGlvbiBmb3JtYXRJc29OYXRpdmUoZGF0ZSkge1xuICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpO1xufVxuXG52YXIgZm9ybWF0SXNvID0gRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmdcbiAgICA/IGZvcm1hdElzb05hdGl2ZVxuICAgIDogZXhwb3J0cy51dGNGb3JtYXQoaXNvU3BlY2lmaWVyKTtcblxuZnVuY3Rpb24gcGFyc2VJc29OYXRpdmUoc3RyaW5nKSB7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoc3RyaW5nKTtcbiAgcmV0dXJuIGlzTmFOKGRhdGUpID8gbnVsbCA6IGRhdGU7XG59XG5cbnZhciBwYXJzZUlzbyA9ICtuZXcgRGF0ZShcIjIwMDAtMDEtMDFUMDA6MDA6MDAuMDAwWlwiKVxuICAgID8gcGFyc2VJc29OYXRpdmVcbiAgICA6IGV4cG9ydHMudXRjUGFyc2UoaXNvU3BlY2lmaWVyKTtcblxuZXhwb3J0cy50aW1lRm9ybWF0RGVmYXVsdExvY2FsZSA9IGRlZmF1bHRMb2NhbGU7XG5leHBvcnRzLnRpbWVGb3JtYXRMb2NhbGUgPSBmb3JtYXRMb2NhbGU7XG5leHBvcnRzLmlzb0Zvcm1hdCA9IGZvcm1hdElzbztcbmV4cG9ydHMuaXNvUGFyc2UgPSBwYXJzZUlzbztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbiIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtdGltZS8gVmVyc2lvbiAxLjAuNy4gQ29weXJpZ2h0IDIwMTcgTWlrZSBCb3N0b2NrLlxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuXHQoZmFjdG9yeSgoZ2xvYmFsLmQzID0gZ2xvYmFsLmQzIHx8IHt9KSkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgdDAgPSBuZXcgRGF0ZTtcbnZhciB0MSA9IG5ldyBEYXRlO1xuXG5mdW5jdGlvbiBuZXdJbnRlcnZhbChmbG9vcmksIG9mZnNldGksIGNvdW50LCBmaWVsZCkge1xuXG4gIGZ1bmN0aW9uIGludGVydmFsKGRhdGUpIHtcbiAgICByZXR1cm4gZmxvb3JpKGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSkpLCBkYXRlO1xuICB9XG5cbiAgaW50ZXJ2YWwuZmxvb3IgPSBpbnRlcnZhbDtcblxuICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHJldHVybiBmbG9vcmkoZGF0ZSA9IG5ldyBEYXRlKGRhdGUgLSAxKSksIG9mZnNldGkoZGF0ZSwgMSksIGZsb29yaShkYXRlKSwgZGF0ZTtcbiAgfTtcblxuICBpbnRlcnZhbC5yb3VuZCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZDAgPSBpbnRlcnZhbChkYXRlKSxcbiAgICAgICAgZDEgPSBpbnRlcnZhbC5jZWlsKGRhdGUpO1xuICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICB9O1xuXG4gIGludGVydmFsLm9mZnNldCA9IGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICByZXR1cm4gb2Zmc2V0aShkYXRlID0gbmV3IERhdGUoK2RhdGUpLCBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKSksIGRhdGU7XG4gIH07XG5cbiAgaW50ZXJ2YWwucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIHZhciByYW5nZSA9IFtdO1xuICAgIHN0YXJ0ID0gaW50ZXJ2YWwuY2VpbChzdGFydCk7XG4gICAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiBNYXRoLmZsb29yKHN0ZXApO1xuICAgIGlmICghKHN0YXJ0IDwgc3RvcCkgfHwgIShzdGVwID4gMCkpIHJldHVybiByYW5nZTsgLy8gYWxzbyBoYW5kbGVzIEludmFsaWQgRGF0ZVxuICAgIGRvIHJhbmdlLnB1c2gobmV3IERhdGUoK3N0YXJ0KSk7IHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKVxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgcmV0dXJuIG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgIGlmIChkYXRlID49IGRhdGUpIHdoaWxlIChmbG9vcmkoZGF0ZSksICF0ZXN0KGRhdGUpKSBkYXRlLnNldFRpbWUoZGF0ZSAtIDEpO1xuICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgIGlmIChkYXRlID49IGRhdGUpIHtcbiAgICAgICAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKytzdGVwIDw9IDApIHtcbiAgICAgICAgICB3aGlsZSAob2Zmc2V0aShkYXRlLCAtMSksICF0ZXN0KGRhdGUpKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5XG4gICAgICAgIH0gZWxzZSB3aGlsZSAoLS1zdGVwID49IDApIHtcbiAgICAgICAgICB3aGlsZSAob2Zmc2V0aShkYXRlLCArMSksICF0ZXN0KGRhdGUpKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBpZiAoY291bnQpIHtcbiAgICBpbnRlcnZhbC5jb3VudCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHQwLnNldFRpbWUoK3N0YXJ0KSwgdDEuc2V0VGltZSgrZW5kKTtcbiAgICAgIGZsb29yaSh0MCksIGZsb29yaSh0MSk7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihjb3VudCh0MCwgdDEpKTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwuZXZlcnkgPSBmdW5jdGlvbihzdGVwKSB7XG4gICAgICBzdGVwID0gTWF0aC5mbG9vcihzdGVwKTtcbiAgICAgIHJldHVybiAhaXNGaW5pdGUoc3RlcCkgfHwgIShzdGVwID4gMCkgPyBudWxsXG4gICAgICAgICAgOiAhKHN0ZXAgPiAxKSA/IGludGVydmFsXG4gICAgICAgICAgOiBpbnRlcnZhbC5maWx0ZXIoZmllbGRcbiAgICAgICAgICAgICAgPyBmdW5jdGlvbihkKSB7IHJldHVybiBmaWVsZChkKSAlIHN0ZXAgPT09IDA7IH1cbiAgICAgICAgICAgICAgOiBmdW5jdGlvbihkKSB7IHJldHVybiBpbnRlcnZhbC5jb3VudCgwLCBkKSAlIHN0ZXAgPT09IDA7IH0pO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gaW50ZXJ2YWw7XG59XG5cbnZhciBtaWxsaXNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKCkge1xuICAvLyBub29wXG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXApO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZW5kIC0gc3RhcnQ7XG59KTtcblxuLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxubWlsbGlzZWNvbmQuZXZlcnkgPSBmdW5jdGlvbihrKSB7XG4gIGsgPSBNYXRoLmZsb29yKGspO1xuICBpZiAoIWlzRmluaXRlKGspIHx8ICEoayA+IDApKSByZXR1cm4gbnVsbDtcbiAgaWYgKCEoayA+IDEpKSByZXR1cm4gbWlsbGlzZWNvbmQ7XG4gIHJldHVybiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGspICogayk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogayk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGs7XG4gIH0pO1xufTtcblxudmFyIG1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kLnJhbmdlO1xuXG52YXIgZHVyYXRpb25TZWNvbmQgPSAxZTM7XG52YXIgZHVyYXRpb25NaW51dGUgPSA2ZTQ7XG52YXIgZHVyYXRpb25Ib3VyID0gMzZlNTtcbnZhciBkdXJhdGlvbkRheSA9IDg2NGU1O1xudmFyIGR1cmF0aW9uV2VlayA9IDYwNDhlNTtcblxudmFyIHNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRUaW1lKE1hdGguZmxvb3IoZGF0ZSAvIGR1cmF0aW9uU2Vjb25kKSAqIGR1cmF0aW9uU2Vjb25kKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uU2Vjb25kKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvblNlY29uZDtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDU2Vjb25kcygpO1xufSk7XG5cbnZhciBzZWNvbmRzID0gc2Vjb25kLnJhbmdlO1xuXG52YXIgbWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcihkYXRlIC8gZHVyYXRpb25NaW51dGUpICogZHVyYXRpb25NaW51dGUpO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25NaW51dGUpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uTWludXRlO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRNaW51dGVzKCk7XG59KTtcblxudmFyIG1pbnV0ZXMgPSBtaW51dGUucmFuZ2U7XG5cbnZhciBob3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICB2YXIgb2Zmc2V0ID0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogZHVyYXRpb25NaW51dGUgJSBkdXJhdGlvbkhvdXI7XG4gIGlmIChvZmZzZXQgPCAwKSBvZmZzZXQgKz0gZHVyYXRpb25Ib3VyO1xuICBkYXRlLnNldFRpbWUoTWF0aC5mbG9vcigoK2RhdGUgLSBvZmZzZXQpIC8gZHVyYXRpb25Ib3VyKSAqIGR1cmF0aW9uSG91ciArIG9mZnNldCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiBkdXJhdGlvbkhvdXIpO1xufSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIGR1cmF0aW9uSG91cjtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0SG91cnMoKTtcbn0pO1xuXG52YXIgaG91cnMgPSBob3VyLnJhbmdlO1xuXG52YXIgZGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogZHVyYXRpb25NaW51dGUpIC8gZHVyYXRpb25EYXk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldERhdGUoKSAtIDE7XG59KTtcblxudmFyIGRheXMgPSBkYXkucmFuZ2U7XG5cbmZ1bmN0aW9uIHdlZWtkYXkoaSkge1xuICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIGR1cmF0aW9uTWludXRlKSAvIGR1cmF0aW9uV2VlaztcbiAgfSk7XG59XG5cbnZhciBzdW5kYXkgPSB3ZWVrZGF5KDApO1xudmFyIG1vbmRheSA9IHdlZWtkYXkoMSk7XG52YXIgdHVlc2RheSA9IHdlZWtkYXkoMik7XG52YXIgd2VkbmVzZGF5ID0gd2Vla2RheSgzKTtcbnZhciB0aHVyc2RheSA9IHdlZWtkYXkoNCk7XG52YXIgZnJpZGF5ID0gd2Vla2RheSg1KTtcbnZhciBzYXR1cmRheSA9IHdlZWtkYXkoNik7XG5cbnZhciBzdW5kYXlzID0gc3VuZGF5LnJhbmdlO1xudmFyIG1vbmRheXMgPSBtb25kYXkucmFuZ2U7XG52YXIgdHVlc2RheXMgPSB0dWVzZGF5LnJhbmdlO1xudmFyIHdlZG5lc2RheXMgPSB3ZWRuZXNkYXkucmFuZ2U7XG52YXIgdGh1cnNkYXlzID0gdGh1cnNkYXkucmFuZ2U7XG52YXIgZnJpZGF5cyA9IGZyaWRheS5yYW5nZTtcbnZhciBzYXR1cmRheXMgPSBzYXR1cmRheS5yYW5nZTtcblxudmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICBkYXRlLnNldERhdGUoMSk7XG4gIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xufSwgZnVuY3Rpb24oZGF0ZSkge1xuICByZXR1cm4gZGF0ZS5nZXRNb250aCgpO1xufSk7XG5cbnZhciBtb250aHMgPSBtb250aC5yYW5nZTtcblxudmFyIHllYXIgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG59LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBlbmQuZ2V0RnVsbFllYXIoKSAtIHN0YXJ0LmdldEZ1bGxZZWFyKCk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCk7XG59KTtcblxuLy8gQW4gb3B0aW1pemVkIGltcGxlbWVudGF0aW9uIGZvciB0aGlzIHNpbXBsZSBjYXNlLlxueWVhci5ldmVyeSA9IGZ1bmN0aW9uKGspIHtcbiAgcmV0dXJuICFpc0Zpbml0ZShrID0gTWF0aC5mbG9vcihrKSkgfHwgIShrID4gMCkgPyBudWxsIDogbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoTWF0aC5mbG9vcihkYXRlLmdldEZ1bGxZZWFyKCkgLyBrKSAqIGspO1xuICAgIGRhdGUuc2V0TW9udGgoMCwgMSk7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCAqIGspO1xuICB9KTtcbn07XG5cbnZhciB5ZWFycyA9IHllYXIucmFuZ2U7XG5cbnZhciB1dGNNaW51dGUgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIGR1cmF0aW9uTWludXRlKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbk1pbnV0ZTtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDTWludXRlcygpO1xufSk7XG5cbnZhciB1dGNNaW51dGVzID0gdXRjTWludXRlLnJhbmdlO1xuXG52YXIgdXRjSG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENNaW51dGVzKDAsIDAsIDApO1xufSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogZHVyYXRpb25Ib3VyKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyBkdXJhdGlvbkhvdXI7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ0hvdXJzKCk7XG59KTtcblxudmFyIHV0Y0hvdXJzID0gdXRjSG91ci5yYW5nZTtcblxudmFyIHV0Y0RheSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCk7XG59LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25EYXk7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ0RhdGUoKSAtIDE7XG59KTtcblxudmFyIHV0Y0RheXMgPSB1dGNEYXkucmFuZ2U7XG5cbmZ1bmN0aW9uIHV0Y1dlZWtkYXkoaSkge1xuICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIHN0ZXAgKiA3KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gZHVyYXRpb25XZWVrO1xuICB9KTtcbn1cblxudmFyIHV0Y1N1bmRheSA9IHV0Y1dlZWtkYXkoMCk7XG52YXIgdXRjTW9uZGF5ID0gdXRjV2Vla2RheSgxKTtcbnZhciB1dGNUdWVzZGF5ID0gdXRjV2Vla2RheSgyKTtcbnZhciB1dGNXZWRuZXNkYXkgPSB1dGNXZWVrZGF5KDMpO1xudmFyIHV0Y1RodXJzZGF5ID0gdXRjV2Vla2RheSg0KTtcbnZhciB1dGNGcmlkYXkgPSB1dGNXZWVrZGF5KDUpO1xudmFyIHV0Y1NhdHVyZGF5ID0gdXRjV2Vla2RheSg2KTtcblxudmFyIHV0Y1N1bmRheXMgPSB1dGNTdW5kYXkucmFuZ2U7XG52YXIgdXRjTW9uZGF5cyA9IHV0Y01vbmRheS5yYW5nZTtcbnZhciB1dGNUdWVzZGF5cyA9IHV0Y1R1ZXNkYXkucmFuZ2U7XG52YXIgdXRjV2VkbmVzZGF5cyA9IHV0Y1dlZG5lc2RheS5yYW5nZTtcbnZhciB1dGNUaHVyc2RheXMgPSB1dGNUaHVyc2RheS5yYW5nZTtcbnZhciB1dGNGcmlkYXlzID0gdXRjRnJpZGF5LnJhbmdlO1xudmFyIHV0Y1NhdHVyZGF5cyA9IHV0Y1NhdHVyZGF5LnJhbmdlO1xuXG52YXIgdXRjTW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gIGRhdGUuc2V0VVRDRGF0ZSgxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENNb250aChkYXRlLmdldFVUQ01vbnRoKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG59LCBmdW5jdGlvbihkYXRlKSB7XG4gIHJldHVybiBkYXRlLmdldFVUQ01vbnRoKCk7XG59KTtcblxudmFyIHV0Y01vbnRocyA9IHV0Y01vbnRoLnJhbmdlO1xuXG52YXIgdXRjWWVhciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbn0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwKTtcbn0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIGVuZC5nZXRVVENGdWxsWWVhcigpIC0gc3RhcnQuZ2V0VVRDRnVsbFllYXIoKTtcbn0sIGZ1bmN0aW9uKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbn0pO1xuXG4vLyBBbiBvcHRpbWl6ZWQgaW1wbGVtZW50YXRpb24gZm9yIHRoaXMgc2ltcGxlIGNhc2UuXG51dGNZZWFyLmV2ZXJ5ID0gZnVuY3Rpb24oaykge1xuICByZXR1cm4gIWlzRmluaXRlKGsgPSBNYXRoLmZsb29yKGspKSB8fCAhKGsgPiAwKSA/IG51bGwgOiBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihNYXRoLmZsb29yKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSAvIGspICogayk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgICBkYXRlLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyBzdGVwICogayk7XG4gIH0pO1xufTtcblxudmFyIHV0Y1llYXJzID0gdXRjWWVhci5yYW5nZTtcblxuZXhwb3J0cy50aW1lSW50ZXJ2YWwgPSBuZXdJbnRlcnZhbDtcbmV4cG9ydHMudGltZU1pbGxpc2Vjb25kID0gbWlsbGlzZWNvbmQ7XG5leHBvcnRzLnRpbWVNaWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHM7XG5leHBvcnRzLnV0Y01pbGxpc2Vjb25kID0gbWlsbGlzZWNvbmQ7XG5leHBvcnRzLnV0Y01pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbmV4cG9ydHMudGltZVNlY29uZCA9IHNlY29uZDtcbmV4cG9ydHMudGltZVNlY29uZHMgPSBzZWNvbmRzO1xuZXhwb3J0cy51dGNTZWNvbmQgPSBzZWNvbmQ7XG5leHBvcnRzLnV0Y1NlY29uZHMgPSBzZWNvbmRzO1xuZXhwb3J0cy50aW1lTWludXRlID0gbWludXRlO1xuZXhwb3J0cy50aW1lTWludXRlcyA9IG1pbnV0ZXM7XG5leHBvcnRzLnRpbWVIb3VyID0gaG91cjtcbmV4cG9ydHMudGltZUhvdXJzID0gaG91cnM7XG5leHBvcnRzLnRpbWVEYXkgPSBkYXk7XG5leHBvcnRzLnRpbWVEYXlzID0gZGF5cztcbmV4cG9ydHMudGltZVdlZWsgPSBzdW5kYXk7XG5leHBvcnRzLnRpbWVXZWVrcyA9IHN1bmRheXM7XG5leHBvcnRzLnRpbWVTdW5kYXkgPSBzdW5kYXk7XG5leHBvcnRzLnRpbWVTdW5kYXlzID0gc3VuZGF5cztcbmV4cG9ydHMudGltZU1vbmRheSA9IG1vbmRheTtcbmV4cG9ydHMudGltZU1vbmRheXMgPSBtb25kYXlzO1xuZXhwb3J0cy50aW1lVHVlc2RheSA9IHR1ZXNkYXk7XG5leHBvcnRzLnRpbWVUdWVzZGF5cyA9IHR1ZXNkYXlzO1xuZXhwb3J0cy50aW1lV2VkbmVzZGF5ID0gd2VkbmVzZGF5O1xuZXhwb3J0cy50aW1lV2VkbmVzZGF5cyA9IHdlZG5lc2RheXM7XG5leHBvcnRzLnRpbWVUaHVyc2RheSA9IHRodXJzZGF5O1xuZXhwb3J0cy50aW1lVGh1cnNkYXlzID0gdGh1cnNkYXlzO1xuZXhwb3J0cy50aW1lRnJpZGF5ID0gZnJpZGF5O1xuZXhwb3J0cy50aW1lRnJpZGF5cyA9IGZyaWRheXM7XG5leHBvcnRzLnRpbWVTYXR1cmRheSA9IHNhdHVyZGF5O1xuZXhwb3J0cy50aW1lU2F0dXJkYXlzID0gc2F0dXJkYXlzO1xuZXhwb3J0cy50aW1lTW9udGggPSBtb250aDtcbmV4cG9ydHMudGltZU1vbnRocyA9IG1vbnRocztcbmV4cG9ydHMudGltZVllYXIgPSB5ZWFyO1xuZXhwb3J0cy50aW1lWWVhcnMgPSB5ZWFycztcbmV4cG9ydHMudXRjTWludXRlID0gdXRjTWludXRlO1xuZXhwb3J0cy51dGNNaW51dGVzID0gdXRjTWludXRlcztcbmV4cG9ydHMudXRjSG91ciA9IHV0Y0hvdXI7XG5leHBvcnRzLnV0Y0hvdXJzID0gdXRjSG91cnM7XG5leHBvcnRzLnV0Y0RheSA9IHV0Y0RheTtcbmV4cG9ydHMudXRjRGF5cyA9IHV0Y0RheXM7XG5leHBvcnRzLnV0Y1dlZWsgPSB1dGNTdW5kYXk7XG5leHBvcnRzLnV0Y1dlZWtzID0gdXRjU3VuZGF5cztcbmV4cG9ydHMudXRjU3VuZGF5ID0gdXRjU3VuZGF5O1xuZXhwb3J0cy51dGNTdW5kYXlzID0gdXRjU3VuZGF5cztcbmV4cG9ydHMudXRjTW9uZGF5ID0gdXRjTW9uZGF5O1xuZXhwb3J0cy51dGNNb25kYXlzID0gdXRjTW9uZGF5cztcbmV4cG9ydHMudXRjVHVlc2RheSA9IHV0Y1R1ZXNkYXk7XG5leHBvcnRzLnV0Y1R1ZXNkYXlzID0gdXRjVHVlc2RheXM7XG5leHBvcnRzLnV0Y1dlZG5lc2RheSA9IHV0Y1dlZG5lc2RheTtcbmV4cG9ydHMudXRjV2VkbmVzZGF5cyA9IHV0Y1dlZG5lc2RheXM7XG5leHBvcnRzLnV0Y1RodXJzZGF5ID0gdXRjVGh1cnNkYXk7XG5leHBvcnRzLnV0Y1RodXJzZGF5cyA9IHV0Y1RodXJzZGF5cztcbmV4cG9ydHMudXRjRnJpZGF5ID0gdXRjRnJpZGF5O1xuZXhwb3J0cy51dGNGcmlkYXlzID0gdXRjRnJpZGF5cztcbmV4cG9ydHMudXRjU2F0dXJkYXkgPSB1dGNTYXR1cmRheTtcbmV4cG9ydHMudXRjU2F0dXJkYXlzID0gdXRjU2F0dXJkYXlzO1xuZXhwb3J0cy51dGNNb250aCA9IHV0Y01vbnRoO1xuZXhwb3J0cy51dGNNb250aHMgPSB1dGNNb250aHM7XG5leHBvcnRzLnV0Y1llYXIgPSB1dGNZZWFyO1xuZXhwb3J0cy51dGNZZWFycyA9IHV0Y1llYXJzO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiZXhwb3J0IGNvbnN0IGRhdGEgPSB7XG4gICBcImZlYXR1cmVzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgICAgICAtMTE5LjIwNjYsIFxuICAgICAgICAgICAgICAgNDAuNzg2NlxuICAgICAgICAgICAgXSwgXG4gICAgICAgICAgICBcInR5cGVcIjogXCJQb2ludFwiXG4gICAgICAgICB9LCBcbiAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgICBcImFydFBsYXphRGlzdGFuY2VGdFwiOiA0MzgwLjAsIFxuICAgICAgICAgICAgXCJhcnRQbGF6YVJhZGl1c0Z0XCI6IDI1MC4wLCBcbiAgICAgICAgICAgIFwiYnJjXCI6IFwiY2l0eVwiLCBcbiAgICAgICAgICAgIFwiY2VudGVyQ2FtcERpc3RhbmNlRnRcIjogMjkwNy4wLCBcbiAgICAgICAgICAgIFwiY2VudGVyQ2FtcFBsYXphUmFkaXVzRnRcIjogMzMwLjAsIFxuICAgICAgICAgICAgXCJjaXZpY1BsYXphRGlzdGFuY2VGdFwiOiAzMTgwLjAsIFxuICAgICAgICAgICAgXCJjaXZpY1BsYXphUmFkaXVzRnRcIjogMjUwLjAsIFxuICAgICAgICAgICAgXCJlc3BsYW5hZGVSYWRpdXNGdFwiOiAyNTAwLjAsIFxuICAgICAgICAgICAgXCJlc3BsYW5hZGVXaWR0aEZ0XCI6IDQwLjAsIFxuICAgICAgICAgICAgXCJub3J0aFNvdXRoQXhpc0hvdXJcIjogNCwgXG4gICAgICAgICAgICBcIm5vcnRoU291dGhBeGlzTWludXRlXCI6IDMwLCBcbiAgICAgICAgICAgIFwicGVudGFnb25Qb2ludHNEaXN0YW5jZUZ0XCI6IDgxNzUuMCwgXG4gICAgICAgICAgICBcInByb21lbmFuZGVXaWR0aEZ0XCI6IDQwLjAsIFxuICAgICAgICAgICAgXCJwdWJsaWNQbGF6YTNEaXN0YW5jZUZ0XCI6IDQzODAuMCwgXG4gICAgICAgICAgICBcInB1YmxpY1BsYXphNkRpc3RhbmNlRnRcIjogNDY4MC4wLCBcbiAgICAgICAgICAgIFwicHVibGljUGxhemE5RGlzdGFuY2VGdFwiOiA0MzgwLjAsIFxuICAgICAgICAgICAgXCJwdWJsaWNQbGF6YVJhZGl1c0Z0XCI6IDI1MC4wLCBcbiAgICAgICAgICAgIFwicmVndWxhclN0cmVldFdpZHRoRnRcIjogNDAuMCwgXG4gICAgICAgICAgICBcInJvZHNSb2FkUmFkaXVzRnRcIjogNzUwLjAsIFxuICAgICAgICAgICAgXCJyb2RzUm9hZFdpZHRoRnRcIjogNDAuMCwgXG4gICAgICAgICAgICBcInN0cmVldE5hbWVzXCI6IFtcbiAgICAgICAgICAgICAgIFwiQXdlXCIsIFxuICAgICAgICAgICAgICAgXCJCcmVhdGhcIiwgXG4gICAgICAgICAgICAgICBcIkNlcmVtb255XCIsIFxuICAgICAgICAgICAgICAgXCJEYW5jZVwiLCBcbiAgICAgICAgICAgICAgIFwiRXVsb2d5XCIsIFxuICAgICAgICAgICAgICAgXCJGaXJlXCIsIFxuICAgICAgICAgICAgICAgXCJHZW51ZmxlY3RcIiwgXG4gICAgICAgICAgICAgICBcIkhhbGxvd2VkXCIsIFxuICAgICAgICAgICAgICAgXCJJbnNwaXJpdFwiLCBcbiAgICAgICAgICAgICAgIFwiSnVqdVwiLCBcbiAgICAgICAgICAgICAgIFwiS3VuZGFsaW5pXCIsIFxuICAgICAgICAgICAgICAgXCJMdXN0cmF0ZVwiXG4gICAgICAgICAgICBdLCBcbiAgICAgICAgICAgIFwic3RyZWV0UmFkaXVzZXNGdFwiOiBbXG4gICAgICAgICAgICAgICAyOTQwLjAsIFxuICAgICAgICAgICAgICAgMzE4MC4wLCBcbiAgICAgICAgICAgICAgIDM0MjAuMCwgXG4gICAgICAgICAgICAgICAzNjYwLjAsIFxuICAgICAgICAgICAgICAgMzkwMC4wLCBcbiAgICAgICAgICAgICAgIDQxNDAuMCwgXG4gICAgICAgICAgICAgICA0MzgwLjAsIFxuICAgICAgICAgICAgICAgNDYyMC4wLCBcbiAgICAgICAgICAgICAgIDQ4NjAuMCwgXG4gICAgICAgICAgICAgICA1MTAwLjAsIFxuICAgICAgICAgICAgICAgNTM0MC4wLCBcbiAgICAgICAgICAgICAgIDU1ODUuMFxuICAgICAgICAgICAgXSwgXG4gICAgICAgICAgICBcInllYXJcIjogMjAxN1xuICAgICAgICAgfSwgXG4gICAgICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCJcbiAgICAgIH0sXG5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgICAgICAgICAgICAgIFwiZ2VvbWV0cnlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJkaXNjb2Zpc2hcIixcbiAgICAgICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInZlaGljbGVcIjogXCJhcnRjYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkRpc2NvIEZpc2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJEaXNjb0Zpc2ggaXMgYW4gYXJ0IGNhciB0aGF0IHRha2VzIGluc3BpcmF0aW9uIGZyb20gdGhlIGFuZ2xlciBmaXNoLiBDb252ZXJ0ZWQgZnJvbSBhIDIxIHBlcnNvbiwgZG91YmxlLWRlY2tlciBidXMsIERpc2NvRmlzaCBvZmZlcnMgYSBjb21wbGV0ZSBwcm8tYXVkaW8gc291bmQgc3lzdGVtLCBmcm9udCBzdGFnZSwgMzDigLMgaWxsdW1pbmF0ZWQgZGlzY28gYmFsbCwgYW5kIGZvbGQgZG93biBwYWRkZWQgZmlucyBmb3IgZ3Vlc3Qgc2VhdGluZy4gQ29tZSBpbnNpZGUgdGhlIGZpc2ggdG8gZ3JhYiBhIGRyaW5rIGF0IHRoZSBpbnN0YWxsZWQgZnVsbCBiYXIsIG9yIGNsaW1iIHVwIHRvIHRoZSBzZWNvbmQgbGV2ZWwsIGhhbmcgd2l0aCB0aGUgREosIGNoaWxsIGFuZCB0YWtlIGl0IGFsbCBpbi4gVGhpcyBhd2Vzb21lIG1hY2hpbmUgaXMgY292ZXJlZCB3aXRoIDMwMDAgTEVEcyB0aGF0IGFyZSBpbmRpdmlkdWFsbHkgbGl0IGFuZCBjb21wdXRlciBjb250cm9sbGVkIHRvIGhhdmUgcGF0dGVybnMgb3IgbWVzc2FnZXMgcmlwcGxlIG92ZXIgdGhlIGZpc2guIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0cmFja2VyXCI6IFwiYXBycy9kaXNjb2ZcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICBdLCBcbiAgIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCJcbn07XG4iLCJpbXBvcnQge1N0YXRpY0dlb0pTT04sIEFqYXhHZW9KU09OLCBEZWZhdWx0RGF0YX0gZnJvbSAnLi9tYXBkYXRhJztcbmltcG9ydCBNYXBXaWRnZXQgZnJvbSAnLi9tYXB3aWRnZXQnO1xuXG5pZiAod2luZG93KSB7XG4gICAgd2luZG93LmJyY21hcCA9IHtNYXA6IE1hcFdpZGdldH07XG59IiwiaW1wb3J0IHtnZXREaXN0YW5jZSwgbm9ybWFsaXplQW5nbGUsIHRvRmVldH0gZnJvbSAnLi4vbWF0aCc7XG5cbmNvbnN0IG1pbnV0ZXNPbkNsb2NrRmFjZSA9IDEyKjYwO1xuXG5cbmV4cG9ydCBjbGFzcyBDbG9jayB7XG4gICAgY29uc3RydWN0b3IoaG91ciwgbWludXRlKSB7XG4gICAgICAgIHRoaXMuaG91ciA9IGhvdXIgJSAxMiA9PSAwID8gMTIgOiBob3VyICUgMTI7XG4gICAgICAgIHRoaXMubWludXRlID0gbWludXRlICUgNjA7XG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBDbG9jay50b1N0cmluZyh0aGlzLmhvdXIsIHRoaXMubWludXRlKTtcbiAgICB9XG5cbiAgICB0b1NsdWcoKSB7XG4gICAgICAgIHJldHVybiBDbG9jay50b1NsdWcodGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJhZGlhbnMoKSB7XG4gICAgICAgIHJldHVybiBDbG9jay50b1JhZGlhbnModGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSk7ICAgICAgICAgICAgICBcbiAgICB9XG5cbiAgICAvKiogZGVwcmVjYXRlZCAqL1xuICAgIHRvUmFkaWFucygpIHtcbiAgICAgICAgcmV0dXJuIENsb2NrLnRvUmFkaWFucyh0aGlzLmhvdXIsIHRoaXMubWludXRlKTsgICAgICBcbiAgICB9XG5cbiAgICBzdGF0aWMgdG9SYWRpYW5zKGhvdXIsIG1pbnV0ZSkge1xuICAgICAgICBsZXQgbWlucyA9IChob3VyKjYwICsgbWludXRlKSAlIG1pbnV0ZXNPbkNsb2NrRmFjZTtcbiAgICAgICAgaWYgKG1pbnMgPiBtaW51dGVzT25DbG9ja0ZhY2UvMikge1xuICAgICAgICAgICAgbWlucyA9IC0obWludXRlc09uQ2xvY2tGYWNlIC0gbWlucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDIqTWF0aC5QSSptaW5zL21pbnV0ZXNPbkNsb2NrRmFjZTsgICAgICAgICAgICAgICAgICAgIFxuICAgIH1cblxuICAgIHN0YXRpYyB0b1N0cmluZyhob3VyLCBtaW51dGUpIHtcbiAgICAgICAgbGV0IHMgPSBob3VyICsgJzonO1xuICAgICAgICBpZiAobWludXRlIDwgMTApIHtcbiAgICAgICAgICAgIHMgKz0gJzAnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzICsgbWludXRlO1xuICAgIH1cblxuICAgIHN0YXRpYyB0b1NsdWcoaG91ciwgbWludXRlKSB7XG4gICAgICAgIGxldCBzID0gaG91ciArICctJztcbiAgICAgICAgaWYgKG1pbnV0ZSA8IDEwKSB7XG4gICAgICAgICAgICBzICs9ICcwJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcyArIG1pbnV0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Nsb2NrKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBub3JtYWxpemVBbmdsZShhbmdsZSwgTWF0aC5QSSk7XG4gICAgbGV0IG1pbnMgPSBNYXRoLmZsb29yKGFuZ2xlICogbWludXRlc09uQ2xvY2tGYWNlIC8gKDIqTWF0aC5QSSkgKyAwLjUpO1xuICAgIGxldCBociA9IE1hdGguZmxvb3IobWlucy82MCk7XG4gICAgaWYgKGhyID09IDApIHtcbiAgICAgICAgaHIgPSAxMjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDbG9jayhociwgbWlucyk7XG59XG5cbmV4cG9ydCBjbGFzcyBBZGRyZXNzIHtcbiAgICBjb25zdHJ1Y3RvcihjbG9jaywgZGlzdGFuY2UsIHN0cmVldCwgbGFuZG1hcmspIHtcbiAgICAgICAgdGhpcy5jbG9jayA9IGNsb2NrO1xuICAgICAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIHRoaXMuc3RyZWV0ID0gc3RyZWV0O1xuICAgICAgICB0aGlzLmxhbmRtYWsgPSBsYW5kbWFyaztcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgaWYgKHNlbGYuZGlzdGFuY2UgPiAxMDAwMCkge1xuICAgICAgICAgICAgcmV0dXJuICdkZWZhdWx0IHdvcmxkJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLmNsb2NrLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICghdGhpcy5zdHJlZXQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMgKyAnIC8gJyArIHRvRmVldCh0aGlzLmRpc3RhbmNlKS50b0ZpeGVkKDApICsgJyBmdCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcyArICcgJiAnICsgdGhpcy5zdHJlZXQubGV0dGVyO1xuICAgIH1cblxuICAgIHRvTG9uZ1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgbGFuZG1hcmtOYW1lID0gc2VsZi5kaXN0YW5jZSA+IDEwMDAwID8gJ0RlZmF1bHQgV29ybGQnIDogc2VsZi5sYW5kbWFyayA/IHNlbGYubGFuZG1hcmsubmFtZSA6IG51bGw7XG4gICAgICAgIGxldCByZXMgPSB0aGlzLmNsb2NrLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh0aGlzLnN0cmVldCkge1xuICAgICAgICAgICAgcmVzICs9ICcgJiAnICsgdGhpcy5zdHJlZXQubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGFuZG1hcmtOYW1lKSB7XG4gICAgICAgICAgICByZXMgKz0gJygnICsgbGFuZG1hcmtOYW1lICsgJyknO1xuICAgICAgICB9XG4gICAgICAgIHJlcyArPSAnLCAnICsgdG9GZWV0KHRoaXMuZGlzdGFuY2UpLnRvRml4ZWQoMCkgKyAnIGZlZXQnO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN0cihob3VyLCBtaW51dGUpIHtcbiAgICByZXR1cm4gQ2xvY2sudG9SYWRpYW5zKGhvdXIsIG1pbnV0ZSk7XG59XG4iLCJpbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge2dldExvY2F0aW9uLCBnZXREaXN0YW5jZSwgZ2V0QmVhcmluZywgaW50ZXJwb2xhdGVBcmN9IGZyb20gJy4uL21hdGgnO1xuaW1wb3J0IHtDbG9jaywgQWRkcmVzcywgdG9DbG9jaywgY3RyfSBmcm9tICcuL2FkZHJlc3MnO1xuaW1wb3J0IHtzbHVnaWZ5LCBkYXlzQWdvU3RyfSBmcm9tICcuLi91dGlsJztcblxuZXhwb3J0IGNsYXNzIEZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG5cbiAgICBnZXQga2luZCgpIHtcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgfVxuXG4gICAgZ2V0IGNvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VvbWV0cnkgJiYgdGhpcy5nZW9tZXRyeS50eXBlID09ICdQb2ludCcgPyB0aGlzLmdlb21ldHJ5LmNvb3JkaW5hdGVzIDogbnVsbDtcbiAgICB9XG5cbiAgICBzdGF0dXMoY2l0eSwge3ZlcmJvc2U9ZmFsc2V9PXt9KSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgICAgIGlmICh0aGlzLmxhc3RzZWVuKSB7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKGRheXNBZ29TdHIodGhpcy5sYXN0c2VlbikpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvb3Jkcykge1xuICAgICAgICAgICAgY29uc3QgYWRkciA9IGNpdHkuZ2V0QWRkcmVzcyh0aGlzLmNvb3Jkcyk7XG4gICAgICAgICAgICBwYXJ0cy5wdXNoKCdhdCAnICsgKHZlcmJvc2UgPyBhZGRyLnRvTG9uZ1N0cmluZygpIDogYWRkci50b1N0cmluZygpKSk7IFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goJ2F0IHVua25vd24gbG9jYXRpb24nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFydHMuam9pbignICcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENpdHkgZXh0ZW5kcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3Rvcih5ZWFyLCBjZW50ZXIsIG9yaWVudGF0aW9uKSB7XG4gICAgICAgIHN1cGVyKCdicmMnICsgeWVhcik7XG4gICAgICAgIHRoaXMueWVhciA9IHllYXI7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSBbXTtcbiAgICB9XG5cbiAgICBnZXQgY2l0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnY2l0eSc7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBcIkJsYWNrIFJvY2sgQ2l0eSBcIiArIHRoaXMueWVhcjtcbiAgICB9XG5cbiAgICBnZXQgY29vcmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZW50ZXI7XG4gICAgfVxuXG4gICAgZ2V0IGNzdHJlZXRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mZWF0dXJlcy5maWx0ZXIoKGYpID0+IGYgaW5zdGFuY2VvZiBDU3RyZWV0KTtcbiAgICB9XG5cbiAgICBnZXRCZWFyaW5nKGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLlBJIC0gdGhpcy5vcmllbnRhdGlvbiArIGFuZ2xlXG4gICAgfVxuXG4gICAgZ2V0TG9jYXRpb24oe2hvdXIsIG1pbnV0ZSwgYW5nbGV9PXt9LCBkaXN0KSB7XG4gICAgICAgIGlmIChhbmdsZSA9PT0gdW5kZWZpbmVkIHx8IGFuZ2xlID09PSBudWxsKSB7XG4gICAgICAgICAgICBhbmdsZSA9IENsb2NrLnRvUmFkaWFucyhob3VyLCBtaW51dGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRMb2NhdGlvbih0aGlzLmNlbnRlciwgdGhpcy5nZXRCZWFyaW5nKGFuZ2xlKSwgZGlzdCk7XG4gICAgfVxuXG4gICAgZ2V0Q2xvY2soY29vcmRzKSB7XG4gICAgICAgIHJldHVybiB0b0Nsb2NrKGdldEJlYXJpbmcodGhpcy5jZW50ZXIsIGNvb3JkcykgLSB0aGlzLm9yaWVudGF0aW9uICsgTWF0aC5QSS8yKTtcbiAgICB9XG5cbiAgICBnZXRBZGRyZXNzKGNvb3Jkcykge1xuICAgICAgICBjb25zdCBkaXN0ID0gZ2V0RGlzdGFuY2UodGhpcy5jZW50ZXIsIGNvb3Jkcyk7XG4gICAgICAgIGNvbnN0IGNsb2NrID0gdGhpcy5nZXRDbG9jayhjb29yZHMpO1xuICAgICAgICBsZXQgc3RyZWV0ID0gbnVsbDtcbiAgICAgICAgaWYgKGNsb2NrLmhvdXIgPiAxICYmIGNsb2NrLmhvdXIgPCAxMSkge1xuICAgICAgICAgICAgaWYgKGRpc3QgPiB0aGlzLmVzcGxhbmFkZS5yYWRpdXMgLSAoKHRoaXMuYVN0cmVldC5yYWRpdXMgLSB0aGlzLmVzcGxhbmFkZS5yYWRpdXMpLzIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPCAodGhpcy5lc3BsYW5hZGUucmFkaXVzICsgdGhpcy5hU3RyZWV0LnJhZGl1cykvMikge1xuICAgICAgICAgICAgICAgICAgICBzdHJlZXQgPSB0aGlzLmVzcGxhbmFkZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaT0xOyBpPHRoaXMuY3N0cmVldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0IDwgKHRoaXMuY3N0cmVldHNbaV0ucmFkaXVzICsgdGhpcy5jc3RyZWV0c1tpLTFdLnJhZGl1cykvMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldCA9IHRoaXMuY3N0cmVldHNbaS0xXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0cmVldCAmJiBkaXN0IDwgdGhpcy5sU3RyZWV0LnJhZGl1cyArICgodGhpcy5sU3RyZWV0LnJhZGl1cyAtIHRoaXMua1N0cmVldC5yYWRpdXMpLzIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJlZXQgPSB0aGlzLmxTdHJlZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQWRkcmVzcyhjbG9jaywgZ2V0RGlzdGFuY2UodGhpcy5jZW50ZXIsIGNvb3JkcyksIHN0cmVldCk7XG4gICAgfVxuXG59O1xuXG5cbmNsYXNzIENpdHlGZWF0dXJlIGV4dGVuZHMgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IoY2l0eSwgc2x1Zykge1xuICAgICAgICBzdXBlcihjaXR5LmlkICsgJy8nICsgc2x1Zyk7XG4gICAgICAgIHRoaXMuY2l0eSA9IGNpdHk7XG4gICAgICAgIGNpdHkuZmVhdHVyZXMucHVzaCh0aGlzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDU3RyZWV0IGV4dGVuZHMgQ2l0eUZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKGNpdHksIG5hbWUsIHJhZGl1cywgd2lkdGgpIHtcbiAgICAgICAgc3VwZXIoY2l0eSwgbmFtZT09J0VzcGxhbmFkZScgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOiBuYW1lWzBdLnRvTG93ZXJDYXNlKCkgKyAnLXN0cmVldCcpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBpZiAobmFtZSAhPSAnRXNwbGFuYWRlJykge1xuICAgICAgICAgICAgY2l0eVtuYW1lWzBdLnRvTG93ZXJDYXNlKCkgKyAnU3RyZWV0J10gPSB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnc3RyZWV0JztcbiAgICB9XG5cbiAgICBnZXQgc3RyZWV0S2luZCgpIHtcbiAgICAgICAgcmV0dXJuICdjc3RyZWV0JztcbiAgICB9XG5cbiAgICBnZXQgbGV0dGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lID09ICdFc3BsYW5hZGUnID8gJ0VzcCcgOiB0aGlzLm5hbWVbMF0udG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICBnZXQgZ2VvbWV0cnkoKSB7XG4gICAgICAgIGNvbnN0IHNwYW5zID0gdGhpcy5sZXR0ZXIgIT0gJ0YnID8gW1tjdHIoMiwwKSwgY3RyKDEwLDApXV0gIDogXG4gICAgICAgICAgICBbW2N0cigyLDMwKSwgY3RyKDMsMzApXSwgW2N0cig0LDApLCBjdHIoNSwwKV0sIFtjdHIoNywwKSwgY3RyKDgsMCldLCBbY3RyKDgsMzApLCBjdHIoOSwzMCldXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdNdWx0aUxpbmVTdHJpbmcnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHNwYW5zLm1hcCgocykgPT4gaW50ZXJwb2xhdGVBcmModGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLCBcbiAgICAgICAgICAgICAgICB0aGlzLmNpdHkuZ2V0QmVhcmluZyhzWzBdKSwgdGhpcy5jaXR5LmdldEJlYXJpbmcoc1sxXSksIDI1KSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBnZXQgaXNSb2FkKCkgeyBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0IGNlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2l0eS5jZW50ZXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVFN0cmVldCBleHRlbmRzIENpdHlGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvcihjaXR5LCBkaXJlY3Rpb24sIHdpZHRoKSB7XG4gICAgICAgIHN1cGVyKGNpdHksIGRpcmVjdGlvbi50b1NsdWcoKSArICctc3RyZWV0Jyk7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbi50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldCBraW5kKCkge1xuICAgICAgICByZXR1cm4gJ3N0cmVldCc7XG4gICAgfVxuXG4gICAgZ2V0IHN0cmVldEtpbmQoKSB7XG4gICAgICAgIHJldHVybiAndHN0cmVldCc7XG4gICAgfVxuXG4gICAgZ2V0IHNwYW5zKCkge1xuICAgICAgICByZXR1cm4gW1t0aGlzLmRpcmVjdGlvbi5taW51dGUgPT0gMTUgfHwgdGhpcy5kaXJlY3Rpb24ubWludXRlID09IDQ1ID8gdGhpcy5jaXR5LmdTdHJlZXQucmFkaXVzIDogXG4gICAgICAgICAgICB0aGlzLmNpdHkuZXNwbGFuYWRlLnJhZGl1cywgdGhpcy5jaXR5LmxTdHJlZXQucmFkaXVzXV07XG4gICAgfVxuXG4gICAgZ2V0IGdlb21ldHJ5KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ011bHRpTGluZVN0cmluZycsXG4gICAgICAgICAgICBjb29yZGluYXRlczogdGhpcy5zcGFucy5tYXAoKHMpID0+IHMubWFwKChkKSA9PiB0aGlzLmNpdHkuZ2V0TG9jYXRpb24odGhpcy5kaXJlY3Rpb24sIGQpKSksXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZ2V0IGlzUm9hZCgpIHsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb21lbmFuZGUgZXh0ZW5kcyBDaXR5RmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IoY2l0eSwgZGlyZWN0aW9uLCB3aWR0aCkge1xuICAgICAgICBjb25zdCBuYW1lID0gZGlyZWN0aW9uLmhvdXIgKyBcIiBPJ0Nsb2NrIFByb21lbmFuZGVcIjtcbiAgICAgICAgc3VwZXIoY2l0eSwgc2x1Z2lmeShuYW1lKSk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnc3RyZWV0JztcbiAgICB9XG5cbiAgICBnZXQgc3RyZWV0S2luZCgpIHtcbiAgICAgICAgcmV0dXJuICdwcm9tZW5hbmRlJztcbiAgICB9XG5cbiAgICBnZXQgc3BhbigpIHtcbiAgICAgICAgcmV0dXJuIFswLCB0aGlzLmNpdHkuZXNwbGFuYWRlLnJhZGl1c107XG4gICAgfVxuXG4gICAgZ2V0IGdlb21ldHJ5KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuc3Bhbi5tYXAoKGQpID0+IHRoaXMuY2l0eS5nZXRMb2NhdGlvbih0aGlzLmRpcmVjdGlvbiwgZCkpLFxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGdldCBpc1JvYWQoKSB7IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF6YSBleHRlbmRzIENpdHlGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvcihjaXR5LCBuYW1lLCBob3VyLCBtaW51dGUsIGRpc3RhbmNlLCByYWRpdXMpIHtcbiAgICAgICAgc3VwZXIoY2l0eSwgc2x1Z2lmeShuYW1lKSk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2l0eS5nZXRMb2NhdGlvbih7aG91cjogaG91ciwgbWludXRlOiBtaW51dGV9LCBkaXN0YW5jZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgIH1cblxuICAgIGdldCBraW5kKCkge1xuICAgICAgICByZXR1cm4gJ3BsYXphJztcbiAgICB9XG5cbiAgICBnZXQgZ2VvbWV0cnkoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgICBjb29yZGluYXRlczogW2ludGVycG9sYXRlQXJjKHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgMCwgMipNYXRoLlBJLCAyNSldXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZ2V0IGlzUm9hZCgpIHsgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvZHNSb2FkIGV4dGVuZHMgQ2l0eUZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKGNpdHksIGNlbnRlckNhbXBEaXN0YW5jZSwgcmFkaXVzLCB3aWR0aCkge1xuICAgICAgICBjb25zdCBuYW1lID0gXCJSb2QncyBSb2FkXCI7XG4gICAgICAgIHN1cGVyKGNpdHksIHNsdWdpZnkobmFtZSkpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNlbnRlciA9IGNpdHkuZ2V0TG9jYXRpb24oe2hvdXI6IDYsIG1pbnV0ZTogMH0sIGNlbnRlckNhbXBEaXN0YW5jZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnc3RyZWV0JztcbiAgICB9XG5cbiAgICBnZXQgZ2VvbWV0cnkoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgICBjb29yZGluYXRlczogaW50ZXJwb2xhdGVBcmModGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLCAwLCAyKk1hdGguUEksIDI1KVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGdldCBpc1JvYWQoKSB7IFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGZW5jZSBleHRlbmRzIENpdHlGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvcihjaXR5LCByYWRpdXMpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICBcIlRyYXNoIEZlbmNlXCI7XG4gICAgICAgIHN1cGVyKGNpdHksIHNsdWdpZnkobmFtZSkpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB9XG5cbiAgICBnZXQgZ2VvbWV0cnkoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgICBjb29yZGluYXRlczogWzAsMSwyLDMsNCwwXS5tYXAoKGkpID0+IGdldExvY2F0aW9uKHRoaXMuY2l0eS5jZW50ZXIsIHRoaXMuY2l0eS5nZXRCZWFyaW5nKDIqaSpNYXRoLlBJLzUpLCB0aGlzLnJhZGl1cykpLFxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXJ0IGV4dGVuZHMgQ2l0eUZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKGNpdHksIG5hbWUsIGNvb3Jkcykge1xuICAgICAgICBzdXBlcihjaXR5LCBzbHVnaWZ5KG5hbWUpKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjb29yZHM7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnYXJ0JztcbiAgICB9XG5cbiAgICBnZXQgZ2VvbWV0cnkoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY2VudGVyXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWZWhpY2xlIGV4dGVuZHMgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IoaWQsIG5hbWUsIGtpbmQsIHt0cmFja2VySWQ9bnVsbH09e30pIHtcbiAgICAgICAgc3VwZXIoaWQpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZlaGljbGVLaW5kID0ga2luZDtcbiAgICAgICAgdGhpcy50cmFja2VySWQgPSB0cmFja2VySWQ7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAndmVoaWNsZSc7XG4gICAgfVxuXG4gICAgZ2V0IGdlb21ldHJ5KCkge1xuICAgICAgICBpZiAodGhpcy50cmFja2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja2VyLmdlb21ldHJ5O1xuICAgICAgICB9IFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgbGFzdHNlZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYWNrZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYWNrZXIubGFzdHNlZW47XG4gICAgICAgIH0gXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBBUFJTU3RhdGlvbiBleHRlbmRzIEZlYXR1cmUge1xuICAgIGNvbnN0cnVjdG9yKGNhbGxzaWduLCB7bGFzdHNlZW49bnVsbCwgY29vcmRzPW51bGwsIHJhd1BhY2tldD1udWxsLCBjb21tZW50PW51bGwsIHN5bWJvbD1udWxsLCBwYXRoPW51bGx9ID0ge30pIHtcbiAgICAgICAgc3VwZXIoJ2FwcnMvJyArIGNhbGxzaWduLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgIHRoaXMubmFtZSA9IGNhbGxzaWduO1xuICAgICAgICB0aGlzLmxhc3RzZWVuID0gbGFzdHNlZW47XG4gICAgICAgIHRoaXMucmF3UGFja2V0ID0gcmF3UGFja2V0O1xuICAgICAgICB0aGlzLmNvbW1lbnQgPSBjb21tZW50O1xuICAgICAgICB0aGlzLmdlb21ldHJ5ID0gY29vcmRzID8ge1xuICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZHNcbiAgICAgICAgfSA6IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IGtpbmQoKSB7XG4gICAgICAgIHJldHVybiAnYXBycyc7XG4gICAgfVxuXG4gICAgZ2V0IGlzQVBSU1N0YXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn07XG5cblxubGV0IG5leHRNYXJrZXJJZCA9IDE7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZXIgZXh0ZW5kcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb29yZHMsIHtuYW1lPW51bGwsIGNvbG9yPW51bGwsIGlkPW51bGwsIGxhc3RzZWVuPW51bGx9ID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkID8gaWQgOiAnbWFya2VyJyArIG5leHRNYXJrZXJJZCsrO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPyBjb2xvciA6ICcjZmU3NTY5JztcbiAgICAgICAgdGhpcy5sYXN0c2VlbiA9IGxhc3RzZWVuO1xuICAgICAgICB0aGlzLmdlb21ldHJ5ID0ge1xuICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBjb29yZHNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjZW50ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvb3JkcztcbiAgICB9XG59XG4iLCJpbXBvcnQge2Zyb21GZWV0LCBnZXRMb2NhdGlvbiwgbm9ybWFsaXplQW5nbGV9IGZyb20gJy4uLy4uL21hdGgnO1xuaW1wb3J0IHtDaXR5LCBDU3RyZWV0LCBUU3RyZWV0LCBQcm9tZW5hbmRlLCBQbGF6YSwgUm9kc1JvYWQsIEZlbmNlLCBBcnQsIFZlaGljbGUsIEFQUlNTdGF0aW9uLCBNYXJrZXJ9IGZyb20gJy4uL2ZlYXR1cmVzJztcbmltcG9ydCB7Q2xvY2t9IGZyb20gJy4uL2FkZHJlc3MnO1xuXG5mdW5jdGlvbiBsYXN0U2VlbihmZWF0KSB7XG4gICAgcmV0dXJuIGZlYXQucHJvcGVydGllcy5sYXN0c2VlbiA/IG5ldyBEYXRlKGZlYXQucHJvcGVydGllcy5sYXN0c2VlbioxMDAwKSA6IG51bGw7XG59O1xuXG5leHBvcnQgXG5mdW5jdGlvbiBwYXJzZUdlb2pzb24oZGF0YSkge1xuICAgIGxldCBkYXRhRmVhdHVyZXMgPSBudWxsO1xuICAgIGlmIChkYXRhLnR5cGUgPT0gJ0ZlYXR1cmUnKSB7XG4gICAgICAgIGRhdGFGZWF0dXJlcyA9IFtkYXRhXTtcbiAgICB9IFxuICAgIGVsc2UgaWYgKGRhdGEudHlwZSA9PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgICAgIGRhdGFGZWF0dXJlcyA9IGRhdGEuZmVhdHVyZXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dlb0pTT04gZGF0YSBtdXN0IGJlIG9mIHR5cGUgRmVhdHVyZSBvciBGZWF0dXJlQ29sbGVjdGlvbicpOyAgICAgICAgICAgXG4gICAgfVxuXG4gICAgY29uc3QgcGFyc2VkRmVhdHVyZXMgPSBbXTtcbiAgICBmb3IobGV0IGRmIG9mIGRhdGFGZWF0dXJlcykge1xuICAgICAgICBpZiAoIWRmLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGRmLnByb3BlcnRpZXMgPSB7fVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZi5wcm9wZXJ0aWVzLmJyYyA9PSAnY2l0eScpIHtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBkZi5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IG5ldyBDaXR5KGMueWVhciwgZGYuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIENsb2NrLnRvUmFkaWFucyhjLm5vcnRoU291dGhBeGlzSG91ciwgYy5ub3J0aFNvdXRoQXhpc01pbnV0ZSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChjaXR5KTtcblxuICAgICAgICAgICAgZm9yKGxldCBpPTA7IGk8Yy5zdHJlZXROYW1lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IENTdHJlZXQoY2l0eSwgXG4gICAgICAgICAgICAgICAgICAgIGMuc3RyZWV0TmFtZXNbaV0sIFxuICAgICAgICAgICAgICAgICAgICBmcm9tRmVldChjLnN0cmVldFJhZGl1c2VzRnRbaV0pLCBcbiAgICAgICAgICAgICAgICAgICAgZnJvbUZlZXQoYy5yZWd1bGFyU3RyZWV0V2lkdGhGdCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpdHkuZXNwbGFuYWRlID0gbmV3IENTdHJlZXQoY2l0eSwgJ0VzcGxhbmFkZScsIGZyb21GZWV0KGMuZXNwbGFuYWRlUmFkaXVzRnQpLFxuICAgICAgICAgICAgICAgIGZyb21GZWV0KGMuZXNwbGFuYWRlV2lkdGhGdCkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChjaXR5LmVzcGxhbmFkZSk7XG4gICAgICAgICAgICBmb3IobGV0IGhvdXI9MjsgaG91ciA8PSAxMDsgKytob3VyKSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBtaW51dGUgb2YgaG91ciA9PSAxMCA/IFswXSA6IFswLCAxNSwgMzAsIDQ1XSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gbmV3IENsb2NrKGhvdXIsIG1pbnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHJlZXQgPSBuZXcgVFN0cmVldChjaXR5LCBkaXJlY3Rpb24sIGZyb21GZWV0KGMucmVndWxhclN0cmVldFdpZHRoRnQpKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChzdHJlZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IFByb21lbmFuZGUoY2l0eSwgbmV3IENsb2NrKDMsMCksIGZyb21GZWV0KGMucHJvbWVuYW5kZVdpZHRoRnQpKSk7XG4gICAgICAgICAgICBwYXJzZWRGZWF0dXJlcy5wdXNoKG5ldyBQcm9tZW5hbmRlKGNpdHksIG5ldyBDbG9jayg2LDApLCBmcm9tRmVldChjLnByb21lbmFuZGVXaWR0aEZ0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUHJvbWVuYW5kZShjaXR5LCBuZXcgQ2xvY2soOSwwKSwgZnJvbUZlZXQoYy5wcm9tZW5hbmRlV2lkdGhGdCkpKTtcbiAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IFByb21lbmFuZGUoY2l0eSwgbmV3IENsb2NrKDEyLDApLCBmcm9tRmVldChjLnByb21lbmFuZGVXaWR0aEZ0KSkpO1xuXG4gICAgICAgICAgICBjaXR5LmZlbmNlID0gbmV3IEZlbmNlKGNpdHksIGZyb21GZWV0KGMucGVudGFnb25Qb2ludHNEaXN0YW5jZUZ0KSk7XG4gICAgICAgICAgICBwYXJzZWRGZWF0dXJlcy5wdXNoKGNpdHkuZmVuY2UpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUm9kc1JvYWQoY2l0eSwgZnJvbUZlZXQoYy5jZW50ZXJDYW1wRGlzdGFuY2VGdCksIGZyb21GZWV0KGMucm9kc1JvYWRSYWRpdXNGdCksIGZyb21GZWV0KGMucm9kc1JvYWRXaWR0aCkpKTtcblxuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJ0NlbnRlciBDYW1wIFBsYXphJywgNiwgMCwgZnJvbUZlZXQoYy5jZW50ZXJDYW1wRGlzdGFuY2VGdCksIGZyb21GZWV0KGMuY2VudGVyQ2FtcFBsYXphUmFkaXVzRnQpKSk7XG4gICAgICAgICAgICBwYXJzZWRGZWF0dXJlcy5wdXNoKG5ldyBQbGF6YShjaXR5LCAnMzowMCBDaXZpYyBQbGF6YScsIDMsIDAsIGZyb21GZWV0KGMuY2l2aWNQbGF6YURpc3RhbmNlRnQpLCBmcm9tRmVldChjLmNpdmljUGxhemFSYWRpdXNGdCkpKTtcbiAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IFBsYXphKGNpdHksICc5OjAwIENpdmljIFBsYXphJywgOSwgMCwgZnJvbUZlZXQoYy5jaXZpY1BsYXphRGlzdGFuY2VGdCksIGZyb21GZWV0KGMuY2l2aWNQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJzM6MDAgUHVibGljIFBsYXphJywgMywgMCwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YTNEaXN0YW5jZUZ0KSwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJzY6MDAgUHVibGljIFBsYXphJywgNiwgMCwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YTZEaXN0YW5jZUZ0KSwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJzk6MDAgUHVibGljIFBsYXphJywgOSwgMCwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YTlEaXN0YW5jZUZ0KSwgZnJvbUZlZXQoYy5wdWJsaWNQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJzQ6MzAgQXJ0IFBsYXphJywgNCwgMzAsIGZyb21GZWV0KGMuYXJ0UGxhemFEaXN0YW5jZUZ0KSwgZnJvbUZlZXQoYy5hcnRQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJzc6MzAgQXJ0IFBsYXphJywgNywgMzAsIGZyb21GZWV0KGMuYXJ0UGxhemFEaXN0YW5jZUZ0KSwgZnJvbUZlZXQoYy5hcnRQbGF6YVJhZGl1c0Z0KSkpO1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgUGxhemEoY2l0eSwgJ01hbiBQbGF6YScsIDAsIDAsIDAsIGZyb21GZWV0KDEwMCkpKTtcblxuICAgICAgICAgICAgbGV0IHRlbXBsZURpc3RhbmNlID0gZnJvbUZlZXQoMjUwMCk7XG4gICAgICAgICAgICBwYXJzZWRGZWF0dXJlcy5wdXNoKG5ldyBQbGF6YShjaXR5LCAnVGVtcGxlIFBsYXphJywgMCwgMCwgdGVtcGxlRGlzdGFuY2UsIGZyb21GZWV0KDEwMCkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZi5wcm9wZXJ0aWVzLmJyYyA9PSAnYXJ0Jykge1xuICAgICAgICAgICAgcGFyc2VkRmVhdHVyZXMucHVzaChuZXcgQXJ0KGNpdHksIGRmLnByb3BlcnRpZXMubmFtZSwgZGYuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZi5wcm9wZXJ0aWVzLnZlaGljbGUpIHtcbiAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IFZlaGljbGUoZGYuaWQsIGRmLnByb3BlcnRpZXMubmFtZSwgZGYucHJvcGVydGllcy52ZWhpY2xlLCB7XG4gICAgICAgICAgICAgICAgdHJhY2tlcklkOiBkZi5wcm9wZXJ0aWVzLnRyYWNrZXIsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGYucHJvcGVydGllcy5hcHJzKSB7XG4gICAgICAgICAgICBwYXJzZWRGZWF0dXJlcy5wdXNoKG5ldyBBUFJTU3RhdGlvbihkZi5wcm9wZXJ0aWVzLmFwcnMsIHtcbiAgICAgICAgICAgICAgICBsYXN0c2VlbjpsYXN0U2VlbihkZiksIFxuICAgICAgICAgICAgICAgIGNvb3JkczpkZi5nZW9tZXRyeSA/IGRmLmdlb21ldHJ5LmNvb3JkaW5hdGVzIDogbnVsbCxcbiAgICAgICAgICAgICAgICByYXdQYWNrZXQ6IGRmLnByb3BlcnRpZXMucmF3cGFja2V0LFxuICAgICAgICAgICAgICAgIHN5bWJvbDogZGYucHJvcGVydGllcy5zeW1ib2wsXG4gICAgICAgICAgICAgICAgY29tbWVudDogZGYucHJvcGVydGllcy5jb21tZW50LFxuICAgICAgICAgICAgICAgIHBhdGg6IGRmLnByb3BlcnRpZXMucGF0aCxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZi5nZW9tZXRyeSAmJiBkZi5nZW9tZXRyeS50eXBlID09ICdQb2ludCcpIHtcbiAgICAgICAgICAgIHBhcnNlZEZlYXR1cmVzLnB1c2gobmV3IE1hcmtlcihkZi5nZW9tZXRyeS5jb29yZGluYXRlcywge1xuICAgICAgICAgICAgICAgIG5hbWU6ZGYucHJvcGVydGllcy5uYW1lLCBcbiAgICAgICAgICAgICAgICBpZDpkZi5pZCwgXG4gICAgICAgICAgICAgICAgbGFzdHNlZW46bGFzdFNlZW4oZGYpXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZEZlYXR1cmVzO1xufSAgICAgICAgXG4iLCJleHBvcnQgKiBmcm9tICcuL2dlb2pzb24nOyIsImltcG9ydCB7Q2l0eX0gZnJvbSAnLi9mZWF0dXJlcyc7XG5pbXBvcnQge1N0YXRpY0RhdGFTb3VyY2UsIEFqYXhEYXRhU291cmNlfSBmcm9tICcuL3NvdXJjZXMnO1xuaW1wb3J0IHtMaXN0ZW5lcnN9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnRcbmNsYXNzIE1hcERhdGEge1xuICAgIGNvbnN0cnVjdG9yKGJhc2VEYXRhKSB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IG5ldyBMaXN0ZW5lcnMoKTtcbiAgICAgICAgbGV0IHNvdXJjZXMgPSBbbmV3IFN0YXRpY0RhdGFTb3VyY2UoYmFzZURhdGEpXTtcbiAgICAgICAgbGV0IGZlYXR1cmVzID0gW107XG4gICAgICAgIGxldCBjaXR5ID0gbnVsbDtcbiBcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZXNCeUlkID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgY2l0eSA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcihsZXQgc3JjIG9mIHNvdXJjZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGYgb2Ygc3JjLmZlYXR1cmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmVzQnlJZC5zZXQoZi5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmIGluc3RhbmNlb2YgQ2l0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2l0eSA9IGY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgZiBvZiBmZWF0dXJlc0J5SWQudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZi50cmFja2VySWQgJiYgZmVhdHVyZXNCeUlkLmhhcyhmLnRyYWNrZXJJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZi50cmFja2VyID0gZmVhdHVyZXNCeUlkLmdldChmLnRyYWNrZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGYudHJhY2tlci50cmFja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZlYXR1cmVzID0gWy4uLmZlYXR1cmVzQnlJZC52YWx1ZXMoKV07XG4gICAgICAgICAgICBsaXN0ZW5lcnMubm90aWZ5KCd1cGRhdGUnLCB0aGlzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzdG9wID0gKCkgPT4ge1xuICAgICAgICAgICAgZm9yKGxldCBkcyBvZiBzb3VyY2VzKSB7XG4gICAgICAgICAgICAgICAgZHMuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2xlYXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBzb3VyY2VzID0gW107XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYWRkR2VvanNvbiA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2gobmV3IFN0YXRpY0RhdGFTb3VyY2UoZGF0YSwgdXBkYXRlKSk7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYWRkR2VvanNvblVybCA9ICh1cmwsIHBvbGxJbnRlcnZhbCkgPT4ge1xuICAgICAgICAgICAgc291cmNlcy5wdXNoKG5ldyBBamF4RGF0YVNvdXJjZSh1cmwsIHBvbGxJbnRlcnZhbCwgdXBkYXRlKSk7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub24gPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuYWRkKGV2ZW50LCBjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9mZiA9IChldmVudCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5yZW1vdmUoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY2l0eScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gY2l0eSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZmVhdHVyZXMnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGZlYXR1cmVzLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXBkYXRlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgKiBmcm9tICcuL2ZlYXR1cmVzJztcbmV4cG9ydCAqIGZyb20gJy4vc291cmNlcyc7IiwiaW1wb3J0IHtwYXJzZUdlb2pzb259IGZyb20gJy4uL2Zvcm1hdHMnO1xuaW1wb3J0IHtyZXF1ZXN0fSBmcm9tICdkMy1yZXF1ZXN0JztcblxuZXhwb3J0XG5jbGFzcyBBamF4RGF0YVNvdXJjZSB7XG4gICAgY29uc3RydWN0b3IodXJsLCBwb2xsSW50ZXJ2YWwsIG5vdGlmeSkge1xuICAgICAgICBsZXQgdGltZW91dElkID0gbnVsbDtcbiAgICAgICAgbGV0IGZlYXR1cmVzID0gW107XG4gICAgXHRjb25zdCByZXEgPSByZXF1ZXN0KHVybClcbiAgICAgICAgICAgICAgICAgLm1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKVxuICAgICAgICAgICAgICAgICAucmVzcG9uc2UoeGhyID0+IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuXG4gICAgICAgIGlmIChwb2xsSW50ZXJ2YWwgPT09IG51bGwgfHwgcG9sbEludGVydmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvbGxJbnRlcnZhbCA9IDU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvbnJlc3BvbnNlID0gKGpzb25kYXRhKSA9PiB7XG4gICAgICAgIFx0aWYgKCFqc29uZGF0YSkge1xuICAgICAgICBcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGdldCBkYXRhIGZyb20gJyArIHVybCk7XG4gICAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgXHRcdGZlYXR1cmVzID0gcGFyc2VHZW9qc29uKGpzb25kYXRhKTtcbiAgICAgICAgXHRcdG5vdGlmeShmZWF0dXJlcyk7XG4gICAgICAgIFx0fVxuICAgIFx0XHR0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHJlcS5nZXQob25yZXNwb25zZSksIHBvbGxJbnRlcnZhbCoxMDAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHJlcS5hYm9ydCgpOyAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdmZWF0dXJlcycsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZmVhdHVyZXMsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXEuZ2V0KG9ucmVzcG9uc2UpO1xuICAgIH1cbn0iLCJleHBvcnQgKiBmcm9tICcuL3N0YXRpYyc7XG5leHBvcnQgKiBmcm9tICcuL2FqYXgnO1xuIiwiaW1wb3J0IHtwYXJzZUdlb2pzb259IGZyb20gJy4uL2Zvcm1hdHMnO1xuXG5leHBvcnRcbmNsYXNzIFN0YXRpY0RhdGFTb3VyY2Uge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBcdHRoaXMuZmVhdHVyZXMgPSBwYXJzZUdlb2pzb24oZGF0YSk7XG4gIFxuICAgICAgICB0aGlzLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7c2NhbGVMaW5lYXJ9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7cmFuZ2V9IGZyb20gJ2QzLWFycmF5JztcbmltcG9ydCB7ZnJvbUZlZXR9IGZyb20gJy4uL21hdGgnO1xuaW1wb3J0IHt0b1BpeGVsc30gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJHcmlkKHByb2plY3Rpb24sIGNvbnRhaW5lciwgY2l0eSwgc3R5bGUpIHtcbiAgICBsZXQgcmFkaWFscyA9IFtdO1xuICAgIGlmIChzdHlsZS5zaG93R3JpZCAmJiBjaXR5KSB7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHByb2plY3Rpb24oY2l0eS5jZW50ZXIpO1xuICAgICAgICAvLyBjb25zdCB0aWNrcyA9IHNjYWxlTGluZWFyKClcbiAgICAgICAgLy8gICAgIC5kb21haW4oWzAsIGNpdHkuZmVuY2UucmFkaXVzXSlcbiAgICAgICAgLy8gICAgIC50aWNrcygxMClcblxuICAgICAgICByYWRpYWxzID0gcmFuZ2UoMCwgMTAwMDAsIGZyb21GZWV0KDEwMCkpLm1hcCgocikgPT4gW3RvUGl4ZWxzKHByb2plY3Rpb24sciksIC4uLmNlbnRlcl0pO1xuICAgIH1cbiAgICBjb25zdCBncm91cCA9IGNvbnRhaW5lci5zZWxlY3QoJ2cuZ3JpZCcpXG4gICAgICAgIC5hdHRyKCdmaWxsJywgJ25vbmUnKVxuICAgICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzAuMnB4JylcbiAgICAgICAgLmF0dHIoJ3N0cm9rZScsIHN0eWxlLm11dGVkQ29sb3IpO1xuICAgIFxuICAgIGxldCBub2RlcyA9IGdyb3VwLnNlbGVjdEFsbChcImNpcmNsZVwiKS5kYXRhKHJhZGlhbHMpO1xuXG4gICAgbm9kZXMuZXhpdCgpXG4gICAgICAgIC5yZW1vdmUoKTtcblxuICAgIG5vZGVzLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLm1lcmdlKG5vZGVzKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCAoZCkgPT4gZFswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIChkKSA9PiBkWzFdKVxuICAgICAgICAgICAgLmF0dHIoJ2N5JywgKGQpID0+IGRbMl0pO1xufVxuXG4iLCJpbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7Z2VvTWVyY2F0b3IgYXMgbWVyY2F0b3J9IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQge01hcERhdGF9IGZyb20gJy4uL21hcGRhdGEnO1xuaW1wb3J0IHtmcm9tWm9vbSwgdG9ab29tfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJy4uL21hdGgnO1xuaW1wb3J0IHtlbmFibGVab29tfSBmcm9tICcuL3pvb21lcic7IFxuaW1wb3J0IHtyZW5kZXJUaWxlc30gZnJvbSAnLi90aWxlcyc7XG5pbXBvcnQge3JlbmRlckdyaWR9IGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQge3JlbmRlclJvYWRzfSBmcm9tICcuL3JvYWRzJztcbmltcG9ydCB7cmVuZGVyTGFiZWxzfSBmcm9tICcuL2xhYmVscyc7XG5pbXBvcnQge3JlbmRlclBvaXN9IGZyb20gJy4vcG9pcyc7XG5pbXBvcnQge3JlbmRlclBsYXlhQmd9IGZyb20gJy4vcGxheWFiZyc7XG5pbXBvcnQge3JlbmRlck90aGVyc30gZnJvbSAnLi9vdGhlcnMnO1xuaW1wb3J0IHtkYXRhIGFzIHRoaXNZZWFyQmFzZU1hcH0gZnJvbSAnLi4vYmFzZW1hcCc7XG5cbmZ1bmN0aW9uIGdldEZlYXR1cmVDb2xvcihmLCBzdHlsZSwgaXNTZWxlY3RlZCkge1xuICAgIGlmIChmLmtpbmQgPT0gJ3ZlaGljbGUnKSB7XG4gICAgICAgIHJldHVybiBzdHlsZS5oaWdobGlnaHRDb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlLm91dGxpbmVDb2xvcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgXG5jbGFzcyBNYXBXaWRnZXQge1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHtcbiAgICAgICAgY2VudGVyLCBcbiAgICAgICAgYmFzZURhdGE9dGhpc1llYXJCYXNlTWFwLCBcbiAgICAgICAgem9vbT0xNC4zOCwgXG4gICAgICAgIG1heFpvb209MTgsXG4gICAgICAgIG1pblpvb209MTQsXG4gICAgICAgIHNob3dHcmlkPWZhbHNlLCBcbiAgICAgICAgc2hvd1BvaVN0YXR1cz10cnVlLCBcbiAgICAgICAgc2hvd1Jhc3RlclRpbGVzT25QbGF5YT1mYWxzZSxcbiAgICAgICAgcmFzdGVyVGlsZXM9J2h0dHA6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCBcbiAgICAgICAgcmFzdGVyVGlsZXNPcGFjaXR5PTEsIFxuICAgICAgICBvdXRsaW5lQ29sb3I9JyM5OTknLFxuICAgICAgICBtdXRlZENvbG9yPScjY2NjJyxcbiAgICAgICAgaGlnaGxpZ2h0Q29sb3I9JyNmZjAwMDAnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I9JyNmZmYnLFxuICAgICAgICBvbmNsaWNrPShmKSA9PiBjb25zb2xlLmxvZyhmLm5hbWUgKyAnIGNsaWNrZWQnKSxcbiAgICAgICAgb252aWV3Y2hhbmdlZD0oKSA9PiB7fSxcbiAgICAgICAgZmVhdHVyZUNvbG9yPWdldEZlYXR1cmVDb2xvcixcbiAgICB9PXt9KSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBtYXBkYXRhID0gbmV3IE1hcERhdGEoYmFzZURhdGEpO1xuXG4gICAgICAgIHpvb20gPSBjbGFtcCh6b29tLCBtaW5ab29tLCBtYXhab29tKTtcblxuICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgcmV0dXJuIG1lcmNhdG9yKClcbiAgICAgICAgICAgICAgICAuY2VudGVyKGNlbnRlciA/IGNlbnRlciA6IFswLDBdKVxuICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoW3dpZHRoLzIuMCwgaGVpZ2h0LzIuMF0pXG4gICAgICAgICAgICAgICAgLnNjYWxlKGZyb21ab29tKHpvb20pKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNlbnRlcikge1xuICAgICAgICAgICAgICAgIGNlbnRlciA9IG1hcGRhdGEuY2l0eSA/IG1hcGRhdGEuY2l0eS5jZW50ZXIgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVyTWFwKGVsZW1lbnQsIG1hcGRhdGEsIGN1cnJlbnRQcm9qZWN0aW9uKCksIHRoaXMsIHRoaXMub25jbGljayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5vbnZpZXdjaGFuZ2VkID0gb252aWV3Y2hhbmdlZDtcbiAgICAgICAgdGhpcy5vbmNsaWNrID0gb25jbGljaztcblxuICAgICAgICB0aGlzLnByb2plY3QgPSAobG5nbGF0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFByb2plY3Rpb24oKShsbmdsYXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudW5wcm9qZWN0ID0gKHBvaW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFByb2plY3Rpb24oKS5pbnZlcnQocG9pbnQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0VmlldyA9IChuZXdDZW50ZXIsIG5ld1pvb20pID0+IHtcbiAgICAgICAgICAgIGNlbnRlciA9IG5ld0NlbnRlcjtcbiAgICAgICAgICAgIHpvb20gPSBjbGFtcChuZXdab29tLCBtaW5ab29tLCBtYXhab29tKTtcbiAgICAgICAgICAgIHRoaXMub252aWV3Y2hhbmdlZCh0aGlzKTtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuem9vbUFyb3VuZCA9IChmb2N1c1BvaW50LCBrKSA9PiB7XG4gICAgICAgICAgICBjZW50ZXIgPSB0aGlzLnVucHJvamVjdChmb2N1c1BvaW50KTtcbiAgICAgICAgICAgIC8vIG5vdGU6IHRoaXMgZG9lc24ndCByZWFsbHkgd29yayB3aXRoIGsncyB0aGF0IHJlc3VsdCBpbiBub24taW50ZWdlciBcbiAgICAgICAgICAgIC8vIHpvb20gbGV2ZWxzIGJlY2F1c2Ugb2YgaG93IGZyb21ab29tIGlzIGltcGxlbWVudGVkLiBGaXggaXQ/XG4gICAgICAgICAgICB6b29tID0gY2xhbXAodG9ab29tKGsgKiBmcm9tWm9vbSh6b29tKSksIG1pblpvb20sIG1heFpvb20pO1xuICAgICAgICAgICAgY2VudGVyID0gdGhpcy51bnByb2plY3QoW2VsZW1lbnQuY2xpZW50V2lkdGggLSBmb2N1c1BvaW50WzBdLCBcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsaWVudEhlaWdodCAtIGZvY3VzUG9pbnRbMV1dKTtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgbWFwZGF0YS5jbGVhcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hZGRHZW9qc29uRGF0YSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBtYXBkYXRhLmFkZEdlb2pzb24oLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFkZEdlb2pzb25EYXRhVXJsID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIG1hcGRhdGEuYWRkR2VvanNvblVybCguLi5hcmdzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub25EYXRhID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIG1hcGRhdGEub24oLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9mZkRhdGEgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgbWFwZGF0YS5vZmYoLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RhdGEnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IG1hcGRhdGEsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2VsZW1lbnQnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGVsZW1lbnQsXG4gICAgICAgICAgICBzZXQ6ICh2KSA9PiB7IGVsZW1lbnQgPSBlbGVtZW50OyByZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY2VudGVyJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBjZW50ZXIsXG4gICAgICAgICAgICBzZXQ6ICh2KSA9PiB7IHRoaXMuc2V0Vmlldyh2LCB6b29tKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnem9vbUxldmVsJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB6b29tLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyB0aGlzLnNldFZpZXcoY2VudGVyLCB2KTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2hvd0dyaWQnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHNob3dHcmlkLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBzaG93R3JpZCA9IHY7IHJlbmRlcigpOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaG93UmFzdGVyVGlsZXNPblBsYXlhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBzaG93UmFzdGVyVGlsZXNPblBsYXlhLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBzaG93UmFzdGVyVGlsZXNPblBsYXlhID0gdjsgcmVuZGVyKCk7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Nob3dQb2lTdGF0dXMnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHNob3dQb2lTdGF0dXMsXG4gICAgICAgICAgICBzZXQ6ICh2KSA9PiB7IHNob3dQb2lTdGF0dXMgPSB2OyByZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmFzdGVyVGlsZXMnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHJhc3RlclRpbGVzLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyByYXN0ZXJUaWxlcyA9IHY7IHJlbmRlcigpOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyYXN0ZXJUaWxlc09wYWNpdHknLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IHJhc3RlclRpbGVzT3BhY2l0eSxcbiAgICAgICAgICAgIHNldDogKHYpID0+IHsgcmFzdGVyVGlsZXNPcGFjaXR5ID0gdjsgcmVuZGVyKCk7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ291dGxpbmVDb2xvcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gb3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBvdXRsaW5lQ29sb3IgPSB2OyByZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbXV0ZWRDb2xvcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gb3V0bGluZUNvbG9yLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBvdXRsaW5lQ29sb3IgPSB2OyByZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaGlnaGxpZ2h0Q29sb3InLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBoaWdobGlnaHRDb2xvciA9IHY7IHJlbmRlcigpOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdiYWNrZ3JvdW5kQ29sb3InLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgIHNldDogKHYpID0+IHsgYmFja2dyb3VuZENvbG9yID0gdjsgcmVuZGVyKCk7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2ZlYXR1cmVDb2xvcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZmVhdHVyZUNvbG9yLFxuICAgICAgICAgICAgc2V0OiAodikgPT4geyBmZWF0dXJlQ29sb3IgPSB2OyByZW5kZXIoKTsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZW5kZXIpO1xuICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgZW5hYmxlWm9vbSh0aGlzLCBzZWxlY3QoZWxlbWVudCkuc2VsZWN0KCcuY29udGFpbmVyJykpO1xuXG4gICAgICAgIC8vIFJlcmVuZGVyIGV2ZXJ5IG9uY2UgaW4gYSB3aGlsZSB0byB1cGRhdGUgcmVsYXRpdmUgdGltZXNcbiAgICAgICAgLy8gbGlrZSBcIk4gbWludXRlcyBhZ29cIlxuICAgICAgICBsZXQgcmVmcmVzaFRpbWVySWQgPSBudWxsO1xuICAgICAgICBjb25zdCByZWZyZXNoUmVsYXRpdmVUaW1lcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgcmVmcmVzaFRpbWVySWQgPSBzZXRUaW1lb3V0KHJlZnJlc2hSZWxhdGl2ZVRpbWVzLCAzMDAwMCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlZnJlc2hUaW1lcklkID0gc2V0VGltZW91dChyZWZyZXNoUmVsYXRpdmVUaW1lcywgMzAwMDApO1xuXG5cbiAgICAgICAgbWFwZGF0YS5vbigndXBkYXRlJywgcmVuZGVyKTtcbiAgICB9XG5cblxufVxuXG5mdW5jdGlvbiByZW5kZXJNYXAoZWxlbWVudCwgZGF0YSwgcHJvamVjdGlvbiwgc3R5bGUsIG9uY2xpY2spIHtcbiAgICBsZXQgbm9kZXMgPSBzZWxlY3QoZWxlbWVudCkuc2VsZWN0QWxsKCdzdmcnKS5kYXRhKFsxXSk7XG5cbiAgICBub2Rlcy5leGl0KClcbiAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgbm9kZXMuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgLmF0dHIoJ3NoYXBlLXJlbmRlcmluZycsICdhdXRvJylcbiAgICAgICAgICAgIC5zdHlsZSgnd2lkdGgnLCAnMTAwJScpXG4gICAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAuY2xhc3NlZCgnY29udGFpbmVyJywgdHJ1ZSlcbiAgICAgICAgLm1lcmdlKG5vZGVzKVxuICAgICAgICAgICAgLnN0eWxlKCdiYWNrZ3JvdW5kJywgc3R5bGUuYmFja2dyb3VuZENvbG9yKVxuICAgICAgICA7ICAgIFxuXG4gICAgY29uc3QgY29udGFpbmVyID0gc2VsZWN0KGVsZW1lbnQpLnNlbGVjdCgnZy5jb250YWluZXInKTtcblxuICAgIG5vZGVzID0gY29udGFpbmVyLnNlbGVjdEFsbCgnZycpLmRhdGEoW1xuICAgICAgICAndGlsZXMnLCBcbiAgICAgICAgJ3BsYXlhYmcnLCBcbiAgICAgICAgJ2dyaWQnLCBcbiAgICAgICAgLy8nY2xpY2t0YXJnZXRzJyxcbiAgICAgICAgJ291dGxpbmVzJyxcbiAgICAgICAgJ290aGVycycsXG4gICAgICAgICdmaWxscycsXG4gICAgICAgICdwb2lzJyxcbiAgICAgICAgJ2xhYmVscycsXG4gICAgICAgIC8vJ3NlbGVjdGlvbicsXG4gICAgICAgIC8vJ3RpY2tzJ1xuICAgICAgICBdKTtcblxuICAgIG5vZGVzLmV4aXQoKVxuICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICBub2Rlcy5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ2cnKVxuICAgICAgICAubWVyZ2Uobm9kZXMpXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0KHRoaXMpLmNsYXNzZWQoZCwgdHJ1ZSk7IFxuICAgICAgICAgICAgfSk7XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IGRhdGEuZmVhdHVyZXM7XG4gICAgY29uc3QgY2l0eSA9IGRhdGEuY2l0eTtcblxuICAgIHJlbmRlclRpbGVzKHByb2plY3Rpb24sIGNvbnRhaW5lciwgc3R5bGUpO1xuICAgIHJlbmRlclBsYXlhQmcocHJvamVjdGlvbiwgY29udGFpbmVyLCBzdHlsZSk7XG4gICAgcmVuZGVyR3JpZChwcm9qZWN0aW9uLCBjb250YWluZXIsIGNpdHksIHN0eWxlKTtcblxuICAgIGNvbnN0IGxheWVyUmVuZGVyZXJzID0gW1xuICAgICAgICByZW5kZXJSb2FkcyxcbiAgICAgICAgcmVuZGVyTGFiZWxzLFxuICAgICAgICByZW5kZXJQb2lzLFxuICAgICAgICByZW5kZXJPdGhlcnMsIFxuICAgIF07XG5cbiAgICBmb3IobGV0IHIgb2YgbGF5ZXJSZW5kZXJlcnMpIHtcbiAgICAgICAgcihwcm9qZWN0aW9uLCBjb250YWluZXIsIGZlYXR1cmVzLCBjaXR5LCBzdHlsZSwgb25jbGljayk7XG4gICAgfSAgICAgICAgXG59IiwiaW1wb3J0IHtzZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQge2Zyb21GZWV0LCB0b0RlZ3JlZXN9IGZyb20gJy4uL21hdGgnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTGFiZWxzKHByb2plY3Rpb24sIGNvbnRhaW5lciwgZmVhdHVyZXMsIGNpdHksIHN0eWxlLCBvbmNsaWNrKSB7XG4gICAgY29uc3QgY3N0cmVldHMgPSBmZWF0dXJlcy5maWx0ZXIoZiA9PiBmLnN0cmVldEtpbmQgPT0gJ2NzdHJlZXQnKTtcbiAgICBjb25zdCB0c3RyZWV0cyA9IGZlYXR1cmVzLmZpbHRlcihmID0+IGYuc3RyZXRLaW5kID09ICd0c3RyZWF0Jyk7XG4gICAgY29uc3QgcG9pcyA9IGZlYXR1cmVzLmZpbHRlcigoZikgPT4gZi5nZW9tZXRyeSAmJiBmLmdlb21ldHJ5LnR5cGUgPT0gJ1BvaW50JyAmJiAhZi50cmFja2VkKTtcblxuICAgIGNvbnN0IHRzdHJlZXRMYWJlbHMgPSB0c3RyZWV0cy5tYXAoKHN0cmVldCkgPT4geyByZXR1cm4ge1xuICAgICAgICBvbmNsaWNrOiAoKSA9PiBvbmNsaWNrKHN0cmVldCksXG4gICAgICAgIHB0OiBwcm9qZWN0aW9uKHN0cmVldC5jaXR5LmdldExvY2F0aW9uKHN0cmVldC5kaXJlY3Rpb24sIHN0cmVldC5jaXR5LmxTdHJlZXQucmFkaXVzKSksXG4gICAgICAgIHR4dDogc3RyZWV0Lm5hbWUsXG4gICAgICAgIGFuZzogc3RyZWV0LmNpdHkuZ2V0QmVhcmluZyhzdHJlZXQuZGlyZWN0aW9uLnJhZGlhbnMpLFxuICAgICAgICBvZmY6IFswLC0xNV0sXG4gICAgICAgIGFuY2hvcjogJ21pZGRsZScsXG4gICAgICAgIGFsaWdubWVudDogJ2F1dG8nLFxuICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgICAgICBzdHJva2U6ICdub25lJyxcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDAsXG4gICAgICAgIGZpbGw6IHN0eWxlLm91dGxpbmVDb2xvcixcbiAgICAgICAgc2VsZWN0YWJsZTogZmFsc2UsXG4gICAgfX0pO1xuICAgIGNvbnN0IGNzdHJlZXRMYWJlbHMgPSBjc3RyZWV0cy5tYXAoc3RyZWV0ID0+IHsgcmV0dXJuIHtcbiAgICAgICAgb25jbGljazogKCkgPT4gb25jbGljayhzdHJlZXQpLFxuICAgICAgICBwdDogcHJvamVjdGlvbihzdHJlZXQuY2l0eS5nZXRMb2NhdGlvbih7aG91cjoxMCwgbWludXRlOjB9LCBzdHJlZXQucmFkaXVzKSksXG4gICAgICAgIHR4dDogc3RyZWV0Lm5hbWUsXG4gICAgICAgIGFuZzogMCxcbiAgICAgICAgb2ZmOiBbMTQsMF0sXG4gICAgICAgIGFuY2hvcjogJ3N0YXJ0JyxcbiAgICAgICAgYWxpZ25tZW50OiAnYXV0bycsXG4gICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXG4gICAgICAgIHN0cm9rZTogJ25vbmUnLFxuICAgICAgICBzdHJva2VXaWR0aDogMCxcbiAgICAgICAgZmlsbDogc3R5bGUub3V0bGluZUNvbG9yLFxuICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcbiAgICB9fSk7XG4gICAgY29uc3QgcG9pTGFiZWxzID0gcG9pcy5tYXAocG9pID0+IHsgcmV0dXJuIHtcbiAgICAgICAgb25jbGljazogKCkgPT4gb25jbGljayhwb2kpLFxuICAgICAgICBwdDogcHJvamVjdGlvbihwb2kuY29vcmRzKSxcbiAgICAgICAgdHh0OiBwb2kubmFtZSxcbiAgICAgICAgYW5nOiAwLFxuICAgICAgICBvZmY6IFswLDhdLFxuICAgICAgICBhbmNob3I6ICdtaWRkbGUnLFxuICAgICAgICBhbGlnbm1lbnQ6ICdoYW5naW5nJyxcbiAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgIHN0cm9rZTogc3R5bGUuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICBzdHJva2VXaWR0aDogNyxcbiAgICAgICAgZmlsbDogc3R5bGUuZmVhdHVyZUNvbG9yKHBvaSwgc3R5bGUpLFxuICAgICAgICBzZWxlY3RhYmxlOiB0cnVlLFxuICAgIH19KTtcbiAgICBjb25zdCBwb2lTdGF0dXNlcyA9IHN0eWxlLnNob3dQb2lTdGF0dXMgPyBwb2lzLm1hcChwb2kgPT4geyByZXR1cm4ge1xuICAgICAgICBvbmNsaWNrOiAoKSA9PiBvbmNsaWNrKHBvaSksXG4gICAgICAgIHB0OiBwcm9qZWN0aW9uKHBvaS5jb29yZHMpLFxuICAgICAgICB0eHQ6IHBvaS5zdGF0dXMoY2l0eSksXG4gICAgICAgIGFuZzogMCxcbiAgICAgICAgb2ZmOiBbMCwxMisxMF0sXG4gICAgICAgIGFuY2hvcjogJ21pZGRsZScsXG4gICAgICAgIGFsaWdubWVudDogJ2hhbmdpbmcnLFxuICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgICAgICBzdHJva2U6IHN0eWxlLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgc3Ryb2tlV2lkdGg6IDcsXG4gICAgICAgIGZpbGw6IHN0eWxlLmZlYXR1cmVDb2xvcihwb2ksIHN0eWxlKSxcbiAgICAgICAgc2VsZWN0YWJsZTogdHJ1ZSxcbiAgICB9fSkgOiBbXTtcblxuICAgIGNvbnN0IGdyb3VwID0gY29udGFpbmVyLnNlbGVjdCgnZy5sYWJlbHMnKTsgICAgXG4gICAgbGV0IG5vZGVzID0gZ3JvdXAuc2VsZWN0QWxsKFwidGV4dFwiKS5kYXRhKFsuLi5jc3RyZWV0TGFiZWxzLCAuLi50c3RyZWV0TGFiZWxzLCAuLi5wb2lTdGF0dXNlcywgLi4ucG9pTGFiZWxzXSk7XG5cbiAgICBub2Rlcy5leGl0KClcbiAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgbm9kZXMuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdmb250LWZhbWlseScsICdIZWx2ZXRpY2EsIHNhbnMtc2VyaWYnKVxuICAgICAgICAgICAgLmF0dHIoJ3BhaW50LW9yZGVyJywgJ3N0cm9rZScpXG4gICAgICAgICAgICAuc3R5bGUoJ2N1cnNvcicsICdkZWZhdWx0JylcbiAgICAgICAgLm1lcmdlKG5vZGVzKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsIChsKSA9PiBsLnN0cm9rZSlcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAobCkgPT4gbC5zdHJva2VXaWR0aClcbiAgICAgICAgICAgIC5hdHRyKCdmb250LXNpemUnLCAobCkgPT4gbC5mb250U2l6ZSlcbiAgICAgICAgICAgIC5hdHRyKCdmb250LXdlaWdodCcsIChsKSA9PiBsLmZvbnRXZWlnaHQpXG4gICAgICAgICAgICAuYXR0cigndGV4dC1hbmNob3InLCAobCkgPT4gbC5hbmNob3IpXG4gICAgICAgICAgICAuYXR0cignYWxpZ25tZW50LWJhc2VsaW5lJywgKGwpID0+IGwuYWxpZ25tZW50KVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAobCkgPT4gbC5maWxsKVxuICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgKGwpID0+IGwuc2VsZWN0YWJsZSA/ICd2aXNpYmxlJyA6ICdub25lJylcbiAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAobCkgPT4gJ3RyYW5zbGF0ZSgnICsgbC5wdC5qb2luKCcsJykgKyAnKSByb3RhdGUoJyArIHRvRGVncmVlcyhsLmFuZykgKyAnKSB0cmFuc2xhdGUoJyArIGwub2ZmLmpvaW4oJywnKSArICcpJykgICAgXG4gICAgICAgICAgICAuc3R5bGUoJ3VzZXItc2VsZWN0JywgKGwpID0+IGwuc2VsZWN0YWJsZSA/ICdhbGxvd2VkJyA6ICdub25lJylcbiAgICAgICAgICAgIC5vbignY2xpY2snLCAobCk9PiBsLm9uY2xpY2spXG4gICAgICAgICAgICAudGV4dCgobCkgPT4gbC50eHQpO1xufSIsImltcG9ydCB7c2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtzY2FsZUxpbmVhcn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtwYXRoIGFzIHBhdGhCdWlsZGVyfSBmcm9tICdkMy1wYXRoJztcbmltcG9ydCB7Z2VvUGF0aH0gZnJvbSAnZDMtZ2VvJztcbmltcG9ydCB7RmVuY2V9IGZyb20gJy4uL21hcGRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyT3RoZXJzKHByb2plY3Rpb24sIGNvbnRhaW5lciwgZmVhdHVyZXMsIGNpdHksIHN0eWxlLCBvbmNsaWNrKSB7XG4gICAgZmVhdHVyZXMgPSBmZWF0dXJlcy5maWx0ZXIoKGYpID0+ICFmLmlzUm9hZCAmJiAhZi5pc1BPSSk7XG5cbiAgICBjb25zdCBncm91cCA9IGNvbnRhaW5lci5zZWxlY3QoJ2cub3RoZXJzJyk7XG4gICAgY29uc3QgZ2VvbWV0cnlUb1BhdGggPSBnZW9QYXRoKHByb2plY3Rpb24pO1xuICAgIGNvbnN0IG5vZGVzID0gZ3JvdXAuc2VsZWN0QWxsKCdwYXRoJykuZGF0YShmZWF0dXJlcyk7XG4gICAgXG4gICAgbm9kZXMuZXhpdCgpXG4gICAgICAgIC5yZW1vdmUoKTtcblxuICAgIG5vZGVzLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgIC5tZXJnZShub2RlcylcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgc3R5bGUub3V0bGluZUNvbG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlLWRhc2hhcnJheScsICc1LDQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2QnLCAoZikgPT4gZ2VvbWV0cnlUb1BhdGgoZi5nZW9tZXRyeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgb25jbGljayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgc3R5bGUubXV0ZWRDb2xvcilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCBzdHlsZS5tdXRlZENvbG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIDAuMylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkJywgKGYpID0+IGdlb21ldHJ5VG9QYXRoKGYuZ2VvbWV0cnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIG9uY2xpY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xufVxuIiwiaW1wb3J0IHtzZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5cbmV4cG9ydCBcbmZ1bmN0aW9uIHJlbmRlclBsYXlhQmcocHJvamVjdGlvbiwgY29udGFpbmVyLCBzdHlsZSkge1xuICAgIGNvbnN0IGJveGVzID0gIXN0eWxlLnNob3dSYXN0ZXJUaWxlc09uUGxheWEgPyBbW3Byb2plY3Rpb24oWy0xMTkuMzI5MCwgNDAuODUxMl0pLCBwcm9qZWN0aW9uKFstMTE5LjEzNzgsIDQwLjcyNjJdKV1dIDogW107XG4gICAgY29uc3QgZ3JvdXAgPSBjb250YWluZXIuc2VsZWN0KCdnLnBsYXlhYmcnKTtcbiAgICBjb25zdCBub2RlcyA9IGdyb3VwLnNlbGVjdEFsbCgncmVjdCcpLmRhdGEoYm94ZXMpO1xuICAgIFxuICAgIG5vZGVzLmV4aXQoKVxuICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICBub2Rlcy5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsIG51bGwpXG4gICAgICAgIC5tZXJnZShub2RlcylcbiAgICAgICAgICAgIC5hdHRyKCd4JywgZiA9PiBmWzBdWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCBmID0+IGZbMF1bMV0pXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBmID0+IGZbMV1bMF0gLSBmWzBdWzBdKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGYgPT4gZlsxXVsxXSAtIGZbMF1bMV0pXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIHN0eWxlLmJhY2tncm91bmRDb2xvcik7XG59XG5cbiIsImltcG9ydCB7c2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtzY2FsZUxpbmVhcn0gZnJvbSAnZDMtc2NhbGUnO1xuaW1wb3J0IHtBcnR9IGZyb20gJy4uL21hcGRhdGEnO1xuXG5leHBvcnQgXG5mdW5jdGlvbiByZW5kZXJQb2lzKHByb2plY3Rpb24sIGNvbnRhaW5lciwgZmVhdHVyZXMsIGNpdHksIHN0eWxlLCBvbmNsaWNrKSB7XG4gICAgZmVhdHVyZXMgPSBmZWF0dXJlcy5maWx0ZXIoKGYpID0+IGYuZ2VvbWV0cnkgJiYgZi5nZW9tZXRyeS50eXBlID09ICdQb2ludCcgJiYgIWYudHJhY2tlZCk7XG5cbiAgICBjb25zdCBncm91cCA9IGNvbnRhaW5lci5zZWxlY3QoJ2cucG9pcycpO1xuICAgIGNvbnN0IG5vZGVzID0gZ3JvdXAuc2VsZWN0QWxsKCdjaXJjbGUnKS5kYXRhKGZlYXR1cmVzKTtcbiAgICBcbiAgICBub2Rlcy5leGl0KClcbiAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgbm9kZXMuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdjaXJjbGUnKVxuICAgICAgICAubWVyZ2Uobm9kZXMpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsIGYgPT4gc3R5bGUuZmVhdHVyZUNvbG9yKGYsIHN0eWxlKSlcbiAgICAgICAgICAgIC5hdHRyKCdzdHJva2UnLCBudWxsKVxuICAgICAgICAgICAgLmF0dHIoJ2N4JywgZiA9PiBwcm9qZWN0aW9uKGYuY29vcmRzKVswXSlcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIGYgPT4gcHJvamVjdGlvbihmLmNvb3JkcylbMV0pXG4gICAgICAgICAgICAuYXR0cigncicsIDMpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgb25jbGljayk7XG59XG4iLCJpbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7c2NhbGVMaW5lYXJ9IGZyb20gJ2QzLXNjYWxlJztcbmltcG9ydCB7cGF0aCBhcyBwYXRoQnVpbGRlcn0gZnJvbSAnZDMtcGF0aCc7XG5pbXBvcnQge2dlb1BhdGh9IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQge2Zyb21GZWV0LCB0b0RlZ3JlZXN9IGZyb20gJy4uL21hdGgnO1xuaW1wb3J0IHt0b1BpeGVscywgdG9ab29tfSBmcm9tICcuLi91dGlsJztcblxuXG5mdW5jdGlvbiByZW5kZXJQYXRocyhwcm9qZWN0aW9uLCBmZWF0dXJlcywgY2l0eSwgZ3JvdXAsIHdlaWdodCwgY29sb3IsIG9uQ2xpY2spIHtcbiAgICBjb25zdCBnZW9tZXRyeVRvUGF0aCA9IGdlb1BhdGgocHJvamVjdGlvbik7XG4gICAgY29uc3Qgbm9kZXMgPSBncm91cC5zZWxlY3RBbGwoJ3BhdGgnKS5kYXRhKGZlYXR1cmVzKTtcbiAgICBcbiAgICBub2Rlcy5leGl0KClcbiAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgbm9kZXMuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLm1lcmdlKG5vZGVzKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZikgPT4gZi5nZW9tZXRyeS50eXBlID09ICdQb2x5Z29uJyA/IGNvbG9yIDogJ25vbmUnKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsIGNvbG9yKVxuICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsIChmKSA9PiBmLndpZHRoID8gdG9QaXhlbHMocHJvamVjdGlvbiwgZi53aWR0aCkgKyB3ZWlnaHQgOiB3ZWlnaHQpXG4gICAgICAgICAgICAuYXR0cignZCcsIChmKSA9PiBnZW9tZXRyeVRvUGF0aChmLmdlb21ldHJ5KSlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBvbkNsaWNrKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUm9hZHMocHJvamVjdGlvbiwgY29udGFpbmVyLCBmZWF0dXJlcywgY2l0eSwgc3R5bGUsIG9uQ2xpY2spIHtcbiAgICBjb25zdCByb2FkRmVhdHVyZXMgPSBmZWF0dXJlcy5maWx0ZXIoKGYpID0+IGYuaXNSb2FkKTtcbiAgICByZW5kZXJQYXRocyhwcm9qZWN0aW9uLCByb2FkRmVhdHVyZXMsIGNpdHksIGNvbnRhaW5lci5zZWxlY3QoJ2cub3V0bGluZXMnKSwgMTAsIHN0eWxlLm91dGxpbmVDb2xvciwgb25DbGljayk7XG4gICAgcmVuZGVyUGF0aHMocHJvamVjdGlvbiwgcm9hZEZlYXR1cmVzLCBjaXR5LCBjb250YWluZXIuc2VsZWN0KCdnLmZpbGxzJyksIDcsIHN0eWxlLmJhY2tncm91bmRDb2xvciwgb25DbGljayk7XG59XG4iLCJpbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7Z2VvTWVyY2F0b3IgYXMgbWVyY2F0b3J9IGZyb20gJ2QzLWdlbyc7XG5pbXBvcnQge3JhbmdlfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQge2Zyb21ab29tLCB0b1pvb20sIHNsaXBweVRpbGVOdW1iZXJzfSBmcm9tICcuLi91dGlsJztcblxuZnVuY3Rpb24gdGlsZVVybCh4LCB5LCB6b29tLCBwYXR0ZXJuKSB7XG4gIHJldHVybiBwYXR0ZXJuXG4gICAgICAgIC5yZXBsYWNlKCd7c30nLCBbXCJhXCIsIFwiYlwiLCBcImNcIl1bTWF0aC5yYW5kb20oKSAqIDMgfCAwXSlcbiAgICAgICAgLnJlcGxhY2UoJ3t6fScsIE1hdGguZmxvb3Ioem9vbSkpXG4gICAgICAgIC5yZXBsYWNlKCd7eH0nLCBNYXRoLmZsb29yKHgpKVxuICAgICAgICAucmVwbGFjZSgne3l9JywgTWF0aC5mbG9vcih5KSk7XG59O1xuXG5mdW5jdGlvbiBsbmcydGlsZShsb24sem9vbSkgeyBcbiAgcmV0dXJuIChNYXRoLmZsb29yKChsb24rMTgwKS8zNjAqTWF0aC5wb3coMix6b29tKSkpOyBcbn1cblxuZnVuY3Rpb24gbGF0MnRpbGUobGF0LHpvb20pICB7IFxuICByZXR1cm4gKE1hdGguZmxvb3IoKDEtTWF0aC5sb2coTWF0aC50YW4obGF0Kk1hdGguUEkvMTgwKSArIDEvTWF0aC5jb3MobGF0Kk1hdGguUEkvMTgwKSkvTWF0aC5QSSkvMiAqTWF0aC5wb3coMix6b29tKSkpOyBcbn1cblxuZnVuY3Rpb24gdGlsZTJsbmcoeCx6KSB7XG4gIHJldHVybiAoeC9NYXRoLnBvdygyLHopKjM2MC0xODApOyBcbn1cblxuZnVuY3Rpb24gdGlsZTJsYXQoeSx6KSB7XG4gIHZhciBuPU1hdGguUEktMipNYXRoLlBJKnkvTWF0aC5wb3coMix6KTsgXG4gIHJldHVybiAoMTgwL01hdGguUEkqTWF0aC5hdGFuKDAuNSooTWF0aC5leHAobiktTWF0aC5leHAoLW4pKSkpO1xufVxuXG5leHBvcnQgXG5mdW5jdGlvbiByZW5kZXJUaWxlcyhwcm9qZWN0aW9uLCBjb250YWluZXIsIHN0eWxlKSB7XG4gICAgY29uc3QgeiA9IHRvWm9vbShwcm9qZWN0aW9uLnNjYWxlKCkpO1xuICAgIGNvbnN0IHpvb20gPSBNYXRoLnJvdW5kKHopO1xuICAgIGNvbnN0IGsgPSBNYXRoLnBvdygyLCB6IC0gem9vbSk7XG4gICAgY29uc3Qgd2lkdGggPSBjb250YWluZXIubm9kZSgpLm93bmVyU1ZHRWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSBjb250YWluZXIubm9kZSgpLm93bmVyU1ZHRWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3Qgbm9ydGh3ZXN0ID0gcHJvamVjdGlvbi5pbnZlcnQoWzAsMF0pO1xuICAgIGNvbnN0IHNvdXRoZWFzdCA9IHByb2plY3Rpb24uaW52ZXJ0KFt3aWR0aCxoZWlnaHRdKTtcbiAgICBjb25zdCB0b3BfdGlsZSAgICA9IGxhdDJ0aWxlKG5vcnRod2VzdFsxXSwgem9vbSk7IFxuICAgIGNvbnN0IGxlZnRfdGlsZSAgID0gbG5nMnRpbGUobm9ydGh3ZXN0WzBdLCB6b29tKTtcbiAgICBjb25zdCBib3R0b21fdGlsZSA9IGxhdDJ0aWxlKHNvdXRoZWFzdFsxXSwgem9vbSk7XG4gICAgY29uc3QgcmlnaHRfdGlsZSAgPSBsbmcydGlsZShzb3V0aGVhc3RbMF0sIHpvb20pO1xuICAgIGNvbnN0IHRpbGVzID0gW107XG4gICAgaWYgKHN0eWxlLnJhc3RlclRpbGVzKSB7XG4gICAgICAgIGZvcihsZXQgeD1sZWZ0X3RpbGU7IHggPD1yaWdodF90aWxlOyArK3gpIHtcbiAgICAgICAgICBmb3IobGV0IHk9dG9wX3RpbGU7IHkgPD1ib3R0b21fdGlsZTsgKyt5KSB7XG4gICAgICAgICAgICBjb25zdCBwdCA9IHByb2plY3Rpb24oW3RpbGUybG5nKHgsIHpvb20pLCB0aWxlMmxhdCh5LCB6b29tKV0pO1xuICAgICAgICAgICAgdGlsZXMucHVzaChbdGlsZVVybCh4LCB5LCB6b29tLCBzdHlsZS5yYXN0ZXJUaWxlcyksIE1hdGguZmxvb3IocHRbMF0pLCBNYXRoLmZsb29yKHB0WzFdKSwgel0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAgICAgICAgXG4gICAgfVxuXG4gICAgY29uc3QgZ3JvdXAgPSBjb250YWluZXIuc2VsZWN0KCdnLnRpbGVzJyk7XG4gICAgY29uc3Qgbm9kZXMgPSBncm91cC5zZWxlY3RBbGwoJ2ltYWdlJykuZGF0YSh0aWxlcyk7XG4gICAgXG4gICAgbm9kZXMuZXhpdCgpXG4gICAgICAgIC5yZW1vdmUoKTtcblxuICAgIG5vZGVzLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgICAgICAubWVyZ2Uobm9kZXMpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIE1hdGguY2VpbCgyNTYqaykpXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBNYXRoLmNlaWwoMjU2KmspKVxuICAgICAgICAgICAgLmF0dHIoXCJ4bGluazpocmVmXCIsICh0KSA9PiB0WzBdKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsICh0KSA9PiB0WzFdKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsICh0KSA9PiB0WzJdKVxuICAgICAgICAgICAgLmF0dHIoXCJ6XCIsICh0KT0+dFszXSlcbiAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIHN0eWxlLnJhc3RlclRpbGVzT3BhY2l0eSlcbiAgICAgICAgICAgIC5vbignZXJyb3InLCBmdW5jdGlvbigpIHsgc2VsZWN0KHRoaXMpLnN0eWxlKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpOyB9KTtcblxufVxuIiwiaW1wb3J0IHtzZWxlY3QsIGV2ZW50fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtmcm9tWm9vbSwgdG9ab29tLCBkZWJvdW5jZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCBcbmZ1bmN0aW9uIGVuYWJsZVpvb20obWFwLCBjb250YWluZXIpIHtcbiAgICBsZXQgeDAseTA7XG5cbiAgICBjb25zdCBvbkRyYWdQcm9ncmVzcyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdHIgPSBbZXZlbnQuY2xpZW50WCAtIHgwLCBldmVudC5jbGllbnRZIC0geTBdO1xuICAgICAgICBjb25zdCBzY2FsZSA9IDE7XG4gICAgICAgIC8vY29uc29sZS5sb2coYHpvb20gdHI6ICR7dHJ9LCBzOiR7c2NhbGV9YCk7XG4gICAgICAgIGNvbnRhaW5lci5zdHlsZSgndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3RyWzBdfXB4LCR7dHJbMV19cHgpIHNjYWxlKCR7c2NhbGV9KWApO1xuICAgIH07XG5cbiAgICBjb25zdCBvbkRyYWdTdGFydGVkID0gKCkgPT4ge1xuICAgICAgICB4MCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIHkwID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgc2VsZWN0KG1hcC5lbGVtZW50KS5vbignbW91c2Vtb3ZlLnpvb20nLCBvbkRyYWdQcm9ncmVzcyk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uRHJhZ0VuZGVkID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB0ciA9IFtldmVudC5jbGllbnRYIC0geDAsIGV2ZW50LmNsaWVudFkgLSB5MF07XG4gICAgICAgIGNvbnN0IHNjYWxlID0gMTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgem9vbWVuZCB0cjoke3RyfSwgc2M6JHtzY2FsZX1gKTtcbiAgICAgICAgbGV0IG5ld0NlbnRlclBvaW50ID0gW21hcC5lbGVtZW50LmNsaWVudFdpZHRoLzIgLSB0clswXSwgXG4gICAgICAgICAgICBtYXAuZWxlbWVudC5jbGllbnRIZWlnaHQvMiAtIHRyWzFdXTtcbiAgICAgICAgbGV0IG5ld0NlbnRlckxuZ0xhdCA9IG1hcC51bnByb2plY3QobmV3Q2VudGVyUG9pbnQpO1xuICAgICAgICBsZXQgbmV3U2NhbGUgPSBmcm9tWm9vbShtYXAuem9vbUxldmVsKSAqIHNjYWxlO1xuICAgICAgICBtYXAuc2V0VmlldyhuZXdDZW50ZXJMbmdMYXQsIHRvWm9vbShuZXdTY2FsZSkpO1xuICAgICAgICBzZWxlY3QobWFwLmVsZW1lbnQpLm9uKCdtb3VzZW1vdmUuem9vbScsIG51bGwpO1xuICAgICAgICBjb250YWluZXIuc3R5bGUoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMHB4LDBweCkgc2NhbGUoMSlgKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25EYmxDbGljayA9ICgpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBtYXAuem9vbUFyb3VuZChbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV0sIDAuNSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXAuem9vbUFyb3VuZChbZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WV0sIDIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9uS2V5RG93biA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgem9vbVN0ZXAgPSAwLjE7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDE4NyAvKiBlcXVhbHMsIHNhbWUga2V5IGFzIHBsdXMgKi8pIHtcbiAgICAgICAgICAgIG1hcC5zZXRWaWV3KG1hcC5jZW50ZXIsIG1hcC56b29tTGV2ZWwgKyB6b29tU3RlcCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09IDE4OSAvKiBtaW51cyAqLykge1xuICAgICAgICAgICAgbWFwLnNldFZpZXcobWFwLmNlbnRlciwgbWFwLnpvb21MZXZlbCAtIHpvb21TdGVwKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHNlbGVjdChtYXAuZWxlbWVudCkub24oJ21vdXNlZG93bi56b29tJywgb25EcmFnU3RhcnRlZCk7XG4gICAgc2VsZWN0KG1hcC5lbGVtZW50KS5vbignbW91c2V1cC56b29tJywgb25EcmFnRW5kZWQpO1xuICAgIHNlbGVjdChtYXAuZWxlbWVudCkub24oJ2RibGNsaWNrLnpvb20nLCBvbkRibENsaWNrKTtcbiAgICBzZWxlY3QoJ2JvZHknKS5vbigna2V5ZG93bi56b29tJywgb25LZXlEb3duKTtcbn07XG5cbmV4cG9ydFxuZnVuY3Rpb24gZGlzYWJsZVpvb20obWFwKSB7XG4gICAgc2VsZWN0KG1hcC5lbGVtZW50KS5vbignLnpvb20nLCBudWxsKTtcbn1cbiIsImV4cG9ydCBjb25zdCBFQVJUSF9SID0gIDYzNzgxMzc7XG5jb25zdCBUV09fUEkgPSBNYXRoLlBJKjI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduKHYpIHtcbiAgICByZXR1cm4gdiA+IDAgPyAxIDogdiA8IDAgPyAtMSA6IDA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAodiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHYpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFuZ2xlKGFuZ2xlLCBjZW50ZXIpIHtcbiAgICBjZW50ZXIgPSBjZW50ZXIgPT09IHVuZGVmaW5lZCA/IDAgOiBjZW50ZXI7XG4gICAgcmV0dXJuIGFuZ2xlIC0gVFdPX1BJKk1hdGguZmxvb3IoKGFuZ2xlICsgTWF0aC5QSSAtIGNlbnRlcikvVFdPX1BJKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRGVncmVlcyhkZWcpIHtcbiAgICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlZ3JlZXMocmFkKSB7XG4gICAgcmV0dXJuIChyYWQgKiAxODAgLyBNYXRoLlBJKSAlIDM2MDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRmVldChmdCkge1xuICAgIHJldHVybiBmdC90b0ZlZXQoMSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9GZWV0KG0pIHtcbiAgICByZXR1cm4gbSozLjI4MDg0O1xufTtcblxuLyoqXG4gKiBHZXQgZ3JlYXQtY2lyY2xlIGRpc3RhbmNlIGJldHdlZW4gbG9jYXRpb25zLiBUaGUgZGlzdGFuY2UgaXMgXG4gKiBjYWxjdWxhdGVkIHVzaW5nIHNwaGVyaWNhbCBsYXcgb2YgY29zaW5lcywgYW4gYXBwcm94aW1hdGlvbiB0byBcbiAqIGhhdmVyc2luZSBmb3JtdWxhLlxuICpcbiAqIEBwYXJhbSBmcm9tIGZpcnN0IGxvY2F0aW9uLCBbbG9uZ2l0dWRlLCBsYXRpdHVkZV0gYXJyYXlcbiAqIEBwYXJhbSB0byBzZWNvbmQgbG9jYXRpb24sIFtsb25naXR1ZGUsIGxhdGl0dWRlXSBhcnJheVxuICogQHJldHVybiBkaXN0YW5jZSBpbiBtZXRlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREaXN0YW5jZShmcm9tLCB0bykge1xuICAgIC8vIM+GOiBsYXRpdHVkZSwgzrs6IGxvbmdpdHVkZSBcbiAgICB2YXIgzrsxID0gZnJvbURlZ3JlZXMoZnJvbVswXSksXG4gICAgICAgIM+GMSA9IGZyb21EZWdyZWVzKGZyb21bMV0pLFxuICAgICAgICDOuzIgPSBmcm9tRGVncmVlcyh0b1swXSksIFxuICAgICAgICDPhjIgPSBmcm9tRGVncmVlcyh0b1sxXSksXG4gICAgICAgIM6UzrsgPSDOuzIgLSDOuzE7XG4gICAgXG4gICAgcmV0dXJuIE1hdGguYWNvcyggTWF0aC5zaW4oz4YxKSpNYXRoLnNpbijPhjIpICsgXG4gICAgICAgIE1hdGguY29zKM+GMSkqTWF0aC5jb3Moz4YyKSAqIE1hdGguY29zKM6UzrspICkgKiBFQVJUSF9SO1xufTtcblxuLyoqXG4gKiBHZXQgaW5pdGlhbCBiZWFyaW5nIChha2EgZm9yd2FyZCBhemltdXRoKSBiZXR3ZWVuIGxvY2F0aW9ucy5cbiAqIFRoaXMgaXMgYW4gYW5nbGUgYmV0d2VlbiBjYXJkaW5hbCBkaXJlY3Rpb24gTm9ydGggYW5kIFxuICogZGlyZWN0aW9uIHRvIHNlY29uZCBsb2NhdGlvbiBhcyBzZWVuIGZyb20gZmlyc3QgbG9jYXRpb24uXG4gKiBcbiAqIEBwYXJhbSBmcm9tIGZpcnN0IGxvY2F0aW9uLCBbbG9uZ2l0dWRlLCBsYXRpdHVkZV0gYXJyYXlcbiAqIEBwYXJhbSB0byBzZWNvbmQgbG9jYXRpb24sIFtsb25naXR1ZGUsIGxhdGl0dWRlXSBhcnJheVxuICogQHJldHVybiBiZWFyaW5nIGluIHJhZGlhbnMsIGNsb2Nrd2lzZSwgLVBJIHRvIFBJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRCZWFyaW5nKGZyb20sIHRvKSB7XG4gICAgLy8gz4Y6IGxhdGl0dWRlLCDOuzogbG9uZ2l0dWRlIFxuICAgIHZhciDOuzEgPSBmcm9tRGVncmVlcyhmcm9tWzBdKSxcbiAgICAgICAgz4YxID0gZnJvbURlZ3JlZXMoZnJvbVsxXSksXG4gICAgICAgIM67MiA9IGZyb21EZWdyZWVzKHRvWzBdKSwgXG4gICAgICAgIM+GMiA9IGZyb21EZWdyZWVzKHRvWzFdKSxcbiAgICAgICAgeSA9IE1hdGguc2luKM67Mi3OuzEpICogTWF0aC5jb3Moz4YyKSxcbiAgICAgICAgeCA9IE1hdGguY29zKM+GMSkqTWF0aC5zaW4oz4YyKSAtXG4gICAgICAgICAgICBNYXRoLnNpbijPhjEpKk1hdGguY29zKM+GMikqTWF0aC5jb3MozrsyLc67MSk7XG5cbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KTtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlIGRlc3RpbmF0aW9uIHBvaW50IGdpdmVuIGluaXRpYWwgbG9jYXRpb24sIGJlYXJpbmcsIFxuICogYW5kIGRpc3RhbmNlLlxuICovIFxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKGZyb20sIGJlYXJpbmcsIGRpc3RhbmNlKSB7XG4gICAgLy8gz4Y6IGxhdGl0dWRlLCDOuzogbG9uZ2l0dWRlIFxuICAgIHZhciDOuzEgPSBmcm9tRGVncmVlcyhmcm9tWzBdKSxcbiAgICAgICAgz4YxID0gZnJvbURlZ3JlZXMoZnJvbVsxXSksXG4gICAgICAgIM+GMiA9IE1hdGguYXNpbihNYXRoLnNpbijPhjEpKk1hdGguY29zKGRpc3RhbmNlL0VBUlRIX1IpICtcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyjPhjEpKk1hdGguc2luKGRpc3RhbmNlL0VBUlRIX1IpKk1hdGguY29zKGJlYXJpbmcpKSxcbiAgICAgICAgzrsyID0gzrsxICsgTWF0aC5hdGFuMihNYXRoLnNpbihiZWFyaW5nKSpNYXRoLnNpbihkaXN0YW5jZS9FQVJUSF9SKSpNYXRoLmNvcyjPhjEpLFxuICAgICAgICAgICAgTWF0aC5jb3MoZGlzdGFuY2UvRUFSVEhfUiktTWF0aC5zaW4oz4YxKSpNYXRoLnNpbijPhjIpKTtcbiAgICBcbiAgICByZXR1cm4gW3RvRGVncmVlcyjOuzIpLCB0b0RlZ3JlZXMoz4YyKV07XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIGxvY2F0aW9ucyBhbG9uZyB0aGUgY2lyY2xlIGFyY1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwb2xhdGVBcmMoY2VudGVyLCByYWRpdXMsIGZyb21BbmdsZSwgdG9BbmdsZSwgbnBvaW50cykge1xuICAgIGlmIChmcm9tQW5nbGUgIT0gMCB8fCB0b0FuZ2xlICE9IDIqTWF0aC5QSSkge1xuICAgICAgICBbZnJvbUFuZ2xlLCB0b0FuZ2xlXSA9IFtmcm9tQW5nbGUsIHRvQW5nbGVdLm1hcCgoYSkgPT4gbm9ybWFsaXplQW5nbGUoYSwgTWF0aC5QSSkpO1xuICAgIH1cbiAgICBsZXQgcG9pbnRzID0gW107XG4gICAgZm9yKGxldCBpPW5wb2ludHM7IGk+PTA7IC0taSkge1xuICAgICAgICBwb2ludHMucHVzaChnZXRMb2NhdGlvbihjZW50ZXIsIGZyb21BbmdsZSArIGkqKHRvQW5nbGUgLSBmcm9tQW5nbGUpL25wb2ludHMsIHJhZGl1cykpO1xuICAgIH1cbiAgICByZXR1cm4gcG9pbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHZhZGQoYSxiLGspIHtcbiAgICBrID0gayA9PT0gdW5kZWZpbmVkID8gMSA6IGs7XG4gICAgcmV0dXJuIFthWzBdK2sqYlswXSxhWzFdK2sqYlsxXV07XG59O1xuXG5mdW5jdGlvbiBqb2luKGFycmF5MSwgYXJyYXkyLCBjYWxsYmFjaykge1xuICAgIHZhciByZXMgPSBbXVxuICAgIGZvcih2YXIgaT0wOyBpPGFycmF5MS5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IodmFyIGo9MDsgajxhcnJheTIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGNhbGxiYWNrKGFycmF5MVtpXSwgYXJyYXkyW2pdKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIGNyb3NzKGFycmF5MSwgYXJyYXkyLCBjYWxsYmFjaykge1xuICAgIHZhciByZXMgPSBbXVxuICAgIGZvcih2YXIgaT0wOyBpPGFycmF5MS5sZW5ndGggJiYgaTxhcnJheTIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzLnB1c2goY2FsbGJhY2soYXJyYXkxW2ldLCBhcnJheTJbal0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbmZ1bmN0aW9uIGxpbmVJbnRlcnNlY3Rpb24oc3RhcnQxLCBlbmQxLCBzdGFydDIsIGVuZDIpIHtcbiAgICB2YXIgbGluZTFTdGFydFggPSBzdGFydDFbMF0sIFxuICAgICAgICBsaW5lMVN0YXJ0WSA9IHN0YXJ0MVsxXSwgXG4gICAgICAgIGxpbmUxRW5kWCA9IGVuZDFbMF0sIFxuICAgICAgICBsaW5lMUVuZFkgPSBlbmQxWzFdLCBcbiAgICAgICAgbGluZTJTdGFydFggPSBzdGFydDJbMF0sIFxuICAgICAgICBsaW5lMlN0YXJ0WSA9IHN0YXJ0MlsxXSwgXG4gICAgICAgIGxpbmUyRW5kWCA9IGVuZDJbMF0sIFxuICAgICAgICBsaW5lMkVuZFkgPSBlbmQyWzFdO1xuXG4gICAgdmFyIGRlbm9taW5hdG9yLCBhLCBiLCBudW1lcmF0b3IxLCBudW1lcmF0b3IyLCByZXN1bHQgPSB7XG4gICAgICAgIHg6IG51bGwsXG4gICAgICAgIHk6IG51bGwsXG4gICAgICAgIG9uTGluZTE6IGZhbHNlLFxuICAgICAgICBvbkxpbmUyOiBmYWxzZVxuICAgIH07XG4gICAgZGVub21pbmF0b3IgPSAoKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSAqIChsaW5lMUVuZFggLSBsaW5lMVN0YXJ0WCkpIC0gKChsaW5lMkVuZFggLSBsaW5lMlN0YXJ0WCkgKiAobGluZTFFbmRZIC0gbGluZTFTdGFydFkpKTtcbiAgICBpZiAoZGVub21pbmF0b3IgPT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYSA9IGxpbmUxU3RhcnRZIC0gbGluZTJTdGFydFk7XG4gICAgYiA9IGxpbmUxU3RhcnRYIC0gbGluZTJTdGFydFg7XG4gICAgbnVtZXJhdG9yMSA9ICgobGluZTJFbmRYIC0gbGluZTJTdGFydFgpICogYSkgLSAoKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSAqIGIpO1xuICAgIG51bWVyYXRvcjIgPSAoKGxpbmUxRW5kWCAtIGxpbmUxU3RhcnRYKSAqIGEpIC0gKChsaW5lMUVuZFkgLSBsaW5lMVN0YXJ0WSkgKiBiKTtcbiAgICBhID0gbnVtZXJhdG9yMSAvIGRlbm9taW5hdG9yO1xuICAgIGIgPSBudW1lcmF0b3IyIC8gZGVub21pbmF0b3I7XG5cbiAgICAvLyBpZiB3ZSBjYXN0IHRoZXNlIGxpbmVzIGluZmluaXRlbHkgaW4gYm90aCBkaXJlY3Rpb25zLCB0aGV5IGludGVyc2VjdCBoZXJlOlxuICAgIHJlc3VsdC54ID0gbGluZTFTdGFydFggKyAoYSAqIChsaW5lMUVuZFggLSBsaW5lMVN0YXJ0WCkpO1xuICAgIHJlc3VsdC55ID0gbGluZTFTdGFydFkgKyAoYSAqIChsaW5lMUVuZFkgLSBsaW5lMVN0YXJ0WSkpO1xuLypcbiAgICAgICAgLy8gaXQgaXMgd29ydGggbm90aW5nIHRoYXQgdGhpcyBzaG91bGQgYmUgdGhlIHNhbWUgYXM6XG4gICAgICAgIHggPSBsaW5lMlN0YXJ0WCArIChiICogKGxpbmUyRW5kWCAtIGxpbmUyU3RhcnRYKSk7XG4gICAgICAgIHkgPSBsaW5lMlN0YXJ0WCArIChiICogKGxpbmUyRW5kWSAtIGxpbmUyU3RhcnRZKSk7XG4gICAgICAgICovXG4gICAgLy8gaWYgbGluZTEgaXMgYSBzZWdtZW50IGFuZCBsaW5lMiBpcyBpbmZpbml0ZSwgdGhleSBpbnRlcnNlY3QgaWY6XG4gICAgaWYgKGEgPiAwICYmIGEgPCAxKSB7XG4gICAgICAgIHJlc3VsdC5vbkxpbmUxID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gaWYgbGluZTIgaXMgYSBzZWdtZW50IGFuZCBsaW5lMSBpcyBpbmZpbml0ZSwgdGhleSBpbnRlcnNlY3QgaWY6XG4gICAgaWYgKGIgPiAwICYmIGIgPCAxKSB7XG4gICAgICAgIHJlc3VsdC5vbkxpbmUyID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gaWYgbGluZTEgYW5kIGxpbmUyIGFyZSBzZWdtZW50cywgdGhleSBpbnRlcnNlY3QgaWYgYm90aCBvZiB0aGUgYWJvdmUgYXJlIHRydWVcbiAgICAvL3JldHVybiByZXN1bHQ7XG4gICAgLy9yZXR1cm4gcmVzdWx0Lm9uTGluZTEgJiYgcmVzdWx0Lm9uTGluZTIgPyBbcmVzdWx0LngsIHJlc3VsdC55XSA6IG51bGw7XG4gICAgcmV0dXJuIHJlc3VsdC5vbkxpbmUxID8gW3Jlc3VsdC54LCByZXN1bHQueV0gOiBudWxsO1xuICAgIC8vcmV0dXJuIFtyZXN1bHQueCwgcmVzdWx0LnldO1xufTtcbiIsImltcG9ydCB7ZnJvbURlZ3JlZXMsIEVBUlRIX1J9IGZyb20gJy4vbWF0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tWm9vbSh6b29tKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIDggKyB6b29tKSAvICgyICogTWF0aC5QSSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdG9ab29tKHNjYWxlKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubG9nKDIgKiBNYXRoLlBJICogc2NhbGUpIC8gTWF0aC5MTjIgLSA4LCAwKVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvUGl4ZWxzKHByb2plY3Rpb24sIGRpc3RhbmNlKSB7XG4gICAgLy8gc3RyaWN0bHkgc3BlYWtpbmcgd2Ugc2hvdWxkIGJlIGxvb2tpbmcgYXQgdGhlIGxhdGl0dWRlXG4gICAgLy8gYXQgdGhlIGV4YWN0IHBvaW50LCBub3QgYXQgcHJvamVjdGlvbiBjZW50ZXIgLSBidXQgYXQgb3VyXG4gICAgLy8gc2NhbGVzIHRoZSBkaWZmZXJlbmNlIGlzIG5lZ2xpZ2libGVcbiAgICB2YXIgbGF0ID0gcHJvamVjdGlvbi5jZW50ZXIoKVsxXSxcbiAgICAgICAgc2NhbGUgPSBwcm9qZWN0aW9uLnNjYWxlKCk7XG4gICAgcmV0dXJuIGRpc3RhbmNlICogc2NhbGUgLyAoRUFSVEhfUiAqIE1hdGguY29zKGZyb21EZWdyZWVzKGxhdCkpKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5KHN0cikge1xuXHRyZXR1cm4gc3RyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuXHQgICAgLnJlcGxhY2UoL1xccysvZywgJy0nKSAgICAgICAgICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCAtXG5cdCAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuXHQgICAgLnJlcGxhY2UoL1xcLVxcLSsvZywgJy0nKSAgICAgICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgLSB3aXRoIHNpbmdsZSAtXG5cdCAgICAucmVwbGFjZSgvXi0rLywgJycpICAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIHN0YXJ0IG9mIHRleHRcblx0ICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHR2YXIgdGltZW91dDtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHR9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVTdHIodGhlbikge1xuXHRyZXR1cm4gdGhlbi5nZXRNb250aCgpICsgJy8nICsgdGhlbi5nZXREYXkoKSArICcvJyArIHRoZW4uZ2V0RnVsbFllYXIoKSArICcgJyArXG5cdFx0KHRoZW4uZ2V0SG91cnMoKSAlIDEyKSArICc6JyArIHRoZW4uZ2V0TWludXRlcygpICsgKHRoZW4uZ2V0SG91cnMoKSA8IDEyID8gJ2FtJyA6ICdwbScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGF5c0Fnb1N0cih0aGVuKSB7XG4gICAgaWYgKHRoZW49PT1udWxsIHx8IHRoZW49PT11bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoZW47XG4gICAgfSBcblxuICAgIHZhciBkaWZmID0gTWF0aC5yb3VuZCgoRGF0ZS5ub3coKSAtIHRoZW4uZ2V0VGltZSgpKS8xMDAwKTtcbiAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgcmV0dXJuICdvbiAnICsgZGF0ZVN0cih0aGVuKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHNlY29uZF9kaWZmID0gZGlmZiAlIDg2NDAwO1xuICAgIHZhciBkYXlfZGlmZiA9IE1hdGgucm91bmQoZGlmZi84NjQwMCk7XG5cbiAgICBpZiAoZGF5X2RpZmYgPT0gMCkge1xuICAgICAgICBpZiAoc2Vjb25kX2RpZmYgPCAxMCkgcmV0dXJuIFwibm93XCI7XG4gICAgICAgIC8vaWYgKHNlY29uZF9kaWZmIDwgNjApIHJldHVybiBzZWNvbmRfZGlmZiArIFwiIHNlY29uZHMgYWdvXCI7XG4gICAgICAgIGlmIChzZWNvbmRfZGlmZiA8IDEyMCkgcmV0dXJuICBcImEgbWludXRlIGFnb1wiO1xuICAgICAgICBpZiAoc2Vjb25kX2RpZmYgPCAzNjAwKSByZXR1cm4gIE1hdGgucm91bmQoc2Vjb25kX2RpZmYvNjApICsgXCIgbWludXRlcyBhZ29cIjtcbiAgICAgICAgaWYgKHNlY29uZF9kaWZmIDwgNzIwMCkgcmV0dXJuIFwiYW4gaG91ciBhZ29cIjtcbiAgICAgICAgaWYgKHNlY29uZF9kaWZmIDwgODY0MDApIHJldHVybiBNYXRoLnJvdW5kKHNlY29uZF9kaWZmLzM2MDApICsgXCIgaG91cnMgYWdvXCI7XG4gICAgfVxuICAgIGlmIChkYXlfZGlmZiA9PSAxKSByZXR1cm4gXCJ5ZXN0ZXJkYXlcIjtcbiAgICBpZiAoZGF5X2RpZmYgPCA3KSByZXR1cm4gZGF5X2RpZmYgKyBcIiBkYXlzIGFnb1wiO1xuXHRyZXR1cm4gJ29uICcgKyBkYXRlU3RyKHRoZW4pOyAgICBcbiAgICAvLyBpZiAoZGF5X2RpZmYgPCAxNCkgcmV0dXJuIFwibGFzdCB3ZWVrXCI7XG4gICAgLy8gaWYgKGRheV9kaWZmIDwgMzEpIHJldHVybiBNYXRoLnJvdW5kKGRheV9kaWZmLzcpICsgXCIgd2Vla3MgYWdvXCI7XG4gICAgLy8gaWYgKGRheV9kaWZmIDwgNjApIHJldHVybiBcImxhc3QgbW9udGhcIjtcbiAgICAvLyBpZiAoZGF5X2RpZmYgPCAzNjUpIHJldHVybiBNYXRoLnJvdW5kKGRheV9kaWZmLzMwKSArIFwiIG1vbnRocyBhZ29cIjtcbiAgICAvLyBpZiAoZGF5X2RpZmYgPCA3MzApIHJldHVybiBcImEgeWVhciBhZ29cIjtcbiAgICAvLyByZXR1cm4gTWF0aC5yb3VuZChkYXlfZGlmZi8zNjUpICsgXCIgeWVhcnMgYWdvXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0ZW5lcnMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgdGhpcy5hZGQgPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVycy5oYXMoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNldChldmVudCwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGlzdGVuZXJzLmdldChldmVudCkucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yZW1vdmUgPSAoZXZlbnQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc2V0KGV2ZW50LCBsaXN0ZW5lcnMuZ2V0KGV2ZW50KS5maWx0ZXIoKGNiKSA9PiBjYiAhPSBjYWxsYmFjaykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubm90aWZ5ID0gKGV2ZW50LCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhcyhldmVudCkpIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNiIG9mIGxpc3RlbmVycy5nZXQoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iXX0=
