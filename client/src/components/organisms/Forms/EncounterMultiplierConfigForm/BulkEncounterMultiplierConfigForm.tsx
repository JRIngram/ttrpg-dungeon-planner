import { EncounterMultiplierConfigRow, AddOrEditEncounterMultiplierConfigRow } from "@/types/configs";
import { EncounterMultiplierService } from "@/services/EncounterMultiplierService/EncounterMultiplierService";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useState } from "react";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  configs: EncounterMultiplierConfigRow[];
  onSubmitCallback: () => void;
  onCancelCallback: () => void;
};

export const BulkEncounterMultiplierConfigForm = ({
  configs,
  onSubmitCallback,
  onCancelCallback,
}: Props) => {
  const [formConfigs, setFormConfigs] = useState<AddOrEditEncounterMultiplierConfigRow[]>(() =>
    configs.map((config) => ({
      id: config.id,
      min: config.min,
      max: config.max,
      multiplier: config.multiplier,
    }))
  );
  const toastsDispatch = useToastsDispatch();

  const handleFieldChange = (index: number, field: keyof AddOrEditEncounterMultiplierConfigRow, value: string) => {
    setFormConfigs((prev) => {
      const newConfigs = [...prev];
      const config = { ...newConfigs[index] };
      
      if (field === "min") {
        config.min = parseInt(value) || 0;
      } else if (field === "max") {
        config.max = value ? parseInt(value) : null;
      } else if (field === "multiplier") {
        config.multiplier = parseFloat(value) || 0;
      }
      
      newConfigs[index] = config;
      return newConfigs;
    });
  };

  const addNewRow = () => {
    const ids = formConfigs.map(c => c.id as number);
    const newId = (ids.length > 0 ? Math.min(...ids) : 0) - 1;
    setFormConfigs((prev) => [
      ...prev,
      {
        id: newId,
        min: 0,
        max: null,
        multiplier: 1,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (formConfigs.length <= 1) return;
    const configToRemove = formConfigs[index];
    
    if (configToRemove.id !== undefined && configToRemove.id > 0) {
      toastsDispatch({
        type: "add",
        toast: {
          message: "Cannot remove existing database rows. Only newly added rows can be removed before saving.",
          type: ToastType.WARNING,
        },
      });
      return;
    }
    
    setFormConfigs((prev) => {
      const newConfigs = [...prev];
      newConfigs.splice(index, 1);
      return newConfigs;
    });
  };

  const validateInputs = (): { valid: boolean; message?: string } => {
    for (const config of formConfigs) {
      if (config.min < 0) {
        return { valid: false, message: "Min must be a positive integer." };
      }
      if (config.max !== null && config.max < 0) {
        return { valid: false, message: "Max must be a positive integer or empty." };
      }
      if (config.multiplier <= 0) {
        return { valid: false, message: "Multiplier must be greater than 0." };
      }
      if (config.max !== null && config.min > config.max) {
        return { valid: false, message: "Min cannot be greater than Max." };
      }
    }

    for (let i = 0; i < formConfigs.length; i++) {
      for (let j = i + 1; j < formConfigs.length; j++) {
        const a = formConfigs[i];
        const b = formConfigs[j];
        
        if (a.max === null && b.max === null) {
          return { valid: false, message: "Only one config can have an unlimited max (null)." };
        }
        
        if (a.max === null) {
          if (b.min <= a.min) {
            return { valid: false, message: `Config with Min=${a.min} (no max) overlaps with row ${j + 1}.` };
          }
        } else if (b.max === null) {
          if (a.min <= b.min) {
            return { valid: false, message: `Config with Min=${b.min} (no max) overlaps with row ${i + 1}.` };
          }
        } else {
          if (a.min <= b.max && b.min <= a.max) {
            return { valid: false, message: `Rows ${i + 1} and ${j + 1} have overlapping ranges.` };
          }
        }
      }
    }

    return { valid: true };
  };

  const submitForm = async () => {
    const validation = validateInputs();
    if (!validation.valid) {
      toastsDispatch({
        type: "add",
        toast: {
          message: validation.message || "Please fix validation errors before submitting",
          type: ToastType.WARNING,
        },
      });
      return;
    }

    const dataFetcher = new EncounterMultiplierService();
    
    const existingConfigs = formConfigs.filter(c => c.id && c.id > 0);
    const newConfigs = formConfigs.filter(c => c.id && c.id < 0);
    
    let allSuccessful = true;
    let lastHttpCode = 200;
    
    for (const config of existingConfigs) {
      const { httpCode } = await dataFetcher.editSingle(config);
      if (!dataFetcher.isSuccessfulHTTPCode(httpCode)) {
        allSuccessful = false;
        lastHttpCode = httpCode;
      }
    }
    
    for (const config of newConfigs) {
      const { httpCode } = await dataFetcher.addSingle({
        min: config.min,
        max: config.max,
        multiplier: config.multiplier,
      });
      if (!dataFetcher.isSuccessfulHTTPCode(httpCode)) {
        allSuccessful = false;
        lastHttpCode = httpCode;
      }
    }

    if (!allSuccessful) {
      toastsDispatch({
        type: "add",
        toast: {
          message: `Could not update configs. HTTP ${lastHttpCode}`,
          type: ToastType.WARNING,
        },
      });
    } else {
      onSubmitCallback();
      toastsDispatch({
        type: "add",
        toast: {
          message: "Successfully updated all encounter multiplier configs",
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      <p>Edit all encounter multiplier configs below. Submit to save all changes at once.</p>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-primary-50">
              <th className="p-2 border-b text-left">Min Monsters</th>
              <th className="p-2 border-b text-left">Max Monsters</th>
              <th className="p-2 border-b text-left">Multiplier</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formConfigs.map((config, index) => (
              <tr key={config.id} className="border-b">
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.min}
                    onChange={(e) => handleFieldChange(index, "min", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.max ?? ""}
                    onChange={(e) => handleFieldChange(index, "max", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                    placeholder="null"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.multiplier}
                    onChange={(e) => handleFieldChange(index, "multiplier", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                    step="0.1"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={config.id !== undefined && config.id > 0}
                    title={config.id !== undefined && config.id > 0 ? "Cannot remove existing database rows" : "Remove row"}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-2">
        <button
          onClick={addNewRow}
          className="px-4 py-2 bg-primary-200 text-white rounded hover:bg-primary-300"
        >
          + Add Row
        </button>
        <div className="mt-2">
          <ButtonRow
            buttons={[
              {
                text: "Save All",
                onClick: submitForm,
                variant: "primaryFilled",
              },
              {
                text: "Cancel",
                onClick: onCancelCallback,
                variant: "tertiaryOutline",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};
