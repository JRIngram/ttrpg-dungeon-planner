import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/atoms/Text/Text";
import {
  RoomWithStringifiedFields,
  StringifiedRoomMonster,
  StringifiedRoomTrap,
} from "@/types/room";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import {
  EncounterMultiplierConfigRow,
  EncounterRatingConfigRow,
} from "@/types/configs";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { MonsterWithQuantity } from "@/types/monster";

type RoomDisplayProps = {
  room: RoomWithStringifiedFields;
};

export const RoomDisplay = ({ room }: RoomDisplayProps) => {
  const encounterRatingService = new EncounterRatingService();

  const {
    data: encounterRatingConfigRows,
    isLoading: isLoadingEncounterRatingConfigRows,
    isError: errorLoadingEncounterRatingConfigRows,
  } = useQuery({
    queryKey: ["encounter-rating-config"],
    queryFn: (): Promise<EncounterRatingConfigRow[]> => {
      return encounterRatingService.getList();
    },
  });

  return (
    <div className="flex gap-4 flex-col my-4">
      <Text text={room.name} textType="header" />
      <Text text={room.description} textType="default" />
      <MonsterList monsters={room.monsters} />
      <TrapList traps={room.traps} />
      <XpInformation monsters={room.monsters} />
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

type XpInformationProps = {
  monsters: StringifiedRoomMonster[];
};

const XpInformation = ({ monsters }: XpInformationProps) => {
  const encounterMultiplierService = new EncounterMultiplierService();

  const {
    data: multiplierConfigRows,
    isLoading: isLoadingMultiplierConfigRows,
    isError: errorLoadingMultiplierConfigRows,
  } = useQuery({
    queryKey: ["encounter-multiplier-config"],
    queryFn: (): Promise<EncounterMultiplierConfigRow[]> => {
      return encounterMultiplierService.getList();
    },
  });

  const calculateTotalMonsterXp = (monster: MonsterWithQuantity) =>
    monster.xp ? parseInt(monster.xp) * monster.quantity : -1;

  const calculateAdjustedTotalXp = (
    totalXp: number,
    roomMonsters: MonsterWithQuantity[],
  ) => {
    if (!multiplierConfigRows) return;

    const monsterCount = roomMonsters.reduce((accumulator, currentMonster) => {
      return accumulator + currentMonster.quantity;
    }, 0);

    const getEncounterMultiplier = () =>
      multiplierConfigRows.find(
        (row) => monsterCount >= row.min && monsterCount <= row.max,
      )?.multiplier ?? 1;

    return totalXp * getEncounterMultiplier();
  };

  const monstersWithNumericalQuantity = monsters.map((monster) => ({
    ...monster,
    // stringify quantity
    quantity: parseInt(monster.quantity),
  }));

  const xpPriorToAdjustment = monstersWithNumericalQuantity.reduce(
    (accumulator, currentValue) =>
      accumulator + calculateTotalMonsterXp(currentValue),
    0,
  );

  return (
    <>
      <Text text="XP Information:" textType="default"></Text>
      <Text
        text={`Pre multiplier adjustment: ${xpPriorToAdjustment}xp`}
        textType="default"
      ></Text>
      {isLoadingMultiplierConfigRows && (
        <Text
          text="Loading post multiplier adjustment XP..."
          textType="default"
        />
      )}
      {!isLoadingMultiplierConfigRows && (
        <Text
          text={`Post multiplier adjustment: ${calculateAdjustedTotalXp(xpPriorToAdjustment, monstersWithNumericalQuantity)}xp`}
          textType="default"
        ></Text>
      )}
    </>
  );
};

// const roomRatingForLevel = (level: number, encounterXp: number): string => {
//   const ratingForLevel = roomRatingConfig.find(
//     (rating) => rating.level === level,
//   );

//   if (ratingForLevel === undefined) return "No rating for level";

//   const { easy, medium, hard, extreme } = ratingForLevel;
//   const xpPerPlayer = adjustedXp / playerCount;

//   if (xpPerPlayer < easy) return "Trivial";
//   if (xpPerPlayer >= easy && xpPerPlayer < medium) return "Easy";
//   if (xpPerPlayer >= medium && xpPerPlayer < hard) return "Medium";
//   if (xpPerPlayer >= hard && xpPerPlayer < extreme) return "Hard";
//   if (xpPerPlayer >= extreme) return "Extreme";

//   return "Error calculating rating. No matching Rating.";
// };
