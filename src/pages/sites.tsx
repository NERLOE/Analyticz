import { trpc } from "@utils/trpc";
import Link from "next/link";

const Sites = () => {
  const q /*{ data: sites }*/ = trpc.useQuery(["auth.getWebsites"]);
  const { data: sites } = q;

  console.log("restating", q);

  return (
    <div className="grid grid-cols-4 gap-10">
      {sites &&
        sites.map((site) => {
          return (
            <Link href={`/${site.domain}`} key={site.id}>
              <div className="py-2 px-2 text-white bg-gray-800 border-t border-b border-gray-700 shadow sm:px-10 sm:rounded-lg sm:border-r sm:border-l">
                <p>{site.domain}</p>
                <p>
                  <span className="font-extrabold">{site.visits.length}</span>{" "}
                  visitors in the last 24h
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Sites;
