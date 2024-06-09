import { render, screen } from "@testing-library/react";
import { composeStory } from "@storybook/react";
import { describe, it, expect } from "vitest";
import Meta, { Primary } from "./NavBar.stories";

describe("NavBar", () => {
  it("renders the NavBar with links", () => {
    const NavBar = composeStory(Primary, Meta);
    const links = [
      {
        name: "Dungeons",
        href: "/dungeons",
      },
      {
        name: "Monsters",
        href: "/monsters",
      },
      {
        name: "Traps",
        href: "/trap",
      },
    ];
    render(<NavBar />);
    links.forEach((link) => {
      const accessibileLink = screen.getByRole("link", { name: link.name });
      expect(accessibileLink).toBeVisible();
      expect(accessibileLink).toHaveAttribute("href", link.href);
    });
  });
});
