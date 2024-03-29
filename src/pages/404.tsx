import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import LogoIcon from "public/marlowe.svg";
import { Button } from "~/components/Button/Button";
import { ICON_SIZES, PAGES } from "~/utils";

export default function FourZeroFour() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
        <meta name="description" content="Not Found" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <main className="flex h-screen w-full flex-grow flex-col items-center justify-center gap-8 md:flex-row md:gap-20 md:py-32 ">
        <Image
          src={LogoIcon as string}
          alt="Marlowe"
          width={ICON_SIZES.XXXL}
          className="hidden md:block"
        />
        <Image
          src={LogoIcon as string}
          alt="Marlowe"
          width={ICON_SIZES.XXL}
          className="block md:hidden"
        />

        <div className="flex w-3/4 flex-col items-center justify-center gap-4 md:w-1/4 md:items-start">
          <div className="text-center md:text-left">
            <h1 className="pb-2 text-4xl font-bold lg:text-5xl">404</h1>
            <h2 className="text-2xl font-semibold lg:text-3xl">
              Page not found
            </h2>
            <p className="pt-4 text-2xl lg:text-3xl">
              The page you&apos;re looking for can&apos;t be found.
            </p>
          </div>

          <div className="w-1/2 md:w-full lg:w-4/5">
            <Link href={{ pathname: PAGES.HOME, query: { page: 1 } }}>
              <Button>Go to Home</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
