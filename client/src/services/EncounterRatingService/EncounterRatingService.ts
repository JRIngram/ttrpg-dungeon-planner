import {
  AddOrEditEncounterRatingConfigRow,
  EncounterRatingConfigRow,
  ServerEncounterRatingConfigRow,
} from "@/types/configs";
import { DataFetcher } from "../DataFetcher/DataFetcher";

export class EncounterRatingService extends DataFetcher<EncounterRatingConfigRow> {
  readonly requestEndpoint: string;

  constructor() {
    super();
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/encounterRatingConfigRow`;
  }

  mapServerConfigToConfig = (
    config: ServerEncounterRatingConfigRow
  ): EncounterRatingConfigRow => {
    const { id, level, easy, medium, hard, extreme } = config;
    return {
      id,
      level,
      easy,
      medium,
      hard,
      extreme,
    };
  };

  getList = async (): Promise<EncounterRatingConfigRow[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as ServerEncounterRatingConfigRow[];

    const compareRows = (
      a: EncounterRatingConfigRow,
      b: EncounterRatingConfigRow,
    ) => {
      if (a.level < b.level) {
        return -1;
      } else if (a.level > b.level) {
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
    config: AddOrEditEncounterRatingConfigRow
  ): Promise<{ entity: EncounterRatingConfigRow | undefined; httpCode: number }> => {
    const response = await fetch(this.requestEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: config.level,
        easy: config.easy,
        medium: config.medium,
        hard: config.hard,
        extreme: config.extreme,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerEncounterRatingConfigRow;
      return {
        entity: this.mapServerConfigToConfig(responseJson),
        httpCode: response.status,
      };
    }
  };

  editSingle = async (
    config: AddOrEditEncounterRatingConfigRow
  ): Promise<{ entity: EncounterRatingConfigRow | undefined; httpCode: number }> => {
    const response = await fetch(`${this.requestEndpoint}/${config.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: config.id,
        level: config.level,
        easy: config.easy,
        medium: config.medium,
        hard: config.hard,
        extreme: config.extreme,
      }),
    });

    if (!this.isSuccessfulHTTPCode(response.status)) {
      return {
        entity: undefined,
        httpCode: response.status,
      };
    } else {
      const responseJson = (await response.json()) as ServerEncounterRatingConfigRow;
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
