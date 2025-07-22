import Link, { LinkProps } from 'next/link';
import { useShop } from './ShopContext';
import { ReactNode } from 'react';

interface ShopLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export const ShopLink = ({ href, children, className, ...props }: ShopLinkProps) => {
  const shop = useShop();

  let url = href;
  if (typeof href === 'string' && shop) {
    // Use a dummy base for relative URLs
    const urlObj = new URL(href, 'http://dummy');
    urlObj.searchParams.set('shop', shop);
    url = urlObj.pathname + urlObj.search;
  }

  return <Link href={url} className={className} {...props}>{children}</Link>;
}; 