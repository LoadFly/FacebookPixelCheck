const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = 3001;
const HISTORY_FILE = 'check_history.log';

// 中间件配置
app.use(bodyParser.json());
app.use(express.static('public'));

// 配置CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 检查Pixel和Access Token的有效性
app.post('/api/check-pixel', async (req, res) => {
    const { pixelId, accessToken, useProxy, testEventCode } = req.body;
    
    if (!pixelId || !accessToken) {
        return res.status(400).json({ error: '请提供Pixel ID和Access Token' });
    }

    try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const response = await axios.post(
            `https://graph.facebook.com/v16.0/${pixelId}/events?access_token=${accessToken}`,
            {                "data": [                    {                        "action_source": "website",                        "event_id": 1,                        "event_name": "ReadPayChapter",                        "event_time": currentTimestamp,                        "user_data": {                            "em": "f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a"                        }                    }                ],                "test_event_code": testEventCode || "TEST79212"            },            useProxy ? { httpsAgent: new HttpsProxyAgent('http://127.0.0.1:7890') } : {}
        );

        if (response.status === 200 && response.data.events_received > 0) {
            // 记录有效的Pixel ID
            fs.appendFileSync(HISTORY_FILE, `${pixelId}\n`);
            res.json({ success: true, message: 'Pixel和Token验证通过' });
        } else {
            res.status(400).json({ success: false, message: 'Pixel或Token无效' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: '验证过程中发生错误' });
    }
});

// 获取历史记录
app.get('/api/history', (req, res) => {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return res.json({ pixels: [] });
        }

        const history = fs.readFileSync(HISTORY_FILE, 'utf8')
            .split('\n')
            .filter(Boolean)
            .reverse() // 最新的记录在前面
            .slice(0, 10); // 只显示最新的10条记录

        res.json({ pixels: history });
    } catch (error) {
        console.error('Error reading history:', error);
        res.status(500).json({ error: '无法读取历史记录' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});