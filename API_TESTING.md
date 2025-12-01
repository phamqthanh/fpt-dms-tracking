# Test API Endpoints

Các lệnh để test API endpoints của ứng dụng tracking.

## Test GET /api/locations

### Lấy tất cả locations
```bash
curl http://localhost:3000/api/locations
```

### Lấy locations (với format JSON đẹp)
```bash
curl http://localhost:3000/api/locations | json_pp
```

hoặc với jq:
```bash
curl http://localhost:3000/api/locations | jq
```

## Test POST /api/locations

### Tạo location với user mới
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cafe Trung Nguyên",
    "latitude": 10.780123,
    "longitude": 106.695456,
    "userEmail": "test@example.com",
    "userName": "Test User"
  }'
```

### Tạo location với user đã tồn tại
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Công viên Tao Đàn",
    "latitude": 10.782234,
    "longitude": 106.693567,
    "userEmail": "nguyen.van.a@example.com"
  }'
```

### Tạo location không có user (anonymous)
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bưu điện Thành phố",
    "latitude": 10.779762,
    "longitude": 106.699544
  }'
```

## Test với JavaScript/TypeScript

### Fetch API (Browser hoặc Node.js)
```javascript
// GET locations
async function getLocations() {
  const response = await fetch('http://localhost:3000/api/locations');
  const data = await response.json();
  console.log(data);
  return data;
}

// POST new location
async function createLocation() {
  const response = await fetch('http://localhost:3000/api/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Landmark 81 Skyview',
      latitude: 10.794530,
      longitude: 106.721802,
      userEmail: 'user@example.com',
      userName: 'Demo User'
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

// Gọi functions
getLocations();
createLocation();
```

### Axios (Node.js hoặc Browser)
```javascript
const axios = require('axios');

// GET locations
axios.get('http://localhost:3000/api/locations')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// POST new location
axios.post('http://localhost:3000/api/locations', {
  name: 'Diamond Plaza',
  latitude: 10.773456,
  longitude: 106.698789,
  userEmail: 'test@example.com',
  userName: 'Test User'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});
```

## Test Error Cases

### Invalid latitude (phải từ -90 đến 90)
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Location",
    "latitude": 95.0,
    "longitude": 106.0,
    "userEmail": "test@example.com"
  }'
```

Expected Response:
```json
{
  "success": false,
  "error": "Latitude must be between -90 and 90"
}
```

### Invalid longitude (phải từ -180 đến 180)
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Location",
    "latitude": 10.0,
    "longitude": 185.0,
    "userEmail": "test@example.com"
  }'
```

Expected Response:
```json
{
  "success": false,
  "error": "Longitude must be between -180 and 180"
}
```

### Missing required fields
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Missing Coords"
  }'
```

Expected Response:
```json
{
  "success": false,
  "error": "Missing required fields: name, latitude, longitude"
}
```

## Test với Postman

### GET Request
1. Method: `GET`
2. URL: `http://localhost:3000/api/locations`
3. Click "Send"

### POST Request
1. Method: `POST`
2. URL: `http://localhost:3000/api/locations`
3. Headers: 
   - Key: `Content-Type`
   - Value: `application/json`
4. Body (raw JSON):
```json
{
  "name": "Nhà Thờ Đức Bà",
  "latitude": 10.779738,
  "longitude": 106.699092,
  "userEmail": "user@example.com",
  "userName": "Test User"
}
```
5. Click "Send"

## Một số địa điểm ở Việt Nam để test

```json
[
  {
    "name": "Chợ Bến Thành",
    "latitude": 10.772461,
    "longitude": 106.698055
  },
  {
    "name": "Dinh Độc Lập",
    "latitude": 10.777229,
    "longitude": 106.695271
  },
  {
    "name": "Bảo tàng Chứng tích Chiến tranh",
    "latitude": 10.779595,
    "longitude": 106.692534
  },
  {
    "name": "Phố đi bộ Nguyễn Huệ",
    "latitude": 10.774532,
    "longitude": 106.703989
  },
  {
    "name": "Nhà hát Lớn Hà Nội",
    "latitude": 21.023916,
    "longitude": 105.857606
  }
]
```
