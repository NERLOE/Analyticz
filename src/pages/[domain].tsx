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
import { useMemo } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import StatsCard from "@components/StatsCard/StatsCard";

interface Props {
  website: Website;
}

const AnalyticsPage: NextPage<Props> = () => {
  const router = useRouter();
  const domain = router.query.domain as string;

  console.log("domain", domain);

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

  const highestVisits = useMemo(() => {
    if (!visits) return 0;
    let hv = 0;

    visits.forEach((visit) => {
      if (visit._count.id > hv) hv = visit._count.id;
    });

    return hv;
  }, [visits]);

  console.log(website, visits, highestVisits);

  if (!website || !visits) return null;

  return (
    <div>
      <p className="text-center font-extrabold text-7xl text-white">
        {website.domain}
      </p>

      <div className="md:flex justify-between">
        <StatsCard
          title="Top Sources"
          keyTitle="Source"
          valueTitle="Visitors"
          highestValue={1}
          list={sources}
        />

        <StatsCard
          title="Top Pages"
          keyTitle="Page"
          valueTitle="Visitors"
          highestValue={highestVisits}
          list={visits.map((visit) => {
            return {
              title: visit.path,
              link: visit.origin + visit.path,
              value: visit._count.id,
            };
          })}
        />
      </div>
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
