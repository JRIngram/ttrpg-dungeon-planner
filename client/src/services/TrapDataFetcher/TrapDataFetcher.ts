import { ServerTrap, Trap } from "@/types/trap";
import { DataFetcher } from "../DataFetcher/DataFetcher";

export class TrapDataFetcher extends DataFetcher<Trap> {
  readonly requestEndpoint: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/trap`;
  }

  mapServerTrapToTrap = (trap: ServerTrap): Trap => {
    const { id, name, effect } = trap;
    const IS_DELETABLE = true; // hardcoded for now :-)
    return {
      id,
      name,
      effect,
      isDeletable: IS_DELETABLE,
    };
  };

  getList = async (): Promise<Trap[]> => {
    const response = await fetch(this.requestEndpoint);
    const responseJson = (await response.json()) as ServerTrap[];

    return responseJson.map((trap) => this.mapServerTrapToTrap(trap));
  };

  addSingle = async (
    trap: Pick<Trap, "name" | "effect">,
  ): Promise<{ entity: Trap | undefined; httpCode: number }> => {
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trap.name,
        effect: trap.effect,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerTrap;
      return {
        entity: this.mapServerTrapToTrap(responseJson),
        httpCode: response.status,
      };
    }
  };

  editSingle = async (
    trap: Trap,
  ): Promise<{ entity: Trap | undefined; httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${trap.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trap.name,
        effect: trap.effect,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as Trap;

      return {
        entity: responseJson,
        httpCode: response.status,
      };
    }
  };

  deleteSingle = async (id: string): Promise<{ httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${id}`, {
      method: "DELETE",
    });

    return {
      httpCode: response.status,
    };
  };
}
