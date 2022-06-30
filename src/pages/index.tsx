import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
            <a
              className="text-center text-2xl text-red-500 my-5 cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </a>
          </>
        ) : (
          <Link
            className="text-center text-2xl text-white my-10"
            href={"/signin"}
          >
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
