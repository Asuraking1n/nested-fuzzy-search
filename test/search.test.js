import { search } from "../src";

describe("search function", () => {
  it("should return correct search results", () => {
    const data = {
      id: 1,
      name: "Root Level",
      children: [
        {
          id: 2,
          name: "Level 2 - A",
          type: "Category",
          child: {
            name: "John Doe",
          },
        },
      ],
    };
    const query = "John Doe";
    const results = search(data, query, 0.2);

    expect(results).toEqual([
      { path: ".children[0].child.name", value: "John Doe", score: 1 },
      { path: ".name", value: "Root Level", score: 0.30000000000000004 },
    ]);
  });
});
