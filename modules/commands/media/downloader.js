const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "downloader",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Niio-team",
    description: "Tải video từ TikTok, Facebook",
    commandCategory: "media",
    usages: "[url]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const url = args.join(" ");

    if (!url) {
        return api.sendMessage("Vui lòng cung cấp URL của video!\nHỗ trợ: TikTok, Facebook", threadID, messageID);
    }

    api.sendMessage("Đang xử lý, vui lòng chờ...", threadID, messageID);

    try {
        let videoUrl, fileName;

        if (url.includes('tiktok.com')) {
            const tiktokUrl = url.replace('m.tiktok.com', 'tiktok.com');
            const videoId = tiktokUrl.split('/').pop();
            const videoResponse = await axios.get(`https://api.tiktokv.com/aweme/v1/aweme/detail/?aweme_id=${videoId}`);
            videoUrl = videoResponse.data.aweme_detail.video.play_addr.url_list[0];
            fileName = `tiktok_${videoId}.mp4`;
        } else if (url.includes('facebook.com')) {
            const { Controller } = require('../../../utils/facebook/index');
            const controller = new Controller();
            const result = await controller.FacebookController(url);
            if (result.error) {
                return api.sendMessage(`❌ ${result.error}`, threadID);
            }
            videoUrl = result.video || result.attachment; // Giả sử là URL
            fileName = `facebook_${Date.now()}.mp4`;
        } else {
            return api.sendMessage("❌ URL không được hỗ trợ! Chỉ hỗ trợ TikTok, Facebook.", threadID);
        }

        // Tải và lưu tạm
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
        const filePath = path.join(cacheDir, fileName);
        const writer = fs.createWriteStream(filePath);
        const response = await axios.get(videoUrl, { responseType: 'stream' });
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Gửi file
        const attachment = fs.createReadStream(filePath);
        await api.sendMessage({
            body: "📥 Video đã tải xong!",
            attachment: attachment
        }, threadID);

        // Xóa cache sau khi gửi
        fs.unlinkSync(filePath);
        api.sendMessage("✅ Đã xóa cache sau khi gửi.", threadID);

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ Có lỗi xảy ra khi tải video! Vui lòng thử lại.", threadID);
    }
};