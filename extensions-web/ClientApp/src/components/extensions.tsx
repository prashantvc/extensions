import { Divider, Space, Switch } from "antd";
import React from "react";
import { Button, message, Upload, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam } from "antd/es/upload/interface";
import { IPackage, PackageWrapper } from "../data/package";
import { PackageList } from "./packageList";

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
                        <Button icon={<PlusOutlined />}>Upload Extension</Button>
                    </Upload>
                    <Space>
                        <Text>Show pre-release</Text>
                        <Switch onChange={this.onSwitchChange} />
                    </Space>
                </Space>
                <Divider />
                <PackageList datasource={this.state.packages} />
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
