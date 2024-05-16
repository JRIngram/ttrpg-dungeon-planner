import Link from "next/link";

type NavBarLink = {
  title: string;
  url: string;
};

type NavBarProps = {
  links: NavBarLink[];
};

export const NavBar = ({ links }: NavBarProps) => {
  return (
    <nav className="w-full flex flex-row px-56 py-8 gap-x-8 gap-10 bg-primary-50">
      {links.map((link) => (
        <Link href={`${link.url}`} className="text-lg text-typograph-500 font-semibold hover:underline hover:text-typography-400 active:underline active:bg-primary-">
          {link.title}
        </Link>
      ))}
    </nav>
  );
};
