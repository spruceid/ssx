import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button'
import { SSX } from '@spruceid/ssx';

interface IStorageModule {
  ssx: SSX;
}

function StorageModule({ ssx }: IStorageModule) {
  const [contentList, setContentList] = useState<Array<string>>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [viewingList, setViewingList] = useState<boolean>(true);

  useEffect(() => {
    const getContentList = async () => {
      const { data } = await ssx.storage.list();
      setContentList(data.map((d: string) => {
        const contentArr = d.split('/');
        contentArr.shift(); // remove the prefix
        return contentArr.join('/');
      }));
    };
    getContentList();
  }, [ssx]);


  const handleGetContent = async (content: string) => {
    const { data } = await ssx.storage.get(content);
    setSelectedContent(content);
    setName(content);
    setText(data);
    setViewingList(false);
  };

  const handleDeleteContent = async (content: string) => {
    await ssx.storage.delete(content);
    setContentList((prevList) => prevList.filter((c) => c !== content));
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
      setContentList((prevList) =>
        prevList.map((c) => (c === selectedContent ? name : c))
      );
      setSelectedContent(null);
    } else {
      setContentList((prevList) => [...prevList, name]);
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

  return (
    <div className="Content" style={{ marginTop: '30px' }}>
      <div className="storage-container Content-container">
        {viewingList ? (
          <div className="List-pane">
            <h3>List Pane</h3>
            {contentList.map((content) => (
              <div className="item-container" key={content}>
                <span>{content}</span>
                <Button className="smallButton" onClick={() => handleGetContent(content)}>Get</Button>
                <Button className="smallButton" onClick={() => handleDeleteContent(content)}>
                  Delete
                </Button>
              </div>
            ))}
            <Button onClick={handlePostNewContent}>Post new content</Button>
          </div>
        ) : (
          <div className="View-pane">
            <h3>View/Edit/Post Pane</h3>
            <Input
              label="Key"
              value={name}
              onChange={setName}
            />
            <Input
              label="Text"
              value={text}
              onChange={setText}
            />
            <Button onClick={handlePostContent}>Post</Button>
            <Button onClick={() => setViewingList(true)}>Back</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorageModule;