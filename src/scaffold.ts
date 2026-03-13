import fs from "node:fs";
import path from "node:path";
import { resolveTemplateDir } from "./utils.js";

interface ScaffoldOptions {
	targetDir: string;
	vars: Record<string, string>;
	force?: boolean;
}

export function scaffold({ targetDir, vars, force }: ScaffoldOptions): void {
	if (fs.existsSync(targetDir) && !force) {
		const entries = fs.readdirSync(targetDir);
		if (entries.length > 0) {
			throw new Error(`Directory "${path.basename(targetDir)}" already exists and is not empty.`);
		}
	}

	const templateDir = resolveTemplateDir();
	copyDir(templateDir, targetDir, vars);

	// Make husky hooks executable on non-Windows
	if (process.platform !== "win32") {
		const huskyDir = path.join(targetDir, ".husky");
		if (fs.existsSync(huskyDir)) {
			for (const file of fs.readdirSync(huskyDir)) {
				const filePath = path.join(huskyDir, file);
				if (fs.statSync(filePath).isFile()) {
					fs.chmodSync(filePath, 0o755);
				}
			}
		}
	}
}

function copyDir(src: string, dest: string, vars: Record<string, string>): void {
	fs.mkdirSync(dest, { recursive: true });

	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const srcPath = path.join(src, entry.name);
		let destName = entry.name;

		if (entry.isDirectory()) {
			copyDir(srcPath, path.join(dest, destName), vars);
			continue;
		}

		const isTmpl = destName.endsWith(".tmpl");
		if (isTmpl) {
			destName = destName.slice(0, -5);
		}

		const destPath = path.join(dest, destName);

		if (isTmpl) {
			let content = fs.readFileSync(srcPath, "utf-8");
			for (const [key, value] of Object.entries(vars)) {
				content = content.replaceAll(`{{${key}}}`, value);
			}
			fs.writeFileSync(destPath, content);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}
