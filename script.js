// Khởi tạo server Node.js thuần lắng nghe port 3000, hỗ trợ CORS và xử lý POST '/api/register'
const http = require('http');

// Hàm tiện ích để trả về dữ liệu JSON và thiết lập header CORS
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',                       // Cho phép mọi nguồn truy cập
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',       // CORS cho các phương thức
        'Access-Control-Allow-Headers': 'Content-Type,Accept'     // Cho phép các header cần thiết
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    // Xử lý preflight OPTIONS (CORS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Accept',
            'Access-Control-Max-Age': '86400'
        });
        return res.end();
    }

    // Xử lý POST /api/register
    if (req.method === 'POST' && req.url === '/api/register') {
        let body = '';
        // Lắng nghe dữ liệu gửi lên
        req.on('data', chunk => {
            body += chunk;
            // Giới hạn kích thước payload cho an toàn
            if (body.length > 1e6) req.destroy();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body); // Parse JSON từ yêu cầu
                // Có thể xử lý dữ liệu ở đây (ghi ra log thử)
                console.log('Nhận form:', data);

                // Trả về phản hồi thành công
                sendJson(res, 200, { message: 'Đăng ký nhận thành công', received: data });
            } catch (e) {
                // Xử lý lỗi parse JSON
                sendJson(res, 400, { error: 'Dữ liệu không hợp lệ' });
            }
        });
        return;
    }

    // Trả về 404 cho các route khác
    sendJson(res, 404, { error: 'Không tìm thấy API' });
});

// Lắng nghe ở port 3000
server.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});