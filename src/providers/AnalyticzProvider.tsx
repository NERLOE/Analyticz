import { NextConfig } from "next";
import getConfig from "next/config";
import Script from "next/script";

const analyticzDomain = "https://analyticz.marcusnerloe.dk";

const getRemoteScriptName = (domain: string, selfHosted?: boolean) => {
  return selfHosted || domain === analyticzDomain ? "analyticz" : "index";
};

const getScriptPath = (options: NextAnalyticzProxyOptions) => {
  const basePath = `/js/${[options.scriptName ?? "script"].join(".")}.js`;

  if (options.subDirectory) {
    return `/${options.subDirectory}${basePath}`;
  }

  return basePath;
};

const getDomain = (options: { customDomain?: string }) =>
  options.customDomain ?? analyticzDomain ?? "";

const getApiEndpoint = (options: NextAnalyticzPublicProxyOptions) =>
  `/${options.subDirectory ?? "proxy"}/api/event${
    options.trailingSlash ? "/" : ""
  }`;

export const withAnalyticzProxy = (options: NextAnalyticzProxyOptions = {}) => {
  return (nextConfig: NextConfig): NextConfig => {
    const nextAnalyticzPublicProxyOptions: NextAnalyticzPublicProxyOptions = {
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

interface NextAnalyticzProxyOptions {
  subDirectory?: string;
  scriptName?: string;
  customDomain?: string;
}

interface NextAnalyticzPublicProxyOptions extends NextAnalyticzProxyOptions {
  trailingSlash: boolean;
}

interface ProviderProps {
  domain: string;
  customDomain?: string;
  children: React.ReactNode;
  enabled?: boolean;
}

const AnalyticzProvider: React.FC<ProviderProps> = (props) => {
  const { enabled = process.env.NODE_ENV === "production" } = props;
  const domain = getDomain(props);
  const proxyOptions: NextAnalyticzPublicProxyOptions =
    getConfig()?.publicRuntimeConfig?.nextAnalyticzPublicProxyOptions;

  return (
    <>
      {enabled && (
        <Script
          async
          defer
          data-api={proxyOptions ? getApiEndpoint(proxyOptions) : undefined}
          data-domain={props.domain}
          src={
            (proxyOptions ? "" : domain) +
            getScriptPath({
              ...proxyOptions,
              scriptName: proxyOptions
                ? proxyOptions.scriptName
                : getRemoteScriptName(props.domain),
            })
          }
        />
      )}

      {props.children}
    </>
  );
};

export default AnalyticzProvider;
