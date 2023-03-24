import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { IPackage, PackageWrapper } from '../data/package';

const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [readme, setReadme] = useState('');

  useEffect(() => {
    const getReadme = async () => {
      const packageData = await getExtensionDetails(identifier, version);
      const readmeResponse = await fetch(`${packageData?.extensionPath}/extension/Readme.md`);
      const readmeText = await readmeResponse.text();
      setReadme(readmeText);
    };
    getReadme();
  }, [identifier, version]);

  return (
    <div style={{ margin: '24px' }}>
      <ReactMarkdown children={readme} remarkPlugins={[remarkGfm]} />
    </div>
  );
};

async function getExtensionDetails(identifier: string | undefined, version: string | undefined) {
  const response = await fetch(`extension/${identifier}/${version}`);
  const data: IPackage = await response.json();
  return new PackageWrapper(data);
}

export default DetailsPage;
