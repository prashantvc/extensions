import { Divider, Space, Switch } from "antd";
import React, { Fragment } from "react";
import { Button, message, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload/interface";
import { Extension, IExtension } from "../data/extension";
import { PackageList } from "./packageList";
import { ExtensionPackage } from "../data/extensionPackage";

const { Text } = Typography;

export class Extensions extends React.Component<
	{},
	{
		extensions: ExtensionPackage[];
		loading: boolean;
		showPrerelease: boolean;
	}
> {
	static displayName = Extensions.name;

	onChange(info: UploadChangeParam) {
		if (info.file.status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === "done") {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	}

	onSwitchChange = (checked: boolean) => {
		this.setState({ showPrerelease: checked }, () => {
			this.populateExtensions();
		});
	};

	constructor(props: any) {
		super(props);
		this.state = { extensions: [], loading: true, showPrerelease: false };
	}

	public render() {
		return (
			<Fragment>
				<Space align="center" size="large">
					<Upload name="file" action="extension" onChange={this.onChange}>
						<Button icon={<PlusOutlined />}>Upload Extension</Button>
					</Upload>
					<Space>
						<Text>Show pre-release</Text>
						<Switch onChange={this.onSwitchChange} />
					</Space>
				</Space>
				<Divider />
				<PackageList datasource={this.state.extensions} />
			</Fragment>
		);
	}

	componentDidMount(): void {
		this.populateExtensions();
	}

	async populateExtensions() {
		console.log("Populating extensions");
		this.setState({ loading: true });

		const response = await fetch(`extension?prerelease=${this.state.showPrerelease}`);
		if (response.status === 204) {
			console.log(response);
			this.setState({ extensions: [], loading: false });
			return;
		}
		type res = { identifier: string; version: string; extensions: IExtension[] };
		const extensionResponse: [res] = await response.json();

		let uniqueExtensions = extensionResponse.reduce((acc: res[], curr: res) => {
			if (acc.find((p) => p.identifier === curr.identifier)) {
				return acc;
			}
			return [...acc, curr];
		}, []);

		console.info(uniqueExtensions);

		const localExtensions = uniqueExtensions.map(
			(p) => new ExtensionPackage(p.identifier, p.version, p.extensions)
		);
		this.setState({ extensions: localExtensions, loading: false });
	}
}
