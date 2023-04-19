import { Command } from "commander";
import * as fs from "fs";
import * as url from "url";
import axios from "axios";
import https from "https";

export const extensionCommand = new Command("extension");
const FormData = require("form-data");

extensionCommand
	.command("add")
	.description("Upload an extension to a private extension repository")
	.argument("file", "The extension file to upload")
	.argument("url", "A valid private extension repository URL")
	.action(addExtension);

async function addExtension(file: string, urlString: string) {
	const filePath = file.replace("~", process.env.HOME!);
	if (!fs.existsSync(filePath)) {
		console.error(`File '${filePath}' does not exist.`);
		return;
	}

	const parsedUrl = url.parse(urlString);
	if (!parsedUrl.protocol || !parsedUrl.hostname) {
		console.log(`${urlString} is invalid, please provide a valid URL with protocol and hostname.`);
		return;
	}

	urlString = `${url.format(parsedUrl)}extension`;
	await uploadFile(filePath, urlString);
}

async function uploadFile(file: string, urlString: string) {
	let data = new FormData();
	let fstream = fs.createReadStream(file);
	data.append("file", fstream);

	const agent = new https.Agent({
		rejectUnauthorized: false,
	});

	let config = {
		method: "POST",
		maxBodyLength: Infinity,
		url: urlString,
		data: data,
		headers: {
			...data.getHeaders(),
		},
		httpsAgent: agent,
	};
	try {
		const response = await axios.request(config);
		if (response.status === 200) {
			console.log(`Extension uploaded successfully.`);
		}
	} catch (err) {
		console.error("\n Upload failed");
	}
}

//"extension" "add" "~/downloads/Egeye.or-vs-demo-1.0.0.vsix" "http://private-extensions.azurewebsites.net/"
