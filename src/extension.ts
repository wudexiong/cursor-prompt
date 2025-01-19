import * as vscode from 'vscode';

interface PromptItem {
    label: string;
    content: string;
}

// 预定义提示词
const DEFAULT_PROMPTS: PromptItem[] = [
    {
        label: "代码审查",
        content: "请帮我审查这段代码，关注以下几个方面：\n1. 性能优化空间\n2. 潜在的安全问题\n3. 代码规范性\n4. 可维护性"
    },
    {
        label: "重构建议",
        content: "请分析这段代码，并给出可能的重构建议，考虑：\n1. 代码结构优化\n2. 设计模式应用\n3. 命名规范\n4. 代码复用"
    },
    {
        label: "Bug 修复",
        content: "这段代码可能存在 bug，请帮我：\n1. 定位可能的问题\n2. 分析问题原因\n3. 提供修复方案\n4. 预防类似问题"
    },
    {
        label: "功能实现",
        content: "我需要实现一个新功能，请提供：\n1. 实现思路\n2. 关键步骤\n3. 注意事项\n4. 最佳实践"
    },
    {
        label: "性能优化",
        content: "请帮我优化这段代码的性能，考虑：\n1. 算法复杂度\n2. 资源使用\n3. 并发处理\n4. 缓存策略"
    },
    {
        label: "单元测试",
        content: "请为这段代码生成单元测试：\n1. 测试用例设计\n2. 边界条件\n3. 异常处理\n4. 测试覆盖率"
    }
];

async function simulateKeystrokes(text: string) {
    // 复制到剪贴板
    await vscode.env.clipboard.writeText(text);
    
    // 模拟按下 Ctrl+V (Windows) 或 Cmd+V (Mac)
    const platform = process.platform;
    if (platform === 'darwin') {
        await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', { text: '\x1b[D\x1b[A' });
        await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', { text: '\u0016' }); // Cmd+V
    } else {
        await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', { text: '\x1b[D\x1b[A' });
        await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', { text: '\u0016' }); // Ctrl+V
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Cursor Prompt extension is now active!');

    // 创建状态栏按钮
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        1000  // 高优先级，确保按钮显示在最右边
    );
    statusBarItem.text = "$(light-bulb) AI";
    statusBarItem.tooltip = "点击选择 AI 提示词";
    statusBarItem.command = 'cursor-prompt.showPromptMenu';
    statusBarItem.show();

    // 注册命令
    const disposable = vscode.commands.registerCommand('cursor-prompt.showPromptMenu', async () => {
        // 创建快速选择项
        const items = DEFAULT_PROMPTS.map(p => ({
            label: `$(light-bulb) ${p.label}`,
            description: p.content.split('\n')[0],
            detail: p.content.split('\n').slice(1).join('\n'),
            prompt: p
        }));

        // 显示快速选择菜单
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: '选择提示词模板',
            matchOnDescription: true,
            matchOnDetail: true
        });

        // 处理选择结果
        if (selected) {
            try {
                // 尝试直接模拟键盘输入
                await simulateKeystrokes(selected.prompt.content);
                vscode.window.showInformationMessage(`已插入提示词：${selected.prompt.label}`);
            } catch (error) {
                // 如果失败，回退到复制到剪贴板
                await vscode.env.clipboard.writeText(selected.prompt.content);
                vscode.window.showInformationMessage(`已复制提示词到剪贴板：${selected.prompt.label}，请手动粘贴`);
            }
        }
    });

    // 注册一个额外的命令用于直接插入最后一次选择的提示词
    const insertDisposable = vscode.commands.registerCommand('cursor-prompt.insertPrompt', async () => {
        const clipboardContent = await vscode.env.clipboard.readText();
        await simulateKeystrokes(clipboardContent);
    });

    context.subscriptions.push(statusBarItem, disposable, insertDisposable);
}

export function deactivate() {} 