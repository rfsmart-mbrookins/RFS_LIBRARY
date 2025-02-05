import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Base URL */
const baseURL = "http://localhost:8000";

/* Workflow Test - retrieve last 3 books, reverse order, save artifact */
test("Workflow", async ({ request }) => {
  const response = await request.get(`${baseURL}/api/books`, {
    ignoreHTTPSErrors: true,
  });
  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  // Reverse order and select last 3 books
  const reversedBooks = [...responseBody].reverse();
  const last3Books = reversedBooks.slice(0, 3);
  console.log("Last 3 books:", last3Books);

  // Save last 3 books as an artifact
  const artifactDir = path.resolve(__dirname, "Artifacts");
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir);
  }
  const artifactPath = path.resolve(artifactDir, "last3Books.json");
  fs.writeFileSync(artifactPath, JSON.stringify(last3Books, null, 2));

  console.log(`Last 3 books saved to ${artifactPath}`);

  // Validate saved data
  const savedBooks = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  savedBooks.forEach((book) => {
    expect(book).toHaveProperty("id");
    expect(book).toHaveProperty("title");
    expect(book).toHaveProperty("author");
    expect(book).toHaveProperty("genre");
    expect(book).toHaveProperty("status");
  });
});
