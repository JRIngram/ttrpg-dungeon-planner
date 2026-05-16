import { Text } from "@/components/atoms/Text/Text";
import {
  RoomWithStringifiedFields,
  StringifiedRoomMonster,
  StringifiedRoomTrap,
} from "@/types/room";

type RoomDisplayProps = {
  room: RoomWithStringifiedFields;
};

export const RoomDisplay = ({ room }: RoomDisplayProps) => {
  return (
    <div className="flex gap-4 flex-col my-4">
      <Text text={room.name} textType="header" />
      <Text text={room.description} textType="default" />
      <MonsterList monsters={room.monsters} />
      <TrapList traps={room.traps} />
    </div>
  );
};

type MonsterListProps = {
  monsters: StringifiedRoomMonster[];
};

const MonsterList = ({ monsters }: MonsterListProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Text text="Contains the following monsters:" textType="default" />
      <ul className="pl-4">
        {monsters.map((monster) => {
          return (
            <li key={monster.id} className="list-disc">
              {monster.quantity} {monster.name} - {monster.xp}xp each
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type TrapListProps = {
  traps: StringifiedRoomTrap[];
};

const TrapList = ({ traps }: TrapListProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Text text="Contains the following traps:" textType="default" />
      <ul className="pl-4">
        {traps.map((trap) => {
          return (
            <li key={trap.id} className="list-disc">
              {trap.quantity} {trap.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
