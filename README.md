# Nested Fuzzy Search

[![npm version](https://badge.fury.io/js/nested-fuzzy-search.svg)](https://www.npmjs.com/package/nested-fuzzy-search)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

**Nested Fuzzy Search** is a lightweight and customizable JavaScript library for performing fuzzy search operations on deeply nested objects and arrays. By leveraging the Levenshtein distance algorithm, this package efficiently handles complex data structures and provides accurate similarity-based results.

## Features

- Recursive search through nested objects and arrays.
- Fuzzy matching using the Levenshtein distance algorithm.
- Customizable similarity threshold.
- Easy integration with JavaScript and TypeScript projects.
- Lightweight and dependency-free.

## Installation

Install the package via npm:

```bash
npm install nested-fuzzy-search
```

## Usage

### Importing the Package

Using ES6 imports:

```javascript
import { search } from "nested-fuzzy-search";
```

### Example with Object

Here’s how you can use `nested-fuzzy-search` to perform a fuzzy search on a nested object:

```javascript
import { search } from "nested-fuzzy-search";

const data = {
  id: 1,
  name: "Root Level",
  details: {
    created: "2024-12-10",
    modified: "2024-12-10",
    meta: {
      tags: ["root", "nested", "example"],
      author: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
    },
  },
  children: [
    {
      id: 2,
      name: "Level 2 - A",
      type: "Category",
      attributes: {
        visibility: "public",
        tags: ["level2", "category"],
      },
    },
  ],
};

const query = "John";
const threshold = 0.5; // Minimum similarity score

const results = search(data, query, {
  threshold,
});

console.log(results);
```

### Output

```javascript
[{ path: ".details.meta.author.name", value: "John Doe", score: 0.5 }];
```

### Example with Array

Here’s an example using `nested-fuzzy-search` with a deeply nested array:

```javascript
import { search } from "nested-fuzzy-search";

const deeplyNestedArray = [
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

const query = "Leaf";
const threshold = 0.3;

const results = search(deeplyNestedArray, query, {
  threshold,
  outputMode: "tree",
});

console.log(results);
```

### Output

```javascript
[
  {
    index: 0,
    originalData: {
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
    matches: [
      {
        path: "[0].children[0].children[0].value",
        value: "Data at level 3",
        score: 0.4666666666666667,
      },
    ],
  },
];
```

### Nested Array with outputMode: `flat`

```javascript
const query = "Leaf";
const threshold = 0.3;

const results = search(deeplyNestedArray, query, {
  threshold,
  outputMode: "flat",
});

console.log(results);
```

### Output

```javascript
[
  {
    path: "[0].children[0].children[0].value",
    value: "Data at level 3",
    score: 0.4666666666666667,
  },
];
```

- CodeSandbox: [Live](https://codesandbox.io/p/sandbox/sdrf7z?file=%2Fsrc%2FApp.js)

## API

### `search(data, query, options)`

Performs a fuzzy search on the provided nested data.

#### Parameters:

- **`data`**: The nested object or array to search.
- **`query`**: The search string.
- **`options`**: { threshold: The minimum similarity score (default: `0.6`), outputMode: The type of output you want (default: `flat`) }.

#### Returns:

An array of results, each containing:

- `path`: The path to the matched value.
- `value`: The matched string.
- `score`: The similarity score.

### How it Works

1. The library flattens the nested structure into a list of paths and string values.
2. It calculates the similarity score between the query and each string value using the Levenshtein distance.
3. Results with scores above the threshold are returned, sorted by relevance.

## Testing

Run unit tests using Jest:

```bash
npm test
```

## Contributing

Contributions are welcome! If you’d like to improve this package, please:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for efficient and customizable fuzzy search in complex datasets.
- Leverages the Levenshtein distance algorithm for similarity scoring.

## Support

If you encounter any issues or have questions, feel free to open an [issue](https://github.com/Asuraking1n/nested-fuzzy-search/issues) on GitHub.

## Connect

- GitHub: [<img src="https://img.shields.io/badge/-GitHub-white?style=social&logo=github&logoColor=black"  height="30"/>](https://github.com/Asuraking1n)
- LinkedIn: [<img src="https://img.shields.io/badge/-LinkedIn-white?style=social&logo=linkedin&logoColor=blue"  height="30"/>](https://www.linkedin.com/in/nishant-kumar-tiwari-253a46196/)

---

Happy Searching! 🚀
