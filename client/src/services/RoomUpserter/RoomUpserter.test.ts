import { describe, expect, it } from "vitest";
import { RoomUpserter } from "./RoomUpserter";
import { Room, RoomWithStringifiedFields } from "@/types/room";

describe("RoomUpserter", () => {
  describe("mapRoomToUpsertFormat", () => {
    it("correctly maps a Room to an UpsertRoom format", () => {
      const upserter = new RoomUpserter();
      const room: RoomWithStringifiedFields = {
        id: "283",
        name: "a",
        description: "b",
        traps: [
          {
            id: "37",
            name: "Hidden Pits",
            effect: "1d4 bludgeoning damage",
            quantity: "20",
          },
        ],
        monsters: [
          {
            id: "127",
            name: "Davee",
            xp: "500",
            quantity: "10",
          },
        ],
        dungeon: "74",
      };

      const upsertRoomFormat = {
        id: "283",
        name: "a",
        description: "b",
        traps: [
          {
            trap: "37",
            quantity: "20",
          },
        ],
        monsters: [
          {
            monster: "127",
            quantity: "10",
          },
        ],
        dungeon: "74",
      };

      expect(upserter.mapRoomToUpsertFormat(room)).toEqual(upsertRoomFormat);
    });
  });
});
