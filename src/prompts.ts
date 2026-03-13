import * as p from "@clack/prompts";
import { validateProjectName } from "./utils.js";

export interface ProjectOptions {
	name: string;
	namespace: string;
	description: string;
}

export async function runPrompts(defaults?: Partial<ProjectOptions>): Promise<ProjectOptions> {
	p.intro("create-faststack-app");

	const name =
		defaults?.name ??
		((await p.text({
			message: "Project name",
			placeholder: "my-app",
			validate: (v) => validateProjectName(v),
		})) as string);

	if (p.isCancel(name)) process.exit(0);

	const namespace =
		defaults?.namespace ??
		((await p.text({
			message: "Package namespace",
			placeholder: `@${name}`,
			defaultValue: `@${name}`,
		})) as string);

	if (p.isCancel(namespace)) process.exit(0);

	const description =
		defaults?.description ??
		((await p.text({
			message: "Description",
			placeholder: "A fullstack React + FastAPI app",
			defaultValue: "A fullstack React + FastAPI app",
		})) as string);

	if (p.isCancel(description)) process.exit(0);

	return { name, namespace, description };
}
