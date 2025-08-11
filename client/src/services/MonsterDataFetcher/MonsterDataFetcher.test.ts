import { vi, it, describe, expect } from "vitest";
import { MonsterDataFetcher } from "./MonsterDataFetcher";
import { ServerMonster } from "@/types/monster";

describe("MonsterDataFetcher", () => {
  describe("mapServerMonsterToMonster", () => {
    it.each([
      [
        {
          id: "1",
          name: "Test Monster",
          xp: 25,
          is_deletable: false,
        },
        {
          id: "1",
          name: "Test Monster",
          xp: 25,
          isDeletable: true, // temporary whilst being hardecoded
        },
      ],
      [
        {
          id: "1",
          name: "Test Monster",
          xp: 25,
          is_deletable: true,
        },
        {
          id: "1",
          name: "Test Monster",
          xp: 25,
          isDeletable: true,
        },
      ],
    ])("maps %o correctly to %o", (serverMonster, expectedMapping) => {
      const monsterDataFetcher = new MonsterDataFetcher();
      expect(
        monsterDataFetcher.mapServerMonsterToMonster(serverMonster)
      ).toEqual(expectedMapping);
    });
  });
});
