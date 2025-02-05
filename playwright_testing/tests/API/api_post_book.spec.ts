import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Base URL */
const baseURL = "http://localhost:8000";

let lastBookAdded: any;

/* POST book */
test("API POST Request", async ({ request }) => {
  const response = await request.post(`${baseURL}/api/books`, {
    ignoreHTTPSErrors: true,
    data: {
      title: "The Coffee Table Book of Coffee Tables",
      author: "Cosmo Kramer",
      genre: "Comedy",
      status: "Available",
      notes: "A book about coffee tables, for coffee table enthusiasts.",
    },
  });
 
  expect(response.status()).toBe(201);

 
  const jsonResponse = await response.json();

  // Validate the response
  expect(jsonResponse).toHaveProperty("title", "The Coffee Table Book of Coffee Tables");
  expect(jsonResponse).toHaveProperty("author", "Cosmo Kramer");
  expect(jsonResponse).toHaveProperty("genre", "Comedy");
  expect(jsonResponse).toHaveProperty(
    "notes",
    "A book about coffee tables, for coffee table enthusiasts."
  );


  lastBookAdded = jsonResponse;

  console.log(jsonResponse);
});

// Save the last added book to artifact
test.afterAll(() => {
  const artifactDir = path.resolve(__dirname, "Artifacts");

  // Create the directory if it doesn't exist.
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const artifactPath = path.join(artifactDir, "lastBookAdded.json");
  fs.writeFileSync(artifactPath, JSON.stringify(lastBookAdded, null, 2));

  console.log(`Book added saved to ${artifactPath}`);
});
