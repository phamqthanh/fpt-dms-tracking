# User Location Tracking App

Ứng dụng tracking vị trí người dùng sử dụng Next.js 13, Prisma và MongoDB.

## Tính năng

- ✅ Hiển thị danh sách vị trí người dùng dạng bảng
- ✅ Link trực tiếp đến Google Maps cho mỗi vị trí
- ✅ API endpoints để thêm và lấy danh sách locations
- ✅ Refresh button để cập nhật dữ liệu real-time
- ✅ Hiển thị thông tin user, tọa độ và thời gian tracking

## Cấu trúc Database

### User Model
```prisma
model User {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  email     String     @unique
  name      String?
  locations Location[]
  createdAt DateTime   @default(now())
}
```

### Location Model
```prisma
model Location {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  latitude  Float
  longitude Float
  userId    String?  @db.ObjectId
  user      User?    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### GET /api/locations
Lấy danh sách tất cả locations kèm thông tin user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Nhà hát Thành phố",
      "latitude": 10.776889,
      "longitude": 106.704139,
      "userId": "...",
      "user": {
        "id": "...",
        "name": "Nguyễn Văn A",
        "email": "nguyen.van.a@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 6
}
```

### POST /api/locations
Tạo location tracking mới.

**Request Body:**
```json
{
  "name": "Tên địa điểm",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "userEmail": "user@example.com",
  "userName": "Tên User (optional)"
}
```

**Validation:**
- `name`: Required
- `latitude`: Required, phải trong khoảng -90 đến 90
- `longitude`: Required, phải trong khoảng -180 đến 180
- `userEmail`: Optional, nếu không có userId
- `userName`: Optional, sử dụng nếu tạo user mới

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Tên địa điểm",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "userId": "...",
    "user": {
      "id": "...",
      "name": "User Name",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Location created successfully"
}
```

## Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
pnpm install
```

### 2. Cấu hình Database
Tạo file `.env` và thêm connection string MongoDB:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/tracking-app"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Seed dữ liệu mẫu
```bash
pnpm prisma db seed
```

### 5. Chạy development server
```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Sử dụng API

### Thêm location mới (JavaScript/TypeScript)
```typescript
const response = await fetch('/api/locations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Bitexco Financial Tower',
    latitude: 10.771667,
    longitude: 106.704167,
    userEmail: 'user@example.com',
    userName: 'User Name'
  }),
});

const result = await response.json();
console.log(result);
```

### Thêm location mới (cURL)
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bitexco Financial Tower",
    "latitude": 10.771667,
    "longitude": 106.704167,
    "userEmail": "user@example.com",
    "userName": "User Name"
  }'
```

### Lấy danh sách locations (cURL)
```bash
curl http://localhost:3000/api/locations
```

## UI Features

### Bảng hiển thị locations
- **Location Name**: Tên địa điểm
- **User**: Tên và email của user tracking
- **Coordinates**: Hiển thị latitude và longitude
- **Time**: Thời gian tracking (relative time)
- **Map**: Button link đến Google Maps

### Refresh Button
Nhấn nút "Refresh" để cập nhật dữ liệu mới nhất từ database.

## Google Maps Integration

Mỗi location có button "View on Map" sẽ mở Google Maps với URL format:
```
https://www.google.com/maps?q=<latitude>,<longitude>
```

Ví dụ: `https://www.google.com/maps?q=10.776889,106.704139`

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: MongoDB
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Notes

- Ứng dụng sử dụng Server Components của Next.js để fetch data
- API routes được protect với error handling
- Validation được thực hiện cho latitude/longitude ranges
- Hỗ trợ tự động tạo user mới nếu chỉ có email
