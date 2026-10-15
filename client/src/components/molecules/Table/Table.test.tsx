import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";

import Meta, { Default, WithNullValues } from "./Table.stories";
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

describe("ConfigTable", () => {
  it("renders all header labels", () => {
    render(
      <Table
        configs={testConfigs}
        headers={[
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
          { key: "enabled", label: "Enabled" },
        ]}
        keyField="id"
      />,
    );

    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByText("Value")).toBeVisible();
    expect(screen.getByText("Enabled")).toBeVisible();
  });

  it("renders all config rows", () => {
    render(
      <Table
        configs={testConfigs}
        headers={[
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
          { key: "enabled", label: "Enabled" },
        ]}
        keyField="id"
      />,
    );

    expect(screen.getByText("Config 1")).toBeVisible();
    expect(screen.getByText("Config 2")).toBeVisible();
    expect(screen.getByText("100")).toBeVisible();
  });

  it("renders null values as 'null'", () => {
    render(
      <Table
        configs={testConfigs}
        headers={[
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
          { key: "enabled", label: "Enabled" },
        ]}
        keyField="id"
      />,
    );

    expect(screen.getByText("null")).toBeVisible();
  });

  it("only displays fields that match headers", () => {
    render(
      <Table
        configs={testConfigs}
        headers={[
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
          { key: "enabled", label: "Enabled" },
        ]}
        keyField="id"
      />,
    );

    // The config objects have id, name, value, enabled, and extraField
    // But only name, value, enabled are in headers, so extraField should not be rendered
    expect(screen.queryByText("should not appear")).not.toBeInTheDocument();
  });

  it("renders empty table when configs is empty", () => {
    render(
      <Table
        configs={[]}
        headers={[
          { key: "name", label: "Name" },
          { key: "value", label: "Value" },
        ]}
        keyField="id"
      />,
    );

    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByText("Value")).toBeVisible();
    expect(screen.queryByText("Config 1")).not.toBeInTheDocument();
  });
});
