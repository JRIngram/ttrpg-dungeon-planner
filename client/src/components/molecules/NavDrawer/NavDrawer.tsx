export type DrawerItem = {
  id: string;
  label: string;
};

type OnSelect = (id: string) => void;

type NavDrawerItemProps = {
  item: DrawerItem;
  onSelect: OnSelect;
};

const NavDrawerButton = ({ item, onSelect }: NavDrawerItemProps) => {
  return (
    <button
      key={item.id}
      onClick={() => {
        onSelect(item.id);
      }}
    >
      {item.label}
    </button>
  );
};

type DefaultItem = {
  label: string;
  onDefaultSelected: () => void;
};

type Props = {
  items: DrawerItem[];
  onSelect: OnSelect;
  defaultItem?: DefaultItem;
};

export const NavDrawer = ({ items, onSelect, defaultItem }: Props) => {
  return (
    <nav className="h-lvh border-r-2 border-solid w-1/5 border-primary-50 overflow-scroll">
      <div className="flex flex-col items-center gap-1">
        {defaultItem && (
          <NavDrawerButton
            key={"default"}
            item={{ id: "default", label: defaultItem.label }}
            onSelect={defaultItem.onDefaultSelected}
          />
        )}
        {items.map((item) => (
          <NavDrawerButton key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </nav>
  );
};
