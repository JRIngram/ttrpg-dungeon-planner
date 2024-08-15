import type { Monster, MonsterId, ServerMonster } from "@/types/monster";
import { ServerError } from "@/types/ServerError";

export class MonsterDataFetcher {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/monster`;
  }

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
  ): Promise<Monster> => {
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

    const responseJson = (await response.json()) as ServerMonster;

    return this.mapServerMonsterToMonster(responseJson);
  };

  editMonster = async (monster: Monster): Promise<Monster> => {
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

    const responseJson = (await response.json()) as ServerMonster;

    return this.mapServerMonsterToMonster(responseJson);
  };

  deleteMonster = async (
    monsterId: MonsterId
  ): Promise<Monster | ServerError> => {
    const response = await fetch(`${this.requestEndpoint}/${monsterId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    if (responseJson.message) {
      return responseJson;
    }

    return this.mapServerMonsterToMonster(responseJson);
  };
}
