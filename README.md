# ChatLambert

ChatLambert 是一个纯前端静态大语言模型对话网站，使用 OpenAI API 兼容格式接口（默认适配 Qwen 兼容模式）。本项目不依赖任何后端服务器，可直接部署为静态网页。
全代码由ChatGPT生成。

---

## 项目特性

- 纯 HTML + JS + CSS 实现
- 使用 OpenAI API 兼容格式
- 支持上下文控制
- 支持 temperature 参数调节
- 页面顶部实时显示 API 余额
- 固定系统 Prompt，AI 自称“兰教授”
- 对理科问题全知全能
- 对文科问题明确拒答

---

## 目录结构

ChatLambert/
│
├── index.html
├── app.js
├── style.css
└── README.md

---

## 系统 Prompt 设计说明

发送请求时包含固定 system prompt：

- 自称兰教授
- 精通理科
- 不回答文科问题
- 明确拒绝文科提问

该 Prompt 直接写入前端 JS 中。

---

## API 配置

在 app.js 中修改：

```
const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const MODEL = "qwen-plus";
```

---

## 上下文控制机制

通过：

```
messages.slice(-maxContext - 1)
```

实现上下文裁剪，其中 -1 保留 system prompt。

---

## API 余额显示机制

调用：

```
GET /api/v1/dashboard/billing/credit_grants
```

解析 total_available 字段。

---

## 安全警告

本项目将 API Key 明文写入前端 JavaScript 中。

任何用户均可通过浏览器 DevTools 查看该 Key。

请勿用于生产环境。

---

## 部署方式

可直接部署到：

- GitHub Pages
- Vercel（静态模式）
- 本地 nginx
- 任意静态托管服务

---

## 未来可扩展方向

- 流式输出
- Markdown 渲染
- 代码高亮
- Token 用量统计
- 多模型切换
- 用户自定义 Prompt

---

## License

仅用于学习与测试用途。

**Lambert Yuxiang Chen**