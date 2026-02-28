import { Room, UpsertRoom } from "@/types/room";

export class RoomUpserter {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/room`;
  }

  isSuccessfulHTTPCode = (responseCode: number) => {
    const stringifiedResponseCode = `${responseCode}`;
    return (
      !stringifiedResponseCode.startsWith("4") &&
      !stringifiedResponseCode.startsWith("5")
    );
  };

  upsertRoom = async (
    room: UpsertRoom,
  ): Promise<{ entity: Room | undefined; httpCode: number }> => {
    const roomAlreadyExists = room.id;
    let response: Response;
    if (roomAlreadyExists) {
      response = await fetch(`${this.requestEndpoint}/${room.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });
    } else {
      response = await fetch(this.requestEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });
    }

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as Room;
      return {
        entity: responseJson,
        httpCode: response.status,
      };
    }
  };

  mapRoomToUpsertFormat(room: Room): UpsertRoom {
    return {
      id: room?.id ? `${room.id}` : undefined,
      name: room.name,
      description: room.description,
      dungeon: room.dungeon,
      monsters: room.monsters.map((monster) => ({
        monster: monster.id,
        quantity: monster.quantity,
      })),
      traps: room.traps.map((trap) => ({
        trap: trap.id,
        quantity: trap.quantity,
      })),
    };
  }
}
