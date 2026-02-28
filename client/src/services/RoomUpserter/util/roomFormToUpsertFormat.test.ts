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
});
