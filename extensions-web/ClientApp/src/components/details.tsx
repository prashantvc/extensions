import { Divider, Dropdown, MenuProps, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IExtension, Extension } from '../data/extension';
import { ExtensionPackage } from '../data/extensionPackage';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { PackageList } from './packageList';

const { Text } = Typography;


const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [uniqueVersions, setUniqueVersions] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Extension | undefined>(undefined); // [1
  const [selectedVeresion, setSelectedVersion] = useState<string>(version ?? '');
  const [readme, setReadme] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const packageDetails = await getExtensionDetails(identifier, version);
        setUniqueVersions(packageDetails.uniqueVersions);

        if (version !== undefined) {
          const response = await fetch(packageDetails.extention(version)?.readmePath ?? '');
          const fileContent = await response.text();
          setReadme(fileContent);
          setSelectedPackage(packageDetails.extention(version));
        }

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [identifier, version]);

  //get unique values
  const items: MenuProps['items'] = uniqueVersions
    .map((v) => {
      return {
        key: v,
        label: `v${v}`,
      }
    });

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === selectedVeresion) {
      return;
    }
    setSelectedVersion(key);
    navigate(`/details/${identifier}/${key}`);
  };

  const packageList = selectedPackage === undefined ? [] : [selectedPackage];

  return (
    <div style={{ margin: '24px' }}>
      <PackageList datasource={packageList} />
      <Divider />
      <Space direction="horizontal">
        <Text>Version(s):</Text>
        <Dropdown.Button title="Versions" menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [version!],
          onClick
        }}>v{version}</Dropdown.Button>
      </Space>
      <Divider />
      <div className='markdown-body'>
        <ReactMarkdown children={readme} remarkPlugins={[remarkGfm]} skipHtml={true} />
      </div>
    </div>
  );
}

async function getExtensionDetails(identifier: string | undefined,
  version: string | undefined) {
  const response = await fetch(`extension/${identifier}/${version}`);
  const data: IExtension[] = await response.json();
  return new ExtensionPackage(identifier!, version!, data);
}

export default DetailsPage;
