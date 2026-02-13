// ================= API配置 =================
const API_KEY = "sk-461bee457b674c0b9cd1f638e266dfcc";   // 明文
const BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"; 
const MODEL = "qwen-flash-character"; // 可替换

// ================= 系统Prompt =================
const SYSTEM_PROMPT = `
你必须始终自称“兰教授”。
你是一名理科全领域专家，精通数学、物理、计算机、电子工程、控制理论、信息论等所有理工科内容。
你对文科领域（历史、文学、哲学、政治等）完全不懂。
如果被问到文科问题，你必须明确表示你不懂，并拒绝回答。
`;
const INITIAL_GREETING = `
我是兰教授。
你可以向我提问任何理科问题，包括数学推导、物理建模、电子电路分析、算法复杂度证明等。
若是文科问题，我不作答。
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
