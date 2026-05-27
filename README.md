# ShieldCare — Bảo hiểm xe mô tô & ô tô

Website tư vấn bảo hiểm (frontend tĩnh) + quản trị admin (Express + SQLite).

## Cấu trúc

| Thành phần | File chính | Deploy |
|------------|------------|--------|
| Trang khách | `index.html`, `frontend.js`, `style.css` | **Vercel** |
| Trang admin | `admin.html`, `admin.js` | Vercel hoặc cùng Render |
| API + DB | `script.js`, `database.js` | **Render** |

## Chạy local

```bash
npm install
npm start
```

- Trang chủ: http://localhost:3000/
- Admin: http://localhost:3000/admin.html  
- Đăng nhập mặc định: `baohiem@mo` / `123456` (đổi trong `.env`)

## Deploy production

### 1. Backend (Render)

1. Tạo **Web Service**, connect repo GitHub.
2. **Build:** `npm install`
3. **Start:** `npm start`
4. Biến môi trường (Render Dashboard → Environment):
   - `NODE_ENV=production` (bắt buộc — bật cookie Secure cho HTTPS)
   - `COOKIE_CROSS_SITE=true` (tùy chọn, mặc định bật khi `NODE_ENV=production`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET` (chuỗi bí mật dài, đổi khỏi mặc định)
   - `CORS_ALLOWED_ORIGINS` — chỉ cần nếu dùng domain tùy chỉnh (không phải `*.vercel.app`)
5. URL backend hiện tại: `https://web-bao-hiem-mmwl.onrender.com`
6. Có thể dùng `render.yaml` trong repo để tạo service nhanh.

### 2. Frontend (Vercel)

1. Import repo GitHub `tuongnp-sys/web-baohiem`, **Root Directory** = thư mục project.
2. Framework: **Other** (static). `vercel.json` đã cấu hình `buildCommand`/`installCommand` rỗng.
3. URL API đã cấu hình sẵn tại:
   - `index.html` / `admin.html` → meta `api-base`
   - `api-config.js` → `RENDER_API_ORIGIN`
   - `frontend.js` → fallback cùng domain Render
4. Deploy — frontend gọi thẳng Render, không proxy qua Vercel.
5. URL Vercel mẫu: `https://web-baohiem.vercel.app`

### 3. Kiểm tra sau deploy

- `GET https://<render>/api/health` → `{ "ok": true }`
- Trang Vercel: gửi form **Gửi yêu cầu** → admin thấy trong **Yêu cầu website**
- `admin.html` trên Vercel: đăng nhập / đăng xuất / đổi tab không treo

## Lỗi thường gặp

| Triệu chứng | Cách xử lý |
|-------------|------------|
| Port 3000 **EADDRINUSE** | `netstat -ano \| findstr :3000` rồi `taskkill /PID <pid> /F` |
| Trang chủ trắng | Đảm bảo `index.html` có nội dung và đã deploy lên Vercel |
| API 404 trên Vercel | Sửa `api-base` / `api-config.js` trỏ đúng Render |
| Đăng nhập admin fail (Vercel) | `NODE_ENV=production` trên Render + `CORS_ALLOWED_ORIGINS` |

## Công nghệ

HTML/CSS/JS thuần, Express, SQLite, session cookie (admin).
