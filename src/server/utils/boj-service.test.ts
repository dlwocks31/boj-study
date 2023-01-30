import { BojService } from "./boj-service";

describe("BojService", () => {
  describe("getProblem", () => {
    it("should return problem", async () => {
      const problem = await new BojService().fetchProblem(1000);
      expect(problem).toEqual({
        id: 1000,
        title: "A+B",
      });
    });
  });
});
