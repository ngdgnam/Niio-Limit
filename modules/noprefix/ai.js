const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || global.config?.GEMINI_API_KEY || "your-api-key-here";
let genAI = null;
if (apiKey && apiKey !== "your-api-key-here") {
    genAI = new GoogleGenerativeAI(apiKey);
}

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Niio-team",
    description: "Chat với Gemini AI",
    commandCategory: "AI",
    usages: "[message]",
    cooldowns: 5
};

module.exports.handleEvent = async function({ event, api }) {
    const { body, threadID, senderID } = event;

    if (!genAI || !body || body.toLowerCase().startsWith(global.config.PREFIX) || senderID === api.getCurrentUserID()) return;

    // Chỉ phản hồi nếu trong DM
    if (threadID === senderID) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result = await model.generateContent(body);
            const response = result.response.text();

            api.sendMessage(`🤖 AI: ${response}`, threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage("❌ Có lỗi khi kết nối với AI!", threadID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;
    const message = args.join(" ");
    if (!genAI) {
        return api.sendMessage("❌ AI chưa được cấu hình! Vui lòng thêm GEMINI_API_KEY.", threadID);
    }
    if (!message) {
        return api.sendMessage("Vui lòng nhập tin nhắn để chat với AI!", threadID);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent(message);
        const response = result.response.text();

        api.sendMessage(`🤖 AI: ${response}`, threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Có lỗi khi kết nối với AI!", threadID);
    }
};