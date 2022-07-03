"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.withAnalyticzProxy = void 0;

const getRemoteScriptName = (domain, selfHosted) => "analyticz";

const getScriptPath = (options) => {
  var _options$scriptName;

  const basePath = `/js/${[
    (_options$scriptName = options.scriptName) !== null &&
    _options$scriptName !== void 0
      ? _options$scriptName
      : "script",
  ].join(".")}.js`;

  if (options.subDirectory) {
    return `/${options.subDirectory}${basePath}`;
  }

  return basePath;
};

const analyticzDomain =
  process.env.SITE_URL || "https://analyticz.marcusnerloe.dk";

const getDomain = (options) => {
  var _ref, _options$customDomain;

  return (_ref =
    (_options$customDomain = options.customDomain) !== null &&
    _options$customDomain !== void 0
      ? _options$customDomain
      : analyticzDomain) !== null && _ref !== void 0
    ? _ref
    : "";
};

const getApiEndpoint = (options) => {
  var _options$subDirectory;

  return `/${
    (_options$subDirectory = options.subDirectory) !== null &&
    _options$subDirectory !== void 0
      ? _options$subDirectory
      : "proxy"
  }/api/event${options.trailingSlash ? "/" : ""}`;
};

const withAnalyticzProxy = (options = {}) => {
  return (nextConfig) => {
    const nextAnalyticzPublicProxyOptions = {
      ...options,
      trailingSlash: !!nextConfig.trailingSlash,
    };
    return {
      ...nextConfig,
      publicRuntimeConfig: {
        ...nextConfig.publicRuntimeConfig,
        nextAnalyticzPublicProxyOptions,
      },
      rewrites: async () => {
        var _nextConfig$rewrites;

        const domain = getDomain(options);

        const getRemoteScript = () =>
          domain +
          getScriptPath({
            scriptName: getRemoteScriptName(domain, domain !== analyticzDomain),
          });

        const analyticzRewrites = [
          {
            source: getScriptPath(options),
            destination: getRemoteScript(),
          },
          {
            source: getApiEndpoint(nextAnalyticzPublicProxyOptions),
            destination: `${domain}/api/event`,
          },
        ];
        const rewrites = await ((_nextConfig$rewrites = nextConfig.rewrites) ===
          null || _nextConfig$rewrites === void 0
          ? void 0
          : _nextConfig$rewrites.call(nextConfig));

        if (!rewrites) {
          return analyticzRewrites;
        } else if (Array.isArray(rewrites)) {
          return rewrites.concat(analyticzRewrites);
        } else {
          rewrites.afterFiles = rewrites.afterFiles.concat(analyticzRewrites);
          return rewrites;
        }
      },
    };
  };
};

exports.withAnalyticzProxy = withAnalyticzProxy;
