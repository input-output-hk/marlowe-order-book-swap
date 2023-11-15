import Image from "next/image";
import CheckIcon from "public/check.svg";
import CopyIcon from "public/copy.svg";
import { useState } from "react";
import { ICON_SIZES } from "~/utils";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      });
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  return (
    <>
      {copied ? (
        <div className="animate-bounce">
          <abbr title="Copied!">
            <Image
              src={CheckIcon as string}
              alt="✓"
              width={ICON_SIZES.M}
              height={ICON_SIZES.M}
            />
          </abbr>
        </div>
      ) : (
        <div
          onClick={copyToClipboard}
          className="rounded-full p-2 hover:bg-m-disabled/10"
        >
          <abbr title="Copy Address">
            <Image
              src={CopyIcon as string}
              alt={"Copy"}
              width={ICON_SIZES.M}
              height={ICON_SIZES.M}
            />
          </abbr>
        </div>
      )}
    </>
  );
};
