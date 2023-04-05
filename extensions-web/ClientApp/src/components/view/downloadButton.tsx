import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { Extension } from "../../data/extension";

export const DownloadButton = ({ extensions }: { extensions: Extension[] }) => {


    const items: MenuProps['items'] = extensions.map((t) => {
        return {
            key: t.extension.target,
            label: t.extension.target,
        }
    });

    if (extensions.length <= 1) {
        return (
            <Button size="small" type="primary" href={extensions[0].packagePath}>Download <DownloadOutlined /></Button>
        );
    } else {
        return (
            <Dropdown.Button
                type="primary"
                size="small"
                icon={<DownOutlined />}
                title="Versions" menu={{
                    items,
                    selectable: true,
                }}>Download</Dropdown.Button>
        );
    }
}