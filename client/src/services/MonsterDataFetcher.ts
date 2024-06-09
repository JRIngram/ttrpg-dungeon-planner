import type { Monster } from "@/types/monster";

export class MonsterDataFetcher {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/monster`;
  }

  getMonsterList = async (): Promise<Monster[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as Promise<Monster[]>;
    console.log(json);
    return json;
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

    const responseJson = await response.json() as Monster;
    
    return responseJson;
  };
}
