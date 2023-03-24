import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { IPackage, PackageWrapper } from '../data/package';
import { Divider } from 'antd';
import { PackageList } from './packageList';

const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [readme, setReadme] = useState('');
  const [packageInfo, setPackageInfo] = useState<PackageWrapper[]>();

  useEffect(() => {
    async function fetchData() {
      try {
        const packageData = await getExtensionDetails(identifier, version);
        const response = await fetch(`${packageData?.extensionPath}/extension/README.md`);
        const text = await response.text();
        setPackageInfo([packageData]);
        setReadme(text);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [identifier, version]);

  return (
    <div style={{ margin: '24px' }}>
      <PackageList datasource={packageInfo!} />
      <Divider/>
      <div className='markdown-body'>
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
