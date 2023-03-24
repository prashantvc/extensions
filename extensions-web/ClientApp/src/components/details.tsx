import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { NavLink, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { IPackage, PackageWrapper } from '../data/package';
import { Avatar, Button, Divider, List, Space, Tag, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [readme, setReadme] = useState('');
  const [packageInfo, setPackageInfo] = useState<PackageWrapper[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const packageData = await getExtensionDetails(identifier, version);
        const response = await fetch(`${packageData?.extensionPath}/extension/README.md`);
        const text = await response.text();
        setPackageInfo([packageData]);
        setLoading(false);
        setReadme(text);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [identifier, version]);

  return (
    <div style={{ margin: '24px' }}>
      <List itemLayout="horizontal" dataSource={packageInfo}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button size="middle" type="primary" href={item.packagePath} icon={<DownloadOutlined />}>Download</Button>
            ]}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size={{  lg: 80, xl: 80, xxl: 80 }}
                  shape="square" src={item.iconPath} />
              }
              title={
                <Space align="baseline">
                  <h4>{item.displayName}</h4>
                  <Text type="secondary">{item.extensionPackage.identifier}</Text>
                  <Tag>v{item.extensionPackage.version}</Tag>
                </Space>
              }
              description={item.description}
            />
          </List.Item>
        )
        }
      />
      <Divider orientation='left'>Description</Divider>
      <div>
        <ReactMarkdown children={readme} remarkPlugins={[remarkGfm]} skipHtml={true}/>
      </div>
    </div>
  );
};

async function getExtensionDetails(identifier: string | undefined,
  version: string | undefined) {
  const response = await fetch(`extension/${identifier}/${version}`);
  const data: IPackage = await response.json();
  return new PackageWrapper(data);
}

export default DetailsPage;
