import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL
const baseURL = "http://localhost:8000";

// Array to store broken endpoints
const brokenAPIEndpoints: string[] = [];

test("Broken API Endpoint", async ({ request }) => {
  const brokenEndpoint = "/api/broken_endpoint";
  const response = await request.get(`${baseURL}${brokenEndpoint}`);

  expect(response.status()).toBe(404);
  console.log(`${baseURL}${brokenEndpoint} Not Found!`);

  // Add the broken endpoint url
  brokenAPIEndpoints.push(`${baseURL}${brokenEndpoint}`);
});

// Save broken endpoints to an artifact
test.afterAll(() => {
  const artifactDir = path.resolve(__dirname, "Artifacts");

  // Create the directory if it doesn't exist
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const artifactPath = path.join(artifactDir, "brokenAPIEndpoints.json");
  fs.writeFileSync(artifactPath, JSON.stringify(brokenAPIEndpoints, null, 2));

  console.log(`Broken API endpoints saved to ${artifactPath}`);
  console.log("Broken endpoints:", brokenAPIEndpoints);
});
