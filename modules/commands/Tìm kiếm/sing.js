const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

async function downloadMusicFromAPI(url) {
  try {
    const apiUrl = `https://apiv2-zprz.onrender.com/ytmp3?url=${encodeURIComponent(url)}`;
    console.log(`[SING] Đang tải dữ liệu từ API: ${apiUrl}`);
    const response = await axios.get(apiUrl, { timeout: 30000 });
    const data = response.data;

    if (!data || !data.result || !data.result.audio) {
      throw new Error('Không thể lấy dữ liệu từ API');
    }

    const audioUrl = data.result.audio;
    const title = data.result.title || 'Unknown';
    const duration = data.result.duration || 0;
    const author = data.result.author || 'Unknown';
    const views = data.result.views || 0;
    const uploadDate = data.result.uploadDate || new Date().toISOString().split('T')[0];

    // Tải file âm thanh
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    const filePath = path.join(cacheDir, `sing-${Date.now()}.mp3`);
    fs.writeFileSync(filePath, Buffer.from(audioResponse.data));

    return {
      title,
      dur: duration,
      viewCount: views,
      author,
      uploadDate,
      filePath
    };
  } catch (error) {
    console.error('[SING] Lỗi tải từ API:', error.message);
    throw error;
  }
}

module.exports.config = {
  name: "sing",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
  commandCategory: "Tìm kiếm",
  usages: "[searchMusic]",
  cooldowns: 0,
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const axios = require('axios');
  const moment = require("moment-timezone");
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

  try {
    const data = await downloadMusicFromAPI('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1]);

    if (fs.statSync(data.filePath).size > 87426214400) {
      return api.sendMessage('Không thể gửi file, vui lòng chọn bài khác', event.threadID, () => fs.unlinkSync(data.filePath), event.messageID);
    }

    const convertedTime = moment(data.uploadDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');

    api.unsendMessage(handleReply.messageID);
    return api.sendMessage({
      body: `🎬 Title: ${data.title} (${module.exports.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author}\n🌐 Lượt xem: ${data.viewCount}\n⏰ Bây giờ là: ${timeNow}`,
      attachment: fs.createReadStream(data.filePath)
    }, event.threadID, () => fs.unlinkSync(data.filePath), event.messageID);
  } catch (e) {
    console.log('[SING] Lỗi:', e.message);
    api.sendMessage('Đã xảy ra lỗi khi tải nhạc.', event.threadID, event.messageID);
  }
}

module.exports.convertHMS = function (value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
}

module.exports.run = async function ({ api, event, args }) {
  const axios = require('axios');
  const moment = require("moment-timezone");
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

  if (args.length === 0 || !args) return api.sendMessage('❎ Phần tìm kiếm không được để trống!', event.threadID, event.messageID);

  const keywordSearch = args.join(" ");
  const pathFile = path.join(cacheDir, `sing-${event.senderID}.mp3`);
  if (fs.existsSync(pathFile)) {
    fs.unlinkSync(pathFile);
  }

  if (args.join(" ").indexOf("https://") === 0) {
    try {
      const data = await downloadMusicFromAPI(args.join(" "));

      if (fs.statSync(data.filePath).size > 8742621440000) {
        return api.sendMessage('⚠️ Không thể gửi file', event.threadID, () => fs.unlinkSync(data.filePath), event.messageID);
      }

      const convertedTime = moment(data.uploadDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
      return api.sendMessage({
        body: `🎬 Title: ${data.title} (${module.exports.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author}\n🌐 Lượt xem: ${data.viewCount}\n⏰ Bây giờ là: ${timeNow}`,
        attachment: fs.createReadStream(data.filePath)
      }, event.threadID, () => fs.unlinkSync(data.filePath), event.messageID);
    } catch (e) {
      console.log('[SING] Lỗi:', e.message);
      api.sendMessage('Đã xảy ra lỗi khi tải nhạc từ link.', event.threadID, event.messageID);
    }
  } else {
    try {
      const Youtube = require('youtube-search-api');
      const data = (await Youtube.GetListByKeyword(keywordSearch, false, 12)).items;

      const link = [];
      let msg = "";
      let num = 0;
      let numb = 0;
      const imgthumnail = [];

      for (let value of data) {
        link.push(value.id);
        const folderthumnail = path.join(cacheDir, `${numb += 1}.png`);
        const linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;
        const getthumnail = (await axios.get(linkthumnail, { responseType: 'arraybuffer' })).data;

        fs.writeFileSync(folderthumnail, getthumnail);
        imgthumnail.push(fs.createReadStream(folderthumnail));

        const datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=AIzaSyBkmMKDjvpyTPXTgjCKKkAaTuF3TCpY1dI`)).data;
        const channel = datac.items[0].snippet.channelTitle;
        num += 1;

        msg += `${num}. ${value.title}\n⏰ Time: ${value.length.simpleText}\n🌐 Tên Kênh: ${channel}\n\n`;
      }

      const body = `📝 Có ${link.length} kết quả trùng với từ khóa tìm kiếm của bạn:\n\n${msg}\nReply (phản hồi) tin nhắn này chọn một trong những tìm kiếm trên`;
      return api.sendMessage({
        attachment: imgthumnail,
        body: body
      }, event.threadID, (error, info) => global.client.handleReply.push({
        type: 'reply',
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        link
      }), event.messageID);
    } catch (e) {
      console.log('[SING] Lỗi tìm kiếm:', e.message);
      api.sendMessage('Đã xảy ra lỗi khi tìm kiếm.', event.threadID, event.messageID);
    }
  }
}