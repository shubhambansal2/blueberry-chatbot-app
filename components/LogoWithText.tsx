import clsx from "clsx";

import Link from "next/link";
import React from "react";
import { ShopLink } from './ShopLink';

const LogoWithText = ({
  textClassName,
  logoClassName,
}: {
  textClassName?: string;
  logoClassName?: string;
}) => {
  return (
    <div className="flex flex-row justify-between items-center space-x-1">
      {/* <LogoMain className={clsx(logoClassName)} /> */}
      <ShopLink href="/" className={clsx("font-bold text-2xl", textClassName)}>
        Foxtrot
      </ShopLink>
    </div>
  );
};

export default LogoWithText;
