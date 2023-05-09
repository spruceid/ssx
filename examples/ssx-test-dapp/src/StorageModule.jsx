import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Button from './components/Button'
const init = [
  { name: 'test1', text: 'test1' },
  { name: 'test2', text: 'test2' },
  { name: 'test3', text: 'test3' },
]

function StorageModule({ ssx }) {
  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [viewingList, setViewingList] = useState(true);

  useEffect(() => {
    const getContentList = async () => {
      const { data } = await ssx.storage.list();
      setContentList(data);
    };
    getContentList();
  }, [ssx]);


  const handleGetContent = async (content) => {
    const { data } = await ssx.storage.get(content);
    console.log(data);
    setSelectedContent(content);
    setName(content);
    setText(data);
    setViewingList(false);
  };

  const handleDeleteContent = async (content) => {
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

  const handlePostNewContent = (e) => {
    e.preventDefault();
    // e.target.va
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
              type="text"
              label="Key"
              value={name}
              onChange={setName}
            />
            <Input
              type="text"
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