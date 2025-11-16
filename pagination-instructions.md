# Инструкция по пагинации для getAdminUsers

## Описание
Эндпоинт `/admin/getUsers` теперь поддерживает пагинацию для оптимизации загрузки больших списков пользователей.

## Запрос
```typescript
// POST /admin/getUsers
{
  "page": 2,        // номер страницы (optional, default: 1)
  "limit": 10,      // количество записей на странице (optional, default: 50)
  // ... остальные параметры
}
```

## Ответ
```typescript
interface Response {
  status: boolean;
  data: ApiWithEmail[];    // массив пользователей
  meta: {
    page: number;          // текущая страница
    limit: number;         // записей на странице
    total: number;         // всего записей
    totalPages: number;    // всего страниц
    hasNext: boolean;      // есть ли следующая страница
    hasPrev: boolean;      // есть ли предыдущая страница
  };
}
```

## Примеры использования

### Первая страница
```javascript
const response = await fetch('/admin/getUsers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ page: 1, limit: 20 })
});

const { data, meta } = await response.json();
// meta: { page: 1, limit: 20, total: 150, totalPages: 8, hasNext: true, hasPrev: false }
```

### Навигация
```javascript
// Следующая страница
if (meta.hasNext) {
  fetchUsers(meta.page + 1, meta.limit);
}

// Предыдущая страница  
if (meta.hasPrev) {
  fetchUsers(meta.page - 1, meta.limit);
}

// Последняя страница
fetchUsers(meta.totalPages, meta.limit);
```

### Компонент пагинации
```javascript
const PaginationControls = ({ meta, onPageChange }) => (
  <div className="pagination-controls">
    <button 
      disabled={!meta.hasPrev}
      onClick={() => onPageChange(meta.page - 1)}
    >
      ← Назад
    </button>
    
    <span className="page-info">
      Страница {meta.page} из {meta.totalPages}
    </span>
    
    <button 
      disabled={!meta.hasNext}
      onClick={() => onPageChange(meta.page + 1)}
    >
      Вперед →
    </button>
    
    <span className="total-info">
      Всего записей: {meta.total}
    </span>
  </div>
);
```

### Полный пример компонента
```javascript
import React, { useState, useEffect } from 'react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await fetch('/admin/getUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, limit })
      });
      
      const result = await response.json();
      
      if (result.status) {
        setUsers(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage, meta.limit);
  };

  return (
    <div>
      <h1>Управление пользователями</h1>
      
      {loading && <div>Загрузка...</div>}
      
      <div className="users-list">
        {users.map(user => (
          <div key={user.email} className="user-card">
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>Маркет: {user.market}</p>
            <p>Реферал: {user.parentRef}</p>
          </div>
        ))}
      </div>

      {meta && (
        <div className="pagination">
          <button 
            disabled={!meta.hasPrev || loading}
            onClick={() => handlePageChange(meta.page - 1)}
          >
            ← Предыдущая
          </button>
          
          <span>
            {meta.page} / {meta.totalPages} 
            (показано {users.length} из {meta.total})
          </span>
          
          <button 
            disabled={!meta.hasNext || loading}
            onClick={() => handlePageChange(meta.page + 1)}
          >
            Следующая →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
```

## Обновленные типы TypeScript

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AdminUsersResponse {
  status: boolean;
  data: ApiWithEmail[];
  meta: PaginationMeta;
}

interface AdminUsersRequest {
  page?: number;
  limit?: number;
  // ... другие поля
}
```

## Рекомендации

1. **Дефолтные значения**: Если не передать `page` и `limit`, используются значения по умолчанию (page=1, limit=50)

2. **Оптимизация**: Используйте разумные значения `limit` (10-50 записей) для баланса между производительностью и UX

3. **Индикаторы загрузки**: Обязательно показывайте индикатор загрузки при переключении страниц

4. **Обработка ошибок**: Предусмотрите обработку ошибок сети и некорректных ответов

5. **URL параметры**: Рассмотрите возможность сохранения текущей страницы в URL для возможности прямых ссылок

6. **Кэширование**: При необходимости можно кэшировать загруженные страницы для улучшения UX 