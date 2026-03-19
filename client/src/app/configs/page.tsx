"use client";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import { useQuery } from "@tanstack/react-query";

export default function Configs() {
  const encounterMultiplierService = new EncounterMultiplierService();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["encounter-multiplier-service"],
    queryFn: () => {
      return encounterMultiplierService.getList();
    },
  });

  console.log({ data });

  return <p>Hello</p>;
}
