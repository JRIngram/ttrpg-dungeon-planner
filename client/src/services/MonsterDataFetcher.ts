import type { Monster, ServerMonster } from "@/types/monster";

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

  getMonsterById = async (id: string): Promise<Monster> => {
    const response = await fetch(`${this.requestEndpoint}/${id}`);
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
}
