import React from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    vscode: any;
  }
}

const vscode = window.vscode;

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid var(--vscode-input-border);
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--vscode-focusBorder);
  }
`;

const PromptList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PromptCard = styled.div`
  padding: 12px;
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--vscode-list-hoverBackground);
  }
`;

const PromptTitle = styled.h3`
  margin: 0 0 8px 0;
  color: var(--vscode-foreground);
`;

const PromptContent = styled.p`
  margin: 0;
  color: var(--vscode-descriptionForeground);
  font-size: 0.9em;
`;

const App: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [prompts] = React.useState([
    { id: 1, title: '代码审查', content: '请帮我审查这段代码，关注性能和安全性问题' },
    { id: 2, title: '重构建议', content: '分析这段代码，给出可能的重构建议' },
    { id: 3, title: 'Bug 修复', content: '这段代码有一个 bug，请帮我找出问题所在' },
  ]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // 发送消息给 VSCode
    vscode.postMessage({
      type: 'copy',
      value: content
    });
  };

  return (
    <Container>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="搜索提示词..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </SearchBar>
      
      <PromptList>
        {prompts
          .filter(prompt => 
            prompt.title.toLowerCase().includes(searchText.toLowerCase()) ||
            prompt.content.toLowerCase().includes(searchText.toLowerCase())
          )
          .map(prompt => (
            <PromptCard
              key={prompt.id}
              onClick={() => handleCopy(prompt.content)}
            >
              <PromptTitle>{prompt.title}</PromptTitle>
              <PromptContent>{prompt.content}</PromptContent>
            </PromptCard>
          ))}
      </PromptList>
    </Container>
  );
};

export default App; 