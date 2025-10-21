import { DataFetcher } from "../DataFetcher/DataFetcher";
import type { AddDungeon, Dungeon, ServerDungeon } from "@/types/dungeon";

export class DungeonDataFetcher extends DataFetcher<Dungeon> {
  readonly requestEndpoint: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/dungeon`;
  }

  mapServerDungeonToDungeon = (dungeon: ServerDungeon): Dungeon => {
    const { id, name, summary, level_min, level_max, player_count } = dungeon;

    return {
      id,
      name,
      summary,
      levelMin: level_min,
      levelMax: level_max,
      playerCount: player_count,
    };
  };

  getList = async (): Promise<Dungeon[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as ServerDungeon[];

    return json.map((serverDungeon) =>
      this.mapServerDungeonToDungeon(serverDungeon),
    );
  };

  addSingle = async (
    dungeon: AddDungeon,
  ): Promise<{ entity: Dungeon | undefined; httpCode: number }> => {
    console.log("adding", dungeon);
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dungeon.name,
        summary: dungeon.summary,
        level_min: dungeon.levelMin,
        level_max: dungeon.levelMax,
        player_count: dungeon.playerCount,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerDungeon;
      return {
        entity: this.mapServerDungeonToDungeon(responseJson),
        httpCode: response.status,
      };
    }
  };

  editSingle = async (
    dungeon: Dungeon,
  ): Promise<{ entity: Dungeon | undefined; httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${dungeon.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dungeon.name,
        summary: dungeon.summary,
        level_min: dungeon.levelMin,
        level_max: dungeon.levelMax,
        player_count: dungeon.playerCount,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerDungeon;

      return {
        entity: this.mapServerDungeonToDungeon(responseJson),
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
