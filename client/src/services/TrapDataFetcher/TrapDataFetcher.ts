import { Trap } from "@/types/trap";

export class TrapDataFetcher {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/trap`;
  }

  getTrapList = async (): Promise<Trap[]> => {
    const response = await fetch(this.requestEndpoint)
    const json = (await response.json()) as Trap[]

    return json;
  }
}