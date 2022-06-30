import Link from "next/link";

const Page404 = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="self-center container text-center mt-24">
        <h1 className="font-extrabold text-5xl text-white">404</h1>
        <h2 className="text-xl text-white mt-4">The page was not found?</h2>
        <Link href="/">
          <button className="button mt-8">Return to home</button>
        </Link>
      </div>
    </div>
  );
};

export default Page404;
