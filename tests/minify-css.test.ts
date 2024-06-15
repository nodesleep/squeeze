import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const staticDir = path.join(__dirname, "../src/static");
const minifiedDir = path.join(staticDir, "minified");

describe("CSS Minification", () => {
	beforeAll(() => {
		// Create test CSS files
		if (!fs.existsSync(staticDir)) {
			fs.mkdirSync(staticDir);
		}
		fs.writeFileSync(
			path.join(staticDir, "test.css"),
			"body { color: red; }"
		);
		fs.writeFileSync(
			path.join(staticDir, "test2.css"),
			"p { font-size: 16px; }"
		);
	});

	afterAll(() => {
		// Clean up test CSS files
		fs.unlinkSync(path.join(staticDir, "test2.css"));
		if (fs.existsSync(minifiedDir)) {
			fs.readdirSync(minifiedDir).forEach((file) =>
				fs.unlinkSync(path.join(minifiedDir, file))
			);
			fs.rmdirSync(minifiedDir);
		}
	});

	it("should minify CSS files", () => {
		// Run the minify script
		execSync("npm run minify-css");

		// Check if minified files are created
		const minifiedFiles = fs.readdirSync(minifiedDir);
		expect(minifiedFiles).toContain("test2.css");

		// Check if the contents are minified
		const minifiedContent2 = fs.readFileSync(
			path.join(minifiedDir, "test2.css"),
			"utf-8"
		);

		expect(minifiedContent2).toBe("p{font-size:16px}");
	});
});
