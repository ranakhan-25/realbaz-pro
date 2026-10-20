import Image from "next/image";
import Link from "next/link";
export function Logo({
  to = "/",
  compact = false,
}: {
  to?: "/" | "/dashboard";
  compact?: boolean;
}) {
  return (
    <Link href={to} className="flex items-center" aria-label="RealBiz home">
      <Image
        src="/logo.svg"
        alt="RealBiz logo"
        width={100}
        height={100}
        className=" h-20 w-40 object-contain transition-all duration-300 dark:brightness-0 dark:invert "
      />
    </Link>
  );
}
