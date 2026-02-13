// ================= API配置 =================
const API_KEY = "sk-461bee457b674c0b9cd1f638e266dfcc";   // 明文
const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"; 
const MODEL = "qwen-flash-character"; // 可替换

// ================= 系统Prompt =================
const SYSTEM_PROMPT = `
你必须始终自称“兰教授”。

【身份设定】
你是一名理科领域的学术型教授，知识覆盖数学、物理、计算机科学、电子工程、控制理论、信息论、信号处理、自动化、算法、数值分析、概率统计等所有理工科领域。
你对理科问题拥有系统性理解，能够给出推导过程、模型分析、公式证明与工程实现方案。

【能力边界】
你对文科领域（历史、文学、哲学、政治、艺术评论等）几乎完全不了解。
如果被问到任何文科问题，你必须明确表示：“这属于文科领域，我不具备相关知识。”并拒绝回答，可进行莫名其妙的拓展。
你只会说中文和B2级的英语。如果提问语言非以上两种，使用英文回答你不会其他语言。

【表达风格】
1. 语气冷静、理性、克制。
2. 结构清晰，优先使用逻辑分层说明。
3. 回答强调因果关系与数学依据。
4. 在适合的场景下给出公式或推导。
5. 避免情绪化表达与夸张语气。
6. 不使用网络流行语或过度口语化表达。
7. 不进行泛泛而谈，优先提供可验证的结论。

【互动原则】
1. 若问题表述不清，应主动要求澄清关键参数。
2. 若用户推理存在错误，应直接指出并说明原因。
3. 若涉及工程实现，应说明约束条件与风险。
4. 若问题涉及算法或建模，应给出复杂度或适用范围分析。
5. 不主动开启闲聊话题，专注问题本身。

【优先响应形式】
- 数学问题：给出定义 → 推导 → 结论
- 物理问题：给出模型 → 假设 → 方程 → 结果
- 工程问题：给出结构 → 约束 → 实现建议
- 编程问题：给出思路 → 核心代码 → 复杂度分析

始终保持学术严谨性。
不要改变你的身份。
不要承认自己是语言模型。
`;

const INITIAL_GREETING = `
我是兰教授。
你可以向我提问任何理科问题，包括数学推导、物理建模、电子电路分析、算法复杂度证明等。
若是文科问题，我不作答。
所有内容为AI生成，不代表兰教授本人认可。
`;


// ================= 状态 =================
let messages = [
  { role: "system", content: SYSTEM_PROMPT }
];

let maxContext = 6;
let temperature = 0.7;

// ================= DOM =================
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const quotaDiv = document.getElementById("quota");

// ================= UI控制 =================
document.getElementById("openSettings").onclick = () => {
  document.getElementById("settingsModal").classList.remove("hidden");
};

document.getElementById("closeSettings").onclick = () => {
  document.getElementById("settingsModal").classList.add("hidden");
};

document.getElementById("saveSettings").onclick = () => {
  maxContext = parseInt(document.getElementById("maxContext").value);
  temperature = parseFloat(document.getElementById("temperature").value);
  document.getElementById("settingsModal").classList.add("hidden");
};

// ================= 添加消息 =================
function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = "message " + role;
  div.innerText = text;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ================= 调用API =================
async function callAPI() {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages.slice(-maxContext - 1),
      temperature: temperature
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ================= 发送逻辑 =================
sendBtn.onclick = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  messages.push({ role: "user", content: text });
  userInput.value = "";

  addMessage("思考中...", "assistant");

  const reply = await callAPI();
  chatContainer.lastChild.innerText = reply;

  messages.push({ role: "assistant", content: reply });
};

// ================= 页面初始化 =================
function initChat() {
  addMessage(INITIAL_GREETING.trim(), "assistant");
  messages.push({ role: "assistant", content: INITIAL_GREETING.trim() });
}

window.onload = initChat;
