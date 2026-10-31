import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

async function enterWorld(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("游客昵称"), "小满");
  await user.click(screen.getByRole("button", { name: "进入我的动物世界" }));
}

describe("personalized animal world app", () => {
  it("offers three local login styles and enters the world", async () => {
    const user = userEvent.setup();
    render(<App search="?visit=habitat" />);

    expect(
      screen.getByRole("button", { name: "选择入园门票风格" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "选择饲养员工作证风格" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "选择极简头像风格" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "选择饲养员工作证风格" }),
    );
    await enterWorld(user);

    expect(screen.getByText("小满的动物世界")).toBeInTheDocument();
    expect(screen.getByText("栗栗", { selector: "h1" })).toBeInTheDocument();
  });

  it("adds a preset animal from the library", async () => {
    const user = userEvent.setup();
    render(<App search="?visit=habitat" />);
    await enterWorld(user);

    await user.click(screen.getByRole("button", { name: "添加动物" }));
    await user.click(screen.getByRole("button", { name: "添加糯糯" }));
    expect(screen.getByRole("button", { name: "已添加糯糯" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "关闭动物库" }));

    expect(
      screen.getByRole("button", { name: "切换到糯糯" }),
    ).toBeInTheDocument();
  });

  it("opens an animal detail and keeps its daily progress independent", async () => {
    const user = userEvent.setup();
    render(<App search="?visit=habitat" />);
    await enterWorld(user);

    await user.click(screen.getByRole("button", { name: "切换到阿呜" }));
    await user.click(screen.getByRole("button", { name: "进入阿呜的世界" }));

    expect(
      screen.getByRole("heading", { name: "阿呜", level: 1 }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "轻轻摸一下" }));
    expect(
      screen.getByRole("meter", { name: "阿呜的喂养值" }),
    ).toHaveAttribute("aria-valuenow", "1");

    await user.click(screen.getByRole("button", { name: "给阿呜投喂" }));
    const drawer = screen.getByRole("dialog", { name: "给阿呜投喂" });
    await user.click(within(drawer).getByRole("button", { name: /鸡肉块/ }));

    expect(
      screen.getByRole("meter", { name: "阿呜的喂养值" }),
    ).toHaveAttribute("aria-valuenow", "5");
  });

  it("adds a page-local calendar appointment", async () => {
    const user = userEvent.setup();
    render(<App search="?visit=habitat" />);
    await enterWorld(user);

    await user.click(screen.getByRole("button", { name: "打开日历" }));
    expect(
      await screen.findByRole("heading", { name: "日历" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "新建" }));

    const dialog = screen.getByRole("dialog", { name: "添加日历事项" });
    await user.type(within(dialog).getByLabelText("标题"), "再来看栗栗");
    await user.click(within(dialog).getByRole("button", { name: "保存到日历" }));

    expect(screen.getAllByText("再来看栗栗").length).toBeGreaterThan(0);
  });

  it("shows locked coupons for every animal", async () => {
    const user = userEvent.setup();
    render(<App search="?visit=habitat" />);
    await enterWorld(user);

    await user.click(screen.getByRole("button", { name: "打开我的券包" }));
    expect(
      await screen.findByRole("heading", { name: "我的券包" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("未解锁")).toHaveLength(3);
  });

  it("remembers a park QR and opens its animal after local login", async () => {
    const user = userEvent.setup();
    render(<App search="?animal=preset-fox" />);

    expect(screen.getByText("登录后直接去见小焰")).toBeInTheDocument();
    await enterWorld(user);

    expect(
      screen.getByRole("heading", { name: "小焰", level: 1 }),
    ).toBeInTheDocument();
  });
});
