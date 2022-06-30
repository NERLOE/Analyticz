import { Website } from "@prisma/client";
import { prisma } from "@server/db/client";
import { trpc } from "@utils/trpc";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  NextPage,
  NextPageContext,
} from "next";
import { useRouter } from "next/router";

interface Props {
  website: Website;
}

const AnalyticsPage: NextPage<Props> = () => {
  const router = useRouter();

  const { data: website } = trpc.useQuery([
    "analytics.getWebsite",
    {
      domain: router.query.domain as string,
    },
  ]);

  if (!website) return null;

  const { data: visits } = trpc.useQuery([
    "analytics.getVisits",
    { websiteId: website.id },
  ]);

  if (!visits) return null;

  console.log(visits);

  return (
    <div>
      <p>{website.domain}</p>
      {visits.map((visit) => {
        return (
          <p key={visit.path}>
            {visit.path}: {visit._count.id}
          </p>
        );
      })}
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
      return {
        props: {
          website: website,
        },
      };
    }
  }

  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
}

export default AnalyticsPage;
