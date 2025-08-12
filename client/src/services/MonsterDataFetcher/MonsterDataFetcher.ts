import type { Monster, MonsterId, ServerMonster } from "@/types/monster";
import { DataFetcher } from "../DataFetcher/DataFetcher";

export class MonsterDataFetcher extends DataFetcher<Monster> {
  readonly requestEndpoint: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/monster`;
  }

  mapServerMonsterToMonster = (monster: ServerMonster): Monster => {
    const { id, name, xp } = monster;
    const IS_DELETABLE = true; // hardcoded for now :-)
    return {
      id,
      name,
      xp,
      isDeletable: IS_DELETABLE,
    };
  };

  getList = async (): Promise<Monster[]> => {
    const responseJson = await fetch(this.requestEndpoint);
    const json = (await responseJson.json()) as ServerMonster[];

    return json.map((monster) => this.mapServerMonsterToMonster(monster));
  };

  addSingle = async (monster: Pick<Monster, "xp" | "name">): Promise<{ entity: Monster | undefined; httpCode: number; }> => {
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        xp: monster.xp,
        name: monster.name,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerMonster;
      return {
        entity: this.mapServerMonsterToMonster(responseJson),
        httpCode: response.status,
      };
    }
  }

  editSingle = async (
    monster: Monster
  ): Promise<{ entity: Monster | undefined, httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${monster.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        xp: monster.xp,
        name: monster.name,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerMonster;

      return {
        entity: this.mapServerMonsterToMonster(responseJson),
        httpCode: response.status,
      };
    }
  };

  async deleteSingle(id: string): Promise<{ httpCode: number; }> {
    const response = await fetch(`${this.requestEndpoint}/${id}`, {
      method: "DELETE",
    });

    return {
      httpCode: response.status,
    };
  }
}
