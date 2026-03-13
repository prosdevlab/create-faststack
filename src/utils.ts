import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function toKebabCase(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[\s_]+/g, "-")
		.toLowerCase();
}

export function validateProjectName(name: string): string | undefined {
	if (!name) return "Project name is required";
	if (!/^[a-z0-9@][a-z0-9-._~/]*$/.test(name)) {
		return "Invalid project name. Use lowercase letters, numbers, and hyphens.";
	}
	return undefined;
}

export function detectPnpmVersion(): string {
	try {
		return execSync("pnpm --version", { encoding: "utf-8" }).trim();
	} catch {
		return "10.28.0";
	}
}

export function resolveTemplateDir(): string {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return path.resolve(__dirname, "..", "templates", "base");
}

export function hasCommand(cmd: string): boolean {
	try {
		execSync(`command -v ${cmd}`, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}
