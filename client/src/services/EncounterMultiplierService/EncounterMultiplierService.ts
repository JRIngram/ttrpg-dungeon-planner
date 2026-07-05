import {
  AddOrEditEncounterMultiplierConfigRow,
  EncounterMultiplierConfigRow,
  ServerEncounterMultiplierConfigRow,
} from "@/types/configs";
import { DataFetcher } from "../DataFetcher/DataFetcher";

export class EncounterMultiplierService extends DataFetcher<EncounterMultiplierConfigRow> {
  readonly requestEndpoint: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/encounterMultiplierConfigRow`;
  }

  mapServerConfigToConfig = (
    config: ServerEncounterMultiplierConfigRow
  ): EncounterMultiplierConfigRow => {
    const { id, min, max, multiplier } = config;
    return {
      id,
      min,
      max,
      multiplier,
    };
  };

  getList = async (): Promise<EncounterMultiplierConfigRow[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as ServerEncounterMultiplierConfigRow[];

    const compareRows = (
      a: EncounterMultiplierConfigRow,
      b: EncounterMultiplierConfigRow,
    ) => {
      if (a.min < b.min) {
        return -1;
      } else if (a.min > b.min) {
        return 1;
      } else {
        return 0;
      }
    };

    return json
      .map((config) => this.mapServerConfigToConfig(config))
      .sort(compareRows);
  };

  addSingle = async (
    config: AddOrEditEncounterMultiplierConfigRow
  ): Promise<{ entity: EncounterMultiplierConfigRow | undefined; httpCode: number }> => {
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        min: config.min,
        max: config.max,
        multiplier: config.multiplier,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerEncounterMultiplierConfigRow;
      return {
        entity: this.mapServerConfigToConfig(responseJson),
        httpCode: response.status,
      };
    }
  };

  editSingle = async (
    config: AddOrEditEncounterMultiplierConfigRow
  ): Promise<{ entity: EncounterMultiplierConfigRow | undefined; httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${config.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: config.id,
        min: config.min,
        max: config.max,
        multiplier: config.multiplier,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerEncounterMultiplierConfigRow;
      return {
        entity: this.mapServerConfigToConfig(responseJson),
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
