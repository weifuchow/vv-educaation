# API Test Skill

> 测试和验证后端 API 接口

## 触发时机

当用户提及以下内容时触发：
- "测试 API"、"API 测试"
- "接口测试"、"后端测试"
- "调用接口"、"HTTP 请求"

## API 概览

### Course API

| 方法 | 端点 | 描述 |
|-----|------|------|
| GET | /api/v1/courses | 获取课程列表 |
| GET | /api/v1/courses/{id} | 获取课程详情 |
| GET | /api/v1/courses/{id}/dsl | 获取课程 DSL |
| POST | /api/v1/courses | 创建课程 |
| PUT | /api/v1/courses/{id} | 更新课程 |
| DELETE | /api/v1/courses/{id} | 删除课程 |

### Progress API

| 方法 | 端点 | 描述 |
|-----|------|------|
| GET | /api/v1/progress/{userId}/{courseId} | 获取进度 |
| POST | /api/v1/progress | 保存进度 |
| DELETE | /api/v1/progress/{userId}/{courseId} | 重置进度 |

### Identity API

| 方法 | 端点 | 描述 |
|-----|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| POST | /api/v1/auth/refresh | 刷新 Token |
| GET | /api/v1/auth/me | 获取当前用户 |

## 测试方法

### 使用 curl

```bash
# 获取课程列表
curl -X GET http://localhost:8080/api/v1/courses \
  -H "Authorization: Bearer ${TOKEN}"

# 创建课程
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "title": "测试课程",
    "dsl": {...}
  }'

# 获取课程 DSL
curl -X GET http://localhost:8080/api/v1/courses/123/dsl \
  -H "Authorization: Bearer ${TOKEN}"
```

### 使用 HTTPie

```bash
# 更友好的命令行 HTTP 客户端
http GET :8080/api/v1/courses Authorization:"Bearer ${TOKEN}"

http POST :8080/api/v1/auth/login \
  username=admin \
  password=secret
```

### Maven 测试

```bash
cd server/api
mvn test

# 运行指定测试类
mvn test -Dtest=CourseControllerTest

# 集成测试
mvn verify
```

## 测试场景

### 1. 健康检查

```bash
curl http://localhost:8080/actuator/health
```

**期望响应：**
```json
{
  "status": "UP"
}
```

### 2. 用户认证流程

```bash
# 1. 注册
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123!","email":"test@example.com"}'

# 2. 登录
TOKEN=$(curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123!"}' | jq -r '.token')

# 3. 获取用户信息
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer ${TOKEN}"
```

### 3. 课程 CRUD

```bash
# 创建
COURSE_ID=$(curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d @course.json | jq -r '.id')

# 读取
curl http://localhost:8080/api/v1/courses/${COURSE_ID} \
  -H "Authorization: Bearer ${TOKEN}"

# 更新
curl -X PUT http://localhost:8080/api/v1/courses/${COURSE_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{"title":"更新后的标题"}'

# 删除
curl -X DELETE http://localhost:8080/api/v1/courses/${COURSE_ID} \
  -H "Authorization: Bearer ${TOKEN}"
```

### 4. 进度保存与恢复

```bash
# 保存进度
curl -X POST http://localhost:8080/api/v1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "courseId": "123",
    "sceneId": "scene2",
    "state": {"score": 80}
  }'

# 获取进度
curl http://localhost:8080/api/v1/progress/user123/course123 \
  -H "Authorization: Bearer ${TOKEN}"
```

## 错误处理测试

### 400 Bad Request

```bash
# 缺少必需字段
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{}'
```

### 401 Unauthorized

```bash
# 无 Token
curl http://localhost:8080/api/v1/courses

# 无效 Token
curl http://localhost:8080/api/v1/courses \
  -H "Authorization: Bearer invalid_token"
```

### 404 Not Found

```bash
curl http://localhost:8080/api/v1/courses/nonexistent \
  -H "Authorization: Bearer ${TOKEN}"
```

### 409 Conflict

```bash
# 重复注册
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"existing","password":"Test123!"}'
```

## 输出格式

```
=== API Test Results ===

🔌 服务状态: http://localhost:8080
   ✓ 健康检查通过

📋 Course API:
   ✓ GET /courses - 200 OK (45ms)
   ✓ GET /courses/{id} - 200 OK (23ms)
   ✓ POST /courses - 201 Created (67ms)
   ✓ PUT /courses/{id} - 200 OK (34ms)
   ✓ DELETE /courses/{id} - 204 No Content (12ms)

📋 Progress API:
   ✓ GET /progress/{userId}/{courseId} - 200 OK (18ms)
   ✓ POST /progress - 201 Created (42ms)

📋 Identity API:
   ✓ POST /auth/login - 200 OK (156ms)
   ✓ GET /auth/me - 200 OK (21ms)

📊 总结:
   通过: 9/9
   平均响应时间: 46ms

✅ 所有 API 测试通过！
```

## Postman Collection

```bash
# 导入 Postman Collection
# 位置: server/api/postman/vv-education.postman_collection.json

# 使用 Newman 运行
npm install -g newman
newman run vv-education.postman_collection.json -e local.postman_environment.json
```

## 注意事项

- 确保后端服务已启动
- 使用测试数据库，不要污染生产数据
- 测试后清理创建的数据
- 检查响应时间是否在可接受范围
- 验证错误响应格式一致
