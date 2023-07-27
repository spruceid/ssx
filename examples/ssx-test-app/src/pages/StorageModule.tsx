import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { SSX } from '@spruceid/ssx';

interface IStorageModule {
  ssx: SSX;
}

function StorageModule({ ssx }: IStorageModule) {
  const [contentList, setContentList] = useState<Array<string>>([]);
  const [credentialsList, setCredentialsList] = useState<Array<string>>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [viewingList, setViewingList] = useState<boolean>(true);
  const [allowPost, setAllowPost] = useState<boolean>(false);

  useEffect(() => {
    const getContentList = async () => {
      const { data } = await ssx.storage.list({ removePrefix: true });
      setContentList(data);
    };
    const getCredentialList = async () => {
      const { data } = await ssx.credentials?.list?.({ removePrefix: true });
      setCredentialsList(data);
    };
    getContentList();
    getCredentialList();
  }, [ssx]);

  const handleShareContent = async (content: string) => {
    const prefix = ssx.storage.prefix;
    const base64Content = await ssx.storage.generateSharingLink(
      `${prefix}/${content}`
    );
    const sharingLink = `${window.location.origin}/share?data=${base64Content}`;
    await navigator.clipboard.writeText(sharingLink);
  };

  const handleGetContent = async (content: string) => {
    const { data } = await ssx.storage.get(content);
    setAllowPost(true);
    setSelectedContent(content);
    setName(content);
    setText(data);
    setViewingList(false);
  };

  const handleDeleteContent = async (content: string) => {
    await ssx.storage.delete(content);
    setContentList(prevList => prevList.filter(c => c !== content));
    setSelectedContent(null);
    setName('');
    setText('');
  };

  const handlePostContent = async () => {
    // check for invalid key
    if (!name || !text || name.includes(' ')) {
      alert('Invalid key or text');
      return;
    }
    await ssx.storage.put(name, text);
    if (selectedContent) {
      setContentList(prevList =>
        prevList.map(c => (c === selectedContent ? name : c))
      );
      setSelectedContent(null);
    } else {
      setContentList(prevList => [...prevList, name]);
    }
    setName('');
    setText('');
    setViewingList(true);
  };

  const handlePostNewContent = (e: any) => {
    e.preventDefault();
    setSelectedContent(null);
    setName('');
    setText('');
    setViewingList(false);
  };

  const handleGetCredential = async (content: string) => {
    const { data } = await ssx.credentials.get(content);
    setAllowPost(false);
    setSelectedContent(content);
    setName(content);
    setText(data);
    setViewingList(false);
  };

  return (
    <div className="Content" style={{ marginTop: '30px' }}>
      <div className="storage-container Content-container">
        {viewingList ? (
          <div className="List-pane">
            <h3>List Pane</h3>
            {contentList.map(content => (
              <div className="item-container" key={content}>
                <span>{content}</span>
                <Button
                  className="smallButton"
                  onClick={() => handleGetContent(content)}>
                  Get
                </Button>
                <Button
                  className="smallButton"
                  onClick={() => handleDeleteContent(content)}>
                  Delete
                </Button>
                <Button
                  className="smallButton"
                  onClick={() => handleShareContent(content)}>
                  Share
                </Button>
              </div>
            ))}
            <Button onClick={handlePostNewContent}>Post new content</Button>
            <h3>Credentials List</h3>
            {credentialsList.map(content => (
              <div className="item-container" key={content}>
                <span>{content}</span>
                <Button
                  className="smallButton"
                  onClick={() => handleGetCredential(content)}>
                  Get
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="View-pane">
            <h3>View/Edit/Post Pane</h3>
            <Input label="Key" value={name} onChange={setName} />
            <Input label="Text" value={text} onChange={setText} />
            {
              allowPost ?
                <Button onClick={handlePostContent}>Post</Button> :
                null
            }
            <Button onClick={() => setViewingList(true)}>Back</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorageModule;
