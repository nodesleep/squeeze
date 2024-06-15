import fs from "fs";
import path from "path";
import CleanCSS from "clean-css";

const staticDir = path.join(__dirname, "../src/static");
const minifiedDir = path.join(staticDir, "minified");

// Function to compress CSS content
const compressCSS = (cssContent: string): string => {
	return new CleanCSS().minify(cssContent).styles;
};

// Minify CSS files in the static directory
const minifyCSSFiles = () => {
	if (!fs.existsSync(minifiedDir)) {
		fs.mkdirSync(minifiedDir);
	}
	fs.readdirSync(staticDir).forEach((file) => {
		if (file.endsWith(".css")) {
			const filePath = path.join(staticDir, file);
			const cssContent = fs.readFileSync(filePath, "utf-8");
			const compressedCSS = compressCSS(cssContent);
			const minifiedFilePath = path.join(minifiedDir, file);
			fs.writeFileSync(minifiedFilePath, compressedCSS, "utf-8");
			console.log(`Minified: ${file}`);
		}
	});
};

minifyCSSFiles();
