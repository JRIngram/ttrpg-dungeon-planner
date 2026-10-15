import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

type TestConfig = {
  id: number;
  name: string;
  value: number | null;
  enabled: boolean;
  extraField: string;
};

const testConfigs: TestConfig[] = [
  {
    id: 1,
    name: "Config 1",
    value: 100,
    enabled: true,
    extraField: "should not appear",
  },
  {
    id: 2,
    name: "Config 2",
    value: null,
    enabled: false,
    extraField: "should not appear",
  },
];

const meta = {
  title: "Components/Molecules/ConfigTable",
  component: Table,
  parameters: {},
  tags: ["autodocs"],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ConfigTableArgs<T> = {
  configs: T[];
  headers: { key: keyof T; label: string }[];
  title: string;
  keyField: keyof T;
};

export const Default: Story = {
  args: {
    configs: testConfigs,
    headers: [
      { key: "name", label: "Name" } as const,
      { key: "value", label: "Value" } as const,
      { key: "enabled", label: "Enabled" } as const,
    ],
    title: "Test Configurations",
    keyField: "id",
  } as ConfigTableArgs<TestConfig>,
};

export const EmptyTable: Story = {
  args: {
    configs: [],
    headers: [
      { key: "name", label: "Name" } as const,
      { key: "value", label: "Value" } as const,
      { key: "enabled", label: "Enabled" } as const,
    ],
    title: "Empty Configurations",
    keyField: "id",
  } as ConfigTableArgs<TestConfig>,
};

export const WithNullValues: Story = {
  args: {
    configs: testConfigs,
    headers: [
      { key: "name", label: "Name" } as const,
      { key: "value", label: "Value" } as const,
    ],
    title: "Configurations with Limited Fields",
    keyField: "id",
  } as ConfigTableArgs<TestConfig>,
};
