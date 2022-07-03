const getRemoteScriptName = (domain, selfHosted) => "analyticz";

const getScriptPath = (options) => {
  const basePath = `/js/${[options.scriptName ?? "script"].join(".")}.js`;

  if (options.subDirectory) {
    return `/${options.subDirectory}${basePath}`;
  }

  return basePath;
};

const analyticzDomain = process.env.SITE_URL;

const getDomain = (options) => options.customDomain ?? analyticzDomain ?? "";

const getApiEndpoint = (options) =>
  `/${options.subDirectory ?? "proxy"}/api/event${
    options.trailingSlash ? "/" : ""
  }`;

export const withAnalyticzProxy = (options = {}) => {
  return (nextConfig) => {
    const nextPlausiblePublicProxyOptions = {
      ...options,
      trailingSlash: !!nextConfig.trailingSlash,
    };

    return {
      ...nextConfig,
      publicRuntimeConfig: {
        ...nextConfig.publicRuntimeConfig,
        nextPlausiblePublicProxyOptions,
      },
      async rewrites() {
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
            source: getApiEndpoint(nextPlausiblePublicProxyOptions),
            destination: `${domain}/api/event`,
          },
        ];

        const rewrites = await nextConfig.rewrites?.();
        if (!rewrites) {
          return analyticzRewrites;
        } else if (Array.isArray(rewrites)) {
          return rewrites.concat(analyticzRewrites);
        } else {
          rewrites.afterFiles = rewrites.afterFiles.concat(analyticzRewrites);
        }
      },
    };
  };
};
