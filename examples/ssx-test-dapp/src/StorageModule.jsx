import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';

function StorageModule() {
  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [viewingList, setViewingList] = useState(true);

  const handleGetContent = (content) => {
    setSelectedContent(content);
    setName(content.name);
    setText(content.text);
    setViewingList(false);
  };

  const handleDeleteContent = (content) => {
    setContentList((prevList) => prevList.filter((c) => c !== content));
    setSelectedContent(null);
    setName('');
    setText('');
  };

  const handlePostContent = () => {
    if (selectedContent) {
      setContentList((prevList) =>
        prevList.map((c) => (c === selectedContent ? { name, text } : c))
      );
      setSelectedContent(null);
    } else {
      setContentList((prevList) => [...prevList, { name, text }]);
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
            {contentList.length === 0 ? (
              <Button onClick={handlePostNewContent}>Post new content</Button>
            ) : (
              contentList.map((content) => (
                <div key={content.name}>
                  <span>{content.name}</span>
                  <Button onClick={() => handleGetContent(content)}>Get</Button>
                  <Button onClick={() => handleDeleteContent(content)}>
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="View-pane">
            <h3>View/Edit/Post Pane</h3>
            <Input
              type="text"
              label="Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              label="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
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