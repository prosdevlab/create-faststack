import { execSync } from "node:child_process";
import * as p from "@clack/prompts";
import { hasCommand } from "./utils.js";

interface PostInstallOptions {
	targetDir: string;
	projectName: string;
	skipInstall: boolean;
	skipGit: boolean;
}

export function postInstall({
	targetDir,
	projectName,
	skipInstall,
	skipGit,
}: PostInstallOptions): void {
	if (!skipGit) {
		if (hasCommand("git")) {
			execSync("git init", { cwd: targetDir, stdio: "ignore" });
			p.log.success("Initialized git repository");
		} else {
			p.log.warning("git not found — skipping git init");
		}
	}

	if (!skipInstall) {
		if (!hasCommand("pnpm")) {
			p.log.step("pnpm not found — installing via npm...");
			try {
				execSync("npm install -g pnpm", { stdio: "inherit" });
				p.log.success("pnpm installed");
			} catch {
				p.log.error("Failed to install pnpm. Install manually: https://pnpm.io/installation");
				return;
			}
		}

		p.log.step("Installing dependencies with pnpm...");
		execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });
		p.log.success("Dependencies installed");
	}

	p.note(
		[
			`cd ${projectName}`,
			"",
			"# Copy and edit environment variables",
			"cp .env.example .env",
			"",
			"# Start development",
			"pnpm dev",
			"",
			"# Frontend: http://localhost:5173",
			"# Backend:  http://localhost:8000",
			"",
			"Note: Docker handles Python deps automatically on first `pnpm dev`.",
		].join("\n"),
		"Next steps",
	);

	p.outro("Happy building!");
}
