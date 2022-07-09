import Card from "@components/Card/Card";
import { Website } from "@prisma/client";
import { prisma } from "@server/db/client";
import { trpc } from "@utils/trpc";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faDisplay,
  faLaptop,
  faMobile,
  faMobileScreenButton,
  faTablet,
  faTabletScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import StatsCard from "@components/StatsCard/StatsCard";
import { CountriesType, getCountryFlag } from "@constants/countries";
import { DeviceName, getDevice } from "@utils/request-information";
import Link from "next/link";

export const getDeviceIcon = (name: DeviceName) => {
  switch (name) {
    case "Mobile":
      return <FontAwesomeIcon icon={faMobileScreenButton} />;
    case "Tablet":
      return <FontAwesomeIcon icon={faTabletScreenButton} />;
    case "Laptop":
      return <FontAwesomeIcon icon={faLaptop} />;
    default:
      return <FontAwesomeIcon icon={faDisplay} />;
  }
};
interface Props {
  website: Website;
}

const AnalyticsPage: NextPage<Props> = () => {
  const router = useRouter();
  const domain = router.query.domain as string;

  const { data: website } = trpc.useQuery([
    "sites.getWebsite",
    {
      domain: domain,
    },
  ]);

  const { data: visits } = trpc.useQuery([
    "sites.getVisits",
    { domain: domain },
  ]);

  const { data: sources } = trpc.useQuery([
    "sites.getSources",
    { domain: domain },
  ]);

  const { data: countries } = trpc.useQuery([
    "sites.getCountries",
    { domain: domain },
  ]);

  const { data: devices } = trpc.useQuery([
    "sites.getDevices",
    { domain: domain },
  ]);

  if (!website || !visits || !sources || !countries || !devices) return null;

  return (
    <div className="flex w-full flex-col">
      <p className="my-10 text-center font-extrabold text-2xl sm:text-4xl lg:text-7xl text-white break-all">
        {website.domain}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatsCard
          title="Top Sources"
          keyTitle="Source"
          valueTitle="Visitors"
          highestValue={sources[0]?.value ?? 0}
          list={sources.map((x) => {
            return {
              ...x,
              icon: x.icon ? (
                <img
                  className="inline h-4 w-4 align-middle"
                  alt={x.title}
                  src={x.icon}
                />
              ) : null,
            };
          })}
        />

        <StatsCard
          title="Top Pages"
          keyTitle="Page"
          valueTitle="Visitors"
          highestValue={visits[0]?._count.id ?? 0}
          list={visits.map((visit) => {
            return {
              title: visit.path,
              link: visit.origin + visit.path,
              value: visit._count.id,
            };
          })}
        />

        <StatsCard
          title="Countries"
          keyTitle="Country"
          valueTitle="Visitors"
          highestValue={countries[0]?.value ?? 0}
          list={countries.map((country) => {
            return {
              title: country.title,
              link: country.link,
              value: country.value,
              icon: country.icon
                ? (getCountryFlag(country.icon as CountriesType) as ReactNode)
                : null,
            };
          })}
        />

        <StatsCard
          title="Devices"
          keyTitle="Screen size"
          valueTitle="Visitors"
          highestValue={devices[0]?.value ?? 0}
          list={(() => {
            const visitSum = devices.reduce((a, b) => a + b.value, 0);
            return devices.map((device) => {
              return {
                title: device.title,
                link: device.link,
                value: device.value,
                valueText: `${device.value} (${Math.round(
                  (device.value / visitSum) * 100
                )}%)`,
                icon: getDeviceIcon(device.icon as DeviceName),
              };
            });
          })()}
        />
      </div>

      <Link href="/sites">
        <button className="button my-10 w-full">Sites</button>
      </Link>
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const { domain } = context.query;

  if (typeof domain == "string") {
    const website = await prisma.website.findFirst({
      where: { domain: domain },
    });

    if (website) {
      const session = await getServerSession(
        context.req,
        context.res,
        authOptions
      );

      if (
        website.ownerId != session?.user.id &&
        process.env.NODE_ENV === "production"
      ) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          website: website,
        },
      };
    }
  }

  return {
    notFound: true,
  };
}

export default AnalyticsPage;
