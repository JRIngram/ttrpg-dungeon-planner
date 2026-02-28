import type {
  AddRoom,
  Room,
  RoomId,
  RoomWithStringifiedFields,
  UpsertRoom,
  UpsertRoomMonster,
} from "@/types/room";
import { DataFetcher } from "../DataFetcher/DataFetcher";
import type { AddOrEditDungeon, Dungeon, ServerDungeon } from "@/types/dungeon";

export class RoomDataFetcher extends DataFetcher<Room> {
  readonly requestEndpoint: string;
  readonly dungeonId: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/room`;
    this.dungeonId = "1";
  }

  getList = async (): Promise<Room[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as Room[];

    return json;
  };

  getListForDungeon = async (dungeonId: string): Promise<Room[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as Room[];

    return json.filter((room) => room.dungeon === dungeonId);
  };

  // addSingle = async (
  //   room: Room,
  // ): Promise<{ entity: Room | undefined; httpCode: number }> => {
  //   // THIS SHOULD NOT BE USED!
  //   const response = await fetch(this.requestEndpoint, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(this.mapRoomToUpsertFormat(room)),
  //   });

  //   if (!this.isSuccessfulHTTPCode(response.status)) {
  //     return {
  //       entity: undefined,
  //       httpCode: response.status,
  //     };
  //   } else {
  //     const responseJson = (await response.json()) as Room;
  //     return {
  //       entity: responseJson,
  //       httpCode: response.status,
  //     };
  //   }
  // };

  // editSingle = async (
  //   room: Room,
  // ): Promise<{ entity: Room | undefined; httpCode: number }> => {
  //   // THIS SHOULD NOT BE USED!
  //   const response = await fetch(`${this.requestEndpoint}/${room.id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(this.mapRoomToUpsertFormat(room)),
  //   });

  //   if (!this.isSuccessfulHTTPCode(response.status)) {
  //     return {
  //       entity: undefined,
  //       httpCode: response.status,
  //     };
  //   } else {
  //     const responseJson = (await response.json()) as Room;

  //     return {
  //       entity: responseJson,
  //       httpCode: response.status,
  //     };
  //   }
  // };

  async deleteSingle(id: string): Promise<{ httpCode: number }> {
    const response = await fetch(`${this.requestEndpoint}/${id}`, {
      method: "DELETE",
    });

    return { httpCode: response.status };
  }

  /**
   * Stringifies the object keys of a room and the key-values of a monster and trap
   * @param room
   * @returns
   */
  stringifyRoomFields(room: Room): RoomWithStringifiedFields {
    const entries = Object.entries(room);
    const stringifiedFields = entries.map((entry) => {
      const [k, v] = entry;
      if (Array.isArray(v)) {
        const stringifiedValueArray = v.map((arrayObject) => {
          const arrayObjectEntries = Object.entries(arrayObject);
          const stringifiedArrayObjectEntries = arrayObjectEntries.map(
            (entry) => {
              const [arrayK, arrayV] = entry;
              return [arrayK, `${arrayV}`];
            },
          );
          return Object.fromEntries(stringifiedArrayObjectEntries);
        });

        return [k, stringifiedValueArray];
      }

      return [k, `${v}`];
    });
    return Object.fromEntries(stringifiedFields);
  }
}
