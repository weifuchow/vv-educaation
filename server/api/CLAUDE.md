# CLAUDE.md - Server API Module Guide

> **Module:** `server/api`
> **Framework:** Spring Boot 3.2.0 (Java 17+)
> **Purpose:** VV Education Backend REST API
> **Last Updated:** 2026-01-11

This document provides comprehensive guidance for AI assistants working on the Java/Spring Boot backend module.

---

## Table of Contents

1. [Current Status & Structure](#1-current-status--structure)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Domain Modules](#4-domain-modules)
5. [API Design Conventions](#5-api-design-conventions)
6. [Database Schema & JPA](#6-database-schema--jpa)
7. [Service Layer Patterns](#7-service-layer-patterns)
8. [Repository Patterns](#8-repository-patterns)
9. [Security & Authentication](#9-security--authentication)
10. [Configuration Management](#10-configuration-management)
11. [Testing Strategies](#11-testing-strategies)
12. [Common Development Scenarios](#12-common-development-scenarios)
13. [Important Notes for AI Assistants](#13-important-notes-for-ai-assistants)

---

## 1. Current Status & Structure

### 1.1 Implementation Status

**Current State:** Early setup stage (M0 phase)

**Completed:**

- ✅ Spring Boot project structure
- ✅ Maven dependencies configuration
- ✅ application.yml configuration
- ✅ Main application class

**In Progress:**

- 🔄 Course domain implementation
- 🔄 Progress domain implementation
- 🔄 Identity/Auth implementation

**Not Started:**

- ⏳ Assessment domain (M2)
- ⏳ Project domain (M3)

### 1.2 Current Directory Structure

```
server/api/
├── src/
│   └── main/
│       ├── java/com/vveducation/
│       │   └── VVEducationApplication.java  # Main entry point
│       └── resources/
│           └── application.yml              # Configuration
├── pom.xml                                  # Maven dependencies
└── README.md                                # Chinese documentation
```

### 1.3 Planned Directory Structure

```
server/api/
├── src/
│   ├── main/
│   │   ├── java/com/vveducation/
│   │   │   ├── VVEducationApplication.java
│   │   │   ├── config/                 # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── CacheConfig.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   ├── common/                 # Shared utilities
│   │   │   │   ├── constants/          # Constants & enums
│   │   │   │   ├── exception/          # Custom exceptions
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── CourseNotFoundException.java
│   │   │   │   │   └── ...
│   │   │   │   └── utils/              # Utility classes
│   │   │   │       ├── JsonUtil.java
│   │   │   │       └── JwtUtil.java
│   │   │   ├── domain/                 # Domain modules (DDD)
│   │   │   │   ├── course/
│   │   │   │   │   ├── controller/     # REST controllers
│   │   │   │   │   │   └── CourseController.java
│   │   │   │   │   ├── service/        # Business logic
│   │   │   │   │   │   └── CourseService.java
│   │   │   │   │   ├── repository/     # Data access
│   │   │   │   │   │   └── CourseRepository.java
│   │   │   │   │   ├── entity/         # JPA entities
│   │   │   │   │   │   └── Course.java
│   │   │   │   │   └── dto/            # Data transfer objects
│   │   │   │   │       ├── CourseDTO.java
│   │   │   │   │       ├── CreateCourseRequest.java
│   │   │   │   │       └── UpdateCourseRequest.java
│   │   │   │   ├── progress/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   ├── repository/
│   │   │   │   │   ├── entity/
│   │   │   │   │   └── dto/
│   │   │   │   ├── identity/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   ├── repository/
│   │   │   │   │   ├── entity/
│   │   │   │   │   └── dto/
│   │   │   │   ├── assessment/         # M2 phase
│   │   │   │   └── project/            # M3 phase
│   │   │   └── infrastructure/         # Infrastructure concerns
│   │   │       ├── storage/            # Object storage (OSS)
│   │   │       ├── cache/              # Redis caching
│   │   │       └── mq/                 # Message queue (future)
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── mapper/                 # MyBatis XML (optional)
│   │           └── CourseMapper.xml
│   └── test/
│       └── java/com/vveducation/
│           ├── domain/
│           │   ├── course/
│           │   │   ├── CourseServiceTest.java
│           │   │   ├── CourseControllerTest.java
│           │   │   └── CourseRepositoryTest.java
│           │   └── ...
│           └── VVEducationApplicationTests.java
└── pom.xml
```

---

## 2. Technology Stack

### 2.1 Core Framework

- **Spring Boot:** 3.2.0
- **Java:** 17+ (LTS)
- **Build Tool:** Maven 3.8+

### 2.2 Database

**Primary Database:**

- **PostgreSQL** 14+ (JSONB support for DSL storage)
- **Alternative:** MySQL 8+ (JSON support)

**ORM Frameworks:**

- **JPA/Hibernate** (primary) - For standard CRUD
- **MyBatis Plus** 3.5.5 (optional) - For complex queries

### 2.3 Caching

- **Redis** 6+ (distributed caching)
- **Spring Cache Abstraction**

### 2.4 Security

- **Spring Security** (authentication & authorization)
- **JWT** (io.jsonwebtoken 0.12.3) - Stateless auth
- **BCrypt** - Password hashing

### 2.5 API Documentation

- **SpringDoc OpenAPI** 2.3.0 (Swagger UI)

### 2.6 Dependencies Summary

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Database Drivers -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- MyBatis Plus (optional) -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.5</version>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>

    <!-- API Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 3. Architecture Patterns

### 3.1 Modular Monolith

**Philosophy:** Domain-Driven Design (DDD) with modular organization

**Benefits:**

- Clear domain boundaries
- Independent development of modules
- Can evolve into microservices if needed
- Easier to understand and maintain

### 3.2 Layered Architecture

```
┌─────────────────────────────────────┐
│         Controller Layer            │  # REST endpoints
│  (Handles HTTP requests/responses)  │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│          Service Layer              │  # Business logic
│  (Transactions, domain rules)       │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│        Repository Layer             │  # Data access
│  (JPA/MyBatis)                      │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│          Database                   │  # PostgreSQL
└─────────────────────────────────────┘
```

**Layer Responsibilities:**

| Layer          | Responsibilities                            | Should NOT                       |
| -------------- | ------------------------------------------- | -------------------------------- |
| **Controller** | HTTP handling, validation, DTO conversion   | Business logic, direct DB access |
| **Service**    | Business logic, transactions, orchestration | HTTP concerns, entity exposure   |
| **Repository** | Data access, queries                        | Business logic, transactions     |

### 3.3 Dependency Injection

**Pattern:** Constructor injection (preferred over field injection)

```java
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    // ✅ CORRECT: Constructor injection
    @Autowired
    public CourseService(CourseRepository repo, CourseMapper mapper) {
        this.courseRepository = repo;
        this.courseMapper = mapper;
    }

    // ❌ WRONG: Field injection (avoid)
    // @Autowired
    // private CourseRepository courseRepository;
}
```

---

## 4. Domain Modules

### 4.1 Course Domain

**Responsibilities:**

- Course CRUD operations
- DSL content management
- Course publishing workflow
- Course metadata

**Entities:**

- `Course` - Course metadata and DSL content

**Key Operations:**

- Create draft course
- Update course DSL
- Publish course (draft → published)
- List courses (with filtering)
- Get course DSL for runtime

### 4.2 Progress Domain

**Responsibilities:**

- Learning progress tracking
- State persistence
- Progress statistics

**Entities:**

- `Progress` - User learning progress per course

**Key Operations:**

- Save progress (runtime state snapshot)
- Load progress (resume learning)
- Get statistics (completion rate, time spent)

### 4.3 Identity Domain

**Responsibilities:**

- User authentication
- User management
- Role/permission management

**Entities:**

- `User` - User credentials and profile

**Key Operations:**

- Register user
- Login (return JWT)
- Get/update profile
- Password reset

### 4.4 Assessment Domain (M2)

**Responsibilities:**

- Project rubrics
- Assessment criteria
- Scoring logic

### 4.5 Project Domain (M3)

**Responsibilities:**

- Project submissions
- Peer review
- Project gallery

---

## 5. API Design Conventions

### 5.1 Base Path & Versioning

**Base Path:** `/api` (configured in application.yml)

**Versioning:** URL-based `/api/v1/...`

### 5.2 RESTful Conventions

| HTTP Method | Path Pattern              | Purpose          | Example                      |
| ----------- | ------------------------- | ---------------- | ---------------------------- |
| GET         | `/api/v1/{resource}`      | List resources   | `/api/v1/courses`            |
| GET         | `/api/v1/{resource}/{id}` | Get single       | `/api/v1/courses/course-001` |
| POST        | `/api/v1/{resource}`      | Create           | `/api/v1/courses`            |
| PUT         | `/api/v1/{resource}/{id}` | Update (full)    | `/api/v1/courses/course-001` |
| PATCH       | `/api/v1/{resource}/{id}` | Update (partial) | `/api/v1/courses/course-001` |
| DELETE      | `/api/v1/{resource}/{id}` | Delete           | `/api/v1/courses/course-001` |

### 5.3 Planned API Endpoints

**Course API:**

```
GET    /api/v1/courses              # List courses
GET    /api/v1/courses/{id}         # Get course metadata
GET    /api/v1/courses/{id}/dsl     # Get course DSL
POST   /api/v1/courses              # Create course
PUT    /api/v1/courses/{id}         # Update course
DELETE /api/v1/courses/{id}         # Delete course
POST   /api/v1/courses/{id}/publish # Publish course
```

**Progress API:**

```
GET    /api/v1/progress/{userId}/{courseId}  # Get progress
POST   /api/v1/progress                      # Save progress
GET    /api/v1/progress/{userId}/stats       # Get stats
```

**Identity API:**

```
POST   /api/v1/auth/register        # Register
POST   /api/v1/auth/login           # Login (JWT)
GET    /api/v1/users/me             # Current user
PUT    /api/v1/users/me             # Update profile
```

### 5.4 Response Format

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-11T10:00:00Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course with ID xyz not found",
    "details": null
  },
  "timestamp": "2026-01-11T10:00:00Z"
}
```

**ApiResponse Wrapper (to implement):**

```java
@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private Boolean success;
    private T data;
    private String message;
    private Instant timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Success", Instant.now());
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        // Implementation
    }
}
```

---

## 6. Database Schema & JPA

### 6.1 Course Entity

**Table:** `courses`

```java
@Entity
@Table(name = "courses")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String courseId;  // Business ID

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    private String version;

    @Type(JsonBinaryType.class)  // Hibernate type for JSONB
    @Column(columnDefinition = "jsonb", nullable = false)
    private CourseDSL dslContent;  // JSON mapping

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CourseStatus status = CourseStatus.DRAFT;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}

enum CourseStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}
```

**SQL Schema:**

```sql
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    course_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    version VARCHAR(20) NOT NULL,
    dsl_content JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_course_id ON courses(course_id);
CREATE INDEX idx_courses_status ON courses(status);
```

### 6.2 Progress Entity

**Table:** `progress`

```java
@Entity
@Table(name = "progress")
@Data
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String courseId;

    @Column(length = 100)
    private String currentSceneId;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> stateSnapshot;  // VVCE runtime state

    @Column(nullable = false)
    private Boolean completed = false;

    private Instant lastAccessedAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
```

### 6.3 User Entity

**Table:** `users`

```java
@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String passwordHash;  // BCrypt hashed

    @Column(length = 100)
    private String nickname;

    @Column(length = 255)
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role = UserRole.STUDENT;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}

enum UserRole {
    STUDENT,
    PARENT,
    ADMIN
}
```

### 6.4 JSON Storage Pattern

**For PostgreSQL JSONB:**

```java
// Option 1: Using Hibernate JSON type
@Type(JsonBinaryType.class)
@Column(columnDefinition = "jsonb")
private CourseDSL dslContent;

// Option 2: Using custom converter
@Convert(converter = JsonConverter.class)
@Column(columnDefinition = "jsonb")
private Map<String, Object> metadata;
```

**Custom Converter:**

```java
@Converter
public class JsonConverter implements AttributeConverter<Map<String, Object>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Object> attribute) {
        try {
            return mapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting to JSON", e);
        }
    }

    @Override
    public Map<String, Object> convertToEntityAttribute(String dbData) {
        try {
            return mapper.readValue(dbData, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error parsing JSON", e);
        }
    }
}
```

---

## 7. Service Layer Patterns

### 7.1 Standard Service Pattern

```java
@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    @Autowired
    public CourseService(CourseRepository repo, CourseMapper mapper) {
        this.courseRepository = repo;
        this.courseMapper = mapper;
    }

    public CourseDTO getCourseById(String courseId) {
        Course course = courseRepository.findByCourseId(courseId)
            .orElseThrow(() -> new CourseNotFoundException(courseId));
        return courseMapper.toDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(CreateCourseRequest request) {
        // Validation
        validateCourseDSL(request.getDslContent());

        // Business logic
        Course course = new Course();
        course.setCourseId(generateCourseId());
        course.setTitle(request.getTitle());
        course.setDslContent(request.getDslContent());
        course.setStatus(CourseStatus.DRAFT);

        // Persistence
        Course saved = courseRepository.save(course);

        return courseMapper.toDTO(saved);
    }

    @Transactional
    public void publishCourse(String courseId) {
        Course course = findOrThrow(courseId);

        // Business rule
        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new IllegalStateException(
                "Only draft courses can be published"
            );
        }

        course.setStatus(CourseStatus.PUBLISHED);
        courseRepository.save(course);
    }

    private Course findOrThrow(String courseId) {
        return courseRepository.findByCourseId(courseId)
            .orElseThrow(() -> new CourseNotFoundException(courseId));
    }
}
```

### 7.2 Transaction Management

**Rules:**

- Use `@Transactional` on **service methods**, not repository methods
- Read-only transactions for queries: `@Transactional(readOnly = true)`
- Isolate transactions at appropriate granularity

```java
@Service
public class CourseService {

    // Read-only transaction
    @Transactional(readOnly = true)
    public List<CourseDTO> listCourses() {
        // ...
    }

    // Write transaction (default)
    @Transactional
    public CourseDTO createCourse(CreateCourseRequest request) {
        // ...
    }

    // Rollback on specific exceptions
    @Transactional(rollbackFor = Exception.class)
    public void importCourse(MultipartFile file) {
        // ...
    }
}
```

---

## 8. Repository Patterns

### 8.1 JPA Repository (Primary)

```java
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCourseId(String courseId);

    List<Course> findByStatus(CourseStatus status);

    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' " +
           "ORDER BY c.createdAt DESC")
    List<Course> findPublishedCourses();

    boolean existsByCourseId(String courseId);

    @Modifying
    @Query("UPDATE Course c SET c.status = :status WHERE c.courseId = :courseId")
    int updateStatus(@Param("courseId") String courseId,
                     @Param("status") CourseStatus status);
}
```

**JPA Naming Conventions:**

- `findBy{Property}` - Find by property
- `findBy{Property}And{Property}` - Multiple conditions
- `existsBy{Property}` - Check existence
- `countBy{Property}` - Count records

### 8.2 MyBatis Plus (Optional)

**When to use:**

- Complex joins
- Performance-critical queries
- Dynamic SQL
- Legacy SQL migration

```java
@Mapper
public interface CourseMapper extends BaseMapper<Course> {

    // Annotation-based
    @Select("SELECT * FROM courses WHERE status = #{status} " +
            "AND created_at > #{date}")
    List<Course> findRecentByStatus(@Param("status") String status,
                                     @Param("date") Instant date);

    // XML-based (defined in CourseMapper.xml)
    List<CourseWithProgressDTO> findCoursesWithProgress(@Param("userId") Long userId);
}
```

**XML Mapper:**

```xml
<!-- src/main/resources/mapper/CourseMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.vveducation.domain.course.repository.CourseMapper">

    <select id="findCoursesWithProgress" resultType="CourseWithProgressDTO">
        SELECT c.*, p.completed, p.current_scene_id
        FROM courses c
        LEFT JOIN progress p ON c.course_id = p.course_id
          AND p.user_id = #{userId}
        WHERE c.status = 'PUBLISHED'
    </select>

</mapper>
```

---

## 9. Security & Authentication

### 9.1 Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Disabled for REST API
            .cors().and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/courses/**").permitAll()
                .requestMatchers("/api/v1/progress/**").authenticated()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(),
                           UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 9.2 JWT Implementation

**JWT Token Structure:**

```json
{
  "sub": "user-12345",
  "username": "student@example.com",
  "role": "STUDENT",
  "iat": 1704960000,
  "exp": 1705046400
}
```

**JWT Service:**

```java
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(Authentication auth) {
        UserDetails user = (UserDetails) auth.getPrincipal();

        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getAuthorities())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### 9.3 Authentication Controller

```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
        @RequestBody LoginRequest request
    ) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        String token = jwtService.generateToken(auth);

        return ResponseEntity.ok(
            ApiResponse.success(new LoginResponse(token))
        );
    }
}
```

---

## 10. Configuration Management

### 10.1 application.yml

**Current Configuration:**

```yaml
spring:
  application:
    name: vv-education-api
  profiles:
    active: dev

  datasource:
    url: jdbc:postgresql://localhost:5432/vv_education
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5

  jpa:
    hibernate:
      ddl-auto: update # ⚠️ Change to 'validate' in production
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

  data:
    redis:
      host: localhost
      port: 6379
      timeout: 3000ms

server:
  port: 8080
  servlet:
    context-path: /api

jwt:
  secret: vv-education-secret-key-please-change-in-production
  expiration: 86400000 # 24 hours

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html

logging:
  level:
    com.vveducation: DEBUG
    org.springframework.web: INFO
```

### 10.2 Environment-Specific Config

**application-dev.yml:**

```yaml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    com.vveducation: DEBUG
```

**application-prod.yml:**

```yaml
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate # Never auto-update in prod

logging:
  level:
    com.vveducation: INFO
```

---

## 11. Testing Strategies

### 11.1 Unit Testing (Service Layer)

```java
@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    void getCourseById_ShouldReturnCourse_WhenExists() {
        // Arrange
        String courseId = "test-001";
        Course course = new Course();
        course.setCourseId(courseId);

        when(courseRepository.findByCourseId(courseId))
            .thenReturn(Optional.of(course));

        // Act
        CourseDTO result = courseService.getCourseById(courseId);

        // Assert
        assertNotNull(result);
        assertEquals(courseId, result.getCourseId());
        verify(courseRepository).findByCourseId(courseId);
    }
}
```

### 11.2 Integration Testing

```java
@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createCourse_ShouldReturn201() throws Exception {
        mockMvc.perform(post("/api/v1/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Test\"}"))
            .andExpect(status().isCreated());
    }
}
```

---

## 12. Common Development Scenarios

### 12.1 Adding a New Domain Module

**Example:** Adding "Assessment" module

1. **Create package structure:**

   ```
   domain/assessment/
   ├── controller/
   ├── service/
   ├── repository/
   ├── entity/
   └── dto/
   ```

2. **Create entity:**

   ```java
   @Entity
   @Table(name = "assessments")
   @Data
   public class Assessment {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       // ...
   }
   ```

3. **Create repository, service, controller** following patterns above

### 12.2 Implementing Caching

```java
@Service
public class CourseService {

    @Cacheable(value = "courses", key = "#courseId")
    public CourseDTO getCourseById(String courseId) {
        // Fetched from DB on cache miss
        // Returned from Redis on cache hit
    }

    @CachePut(value = "courses", key = "#courseId")
    public CourseDTO updateCourse(String courseId, UpdateCourseRequest request) {
        // Updates cache after saving
    }

    @CacheEvict(value = "courses", key = "#courseId")
    public void deleteCourse(String courseId) {
        // Removes from cache
    }
}
```

---

## 13. Important Notes for AI Assistants

### 13.1 Critical Principles

1. **Domain-Driven Design**: Always organize by business domain
2. **Layer Separation**: Controller → Service → Repository
3. **Transaction Management**: Use `@Transactional` on services
4. **DTO Pattern**: Never expose entities in APIs
5. **Constructor Injection**: Preferred over field injection

### 13.2 Do NOT Do

- ❌ Don't bypass service layer (controller calling repository)
- ❌ Don't use `ddl-auto: update` in production
- ❌ Don't store JWT secret in code
- ❌ Don't return entities from controllers
- ❌ Don't use field injection

### 13.3 DO

- ✅ Use constructor injection
- ✅ Validate input at controller level
- ✅ Handle exceptions globally
- ✅ Use DTOs for API responses
- ✅ Log appropriately
- ✅ Write tests

---

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Maintained By:** VV Education Team
