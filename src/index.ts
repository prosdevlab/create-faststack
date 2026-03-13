import path from "node:path";
import { Command } from "commander";
import { postInstall } from "./post-install.js";
import { runPrompts } from "./prompts.js";
import { scaffold } from "./scaffold.js";
import { detectPnpmVersion, toKebabCase, validateProjectName } from "./utils.js";

const program = new Command()
	.name("create-faststack-app")
	.description("Scaffold a pnpm monorepo with React 19 + FastAPI + Turbo + Biome + Docker")
	.argument("[project-name]", "Name for the new project")
	.option("--namespace <namespace>", "Package namespace (e.g. @myapp)")
	.option("--description <description>", "Project description")
	.option("--no-install", "Skip pnpm install")
	.option("--no-git", "Skip git init")
	.option("--force", "Overwrite existing directory")
	.action(async (projectName?: string) => {
		const opts = program.opts<{
			namespace?: string;
			description?: string;
			install: boolean;
			git: boolean;
			force?: boolean;
		}>();

		const options = await runPrompts({
			name: projectName ? toKebabCase(projectName) : undefined,
			namespace: opts.namespace,
			description: opts.description,
		});

		const error = validateProjectName(options.name);
		if (error) {
			console.error(`Error: ${error}`);
			process.exit(1);
		}

		const targetDir = path.resolve(process.cwd(), options.name);
		const pnpmVersion = detectPnpmVersion();

		scaffold({
			targetDir,
			vars: {
				PROJECT_NAME: options.name,
				NAMESPACE: options.namespace,
				DESCRIPTION: options.description,
				PNPM_VERSION: pnpmVersion,
			},
			force: opts.force,
		});

		postInstall({
			targetDir,
			projectName: options.name,
			skipInstall: !opts.install,
			skipGit: !opts.git,
		});
	});

program.parse();
