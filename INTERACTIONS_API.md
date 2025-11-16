# API для работы с историей взаимодействий

## Описание

API предоставляет доступ к истории взаимодействий пользователей с ботом. История включает просмотры сцен, отправленные и прочитанные напоминания.

## Базовые URL

- API эндпоинты: `/api/*`
- Telegram бот эндпоинты: `/tg/*`

## Модель данных

### UserInteraction

```typescript
interface UserInteraction {
  _id: string;
  chatId: number;
  type: 'scene_view' | 'reminder_sent' | 'reminder_read';
  
  // Поля для сцен
  sceneId?: string;
  sceneText?: string;
  sceneButtons?: Array<{
    text: string;
    targetSceneId: string;
  }>;
  previousSceneId?: string;
  clickedAt?: Date;
  
  // Поля для напоминаний
  scheduledMessageId?: string;
  reminderText?: string;
  sentAt?: Date;
  isRead?: boolean;
  readAt?: Date;
  
  // Автоматические поля
  createdAt: Date;
  updatedAt: Date;
}
```

### Типы взаимодействий

- `scene_view` - просмотр сцены
- `reminder_sent` - отправлено напоминание
- `reminder_read` - прочитано напоминание

## Эндпоинты

### 1. Получить всю историю взаимодействий

Возвращает все записи истории взаимодействий, отсортированные по дате создания (новые сначала).

**Запрос:**

```http
GET /api/getAllInteractions
GET /tg/getAllInteractions
```

**Ответ:**

```json
{
  "status": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "chatId": 123456789,
      "type": "scene_view",
      "sceneId": "welcome",
      "sceneText": "Добро пожаловать!",
      "sceneButtons": [
        {
          "text": "Начать",
          "targetSceneId": "main_menu"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "chatId": 123456789,
      "type": "reminder_sent",
      "scheduledMessageId": "msg_123",
      "reminderText": "Не забудьте проверить баланс",
      "sentAt": "2024-01-15T11:00:00.000Z",
      "isRead": false,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Ошибка:**

```json
{
  "status": false,
  "errors": ["Ошибка при получении истории взаимодействий"]
}
```

**Пример использования (JavaScript/TypeScript):**

```typescript
async function getAllInteractions() {
  try {
    const response = await fetch('/api/getAllInteractions');
    const result = await response.json();
    
    if (result.status) {
      console.log('История взаимодействий:', result.data);
      return result.data;
    } else {
      console.error('Ошибки:', result.errors);
      return [];
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return [];
  }
}
```

---

### 2. Получить историю по chatId

Возвращает историю взаимодействий для конкретного пользователя по его chatId.

**Запрос:**

**Вариант 1: GET с параметром в URL**

```http
GET /api/getInteractionsByChatId/:chatId
GET /tg/getInteractionsByChatId/:chatId
```

**Пример:**

```http
GET /api/getInteractionsByChatId/123456789
```

**Вариант 2: POST с chatId в body**

```http
POST /api/getInteractionsByChatId
POST /tg/getInteractionsByChatId
Content-Type: application/json

{
  "chatId": 123456789
}
```

**Параметры:**

- `chatId` (number, обязательный) - ID чата пользователя в Telegram

**Ответ:**

```json
{
  "status": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "chatId": 123456789,
      "type": "scene_view",
      "sceneId": "welcome",
      "sceneText": "Добро пожаловать!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Ошибки:**

```json
{
  "status": false,
  "errors": ["chatId обязателен"]
}
```

```json
{
  "status": false,
  "errors": ["chatId должен быть числом"]
}
```

**Пример использования (JavaScript/TypeScript):**

```typescript
// GET запрос
async function getInteractionsByChatIdGet(chatId: number) {
  try {
    const response = await fetch(`/api/getInteractionsByChatId/${chatId}`);
    const result = await response.json();
    
    if (result.status) {
      return result.data;
    } else {
      console.error('Ошибки:', result.errors);
      return [];
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return [];
  }
}

// POST запрос
async function getInteractionsByChatIdPost(chatId: number) {
  try {
    const response = await fetch('/api/getInteractionsByChatId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId }),
    });
    
    const result = await response.json();
    
    if (result.status) {
      return result.data;
    } else {
      console.error('Ошибки:', result.errors);
      return [];
    }
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return [];
  }
}
```

---

## Примеры использования

### React компонент

```typescript
import { useState, useEffect } from 'react';

interface UserInteraction {
  _id: string;
  chatId: number;
  type: 'scene_view' | 'reminder_sent' | 'reminder_read';
  sceneId?: string;
  sceneText?: string;
  reminderText?: string;
  createdAt: Date;
  // ... другие поля
}

function InteractionsHistory({ chatId }: { chatId?: number }) {
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInteractions();
  }, [chatId]);

  async function loadInteractions() {
    setLoading(true);
    setError(null);
    
    try {
      const url = chatId 
        ? `/api/getInteractionsByChatId/${chatId}`
        : '/api/getAllInteractions';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.status) {
        setInteractions(result.data);
      } else {
        setError(result.errors?.[0] || 'Ошибка загрузки');
      }
    } catch (err) {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h2>История взаимодействий</h2>
      {interactions.length === 0 ? (
        <p>История пуста</p>
      ) : (
        <ul>
          {interactions.map((interaction) => (
            <li key={interaction._id}>
              <strong>{interaction.type}</strong> - {new Date(interaction.createdAt).toLocaleString()}
              {interaction.sceneText && <p>{interaction.sceneText}</p>}
              {interaction.reminderText && <p>{interaction.reminderText}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Axios пример

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Получить всю историю
export async function getAllInteractions() {
  const response = await api.get('/getAllInteractions');
  return response.data;
}

// Получить историю по chatId
export async function getInteractionsByChatId(chatId: number) {
  const response = await api.get(`/getInteractionsByChatId/${chatId}`);
  return response.data;
}

// Или через POST
export async function getInteractionsByChatIdPost(chatId: number) {
  const response = await api.post('/getInteractionsByChatId', { chatId });
  return response.data;
}
```

---

## Обработка ошибок

Все эндпоинты возвращают единый формат ответа:

**Успешный ответ:**
```json
{
  "status": true,
  "data": [...]
}
```

**Ошибка:**
```json
{
  "status": false,
  "errors": ["Описание ошибки"]
}
```

Рекомендуется всегда проверять поле `status` перед использованием данных.

---

## Примечания

1. Все записи сортируются по `createdAt` в порядке убывания (новые сначала)
2. `chatId` должен быть числом
3. Для фильтрации по типу взаимодействия используйте клиентскую фильтрацию массива `data`
4. Для пагинации можно использовать методы массива JavaScript (slice, например)
5. Эндпоинты доступны как через `/api/*`, так и через `/tg/*` - используйте тот, который соответствует вашему сервису

