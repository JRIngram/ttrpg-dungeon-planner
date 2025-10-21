import { vi, it, describe, expect } from "vitest";
import { DungeonDataFetcher } from "./DungeonDataFetcher";

describe("MonsterDataFetcher", () => {
    describe("mapServerMonsterToMonster", () => {
        it.each([
            [{
                id: "1",
                name: "The Hidden Temple of Dave",
                summary: "Explore the hidden ruins of the Temple of Dave, and find the hidden crystal of Daveth ",
                level_min: 1,
                level_max: 3,
                player_count: 4
            },
            {
                id: "1",
                name: "The Hidden Temple of Dave",
                summary: "Explore the hidden ruins of the Temple of Dave, and find the hidden crystal of Daveth ",
                levelMin: 1,
                levelMax: 3,
                playerCount: 4
            }]
        ])("maps %o correctly to %o", (serverDungeon, expectedMapping) => {
            const dungeonDataFetcher = new DungeonDataFetcher();
            expect(
                dungeonDataFetcher.mapServerDungeonToDungeon(serverDungeon)
            ).toEqual(expectedMapping);
        });
    });
});
