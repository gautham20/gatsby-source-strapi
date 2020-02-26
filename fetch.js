'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var apiURL = _ref2.apiURL,
        contentType = _ref2.contentType,
        jwtToken = _ref2.jwtToken,
        queryLimit = _ref2.queryLimit,
        maxPerPage = _ref2.maxPerPage,
        reporter = _ref2.reporter;
    var apiBase, apiEndpoints, fetchRequestConfig, documents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Define API endpoint.
            apiBase = apiURL + '/' + (0, _pluralize2.default)(contentType);
            //const apiEndpoint = `${apiBase}?_limit=${queryLimit}`

            apiEndpoints = Array(parseInt(queryLimit / maxPerPage)).fill().map(function (_, i) {
              return apiBase + '?_limit=' + maxPerPage + '&_start=' + maxPerPage * i;
            });


            console.log(apiEndpoints);

            reporter.info('Starting to fetch data from Strapi - ' + apiBase);

            // Set authorization token
            fetchRequestConfig = {};

            if (jwtToken !== null) {
              fetchRequestConfig.headers = {
                Authorization: 'Bearer ' + jwtToken
              };
            }

            // Make API request.
            documents = [];

            // apiEndpoints.forEach((api) => {
            //   const paginatedDocs = await axios(api, fetchRequestConfig)
            //   const paginatedCleanedDocs = paginatedDocs.data.map(item => clean(item))
            //   documents.concat(paginatedCleanedDocs)
            // })

            _context.next = 9;
            return _axios2.default.all(apiEndpoints.map(function (url) {
              return _axios2.default.get(url);
            })).then(_axios2.default.spread(function () {
              for (var _len = arguments.length, responses = Array(_len), _key = 0; _key < _len; _key++) {
                responses[_key] = arguments[_key];
              }

              responses.forEach(function (resp) {
                var cleanedDocs = resp.data.map(function (item) {
                  return clean(item);
                });
                documents = documents.concat(cleanedDocs);
                console.log(documents.length);
              });
            }));

          case 9:
            return _context.abrupt('return', documents);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Remove fields starting with `_` symbol.
 *
 * @param {object} item - Entry needing clean
 * @returns {object} output - Object cleaned
 */
var clean = function clean(item) {
  (0, _lodash.forEach)(item, function (value, key) {
    if ((0, _lodash.startsWith)(key, '__')) {
      delete item[key];
    } else if ((0, _lodash.startsWith)(key, '_')) {
      delete item[key];
      item[key.slice(1)] = value;
    } else if ((0, _lodash.isObject)(value)) {
      item[key] = clean(value);
    }
  });

  return item;
};