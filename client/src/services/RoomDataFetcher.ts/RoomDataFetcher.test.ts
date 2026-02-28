import { vi, it, describe, expect } from "vitest";
import { Room, RoomWithStringifiedFields } from "@/types/room";
import { RoomDataFetcher } from "./RoomDataFetcher";

describe("RoomDataFetcher", () => {
  describe("stringifyRoomFields", () => {
    it("successfully stringifies room fields", () => {
      const roomDataFetcher = new RoomDataFetcher();
      const room: Room = {
        id: 283,
        name: "a",
        description: "b",
        traps: [
          {
            id: 37,
            name: "Hidden Pits",
            effect: "1d4 bludgeoning damage",
            quantity: 20,
          },
        ],
        monsters: [
          {
            id: 127,
            name: "Davee",
            xp: 500,
            quantity: 10,
          },
        ],
        dungeon: 74,
      };

      const stringifiedRoom: RoomWithStringifiedFields = {
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

      expect(roomDataFetcher.stringifyRoomFields(room)).toEqual(
        stringifiedRoom,
      );
    });
  });
});
