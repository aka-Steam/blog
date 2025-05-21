import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TagsBlock } from "./index";

// Моки для Material-UI компонентов
jest.mock("@mui/material/Skeleton", () => ({ width }) => (
  <div data-testid="skeleton" style={{ width }} />
));

jest.mock("@mui/icons-material/Tag", () => () => <div>TagIcon</div>);

describe("TagsBlock Component", () => {
  const mockTags = ["react", "javascript", "redux", "testing", "frontend"];

  it("корректно отображает состояние загрузки", () => {
    render(<TagsBlock isLoading={true} />);

    // Проверяем, что отображаются 5 скелетонов (по умолчанию)
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons).toHaveLength(5);
    expect(skeletons[0]).toHaveStyle("width: 50px");

    // Проверяем, что отображаются иконки тегов
    const tagIcons = screen.getAllByText("TagIcon");
    expect(tagIcons).toHaveLength(5);
  });

  it("корректно отображает теги, когда они НЕ в состоянии загрузки", () => {
    render(
      <MemoryRouter>
        <TagsBlock items={mockTags} isLoading={false} />
      </MemoryRouter>
    );

    // Проверяем, что отображаются все теги
    mockTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });

    // Проверяем, что ссылки имеют правильные href
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(mockTags.length);
    expect(links[0]).toHaveAttribute("href", "/tags/react");
    expect(links[1]).toHaveAttribute("href", "/tags/javascript");
  });

  it("отображает правильное количество тегов", () => {
    const testTags = ["one", "two"];
    render(
      <MemoryRouter>
        <TagsBlock items={testTags} isLoading={false} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link")).toHaveLength(testTags.length);
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("не отображает скелет, когда теги НЕ в состоянии загрузки", () => {
    render(
      <MemoryRouter>
        <TagsBlock items={mockTags} isLoading={false} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });

  it("корректно отображается с пустым массивом тегов", () => {
    render(
      <MemoryRouter>
        <TagsBlock items={[]} isLoading={false} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("использует default isLoading prop", () => {
    render(<TagsBlock items={mockTags} />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(5);
  });
});