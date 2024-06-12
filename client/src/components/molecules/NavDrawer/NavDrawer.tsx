export type DrawerItem = {
  id: string;
  label: string;
};

type Props = {
  items: DrawerItem[];
  onSelect: () => void;
};

export const NavDrawer = ({ items, onSelect }: Props) => {
  return (
    <nav className="h-lvh border-r-2 border-solid w-1/5 border-primary-50 overflow-scroll">
      <div className="flex flex-col items-center gap-1">
        {items.map((item) => (
          <p key={item.id}>{item.label}</p>
        ))}
      </div>
    </nav>
  );
};
