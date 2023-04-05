import { Avatar, List, Space, Tag, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { Extension } from "../data/extension";
import { ExtensionPackage } from "../data/extensionPackage";
import { DownloadButton } from "./view/downloadButton";

const { Text } = Typography;

// package list FC component
export const PackageList = ({ datasource, version }: { datasource: ExtensionPackage[] | undefined, version?: string }) => {

    const getDownloadItems = (items: Extension[]) => {
        if (version !== undefined) {
            return items.filter((item) => item.extension.version === version);
        }
        return items
    };

    return (
        <List itemLayout="horizontal"
            dataSource={datasource}
            renderItem={(item, index) => (
                <List.Item
                    actions={[
                        <DownloadButton extensions={getDownloadItems(item.extensions)} />
                    ]}>
                    <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={{ lg: 64, xl: 64, xxl: 64 }} src={item.mainExtension.iconPath} />
                        }
                        title={
                            <Space direction="vertical" size='small'>
                                <Space align="center">
                                    <NavLink to={`/details/${item.identifier}/${item.version}`}>
                                        {item.mainExtension.extension.displayName}
                                    </NavLink>
                                    <Tag>v{item.version}</Tag>
                                </Space>
                                <Text type="secondary">{item.identifier}</Text>
                            </Space>
                        }
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );
}