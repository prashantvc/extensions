import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { Extension } from "../../data/extension";

export const DownloadButton = ({ extensions }: { extensions: Extension[] }) => {
	const items: MenuProps["items"] = extensions.map((t) => {
		return {
			key: t.extension.target,
			label: t.extension.target,
		};
	});

	const onClick: MenuProps["onClick"] = ({ key }) => {
		var ext = extensions.find((t) => t.extension.target === key);
		if (ext) {
			window.open(ext.packagePath, "_blank");
			console.info(ext.packagePath);
		}
	};

	if (extensions.length === 1) {
		return (
			<Button size="small" type="primary" href={extensions[0].packagePath}>
				Download <DownloadOutlined />
			</Button>
		);
	} else {
		return (
			<Dropdown
				menu={{
					items,
					selectable: true,
					onClick,
				}}
			>
				<Button type="primary" size="small">
					<Space>
						Download
						<DownOutlined />
					</Space>
				</Button>
			</Dropdown>
		);
	}
};
