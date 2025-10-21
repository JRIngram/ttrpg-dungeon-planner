import { ToastProps } from "@/components/molecules/Toast/Toast";
import { ToastType } from "@/types/toast";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { ToastList } from "./ToastList";

describe("ToastList", () => {
  it("displays each Toast within the Toast List", () => {
    render(
      <ToastList
        toastList={[
          {
            id: "1",
            message: "Test Toast One",
            type: ToastType.SUCCESS,
          },
          {
            id: "2",
            message: "Test Toast Two",
            type: ToastType.WARNING,
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(2);
  });
});
