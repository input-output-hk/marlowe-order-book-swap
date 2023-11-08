import Image from "next/image";
import DiscordLogo from "public/discord.svg";
import GithubLogo from "public/github.svg";
import TwitterLogo from "public/twitter.svg";
import YoutubeLogo from "public/youtube.svg";
import { ICON_SIZES } from "~/utils";

export const Footer = () => {
  return (
    <footer className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <hr className="pb-6" />
      <div className="flex flex-col justify-between gap-8 px-4 md:flex-row md:gap-14">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-8 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:grid-rows-1 lg:gap-14">
          <div>
            <p className="font-bold">Resources</p>
            <a
              href="https://marlowe.iohk.io/"
              target="_blank"
              className="block"
            >
              Official Website
            </a>
            <a
              href="https://docs.marlowe.iohk.io/"
              target="_blank"
              className="block"
            >
              Documentation
            </a>
            <a
              href="https://play.marlowe.iohk.io/"
              target="_blank"
              className="block"
            >
              Playground
            </a>
            <a
              href="https://marlowe.iohk.io/blog"
              target="_blank"
              className="block"
            >
              Blog
            </a>
          </div>
          <div>
            <p className="font-bold">Legal</p>
            <a
              href="https://docs.google.com/document/d/13zJ5jdaKjXgAytvDn0kln8UFDhyFr3AS/view"
              target="_blank"
              className="block"
            >
              Cookie Policy
            </a>
            <a
              href="https://static.iohk.io/terms/iog-privacy-policy.pdf"
              target="_blank"
              className="block"
            >
              Privacy Policy
            </a>
            <a
              href="https://plutus-static.s3.eu-central-1.amazonaws.com/IOHK+Website+Terms+%26+Conditions+(Final).pdf"
              target="_blank"
              className="block"
            >
              Terms of Use
            </a>
          </div>
          <div>
            <p className="font-bold">Support</p>
            <a
              href="https://iohk.zendesk.com/hc/en-us/requests/new"
              target="_blank"
              className="block"
            >
              IOG tech support
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 md:w-1/2 md:items-end md:gap-0 lg:w-1/3">
          <div className="flex gap-6">
            <a
              href="https://github.com/input-output-hk/marlowe-cardano"
              target="_blank"
              className="cursor-pointer hover:brightness-50"
            >
              <Image
                src={GithubLogo as string}
                alt="GitHub"
                height={ICON_SIZES.M}
                width={ICON_SIZES.M}
              />
            </a>
            <a
              href="https://discord.gg/inputoutput"
              target="_blank"
              className="cursor-pointer hover:brightness-50"
            >
              <Image
                src={DiscordLogo as string}
                alt="Discord"
                height={ICON_SIZES.M}
                width={ICON_SIZES.M}
              />
            </a>
            <a
              href="https://twitter.com/marlowe_io"
              target="_blank"
              className="cursor-pointer hover:brightness-50"
            >
              <Image
                src={TwitterLogo as string}
                alt="Twitter"
                height={ICON_SIZES.M}
                width={ICON_SIZES.M}
              />
            </a>
            <a
              href="https://www.youtube.com/@IohkIo"
              target="_blank"
              className="cursor-pointer hover:brightness-50"
            >
              <Image
                src={YoutubeLogo as string}
                alt="YouTube"
                height={ICON_SIZES.M}
                width={ICON_SIZES.M}
              />
            </a>
          </div>
          <div className="text-center md:text-right">
            &copy; 2023 Input Output Global, Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
