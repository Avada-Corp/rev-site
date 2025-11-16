# 📋 Инструкция для бекенда: API для системы промокодов

## 🔗 Эндпоинты

### 1. Получение существующих промокодов

**Метод:** `GET`  
**URL:** `/admin/promocodes`  
**Авторизация:** Bearer Token (только для суперадминов)

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Ответ (200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "promo_123456789",
      "code": "SUMMER2024",
      "amount": 50.00,
      "isReusable": false,
      "expirationDate": 1735689600000,
      "usageLimit": null,
      "currentUsage": 0,
      "referralUser": "user@example.com",
      "createdAt": 1703246400000,
      "isActive": true
    }
  ],
  "errors": [],
  "message": "Промокоды получены успешно"
}
```

**Ответ (403):**
```json
{
  "status": false,
  "data": null,
  "errors": ["Недостаточно прав доступа"],
  "message": "Доступ запрещен"
}
```

---

### 2. Генерация новых промокодов

**Метод:** `POST`  
**URL:** `/admin/promocodes/generate`  
**Авторизация:** Bearer Token (только для суперадминов)

**Заголовки:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "amount": 100.50,
  "count": 5,
  "isReusable": true,
  "expirationDate": 1735689600000,
  "usageLimit": 10,
  "referralUser": "referral@example.com"
}
```

**Ответ (200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "promo_987654321",
      "code": "ABC123XYZ",
      "amount": 100.50,
      "isReusable": true,
      "expirationDate": 1735689600000,
      "usageLimit": 10,
      "currentUsage": 0,
      "referralUser": "referral@example.com",
      "createdAt": 1703246400000,
      "isActive": true
    },
    {
      "id": "promo_987654322",
      "code": "DEF456UVW",
      "amount": 100.50,
      "isReusable": true,
      "expirationDate": 1735689600000,
      "usageLimit": 10,
      "currentUsage": 0,
      "referralUser": "referral@example.com",
      "createdAt": 1703246400000,
      "isActive": true
    }
  ],
  "errors": [],
  "message": "Промокоды сгенерированы успешно"
}
```

**Ответ (400):**
```json
{
  "status": false,
  "data": null,
  "errors": ["Неверные параметры запроса"],
  "message": "Ошибка валидации"
}
```

---

### 3. Получение пользователей (для выбора реферала)

**Метод:** `GET`  
**URL:** `/admin/users?email=&page=1&limit=1000`  
**Авторизация:** Bearer Token (админы и суперадмины)

**Параметры запроса:**
- `email` (string, optional): фильтр по email
- `page` (number, optional): номер страницы (по умолчанию 1)  
- `limit` (number, optional): количество записей (по умолчанию 1000)

**Ответ (200):**
```json
{
  "status": true,
  "data": [
    {
      "email": "user1@example.com",
      "username": "user123",
      "_id": "user_id_1",
      "tgAccount": "@user123",
      "parentRef": "parent@example.com"
    },
    {
      "email": "user2@example.com", 
      "username": null,
      "_id": "user_id_2",
      "tgAccount": null,
      "parentRef": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 1000,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

## 📊 Типы данных

### PromocodeGenerateRequest (запрос)
```typescript
interface PromocodeGenerateRequest {
  amount: number;           // Сумма промокода (обязательно, > 0)
  count: number;            // Количество промокодов (обязательно, 1-100)
  isReusable: boolean;      // Многоразовый промокод (обязательно)
  expirationDate?: number;  // Срок действия в timestamp (опционально)
  usageLimit?: number;      // Лимит использований (опционально, только для многоразовых)
  referralUser?: string;    // Email реферала (опционально)
}
```

### Promocode (ответ)
```typescript
interface Promocode {
  id: string;               // Уникальный ID промокода
  code: string;             // Код промокода (генерируется автоматически)
  amount: number;           // Сумма промокода
  isReusable: boolean;      // Многоразовый или одноразовый
  expirationDate?: number;  // Срок действия (timestamp)
  usageLimit?: number;      // Лимит использований
  currentUsage: number;     // Текущее количество использований
  referralUser?: string;    // Email реферала (если привязан)
  createdAt: number;        // Дата создания (timestamp)
  isActive: boolean;        // Активен ли промокод
}
```

### UserInfo (для выбора реферала)
```typescript
interface UserInfo {
  email: string;            // Email пользователя (обязательно)
  username: string | null;  // Username (может быть null)
  _id: string | null;       // ID пользователя
  tgAccount: string | null; // Telegram аккаунт
  parentRef: string | null; // Родительский реферал
}
```

---

## 🔐 Требования безопасности

### Авторизация
- **Все эндпоинты** требуют Bearer Token в заголовке `Authorization`
- **Промокоды** доступны только **суперадминам** (`isSuperAdmin: true`)
- **Пользователи** доступны **админам и суперадминам** (`isAdmin: true` или `isSuperAdmin: true`)

### Валидация запросов

**Для генерации промокодов:**
- `amount`: число > 0.01
- `count`: целое число от 1 до 100
- `isReusable`: булево значение
- `expirationDate`: положительное число (timestamp) или null
- `usageLimit`: положительное целое число или null (только для `isReusable: true`)
- `referralUser`: валидный email существующего пользователя или null

---

## 🎯 Бизнес-логика

### Генерация кодов промокодов
- Коды должны быть **уникальными** и **случайными**
- Рекомендуемая длина: 8-12 символов
- Формат: буквы и цифры (без спецсимволов)
- Пример: `ABC123XYZ`, `X9K2M7N4P`

### Проверка статуса промокода
```javascript
function getPromocodeStatus(promocode) {
  if (!promocode.isActive) return 'inactive';
  if (promocode.expirationDate && promocode.expirationDate < Date.now()) return 'expired';
  if (promocode.usageLimit && promocode.currentUsage >= promocode.usageLimit) return 'exhausted';
  return 'active';
}
```

### Связь с рефералами
- При указании `referralUser` проверить существование пользователя
- Привязка влияет на статистику и начисления рефералу
- В таблице промокодов хранится email реферала

---

## 🗄️ Рекомендуемая структура базы данных

```sql
CREATE TABLE promocodes (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_reusable BOOLEAN DEFAULT FALSE,
    expiration_date BIGINT NULL,
    usage_limit INT NULL,
    current_usage INT DEFAULT 0,
    referral_user VARCHAR(255) NULL,
    created_at BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_code (code),
    INDEX idx_referral_user (referral_user),
    INDEX idx_expiration_date (expiration_date)
);
```

---

## ⚠️ Обработка ошибок

**Стандартные HTTP коды:**
- `200` - Успешно
- `400` - Ошибка валидации  
- `401` - Не авторизован
- `403` - Недостаточно прав
- `500` - Внутренняя ошибка сервера

**Формат ошибок:**
```json
{
  "status": false,
  "data": null,
  "errors": ["Описание ошибки"],
  "message": "Краткое описание"
}
```

---

## 📝 Примечания для разработки

1. **Уникальность кодов**: При генерации промокодов обязательно проверять уникальность кода в базе данных
2. **Timestamp формат**: Все даты передаются в миллисекундах (JavaScript Date.getTime())
3. **Валидация email**: При указании `referralUser` проверять существование пользователя в системе
4. **Логирование**: Рекомендуется логировать все операции с промокодами для аудита
5. **Кэширование**: Список пользователей можно кэшировать для улучшения производительности

---

## 🧪 Примеры для тестирования

### Генерация одноразового промокода без привязки
```bash
curl -X POST http://localhost:5300/admin/promocodes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.00,
    "count": 1,
    "isReusable": false
  }'
```

### Генерация многоразовых промокодов с лимитом и рефералом
```bash
curl -X POST http://localhost:5300/admin/promocodes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "count": 5,
    "isReusable": true,
    "usageLimit": 50,
    "expirationDate": 1735689600000,
    "referralUser": "referral@example.com"
  }'
```

### Получение всех промокодов
```bash
curl -X GET http://localhost:5300/admin/promocodes \
  -H "Authorization: Bearer YOUR_TOKEN"
``` 