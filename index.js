const defaults = {
  rootValue: 750,
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ["font", "font-size", "line-height", "letter-spacing"],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  exclude: null
};


// function toFixed(number, precision) {
//   const multiplier = Math.pow(10, precision + 1),
//     wholeNumber = Math.floor(number * multiplier);
//   return (Math.round(wholeNumber / 10) * 10) / multiplier;
// }

function createPxReplace(rootValue, unitPrecision, minPixelValue) {
  return (m, $1) => {
    if (!$1) return m;
    const pixels = parseFloat($1);
    if (pixels < minPixelValue) return m;
    const fixedVal = rootValue / 375 * pixels
    return fixedVal === 0 ? "0" : fixedVal + "rpx";
  };
}

const _type = s =>
  Object.prototype.toString
    .call(s)
    .slice(8, -1)
    .toLowerCase();

const types = [
  "String",
  "Array",
  "Undefined",
  "Boolean",
  "Number",
  "Function",
  "Symbol",
  "Object"
];

const type = types.reduce((acc, str) => {
 
  acc["is" + str] = val => _type(val) === str.toLowerCase();
  return acc;
}, {});

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (options = {}) => {
  // Work with options here

  const opts = Object.assign({}, defaults, options);
  const exclude = opts.exclude;
  let isExcludeFile = false;
  let pxReplace;
  return {
    postcssPlugin: 'postcss-pxtorpx',
    /*
    Root (root, postcss) {
      // Transform CSS AST here
    }
    */
    Once(css) {
      const filePath = css.source.input.file;
      if (
        exclude &&
        ((type.isFunction(exclude) && exclude(filePath)) ||
          (type.isString(exclude) && filePath.indexOf(exclude) !== -1) ||
          filePath.match(exclude) !== null)
      ) {
        isExcludeFile = true;
      } else {
        isExcludeFile = false;
      }

      const rootValue =
        typeof opts.rootValue === "function"
          ? opts.rootValue(css.source.input)
          : opts.rootValue;

      pxReplace = createPxReplace(
        rootValue,
        opts.unitPrecision,
        opts.minPixelValue
      );
    },
    Declaration (decl) {
      // The faster way to find Declaration node
      if (decl.value.indexOf('px') === -1)
        return

      const value = decl.value.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|var\([^)]+\)|(\d*\.?\d+)px/g, pxReplace);
      if (opts.replace) {
        decl.value = value;
      } else {
        decl.cloneAfter({ value: value });
      }
    }  
  }
}

module.exports.postcss = true
