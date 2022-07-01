import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react";
import { trpc } from "@utils/trpc";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { BuiltInProviderType } from "next-auth/providers";
import Link from "next/link";

const providerIcons: { [key in BuiltInProviderType]?: IconProp } = {
  github: faGithub,
  google: faGoogle,
  twitter: faTwitter,
};

const SignIn = () => {
  const { data: providers } = trpc.useQuery(["auth.getProviders"]);

  return (
    <div className="min-h-screen bg-landing">
      <div className="flex flex-col justify-center items-center py-12 space-y-8 min-h-screen sm:px-6 lg:px-8 lg:space-y-12">
        <div
          aria-label="Sign in form"
          className="space-y-4 w-full sm:mx-auto sm:max-w-md"
        >
          <div className="py-8 px-4 bg-gray-800 border-t border-b border-gray-700 shadow sm:px-10 sm:rounded-lg sm:border-r sm:border-l">
            <div className="flex flex-col justify-center animate-fade-in">
              <button
                onClick={() =>
                  signIn("github", {
                    callbackUrl: `${window.location.origin}/sites`,
                  })
                }
                className="inline-flex items-center border font-medium relative text-base px-6 py-3 rounded-md text-white border-pink-700 bg-pink-600 hover:bg-pink-700 hover:border-pink-800 shadow-sm justify-center sm:py-10 sm:px-y12 sm:text-2xl sm:font-semibold sm:rounded-lg"
              >
                <span>
                  <FontAwesomeIcon
                    icon={faGithub}
                    size={"lg"}
                    className="mr-2 sm:mr-4"
                  />
                  Sign in with Github
                </span>
              </button>
              <div className="mt-6">
                <div className="relative">
                  <div className="flex absolute inset-0 items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="flex relative justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-gray-800">
                      or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {providers &&
                    Object.values(providers).map((provider) => {
                      if (provider.id == "github") return null; // Disabled this when adding username, and password credentials
                      const icon =
                        providerIcons[provider.id as BuiltInProviderType];

                      return (
                        <button
                          className={`inline-flex items-center border font-medium relative text-base ${
                            provider.id == "github" && "col-span-2"
                          } px-6 py-3 rounded-md text-white border-gray-700 bg-gray-800 hover:bg-gray-750 hover:text-gray-100 shadow-sm justify-center`}
                          key={provider.name}
                          onClick={() =>
                            signIn(provider.id, {
                              callbackUrl: `${window.location.origin}/sites`,
                            })
                          }
                        >
                          <span className="sr-only">Sign in with</span>
                          {icon && (
                            <FontAwesomeIcon icon={icon} className="mr-2" />
                          )}
                          <span>{provider.name}</span>
                        </button>
                      );
                    })}
                </div>
                <p className="mt-6 text-xs text-gray-500 prose prose-sm">
                  By signing in, you agree to our{" "}
                  <Link href="/">Terms of Service</Link> and{" "}
                  <Link href="/">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
