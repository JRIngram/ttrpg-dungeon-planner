import { DungeonId } from "@/types/dungeon";

type ExportType = "json" | "markdown";

export class DungeonExporter {
  readonly requestEndpoint: string;

  constructor() {
    this.requestEndpoint = `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_PORT}/dungeonPlanner/dungeon`;
  }

  isSuccessfulHTTPCode = (responseCode: number) => {
    const stringifiedResponseCode = `${responseCode}`;
    return (
      !stringifiedResponseCode.startsWith("4") &&
      !stringifiedResponseCode.startsWith("5")
    );
  };

  buildExportEndpoint = (id: DungeonId, exportType: ExportType) =>
    `${this.requestEndpoint}/${id}/export/${exportType}`;

  exportJson = async (id: DungeonId) => {
    const exportUrl = this.buildExportEndpoint(id, "json");

    const response = await fetch(exportUrl);
    const isSuccessful = this.isSuccessfulHTTPCode(response.status);
    console.log("hi");

    if (isSuccessful) {
      const a = document.createElement("a");
      a.href = this.buildExportEndpoint(id, "json");
      a.click();
    }

    const a = document.createElement("a");
    a.href = this.buildExportEndpoint(id, "json");
    a.click();

    return isSuccessful;
  };
}
