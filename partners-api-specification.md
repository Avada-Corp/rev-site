# Инструкция для бекенда: API партнеров

## 📋 Обзор

Система управления партнерами позволяет создавать внутренних и внешних партнеров с различными типами комиссий.

## 🔗 Endpoints

### **GET /admin/partners** - Получить всех партнеров
```http
GET /admin/partners
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "partnerType": "external",
      "partnerUser": {
        "email": "partner@example.com",
        "username": "partner_user"
      },
      "commissionType": "general_rules",
      "commissionPercent": 15,
      "selectedUsers": [],
      "fixedPayment": null,
      "disableReferralProgram": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **POST /admin/partners** - Создать партнера
```http
POST /admin/partners
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "partnerType": "external",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "general_rules",
  "commissionPercent": 15,
  "selectedUserEmails": ["user1@example.com", "user2@example.com"],
  "fixedPayment": null,
  "disableReferralProgram": true
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "partnerType": "external",
    "partnerUser": {
      "email": "partner@example.com",
      "username": "partner_user"
    },
    "commissionType": "general_rules",
    "commissionPercent": 15,
    "selectedUsers": [
      {
        "email": "user1@example.com",
        "username": "user1"
      },
      {
        "email": "user2@example.com",
        "username": "user2"
      }
    ],
    "fixedPayment": null,
    "disableReferralProgram": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### **PUT /admin/partners/{id}** - Обновить партнера
```http
PUT /admin/partners/1
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (аналогично POST)

**Response:** (аналогично POST)

### **DELETE /admin/partners/{id}** - Удалить партнера
```http
DELETE /admin/partners/1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": true
}
```

## 📊 Типы данных

### **PartnerType** (enum)
```typescript
"internal" | "external"
```

### **CommissionType** (enum)
```typescript
// Для внутренних партнеров
"service" | "users"

// Для внешних партнеров  
"general_rules" | "fixed_payment" | "profit_percent"
```

### **Partner** (interface)
```typescript
interface Partner {
  id?: number;
  partnerType: 'internal' | 'external';
  partnerUser: PartnerUser | null;
  commissionType: string;
  commissionPercent: number;
  selectedUsers: PartnerUser[];
  fixedPayment?: number;
  disableReferralProgram?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### **PartnerUser** (interface)
```typescript
interface PartnerUser {
  email: string;
  username: string | null;
}
```

### **CreatePartnerRequest** (interface)
```typescript
interface CreatePartnerRequest {
  partnerType: 'internal' | 'external';
  partnerUserEmail: string;
  commissionType: string;
  commissionPercent?: number;
  selectedUserEmails?: string[];
  fixedPayment?: number;
  disableReferralProgram?: boolean;
}
```

### **UpdatePartnerRequest** (interface)
```typescript
interface UpdatePartnerRequest extends CreatePartnerRequest {
  id: number;
}
```

## ✅ Логика валидации

### **Внутренние партнеры (internal):**
- ✅ `partnerUserEmail` - обязательное
- ✅ `commissionType` - "service" или "users"
- ✅ `commissionPercent` - обязательное (0-100)
- ✅ `selectedUserEmails` - обязательное для типа "users"

### **Внешние партнеры (external):**
- ✅ `partnerUserEmail` - обязательное
- ✅ `commissionType` - "general_rules", "fixed_payment" или "profit_percent"
- ✅ `commissionPercent` - обязательное для "profit_percent" (0-100)
- ✅ `fixedPayment` - обязательное для "fixed_payment" (> 0)
- ✅ `disableReferralProgram` - только для "general_rules" (boolean)

## 💡 Особенности

### **Тип "general_rules":**
- Процент рассчитывается автоматически на основе общей суммы управления
- Поле `commissionPercent` игнорируется
- Поле `disableReferralProgram` влияет на скидку 30%

### **Тип "fixed_payment":**
- Фиксированная сумма в долларах
- Поле `commissionPercent` игнорируется

### **Тип "profit_percent":**
- Процент от прибыли партнера (50/50)
- Поле `fixedPayment` игнорируется

### **Пользователи:**
- Для внутренних партнеров с типом "users" - выбираются конкретные пользователи
- Для внешних партнеров - всегда "все пользователи" (поле игнорируется)

## ⚠️ Ошибки

**400 Bad Request:**
```json
{
  "status": false,
  "errors": {
    "partnerUserEmail": ["Пользователь не найден"],
    "commissionType": ["Неверный тип комиссии для данного типа партнера"],
    "commissionPercent": ["Процент должен быть от 0 до 100"],
    "fixedPayment": ["Сумма должна быть больше 0"]
  }
}
```

**404 Not Found:**
```json
{
  "status": false,
  "errors": {
    "message": ["Партнер не найден"]
  }
}
```

**500 Internal Server Error:**
```json
{
  "status": false,
  "errors": {
    "message": ["Внутренняя ошибка сервера"]
  }
}
```

## 🔄 Примеры запросов

### Создание внешнего партнера с типом "general_rules":
```json
{
  "partnerType": "external",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "general_rules",
  "disableReferralProgram": true
}
```

### Создание внешнего партнера с фиксированным платежом:
```json
{
  "partnerType": "external",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "fixed_payment",
  "fixedPayment": 1000
}
```

### Создание внешнего партнера с процентом от прибыли:
```json
{
  "partnerType": "external",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "profit_percent",
  "commissionPercent": 50
}
```

### Создание внутреннего партнера с процентом от сервиса:
```json
{
  "partnerType": "internal",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "service",
  "commissionPercent": 10
}
```

### Создание внутреннего партнера с процентом от пользователей:
```json
{
  "partnerType": "internal",
  "partnerUserEmail": "partner@example.com",
  "commissionType": "users",
  "commissionPercent": 15,
  "selectedUserEmails": ["user1@example.com", "user2@example.com"]
}
```
