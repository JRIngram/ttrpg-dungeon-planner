import { EncounterRatingConfigRow } from "@/types/configs";

export class EncounterRatingService {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/encounterRatingConfigRow`;
  }

  isSuccessfulHTTPCode = (responseCode: number) => {
    const stringifiedResponseCode = `${responseCode}`;
    return (
      !stringifiedResponseCode.startsWith("4") &&
      !stringifiedResponseCode.startsWith("5")
    );
  };

  getList = async (): Promise<EncounterRatingConfigRow[]> => {
    const response = await fetch(this.requestEndpoint);
    const json = (await response.json()) as EncounterRatingConfigRow[];

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

    return json.sort(compareRows);
  };
}
