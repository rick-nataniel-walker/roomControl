import { apiClient, installLoadingInterceptors } from "@/api/apiClient";
import { START_LOADING, STOP_LOADING } from "@/store/constants";

const successfulAdapter = (config) =>
  Promise.resolve({
    data: {},
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });

describe("apiClient loading interceptors", () => {
  let commits;
  let uninstall;

  beforeEach(() => {
    commits = [];
    uninstall = installLoadingInterceptors({
      commit: (mutation) => commits.push(mutation),
    });
  });

  afterEach(() => {
    uninstall();
  });

  it("starts and stops loading around a successful request", async () => {
    await apiClient.get("/test", { adapter: successfulAdapter });

    expect(commits).toEqual([START_LOADING, STOP_LOADING]);
  });

  it("stops loading when a request fails", async () => {
    const adapter = (config) => Promise.reject({ config, message: "Failed" });

    await expect(apiClient.get("/test", { adapter })).rejects.toMatchObject({
      message: "Failed",
    });
    expect(commits).toEqual([START_LOADING, STOP_LOADING]);
  });

  it("allows background requests to opt out", async () => {
    await apiClient.get("/test", {
      adapter: successfulAdapter,
      showSpinner: false,
    });

    expect(commits).toEqual([]);
  });
});
