import type { AddRoom, Room, ServerRoom } from "@/types/room";
import { DataFetcher } from "../DataFetcher/DataFetcher";
import type { AddDungeon, Dungeon, ServerDungeon } from "@/types/dungeon";

export class RoomDataFetcher extends DataFetcher<Room> {
  readonly requestEndpoint: string;
  readonly dungeonId: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/room`;
    this.dungeonId = "1";
  }

  mapServerRoomToRoom = (room: ServerRoom): Room => {
    const { id, name, description, dungeon, monsters, traps } = room;

    return {
      id,
      name,
      description,
      dungeonId: dungeon,
      traps,
      monsters,
    };
  };

  mapRoomToServerRoom = (room: Room): Omit<ServerRoom, "id"> => {
    const { name, description, dungeonId, traps, monsters } = room;

    return {
      name,
      description,
      traps,
      monsters,
      dungeon: dungeonId,
    };
  };

  getList = async (): Promise<Room[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as ServerRoom[];

    return json.map((serverRoom) => this.mapServerRoomToRoom(serverRoom));
  };

  getListForDungeon = async (dungeonId: string): Promise<Room[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as ServerRoom[];

    return json
      .filter((room) => room.dungeon === dungeonId)
      .map((serverRoom) => this.mapServerRoomToRoom(serverRoom));
  };

  addSingle = async (
    room: AddRoom,
  ): Promise<{ entity: Room | undefined; httpCode: number }> => {
    console.log({ room });
    console.log(JSON.stringify(this.mapRoomToServerRoom(room)));
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.mapRoomToServerRoom(room)),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerRoom;
      return {
        entity: this.mapServerRoomToRoom(responseJson),
        httpCode: response.status,
      };
    }
  };

  editSingle = async (
    room: Room,
  ): Promise<{ entity: Room | undefined; httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${room.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.mapRoomToServerRoom(room)),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerRoom;

      return {
        entity: this.mapServerRoomToRoom(responseJson),
        httpCode: response.status,
      };
    }
  };

  async deleteSingle(id: string): Promise<{ httpCode: number }> {
    const response = await fetch(`${this.requestEndpoint}/${id}`, {
      method: "DELETE",
    });

    return { httpCode: response.status };
  }
}
