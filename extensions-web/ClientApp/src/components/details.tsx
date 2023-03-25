
import { Dropdown, MenuProps, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IPackage, PackageWrapper } from '../data/package';
import { PackageDetails } from '../data/packageDetails';

const DetailsPage = () => {
  const { identifier, version } = useParams<{ identifier: string, version: string }>();
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVeresion, setSelectedVersion] = useState<string>(version ?? '');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const packageDetails = await getExtensionDetails(identifier, version);
        setVersions(packageDetails.versions);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [identifier, version]);

  const items: MenuProps['items'] = versions.map((v) => {
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

  return (
    <div style={{ margin: '24px' }}>
      <Dropdown.Button menu={{
        items,
        selectable: true,
        defaultSelectedKeys: [version!],
        onClick
      }}>
        v{version}
      </Dropdown.Button>

      <h1>{identifier}</h1>
      <h2>{version}</h2>
    </div>
  );
}

async function getExtensionDetails(identifier: string | undefined,
  version: string | undefined) {
  const response = await fetch(`extension/${identifier}/${version}`);
  const data: IPackage[] = await response.json();
  return new PackageDetails(identifier!, version!, data);
}

export default DetailsPage;
