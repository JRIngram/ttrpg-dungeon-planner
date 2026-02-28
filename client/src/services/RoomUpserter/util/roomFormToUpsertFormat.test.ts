import { RoomForm } from "@/components/organisms/Forms/RoomForm/reducer";
import { UpsertRoom } from "@/types/room";
import { describe, expect, it } from "vitest";
import { roomFormToUpsertFormat } from "./roomFormToUpsertFormat";

describe("roomFormToUpsertFormat", () => {
  it("successfully converts roomForm to upsert format", () => {
    const roomFormData: RoomForm = {
      id: "1",
      name: "a",
      description: "b",
      dungeon: "73",
      monsters: [
        {
          monster: "127",
          quantity: 1,
        },
      ],
      traps: [
        {
          trap: "37",
          quantity: 2,
        },
      ],
      roomNameInputError: "",
      roomDescriptionInputError: "",
      monsterIdError: "",
      monsterQuantityError: "",
      trapIdError: "",
      trapQuantityError: "",
    };

    const expected: UpsertRoom = {
      id: "1",
      name: "a",
      description: "b",
      dungeon: "73",
      monsters: [
        {
          monster: "127",
          quantity: 1,
        },
      ],
      traps: [
        {
          trap: "37",
          quantity: 2,
        },
      ],
    };

    expect(roomFormToUpsertFormat(roomFormData)).toEqual(expected);
  });

  describe("filtering", () => {
    it.each([
      {
        testId: "Trap: Filters  with empty string id",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [
            {
              trap: "",
              quantity: 2,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [],
        },
      },
      {
        testId: "Trap: Filters with quantity 0",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [
            {
              trap: "5",
              quantity: 0,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [],
        },
      },
      {
        testId: "Trap: Filters with quantity -1",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [
            {
              trap: "5",
              quantity: -1,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "127",
              quantity: 1,
            },
          ],
          traps: [],
        },
      },
      {
        testId: "Monster: Filters  with empty string id",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "",
              quantity: 1,
            },
          ],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
        },
      },
      {
        testId: "Monster: Filters with quantity 0",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "1",
              quantity: 0,
            },
          ],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
        },
      },
      {
        testId: "Monster: Filters with quantity -1",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "1",
              quantity: -1,
            },
          ],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [],
          traps: [
            {
              trap: "1",
              quantity: 1,
            },
          ],
        },
      },
      {
        testId:
          "Monsters + Trap: Filters on multiple fields and can retain multiple entries",
        roomData: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "11",
              quantity: -1,
            },
            {
              monster: "12",
              quantity: 0,
            },
            {
              monster: "13",
              quantity: 1,
            },
            {
              monster: "14",
              quantity: 15,
            },
            {
              monster: "",
              quantity: 1,
            },
          ],
          traps: [
            {
              trap: "1",
              quantity: -1,
            },
            {
              trap: "2",
              quantity: 0,
            },
            {
              trap: "3",
              quantity: 1,
            },
            {
              trap: "4",
              quantity: 15,
            },
            {
              trap: "",
              quantity: 1,
            },
          ],
          roomNameInputError: "",
          roomDescriptionInputError: "",
          monsterIdError: "",
          monsterQuantityError: "",
          trapIdError: "",
          trapQuantityError: "",
        },
        expected: {
          id: "1",
          name: "a",
          description: "b",
          dungeon: "73",
          monsters: [
            {
              monster: "13",
              quantity: 1,
            },
            {
              monster: "14",
              quantity: 15,
            },
          ],
          traps: [
            {
              trap: "3",
              quantity: 1,
            },
            {
              trap: "4",
              quantity: 15,
            },
          ],
        },
      },
    ])("$testId", ({ roomData, expected }) => {
      expect(roomFormToUpsertFormat(roomData)).toEqual(expected);
    });
  });
});
