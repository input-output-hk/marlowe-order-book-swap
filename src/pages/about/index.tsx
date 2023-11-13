import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - About</title>
        <meta name="description" content="About" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <main className="flex h-fit w-full flex-grow flex-col gap-4 ">
        <div className="mx-4 mb-4 md:mx-12 lg:mx-24 lg:p-4 xl:mx-28 xl:p-5">
          <b className="text-2xl">Overview</b>
          <div>
            The Order Book Token Swap prototype aims to create a decentralized
            platform where users can list tokens for swap, specifying the
            desired amount and type of other tokens in return. Interested
            parties from around the globe can accept these offers, leading to a
            finalized token swap.
          </div>
          <br />
          <div>
            This <b>Order Book Token Swap</b> was built using mainstream Web
            Technologies & Frameworks (Typescript & React) on top of the Marlowe
            Web DApp Stack:
            <br />
            <ul className="mx-5 list-outside list-disc">
              <li>
                <a
                  href="https://github.com/input-output-hk/marlowe-ts-sdk/"
                  target="_blank"
                  className="text-m-blue hover:underline"
                >
                  Marlowe TypeScript SDK (TS-SDK)
                </a>
                : a suite of TypeScript/JavaScript libraries for developing
                Web-DApp in the Cardano Blockchain using Marlowe Technologies.
              </li>
            </ul>
          </div>
          <br />
          Enjoy and stay tuned for our next releases!
        </div>
      </main>
    </>
  );
}
