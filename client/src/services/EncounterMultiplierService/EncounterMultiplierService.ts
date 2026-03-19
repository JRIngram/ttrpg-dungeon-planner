import { EncounterMultiplierConfigRow } from "@/types/configs";
import { Room, UpsertRoom } from "@/types/room";

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
    const json = await response.json();
    return json;
  };
}
