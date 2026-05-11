import { Text } from "@/components/atoms/Text/Text";
import { Dungeon } from "@/types/dungeon";

type Props = {
  dungeon: Dungeon;
};

export const DungeonSummary = ({ dungeon }: Props) => {
  const playerCountString = `${dungeon.playerCount} ${
    dungeon.playerCount > 1 ? "players" : "player"
  }`;

  const levelString =
    dungeon.levelMin !== dungeon.levelMax
      ? `at levels ${dungeon.levelMin} to ${dungeon.levelMax}`
      : `at level ${dungeon.levelMin}`;

  const playerLevelRubric = `For ${playerCountString}, ${levelString}.`;

  return (
    <>
      <Text textType="header" text={dungeon.name} />
      <Text textType="default" text={dungeon.summary} />
      <Text textType="default" text={playerLevelRubric} />
    </>
  );
};
