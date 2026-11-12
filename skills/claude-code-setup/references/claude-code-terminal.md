# Claude Code 终端配置

推荐路线：已有或自建网络 → 官方 Claude Code → `claude setup-token` → 本机保存 → 在项目中运行 `claude`。

## 先确定运行环境

问清用户实际使用 Windows 原生终端、WSL、macOS 还是 Linux。Windows 与 WSL 的代理、凭据和配置独立，不能把一边检测通过当成另一边通过。已有可用网络时不要求购买 VPS 或代理；只有用户需要部署自己的服务器时，才执行 SKILL.md 中的服务器流程。

## Windows：使用随包向导

包内入口为 `windows/Configure.cmd`。用户明确请求配置后，用可见的交互终端打开它；不要在无人交互的后台捕获 token 输出。向导依次执行环境检查、线路确认、本机 HTTP/混合代理或 TUN 检测、官方 CLI 安装/版本核验、长期 token 输入及加密保存，并创建桌面入口。

官方生成命令是 `claude setup-token`（中间有连字符），需要有效的 Claude 订阅。用户在自己的电脑完成浏览器授权，token 只在本机终端输入；不要向用户索要 token 发到聊天中，也不要录制、截图、回显或上传授权终端。

token 用当前 Windows 用户 DPAPI 加密，向导只向本次 CLI 进程注入 `CLAUDE_CODE_OAUTH_TOKEN`。不写全局环境变量，不把 token 放入 Git、普通 JSON 或命令参数。同用户进程与管理员不构成绝对隔离边界。已有认证、API key、代理或自定义配置目录发生冲突时先列字段名，不展示值、不擅自覆盖。

完成后运行 `windows/StartClaude.cmd`，选择项目目录；再次检查用 `windows/CheckEnvironment.cmd`。保存成功只证明本地配置完成，必须由用户在官方 Claude Code 内核对账号与真实请求。403、限流、网络失败要保留实际错误，不直接推断账号被封。

## macOS / Linux

先只读运行 `claude --version` 与 `claude setup-token --help`，缺失 CLI 时使用目标平台的官方安装方式。请用户在自己的终端执行 `claude setup-token`。按平台实际密钥库或私密文件能力保护 token，仅向当前启动的 `claude` 子进程传入认证，不能把 Windows DPAPI 方案用于其他系统，也不要使用 `setx` 或写入全局 shell 配置作为默认做法。

项目级配置、MCP 与子工具可能有自己的认证或网络行为。启动前出口检查不能保证整个会话始终使用同一路线；未经实际测试，不声称故障阻断、DNS 无泄漏或账号可用已通过。

## 商业资源与认证分开

资源页的代充站和 API 中转站是独立商业入口。`setup-token` 产生的是官方订阅 token，不是中转 API key；不要把它粘贴到代充站、中转站或 CLIProxyAPI。用户单独选择中转时再按该服务提供的真实文档配置独立的 API 认证，不伪造接口或自动切换现有认证。
