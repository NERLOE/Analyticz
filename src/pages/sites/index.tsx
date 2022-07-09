import Card from "@components/Card/Card";
import { getUserWebsites } from "@server/router/auth";
import { trpc } from "@utils/trpc";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]";

const Sites = () => {
  const { data: sites } = trpc.useQuery(["auth.getWebsites"], {
    staleTime: Infinity,
  });

  console.log("sites", sites);

  return (
    <>
      <div className="flex justify-end">
        <Link href="/sites/new">
          <button className="button">Create site</button>
        </Link>
      </div>
      <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sites &&
          sites.map((site) => {
            return (
              <Link href={`/${site.domain}`} key={site.id}>
                <Card className="">
                  <div className="flex align-center">
                    {site.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={site.icon} alt="icon" className="w-5 h-5" />
                    )}{" "}
                    <p>{site.domain}</p>
                  </div>

                  <p>
                    <span className="font-extrabold">{site.visits.length}</span>{" "}
                    visitors in the last 24h
                  </p>
                </Card>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user) {
    // If the user isn't signed in, redirect to the login page
    return {
      redirect: {
        destination: "/signin",
        permanent: true,
      },
    };
  }

  const websites = await getUserWebsites(session);
  if (websites.length <= 0) {
    // If the user has no registered websites,
    // redirect to /sites/new to register a new site
    return {
      redirect: {
        destination: "/sites/new",
        permanent: true,
      },
    };
  }

  return { props: {} };
}

export default Sites;
