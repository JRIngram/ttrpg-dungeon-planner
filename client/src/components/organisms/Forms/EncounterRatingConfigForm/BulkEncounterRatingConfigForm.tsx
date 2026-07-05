import { EncounterRatingConfigRow, AddOrEditEncounterRatingConfigRow } from "@/types/configs";
import { EncounterRatingService } from "@/services/EncounterRatingService/EncounterRatingService";
import { ButtonRow } from "@/components/molecules/ButtonRow/ButtonRow";
import { useState } from "react";
import { useToastsDispatch } from "@/context/ToastContext";
import { ToastType } from "@/types/toast";

type Props = {
  configs: EncounterRatingConfigRow[];
  onSubmitCallback: () => void;
  onCancelCallback: () => void;
};

export const BulkEncounterRatingConfigForm = ({
  configs,
  onSubmitCallback,
  onCancelCallback,
}: Props) => {
  const [formConfigs, setFormConfigs] = useState<AddOrEditEncounterRatingConfigRow[]>(() =>
    configs.map((config) => ({
      id: config.id,
      level: config.level,
      easy: config.easy,
      medium: config.medium,
      hard: config.hard,
      extreme: config.extreme,
    }))
  );
  const toastsDispatch = useToastsDispatch();

  const handleFieldChange = (index: number, field: keyof AddOrEditEncounterRatingConfigRow, value: string) => {
    setFormConfigs((prev) => {
      const newConfigs = [...prev];
      const config = { ...newConfigs[index] };
      
      if (field === "level") {
        config.level = parseInt(value) || 0;
      } else if (field === "easy") {
        config.easy = parseInt(value) || 0;
      } else if (field === "medium") {
        config.medium = parseInt(value) || 0;
      } else if (field === "hard") {
        config.hard = parseInt(value) || 0;
      } else if (field === "extreme") {
        config.extreme = parseInt(value) || 0;
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
        level: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        extreme: 0,
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
      if (config.level < 0) {
        return { valid: false, message: "Level must be a positive integer." };
      }
      if (config.easy < 0) {
        return { valid: false, message: "Easy threshold must be a positive integer." };
      }
      if (config.medium < 0) {
        return { valid: false, message: "Medium threshold must be a positive integer." };
      }
      if (config.hard < 0) {
        return { valid: false, message: "Hard threshold must be a positive integer." };
      }
      if (config.extreme < 0) {
        return { valid: false, message: "Extreme threshold must be a positive integer." };
      }
      if (config.easy >= config.medium) {
        return { valid: false, message: "Easy threshold must be less than Medium threshold." };
      }
      if (config.medium >= config.hard) {
        return { valid: false, message: "Medium threshold must be less than Hard threshold." };
      }
      if (config.hard >= config.extreme) {
        return { valid: false, message: "Hard threshold must be less than Extreme threshold." };
      }
    }

    for (let i = 0; i < formConfigs.length; i++) {
      for (let j = i + 1; j < formConfigs.length; j++) {
        if (formConfigs[i].level === formConfigs[j].level) {
          return { valid: false, message: `Duplicate level found: ${formConfigs[i].level}` };
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
          message: validation.message || "Please fix validation errors.",
          type: ToastType.WARNING,
        },
      });
      return;
    }

    const dataFetcher = new EncounterRatingService();
    
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
        level: config.level,
        easy: config.easy,
        medium: config.medium,
        hard: config.hard,
        extreme: config.extreme,
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
          message: "Successfully updated all encounter rating configs",
          type: ToastType.SUCCESS,
        },
      });
    }
  };

  return (
    <>
      <p>Edit all encounter rating configs below. Submit to save all changes at once.</p>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-primary-50">
              <th className="p-2 border-b text-left">Level</th>
              <th className="p-2 border-b text-left">Easy Threshold</th>
              <th className="p-2 border-b text-left">Medium Threshold</th>
              <th className="p-2 border-b text-left">Hard Threshold</th>
              <th className="p-2 border-b text-left">Extreme Threshold</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formConfigs.map((config, index) => (
              <tr key={config.id} className="border-b">
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.level}
                    onChange={(e) => handleFieldChange(index, "level", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.easy}
                    onChange={(e) => handleFieldChange(index, "easy", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.medium}
                    onChange={(e) => handleFieldChange(index, "medium", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.hard}
                    onChange={(e) => handleFieldChange(index, "hard", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
                  />
                </td>
                <td className="p-2 border-r">
                  <input
                    type="number"
                    value={config.extreme}
                    onChange={(e) => handleFieldChange(index, "extreme", e.target.value)}
                    className="w-full p-1 border"
                    min="0"
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
