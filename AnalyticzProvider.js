"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAnalyticzProxy = void 0;
var getRemoteScriptName = function (domain, selfHosted) {
  return "analyticz";
};
var getScriptPath = function (options) {
  var _a;
  var basePath = "/js/".concat(
    [(_a = options.scriptName) !== null && _a !== void 0 ? _a : "script"].join(
      "."
    ),
    ".js"
  );
  if (options.subDirectory) {
    return "/".concat(options.subDirectory).concat(basePath);
  }
  return basePath;
};
var analyticzDomain =
  process.env.SITE_URL || "https://analyticz.marcusnerloe.dk";
var getDomain = function (options) {
  var _a, _b;
  return (_b =
    (_a = options.customDomain) !== null && _a !== void 0
      ? _a
      : analyticzDomain) !== null && _b !== void 0
    ? _b
    : "";
};
var getApiEndpoint = function (options) {
  var _a;
  return "/"
    .concat(
      (_a = options.subDirectory) !== null && _a !== void 0 ? _a : "proxy",
      "/api/event"
    )
    .concat(options.trailingSlash ? "/" : "");
};
var withAnalyticzProxy = function (options) {
  if (options === void 0) {
    options = {};
  }
  return function (nextConfig) {
    var nextAnalyticzPublicProxyOptions = __assign(__assign({}, options), {
      trailingSlash: !!nextConfig.trailingSlash,
    });
    return __assign(__assign({}, nextConfig), {
      publicRuntimeConfig: __assign(
        __assign({}, nextConfig.publicRuntimeConfig),
        { nextAnalyticzPublicProxyOptions: nextAnalyticzPublicProxyOptions }
      ),
      rewrites: function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
          var domain, getRemoteScript, analyticzRewrites, rewrites;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                domain = analyticzDomain;
                getRemoteScript = function () {
                  return (
                    domain +
                    getScriptPath({
                      scriptName: getRemoteScriptName(
                        domain,
                        domain !== analyticzDomain
                      ),
                    })
                  );
                };
                console.log("source", getScriptPath(options));
                console.log("destination", getRemoteScript());
                analyticzRewrites = [
                  {
                    source: getScriptPath(options),
                    destination: getRemoteScript(),
                  },
                  {
                    source: getApiEndpoint(nextAnalyticzPublicProxyOptions),
                    destination: "".concat(domain, "/api/event"),
                  },
                ];
                return [
                  4 /*yield*/,
                  (_a = nextConfig.rewrites) === null || _a === void 0
                    ? void 0
                    : _a.call(nextConfig),
                ];
              case 1:
                rewrites = _b.sent();
                if (!rewrites) {
                  console.log("no rewrites", analyticzRewrites);
                  return [2 /*return*/, analyticzRewrites];
                } else if (Array.isArray(rewrites)) {
                  console.log(
                    "returning rewrites",
                    rewrites.concat(analyticzRewrites)
                  );
                  return [2 /*return*/, rewrites.concat(analyticzRewrites)];
                } else {
                  console.log(
                    "else afterFiles",
                    rewrites.afterFiles.concat(analyticzRewrites)
                  );
                  rewrites.afterFiles =
                    rewrites.afterFiles.concat(analyticzRewrites);
                }
                return [2 /*return*/];
            }
          });
        });
      },
    });
  };
};
exports.withAnalyticzProxy = withAnalyticzProxy;
