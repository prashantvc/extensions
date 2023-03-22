import { Avatar, Badge, Divider, List, Space, Switch } from "antd";
import React from "react";
import { Button, message, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from "antd/es/upload/interface";
import { IPackage, PackageWrapper } from "../data/package";

const { Text } = Typography;

export class Extensions extends React.Component<
    {},
    {
        packages: PackageWrapper[];
        loading: boolean;
        showPrerelease: boolean;
    }
> {

    static displayName = Extensions.name;

    onChange(info: UploadChangeParam) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            this.populateExtensions();
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    onSwitchChange = (checked: boolean) => {
        this.setState({ showPrerelease: checked }, () => {
            this.populateExtensions();
        });
    }

    constructor(props: any) {
        super(props);
        this.state = { packages: [], loading: true, showPrerelease: false };
    }

    public render() {
        return (
            <div>
                <Space align="center" size="large">
                    <Upload name="file" action="extension" onChange={this.onChange}>
                        <Button icon={<UploadOutlined />}>Upload Extension</Button>
                    </Upload>
                    <Space>
                        <Text>Show pre-release</Text>
                        <Switch onChange={this.onSwitchChange} />
                    </Space>
                </Space>
                <Divider />
                <List itemLayout="horizontal"
                    dataSource={this.state.packages}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <Button type="primary" href={item.packagePath}>Download</Button>
                            ]}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar shape="square" size="large" src={item.iconPath} />
                                }
                                title={
                                    <Space>
                                        {item.displayName}
                                        <Text type="secondary">{item.extensionPackage.identifier}</Text>
                                        <Badge
                                            className="site-badge-count-109"
                                            count={item.extensionPackage.version}
                                            style={{ backgroundColor: '#52c41a' }}
                                        />
                                    </Space>

                                }
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }

    componentDidMount(): void {
        this.populateExtensions();
    }

    async populateExtensions() {
        console.log("Populating extensions");
        this.setState({ loading: true })

        console.log(`extension?prerelease=${this.state.showPrerelease}`);
        const response = await fetch(`extension?prerelease=${this.state.showPrerelease}`);
        const extensionData: IPackage[] = await response.json();
        const packages = extensionData.map(p => new PackageWrapper(p))

        this.setState({ packages: packages, loading: false });
    }
}
