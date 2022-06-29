import type { NextPage } from "next";
import { trpc } from "@utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-1/2 min-h-screen mx-auto">
        <h1 className="font-extrabold text-center text-7xl text-color-white">
          Analyticz.io
        </h1>
      </div>
    </>
  );
};

export default Home;
