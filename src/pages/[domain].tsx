import { Website } from "@prisma/client";
import { prisma } from "@server/db/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

interface Props {
  website: Website;
}

const AnalyticsPage = ({ website }: Props) => {
  console.log("website", website);
  return (
    <div className="flex">
      <p>{website?.domain}</p>
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
      include: {
        visits: true,
      },
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
