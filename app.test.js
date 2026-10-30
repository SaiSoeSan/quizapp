const request = require("supertest");
const app = require("./app");

describe("GET /", () => {
  it("returns the API status", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Quiz App API is running!",
    });
  });
});
