import { NextConfig } from "next";
import Script from "next/script";

const getRemoteScriptName = (domain: string, selfHosted?: boolean) =>
  "analyticz";

const getScriptPath = (options: { scriptName: string }) => {
  const basePath = `/js/${[options.scriptName ?? "script"].join(".")}.js`;

  return basePath;
};

export const withAnalyticzProxy = () => {
  return (nextConfig: NextConfig) => {
    return {
      ...nextConfig,
    };
  };
};

interface ProviderProps {
  domain: string;
  children: React.ReactNode;
}

const AnalyticzProvider: React.FC<ProviderProps> = (props) => {
  const domain = process.env.SITE_URL;

  return (
    <>
      <Script
        async
        defer
        data-domain={props.domain}
        src={
          domain +
          getScriptPath({ scriptName: getRemoteScriptName(props.domain) })
        }
      />
      {props.children}
    </>
  );
};

export default AnalyticzProvider;
