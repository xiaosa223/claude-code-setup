# Claude Code Setup

在自己的终端使用官方 Claude Code：准备网络，用 `claude setup-token` 完成官方订阅授权，把 token 保存在本机，再进入项目开始工作。

## 安装 Skill

在支持 Agent Skills 的工具中安装：

```sh
DO_NOT_TRACK=1 npx --yes skills add xiaosa223/claude-code-setup --skill claude-code-setup --agent claude-code --global --copy --yes
```

Windows PowerShell：

```powershell
$env:DO_NOT_TRACK='1'
npx --yes skills add xiaosa223/claude-code-setup --skill claude-code-setup --agent claude-code --global --copy --yes
```

安装后在 Claude Code 输入 `/claude-code-setup`，让 AI 引导配置。使用其他支持该标准的工具时，按工具实际要求调整 `--agent`。

## 推荐路线

1. 使用已有可用线路；确实需要自建服务器时，再使用 Skill 内的分阶段 VPS 部署工具。
2. 安装并验证官方 Claude Code。
3. 在本机运行 `claude setup-token`，按官方页面完成授权。需要有效的 Claude 订阅。
4. 在自己的电脑保存 token，进入项目运行 `claude`。

Windows 提供随包的交互向导：[Configure.cmd](skills/claude-code-setup/windows/Configure.cmd)。下载仓库 ZIP 并完整解压后，运行该文件；token 用当前 Windows 用户 DPAPI 加密，不进入网页、聊天、普通配置 JSON 或全局环境变量。后续入口是 `StartClaude.cmd` 和 `CheckEnvironment.cmd`。

VPS 工具只在用户明确需要并授权修改目标服务器时执行。安装 Skill 不会自动部署 VPS，也不会读取或迁移现有 Claude 账号。

## 资源

| 服务 | 文案 | 链接 |
| --- | --- | --- |
| DMIT | VPS 服务器 · 返佣推广 | [查看](https://www.dmit.io/aff.php?aff=30283) |
| Webshare | 代理资源 · 返佣推广 | [查看](https://www.webshare.io/?referral_code=5hr8v0sunytu) |
| 代充站 | 低价源头代充 · 推广 | [xiaosa.win](https://xiaosa.win) |
| API 中转站 | 不降智稳定中转站 · 推广 | [api.lsidestudio.com](https://api.lsidestudio.com) |

商业入口与官方订阅认证分开，官方 token 只在本机使用。项目不接收账号密码或 token，不宣称本地检查能代替服务端认证。

## 验证与许可

运行 `python tools/validate.py` 检查包完整性、脚本语法及公开内容；该验证不连接服务器、不使用真实账号。Windows 向导的核心验证命令为 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File skills/claude-code-setup/windows/tests/Test-Core.ps1`。

本项目保留随包的 MIT 许可证和必要版权声明。公开仓库不包含 VPS 凭据、订阅、用户 token 或本机状态文件。
