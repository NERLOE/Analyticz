const analyticzDomain = "https://analyticz.marcusnerloe.dk";

const getRemoteScriptName = (domain, selfHosted = false) => {
  return selfHosted || domain === analyticzDomain ? "analyticz" : "index";
};

const getScriptPath = (options) => {
  const basePath = `/js/${[options.scriptName ?? "script"].join(".")}.js`;

  if (options.subDirectory) {
    return `/${options.subDirectory}${basePath}`;
  }

  return basePath;
};

const getDomain = (options) => options.customDomain ?? analyticzDomain ?? "";

const getApiEndpoint = (options) =>
  `/${options.subDirectory ?? "proxy"}/api/event${
    options.trailingSlash ? "/" : ""
  }`;

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

        if (process.env.ANALYTICZ_DEBUG) {
          console.log("analyticzRewrites = ", analyticzRewrites);
        }

        const rewrites = await nextConfig.rewrites?.();
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
