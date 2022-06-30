import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

const AnalyticsPage: React.FC = () => {
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
    <div className="flex">
      <p>{website.domain}</p>
      <p>{visits._count.id}</p>
    </div>
  );
};

export default AnalyticsPage;
