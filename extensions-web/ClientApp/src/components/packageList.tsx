import { DownloadOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Space, Tag, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { PackageWrapper } from "../data/package";

const { Text } = Typography;

// package list FC component
export const PackageList = ({ datasource }: { datasource: PackageWrapper[] }) => {
    return (
        <List itemLayout="horizontal"
            dataSource={datasource}
            renderItem={(item, index) => (
                <List.Item
                    actions={[
                        <Button size="small" type="primary" href={item.packagePath} icon={<DownloadOutlined />}>Download</Button>
                    ]}>
                    <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={{ lg: 64, xl: 64, xxl: 64 }} src={item.iconPath} />
                        }
                        title={
                            <Space direction="vertical" size='small'>
                                <Space align="center">
                                    <NavLink to={`/details/${item.extensionPackage.identifier}/${item.extensionPackage.version}`}>
                                        {item.displayName}
                                    </NavLink>
                                    <Tag>v{item.extensionPackage.version}</Tag>
                                </Space>
                                <Text type="secondary">{item.extensionPackage.identifier}</Text>
                            </Space>
                        }
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );
}