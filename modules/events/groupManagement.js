module.exports.config = {
    name: "groupManagement",
    eventType: ["log:unsubscribe", "log:thread-name", "log:thread-image", "log:thread-color", "log:thread-emoji"],
    version: "1.0.0",
    credits: "Niio-team",
    description: "Quản lý nhóm: Anti-out, Anti-change-info, Warn system"
};

module.exports.run = async function({ event, api, Threads, Users }) {
    try {
    const { threadID, logMessageType, logMessageData } = event;

    const threadData = await Threads.getData(threadID);
    const settings = threadData.data || {};

    // Mặc định bật nếu chưa có
    if (settings.antiOut === undefined) settings.antiOut = true;
    if (settings.antiChangeInfo === undefined) settings.antiChangeInfo = true;

    // Anti-out
    if (logMessageType === "log:unsubscribe") {
        const leftParticipantFbId = logMessageData.leftParticipantFbId;
        if (settings.antiOut && !global.config.ADMINBOT.includes(leftParticipantFbId)) {
            api.addUserToGroup(leftParticipantFbId, threadID, (err) => {
                if (err) {
                    api.sendMessage("❌ Không thể thêm lại người dùng đã rời nhóm!", threadID);
                } else {
                    api.sendMessage("✅ Đã thêm lại người dùng đã rời nhóm!", threadID);
                }
            });
        }
    }

    // Anti-change-info
    if (["log:thread-name", "log:thread-image", "log:thread-color", "log:thread-emoji"].includes(logMessageType)) {
        const author = logMessageData.author;
        if (settings.antiChangeInfo && !global.config.ADMINBOT.includes(author)) {
            // Warn system
            const userData = await Users.getData(author);
            userData.data.warns = (userData.data.warns || 0) + 1;
            await Users.setData(author, userData);

            const name = await Users.getNameUser(author);
            api.sendMessage(`🚫 ${name} đã cố gắng thay đổi thông tin nhóm! Cảnh cáo ${userData.data.warns}/3`, threadID);

            if (userData.data.warns >= 3) {
                api.removeUserFromGroup(author, threadID);
                api.sendMessage(`🚫 ${name} đã bị kick do vi phạm quá nhiều!`, threadID);
                userData.data.warns = 0; // Reset
                await Users.setData(author, userData);
            }

            // Revert changes
            if (logMessageType === "log:thread-name") {
                api.setTitle(settings.threadName || "Nhóm", threadID);
            } else if (logMessageType === "log:thread-image") {
                // Revert image if possible
            }
            // Similar for others
        }
    }
    } catch (error) {
        console.error("Lỗi trong groupManagement:", error);
    }
};