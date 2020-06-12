'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('gatsby-source-filesystem'),
    createRemoteFileNode = _require.createRemoteFileNode;

//field contains info that has to go into File
//item is the overall item in which key is saved
//key is the key it saved in the object

var createFileName = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(store, cache, createNode, touchNode, auth, field, item, key, isArray) {
    var fileNodeID, mediaDataCacheKey, cacheMediaData, source_url, fileNode;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fileNodeID = void 0;
            // using field on the cache key for multiple image field

            mediaDataCacheKey = 'strapi-media-' + item.id + '-' + key;
            _context.next = 4;
            return cache.get(mediaDataCacheKey);

          case 4:
            cacheMediaData = _context.sent;


            // If we have cached media data and it wasn't modified, reuse
            // previously created file node to not try to redownload
            if (cacheMediaData && field.updatedAt === cacheMediaData.updatedAt) {
              fileNodeID = cacheMediaData.fileNodeID;
              touchNode({ nodeId: cacheMediaData.fileNodeID });
            }

            // If we don't have cached data, download the file

            if (fileNodeID) {
              _context.next = 21;
              break;
            }

            _context.prev = 7;

            // full media url
            source_url = '' + (field.url.startsWith('http') ? '' : apiURL) + field.url;
            _context.next = 11;
            return createRemoteFileNode({
              url: source_url,
              store: store,
              cache: cache,
              createNode: createNode,
              auth: auth
            });

          case 11:
            fileNode = _context.sent;

            if (!fileNode) {
              _context.next = 16;
              break;
            }

            fileNodeID = fileNode.id;

            _context.next = 16;
            return cache.set(mediaDataCacheKey, {
              fileNodeID: fileNodeID,
              modified: field.updatedAt
            });

          case 16:
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](7);

            console.log(_context.t0);

          case 21:
            if (fileNodeID) {
              if (isArray) {
                if (!item.hasOwnProperty(key + '_nodes')) {
                  item[key + '__NODE'] = [];
                }
                item[key + '__NODE'].push(fileNodeID);
              } else {
                item[key + '___NODE'] = fileNodeID;
              }
            }

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[7, 18]]);
  }));

  return function createFileName(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();

var extractFields = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(apiURL, store, cache, createNode, touchNode, auth, item) {
    var _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return _regenerator2.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(item && item.hasOwnProperty('mime'))) {
              _context4.next = 5;
              break;
            }

            _context4.next = 3;
            return createFileName(store, cache, createNode, touchNode, auth, item, item, 'localfile');

          case 3:
            _context4.next = 31;
            break;

          case 5:
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop(key) {
              var field;
              return _regenerator2.default.wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      field = item[key];

                      if (!(Array.isArray(field) && key != 'additionalImages')) {
                        _context3.next = 6;
                        break;
                      }

                      _context3.next = 4;
                      return _promise2.default.all(field.map(function () {
                        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(f) {
                          return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  return _context2.abrupt('return', extractFields(apiURL, store, cache, createNode, touchNode, auth, f, key));

                                case 1:
                                case 'end':
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, undefined);
                        }));

                        return function (_x17) {
                          return _ref3.apply(this, arguments);
                        };
                      }()));

                    case 4:
                      _context3.next = 9;
                      break;

                    case 6:
                      if (!(field !== null && field !== undefined && field.hasOwnProperty('mime'))) {
                        _context3.next = 9;
                        break;
                      }

                      _context3.next = 9;
                      return createFileName(store, cache, createNode, touchNode, auth, field, item, key);

                    case 9:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _loop, undefined);
            });
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 9;
            _iterator = (0, _getIterator3.default)((0, _keys2.default)(item));

          case 11:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context4.next = 17;
              break;
            }

            key = _step.value;
            return _context4.delegateYield(_loop(key), 't0', 14);

          case 14:
            _iteratorNormalCompletion = true;
            _context4.next = 11;
            break;

          case 17:
            _context4.next = 23;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t1 = _context4['catch'](9);
            _didIteratorError = true;
            _iteratorError = _context4.t1;

          case 23:
            _context4.prev = 23;
            _context4.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 26:
            _context4.prev = 26;

            if (!_didIteratorError) {
              _context4.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context4.finish(26);

          case 30:
            return _context4.finish(23);

          case 31:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, undefined, [[9, 19, 23, 31], [24,, 26, 30]]);
  }));

  return function extractFields(_x10, _x11, _x12, _x13, _x14, _x15, _x16) {
    return _ref2.apply(this, arguments);
  };
}();

// Downloads media from image type fields
exports.downloadMediaFiles = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref5) {
    var entities = _ref5.entities,
        apiURL = _ref5.apiURL,
        store = _ref5.store,
        cache = _ref5.cache,
        createNode = _ref5.createNode,
        touchNode = _ref5.touchNode,
        auth = _ref5.jwtToken;
    return _regenerator2.default.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt('return', _promise2.default.all(entities.map(function () {
              var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(entity) {
                var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

                return _regenerator2.default.wrap(function _callee4$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context5.prev = 3;
                        _iterator2 = (0, _getIterator3.default)(entity);

                      case 5:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                          _context5.next = 12;
                          break;
                        }

                        item = _step2.value;
                        _context5.next = 9;
                        return extractFields(apiURL, store, cache, createNode, touchNode, auth, item);

                      case 9:
                        _iteratorNormalCompletion2 = true;
                        _context5.next = 5;
                        break;

                      case 12:
                        _context5.next = 18;
                        break;

                      case 14:
                        _context5.prev = 14;
                        _context5.t0 = _context5['catch'](3);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context5.t0;

                      case 18:
                        _context5.prev = 18;
                        _context5.prev = 19;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                        }

                      case 21:
                        _context5.prev = 21;

                        if (!_didIteratorError2) {
                          _context5.next = 24;
                          break;
                        }

                        throw _iteratorError2;

                      case 24:
                        return _context5.finish(21);

                      case 25:
                        return _context5.finish(18);

                      case 26:
                        return _context5.abrupt('return', entity);

                      case 27:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee4, undefined, [[3, 14, 18, 26], [19,, 21, 25]]);
              }));

              return function (_x19) {
                return _ref6.apply(this, arguments);
              };
            }())));

          case 1:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x18) {
    return _ref4.apply(this, arguments);
  };
}();