const stylelint = require("stylelint");

//
// load carbon theme tokens
//
const carbonThemes = require("@carbon/themes");
// console.dir(carbonThemes.tokens.colors);
const themesTokens = carbonThemes.tokens.colors.map((token) =>
  carbonThemes.formatTokenName(token)
);
const themeFunctions = ["get-light-value"];

const ruleName = "plugin/carbon-use";

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: function expected(property) {
    return 'Expected carbon token for "' + property + '".';
  },
});

// Store the variables in object
const variables = {};

/**
 * Returns boolean wether a string should be parsed as regex or not
 *
 * @param  {string} string
 * @return {bool}
 */
function isStringRegex(string) {
  return string[0] === "/" && string[string.length - 1] === "/";
}

/**
 * Returns RegExp object for string like "/reg/"
 *
 * @param  {string} string
 * @return {RegExp}
 */
function toRegex(string) {
  return new RegExp(string.slice(1, -1));
}

/**
 * Compares the declaration with regex pattern
 * to verify the usage of variable
 *
 * @param  {string} val
 * @return {bool}
 */
function checkValue(val, exceptions = []) {
  // Regex for checking - capture: 3 = function, 4 = earlier variables, 6 = variable
  // $any-variable;
  // any-function($any-variable
  const regEx = /^((([a-zA-Z0-9-]*)\(*)|([a-zA-Z0-9- ]*))(\$([A-Z0-9a-z-]+))/g;

  for (const exception of exceptions) {
    if (isStringRegex(exception)) {
      if (toRegex(exception).test(val)) return true;
    } else {
      if (exception === val) return true;
    }
  }

  const matches = regEx.exec(val);
  const matchVariable = 6;
  const matchFunction = 3;
  if (matches && matches[matchVariable]) {
    // if function check it's in themeFunctions
    // console.dir(matches);
    const passFunctionCheck =
      !matches[matchFunction] ||
      matches[matchFunction].length === 0 ||
      themeFunctions.includes(matches[matchFunction]);
    // check token exists in theme
    return passFunctionCheck && themesTokens.includes(matches[matchVariable]);
  }
  return false;
}

/**
 * Checks the value and if its present in variables object
 * returns the respective variable
 *
 * @param  {string}
 * @return {string|bool}
 */
function checkPresentVariable(val) {
  return variables[val] ? variables[val] : false;
}

/**
 * Checks the defined property in (css|scss|less) with the
 * test string or regex defined in stylelint config
 *
 * @param  {string} value
 * @param  {string|regex} comparison
 * @return {bool}
 */
function testAgaintString(prop, value, comparison) {
  // if prop is a variable do not run check
  // and add it in the variables object for later check
  // and return, since it would be a variable declaration
  // not a style property declaration
  if (checkValue(prop)) {
    variables[value] = prop;
    return;
  }

  if (isStringRegex(comparison)) {
    const valueMatches = new RegExp(comparison.slice(1, -1)).test(prop);
    return valueMatches;
  }

  return prop == comparison;
}

/**
 * Checks the test expression with css declaration
 *
 * @param  {string} prop
 * @param  {string|array} comparison
 * @return {bool}
 */
function checkProp(prop, value, targets) {
  for (const target of targets) {
    if (testAgaintString(prop, value, target)) return true;
  }
  return false;
}

/**
 * Checks the test expression with css declaration
 *
 * @param  {string|array} options
 * @return {object}
 */
function parseOptions(options) {
  const parsed = { targets: [], ignoreValues: ["/color\\(/"] };

  if (Array.isArray(options)) {
    const last = options[options.length - 1];
    if (typeof last === "object") {
      parsed.targets = options.slice(0, options.length - 1);
      if (last.ignoreValues) {
        parsed.ignoreValues = parsed.ignoreValues.concat(last.ignoreValues);
      }
    } else {
      parsed.targets = options;
    }
  } else {
    parsed.targets = [options];
  }
  return parsed;
}

module.exports = stylelint.createPlugin(ruleName, function (config) {
  options = parseOptions(config || []);

  return function (root, result) {
    const validOptions = stylelint.utils.validateOptions({
      ruleName: ruleName,
      result: result,
      actual: options,
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (statement) {
      if (
        checkProp(statement.prop, statement.value, options.targets) &&
        checkPresentVariable(statement.value) &&
        !checkValue(statement.value, options.ignoreValues)
      ) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: messages.expectedPresent(
            statement.prop,
            checkPresentVariable(statement.value)
          ),
        });
      } else if (
        checkProp(statement.prop, statement.value, options.targets) &&
        !checkValue(statement.value, options.ignoreValues)
      ) {
        stylelint.utils.report({
          ruleName: ruleName,
          result: result,
          node: statement,
          message: messages.expected(statement.prop),
        });
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
