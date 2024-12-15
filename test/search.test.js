import { search } from "../src";

// Test data
const simpleNestedArray = [
  {
    id: 1,
    name: "Parent 1",
    children: [
      {
        id: 11,
        name: "Child 1.1",
        children: [
          {
            id: 111,
            name: "Sub-Child 1.1.1",
            value: "Data at level 3",
          },
        ],
      },
    ],
  },
];

const simpleNestedObject = {
  parent: {
    id: 1,
    name: "Parent 1",
    children: {
      child1: {
        id: 11,
        name: "Child 1.1",
        children: {
          subChild1: {
            id: 111,
            name: "Sub-Child 1.1.1",
            value: "Data at level 3",
          },
        },
      },
    },
  },
};

describe("Search Function Tests", () => {
  test('Search in deeply nested array for a query "level 3"', () => {
    const query = "level 3";
    const results = search(simpleNestedArray, query, {
      threshold: 0.3,
      outputMode: "tree",
    });

    // Check for at least one result in Parent 1
    expect(results.length).toBeGreaterThan(0);

    // Check the path and value
    expect(results[0].originalData.name).toBe("Parent 1");
    expect(results[0].matches[0].path).toBe(
      "[0].children[0].children[0].value"
    );
  });

  test('Search in nested object for a query "level 3"', () => {
    const query = "level 3";
    const results = search(simpleNestedObject, query, {
      threshold: 0.3,
    });

    // Check for at least one result in Parent 1
    expect(results.length).toBeGreaterThan(0);

    // Check the path and value
    expect(results[0].path).toBe(
      ".parent.children.child1.children.subChild1.value"
    );
    expect(results[0].value).toBe("Data at level 3");
  });
});
