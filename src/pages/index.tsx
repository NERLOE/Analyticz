import type { NextPage } from "next";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();

  return (
    <>
      <div className="flex flex-col items-center justify-center w-1/2 min-h-screen mx-auto">
        <h1 className="font-extrabold text-center text-7xl text-color-white">
          Analyticz.io
        </h1>
        {session.data ? (
          <p className="text-center text-2xl text-color-white">
            Welcome, {session.data.user.name}
          </p>
        ) : (
          <Link href={"/api/auth/signin"}>
            <p className="text-center text-2xl text-color-white my-10">Login</p>
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
