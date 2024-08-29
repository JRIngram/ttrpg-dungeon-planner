import type { Monster, MonsterId, ServerMonster } from "@/types/monster";
import { ServerError } from "@/types/ServerError";

type MonsterDataFetcherResponse = {
  httpCode: number;
  monster?: Monster;
  message?: string;
};

export class MonsterDataFetcher {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/monster`;
  }

  isSuccessfulHTTPCode = (responseCode: number) => {
    const stringifiedResponseCode = `${responseCode}`;
    return (
      !stringifiedResponseCode.startsWith("4") &&
      !stringifiedResponseCode.startsWith("5")
    );
  };

  mapServerMonsterToMonster = (monster: ServerMonster): Monster => {
    const { id, name, xp } = monster;
    return {
      id,
      name,
      xp,
      isDeletable: monster.is_deletable,
    };
  };

  getMonsterList = async (): Promise<Monster[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as ServerMonster[];

    return json.map((monster) => this.mapServerMonsterToMonster(monster));
  };

  getMonsterById = async (monsterId: MonsterId): Promise<Monster> => {
    const response = await fetch(`${this.requestEndpoint}/${monsterId}`);
    const json = (await response.json()) as ServerMonster;

    return this.mapServerMonsterToMonster(json);
  };

  addMonster = async (
    monster: Pick<Monster, "name" | "xp">
  ): Promise<{ monster: Monster | undefined; httpCode: number }> => {
    const d = new FormData();
    d.append("monster_xp", `${monster.xp}`);
    d.append("monster_name", monster.name);

    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monster_xp: monster.xp,
        monster_name: monster.name,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        monster: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerMonster;
      return {
        monster: this.mapServerMonsterToMonster(responseJson),
        httpCode: response.status,
      };
    }
  };

  editMonster = async (
    monster: Monster
  ): Promise<{ monster: Monster | undefined; httpCode: number }> => {
    const d = new FormData();
    d.append("monster_xp", `${monster.xp}`);
    d.append("monster_name", monster.name);

    const response = await fetch(`${this.requestEndpoint}/${monster.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monster_xp: monster.xp,
        monster_name: monster.name,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        monster: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerMonster;

      return {
        monster: this.mapServerMonsterToMonster(responseJson),
        httpCode: response.status,
      };
    }
  };

  deleteMonster = async (
    monsterId: MonsterId
  ): Promise<MonsterDataFetcherResponse> => {
    const response = await fetch(`${this.requestEndpoint}/${monsterId}`, {
      method: "DELETE",
    });

    const responseJson = await response.json();

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        monster: undefined,
        httpCode: response.status,
        message: responseJson?.message,
      };
    } else {
      const serverMonsterJson = responseJson as ServerMonster;

      return {
        monster: this.mapServerMonsterToMonster(serverMonsterJson),
        httpCode: response.status,
      };
    }
  };
}
