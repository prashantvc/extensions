import { Command } from "commander";
import * as url from "url";

const PRIVATE_EXTENSION_REPOSITORY = "PRIVATE_EXTENSION_REPOSITORY";

export const repoCommand = new Command("repo");
const setRepoCommand = new Command("set")
	.description("Add a new private extension repository")
	.argument("<url>", "A valid private extension repository URL")
	.action(setRepository);

repoCommand
	.command("show")
	.description("Shows all active private extension repositories details")
	.action(showRepositoryDetails);

repoCommand.addCommand(setRepoCommand);

async function setRepository(urlString: string) {
	const parsedUrl = url.parse(urlString);
	if (!parsedUrl.protocol || !parsedUrl.hostname) {
		console.log("Invalid URL, please provide a valid URL with protocol and hostname.");
		setRepoCommand.outputHelp();
		return;
	}

	process.env[PRIVATE_EXTENSION_REPOSITORY] = urlString;
}

function showRepositoryDetails() {
	const url = process.env[PRIVATE_EXTENSION_REPOSITORY];
	if (!url) {
		console.error("No active private extension repository, use 'repo set' to add one.\n");
		setRepoCommand.outputHelp();
		return;
	}
	console.log(`Active repository: ${process.env[PRIVATE_EXTENSION_REPOSITORY]}`);
}
