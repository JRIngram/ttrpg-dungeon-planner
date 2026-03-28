import { EncounterMultiplierConfigRow } from "@/types/configs";

export class EncounterMultiplierService {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/encounterMultiplierConfigRow`;
  }

  isSuccessfulHTTPCode = (responseCode: number) => {
    const stringifiedResponseCode = `${responseCode}`;
    return (
      !stringifiedResponseCode.startsWith("4") &&
      !stringifiedResponseCode.startsWith("5")
    );
  };

  getList = async (): Promise<EncounterMultiplierConfigRow[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as EncounterMultiplierConfigRow[];

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

    return json.sort(compareRows);
  };
}
