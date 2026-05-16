import type { Meta, StoryObj } from "@storybook/react";
import { EncounterRatingPill, EncounterRating } from "./EncounterRatingPill";

const meta = {
  title: "Components/Atoms/EncounterRatingPill",
  component: EncounterRatingPill,
  parameters: {},
  tags: ["autodocs"],
} satisfies Meta<typeof EncounterRatingPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trivial: Story = {
  args: {
    rating: "trivial",
  },
};

export const Easy: Story = {
  args: {
    rating: "easy",
  },
};

export const Medium: Story = {
  args: {
    rating: "medium",
  },
};

export const Hard: Story = {
  args: {
    rating: "hard",
  },
};

export const Extreme: Story = {
  args: {
    rating: "extreme",
  },
};

export const Unavailable: Story = {
  args: {
    rating: "unavailable",
  },
};
