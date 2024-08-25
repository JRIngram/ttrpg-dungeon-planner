import { describe, it, expect, vi } from "vitest";
import { ToastConfig, ToastType } from "@/types/toast";
import { render, screen } from "@testing-library/react";
import { Toast } from "./Toast";
import userEvent from "@testing-library/user-event";

const onCloseSpy = vi.fn();

describe("Toast", () => {
  it.each([
    [
      "Hello I am a erronous toast",
      ToastType.ERROR,
      "ERROR: Hello I am a erronous toast",
    ],
    [
      "Hello I am a successful toast",
      ToastType.SUCCESS,
      "SUCCESS: Hello I am a successful toast",
    ],
    [
      "Hello I am a warningful toast",
      ToastType.WARNING,
      "WARNING: Hello I am a warningful toast",
    ],
  ])(
    "Displays the passed text and correct prefix",
    (message, type, expected) => {
      render(<Toast message={message} type={type} onClose={() => {}} />);
      expect(screen.getByText(expected)).toBeVisible();
    }
  );

  it("calls onClose when close is pressed", async () => {
    render(
      <Toast
        message={"Hello I am a erronous toast"}
        type={ToastType.ERROR}
        onClose={onCloseSpy}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onCloseSpy).toHaveBeenCalledOnce();
  });
});
