# VV Education - API Server

Java Spring Boot 后端服务

## 功能概述

提供 VV 课堂的后端 API 服务，采用模块化单体架构，按领域模块划分。

## 领域模块

### 1. Course（课程模块）

- 课程 CRUD
- 课程版本管理
- 课程发布/下架
- DSL 存储与检索
- 资源索引管理

### 2. Progress（进度模块）

- 学习进度保存
- 进度读取/恢复
- 进度统计
- 学习上下文存档

### 3. Identity（身份模块）

- 用户注册/登录
- 用户信息管理
- 角色权限（学生/家长/管理员）
- Token 管理

### 4. Assessment（评估模块 - M2）

- 任务评估
- Rubric 评分
- 证据链记录

### 5. Project（项目模块 - M3）

- 项目管理
- 组队管理
- 成果提交
- 同伴评审

## 技术选型

- **框架**: Spring Boot 3.x
- **数据库**: PostgreSQL / MySQL
- **缓存**: Redis
- **ORM**: MyBatis Plus / JPA
- **API 文档**: Swagger / SpringDoc OpenAPI
- **认证**: JWT
- **存储**: 对象存储（OSS）用于课件资源

## 目录结构

```
api/
├── src/main/java/com/vveducation/
│   ├── VVEducationApplication.java
│   ├── config/                 # 配置
│   ├── common/                 # 通用工具
│   │   ├── constants/
│   │   ├── exception/
│   │   └── utils/
│   ├── domain/                 # 领域模块
│   │   ├── course/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── dto/
│   │   ├── progress/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   └── ...
│   │   ├── identity/
│   │   └── ...
│   └── infrastructure/         # 基础设施
│       ├── storage/
│       ├── cache/
│       └── mq/
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── mapper/                 # MyBatis XML（如使用）
├── pom.xml
└── Dockerfile
```

## API 列表（M0 MVP）

### Course API

```
GET    /api/v1/courses              # 课程列表
GET    /api/v1/courses/{id}         # 课程详情
GET    /api/v1/courses/{id}/dsl     # 获取课程 DSL
POST   /api/v1/courses              # 创建课程
PUT    /api/v1/courses/{id}         # 更新课程
DELETE /api/v1/courses/{id}         # 删除课程
POST   /api/v1/courses/{id}/publish # 发布课程
```

### Progress API

```
GET    /api/v1/progress/{userId}/{courseId}  # 获取进度
POST   /api/v1/progress                      # 保存进度
GET    /api/v1/progress/{userId}/stats       # 进度统计
```

### Identity API

```
POST   /api/v1/auth/register        # 注册
POST   /api/v1/auth/login           # 登录
GET    /api/v1/users/me             # 当前用户信息
PUT    /api/v1/users/me             # 更新用户信息
```

## 数据库设计（M0）

### courses（课程表）

```sql
CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  version VARCHAR(20) NOT NULL,
  dsl_content JSON NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course_id (course_id),
  INDEX idx_status (status)
);
```

### progress（进度表）

```sql
CREATE TABLE progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  current_scene_id VARCHAR(100),
  state_snapshot JSON,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_course (user_id, course_id),
  INDEX idx_user_id (user_id)
);
```

### users（用户表）

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 开发指南

### 环境要求

- JDK 17+
- Maven 3.8+
- PostgreSQL 14+ / MySQL 8+
- Redis 6+

### 启动开发

```bash
mvn spring-boot:run
```

### 构建

```bash
mvn clean package
```

### 运行测试

```bash
mvn test
```

## 配置示例

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/vv_education
    username: postgres
    password: password
  redis:
    host: localhost
    port: 6379
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080

jwt:
  secret: your-secret-key
  expiration: 86400000
```

## 许可证

MIT
