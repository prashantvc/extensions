import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm'
import { IPackage, PackageWrapper } from '../data/package';

const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [readme, setReadme] = useState('');
  useEffect(() => {
    getExtensionDetails(identifier, version).then(data => {
      fetch(`${data?.extensionPath}/extension/Readme.md`)
        .then(response => response.text())
        .then(text => setReadme(text));
    });
  }, []);

  return (
    <div style={{ margin: '24px' }}>
      <ReactMarkdown children={readme} remarkPlugins={[remarkGfm]} />
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
