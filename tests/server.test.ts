// tests/server.test.ts
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import fs from "fs";
import http from "http";

const routesDir = path.join(__dirname, "../src/routes");
const staticDir = path.join(__dirname, "../src/static");
const serverPath = path.join(__dirname, "../src/server.ts");

let server: ChildProcessWithoutNullStreams;

const waitForServerToStart = async (): Promise<void> => {
	return new Promise((resolve) => {
		server.stdout.on("data", (data: Buffer) => {
			if (data.toString().includes("Server is running on port")) {
				resolve();
			}
		});
	});
};

const makeRequest = (
	options: http.RequestOptions,
	postData?: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const req = http.request(options, (res) => {
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				resolve(data);
			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		if (postData) {
			req.write(postData);
		}
		req.end();
	});
};

beforeAll(async () => {
	server = spawn("ts-node", [serverPath]);
	await waitForServerToStart();
});

afterAll(() => {
	server.kill();
});

describe("GET /", () => {
	it("should serve compressed index.html", async () => {
		const response = await makeRequest({
			hostname: "localhost",
			port: 3000,
			path: "/",
			method: "GET",
		});

		expect(response).toContain("<!doctype html>");
	});
});

describe("POST /:filename", () => {
	it("should serve compressed HTML files from routes directory", async () => {
		const testFileName = "test.html";
		const testFilePath = path.join(routesDir, testFileName);
		fs.writeFileSync(testFilePath, "<html><body>Test</body></html>");

		const response = await makeRequest({
			hostname: "localhost",
			port: 3000,
			path: `/${path.basename(testFileName, ".html")}`,
			method: "POST",
		});

		expect(response).toBe("<html><body>Test</body></html>");

		fs.unlinkSync(testFilePath);
	});
});

describe("GET /static/:filename", () => {
	it("should serve static files from static directory", async () => {
		const testFileName = "test.css";
		const testFilePath = path.join(staticDir, testFileName);
		fs.writeFileSync(testFilePath, "body { color: red; }");

		const response = await makeRequest({
			hostname: "localhost",
			port: 3000,
			path: `/static/${testFileName}`,
			method: "GET",
		});

		expect(response).toBe("body { color: red; }");

		fs.unlinkSync(testFilePath);
	});
});
