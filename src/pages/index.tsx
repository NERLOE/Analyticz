import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = trpc.useQuery(["auth.getSession"]);

  console.log(session);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-1/2 min-h-screen mx-auto">
        <h1 className="font-extrabold text-center text-7xl text-white">
          Analyticz.io
        </h1>
        {session ? (
          <>
            <p className="text-center my-5 text-2xl text-white">
              Welcome, {session.user.name}
            </p>
            <Link
              className="text-center text-2xl text-red-500 my-25"
              href={"/api/auth/signout"}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            className="text-center text-2xl text-white my-25"
            href={"/api/auth/signin"}
          >
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
