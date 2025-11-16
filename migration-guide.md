# Инструкция по обновлению клиентских сервисов

## 🔄 Изменения в API эндпоинтах

### 1. **POST /auth/login**

**Было:**
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  isAdmin: boolean;        // ❌ удалено
  isSuperAdmin: boolean;   // ❌ удалено
  tgAccount: string;
}
```

**Стало:**
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  userRole?: 'Admin' | 'SuperAdmin' | 'Marketing' | 'QA';  // ✅ добавлено
  tgAccount: string;
}
```

### 2. **POST /auth/tgLogin**

**Было:**
```typescript
interface TgLoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  isAdmin: boolean;        // ❌ удалено
  isSuperAdmin: boolean;   // ❌ удалено
  tgAccount: string;
  isCreated: boolean;
}
```

**Стало:**
```typescript
interface TgLoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  userRole?: 'Admin' | 'SuperAdmin' | 'Marketing' | 'QA';  // ✅ добавлено
  tgAccount: string;
  isCreated: boolean;
}
```

---

## 🛠️ Что нужно изменить в клиентских сервисах

### 1. **Обновить интерфейсы/типы**

```typescript
// Старые типы - УДАЛИТЬ
interface OldUser {
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// Новые типы - ДОБАВИТЬ
enum UserRole {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  Marketing = 'Marketing',
  QA = 'QA'
}

interface NewUser {
  userRole?: UserRole;
}
```

### 2. **Изменить логику проверки ролей**

**Было:**
```typescript
// Проверка админа
if (user.isAdmin) {
  // админ логика
}

// Проверка суперадмина
if (user.isSuperAdmin) {
  // суперадмин логика
}

// Проверка любого админа
if (user.isAdmin || user.isSuperAdmin) {
  // админ панель
}
```

**Стало:**
```typescript
// Проверка админа
if (user.userRole === 'Admin') {
  // админ логика
}

// Проверка суперадмина
if (user.userRole === 'SuperAdmin') {
  // суперадмин логика
}

// Проверка любого админа
if (user.userRole === 'Admin' || user.userRole === 'SuperAdmin') {
  // админ панель
}

// Проверка новых ролей
if (user.userRole === 'Marketing') {
  // маркетинг логика
}

if (user.userRole === 'QA') {
  // QA логика
}
```

### 3. **Обновить хранение данных пользователя**

**В localStorage/sessionStorage/Redux/Vuex:**
```typescript
// Было
const userData = {
  email: 'user@example.com',
  isAdmin: true,
  isSuperAdmin: false
};

// Стало
const userData = {
  email: 'user@example.com',
  userRole: 'Admin'  // или 'SuperAdmin', 'Marketing', 'QA'
};
```

### 4. **Обновить компоненты UI**

**React пример:**
```tsx
// Было
const AdminPanel = ({ user }) => {
  if (!user.isAdmin && !user.isSuperAdmin) {
    return <div>Нет доступа</div>;
  }
  return <div>Админ панель</div>;
};

// Стало
const AdminPanel = ({ user }) => {
  const hasAdminAccess = ['Admin', 'SuperAdmin'].includes(user.userRole);
  if (!hasAdminAccess) {
    return <div>Нет доступа</div>;
  }
  return <div>Админ панель</div>;
};
```

**Vue пример:**
```vue
<!-- Было -->
<template>
  <div v-if="user.isAdmin || user.isSuperAdmin">
    Админ панель
  </div>
</template>

<!-- Стало -->
<template>
  <div v-if="hasAdminRole">
    Админ панель
  </div>
</template>

<script>
computed: {
  hasAdminRole() {
    return ['Admin', 'SuperAdmin'].includes(this.user.userRole);
  }
}
</script>
```

### 5. **Обновить JWT токен обработку**

```typescript
// Было
interface JWTPayload {
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  tgAccount: string;
}

// Стало
interface JWTPayload {
  email: string;
  userRole?: 'Admin' | 'SuperAdmin' | 'Marketing' | 'QA';
  tgAccount: string;
}
```

---

## 🎯 Рекомендуемый план миграции

### Этап 1: Подготовка
1. Создать новые типы/интерфейсы с `userRole`
2. Добавить хелпер функции для проверки ролей

```typescript
// Хелпер функции
const isAdmin = (user: User) => user.userRole === 'Admin';
const isSuperAdmin = (user: User) => user.userRole === 'SuperAdmin';
const isMarketing = (user: User) => user.userRole === 'Marketing';
const isQA = (user: User) => user.userRole === 'QA';
const hasAdminAccess = (user: User) => ['Admin', 'SuperAdmin'].includes(user.userRole);
```

### Этап 2: Постепенная замена
1. Заменить проверки `isAdmin`/`isSuperAdmin` на новые хелперы
2. Обновить компоненты по одному
3. Тестировать каждое изменение

### Этап 3: Очистка
1. Удалить старые поля из интерфейсов
2. Удалить неиспользуемый код
3. Финальное тестирование

---

## ⚠️ Важные моменты

1. **Обратная совместимость**: Поле `userRole` может быть `undefined` для старых пользователей
2. **Миграция данных**: Нужно обновить локальные данные пользователей
3. **Тестирование**: Проверить все сценарии с разными ролями
4. **Логирование**: Добавить логи для отслеживания проблем миграции

### Пример безопасной проверки:
```typescript
const checkUserRole = (user: User, requiredRole: string) => {
  // Безопасная проверка с fallback на старую логику
  if (user.userRole) {
    return user.userRole === requiredRole;
  }
  
  // Fallback для старых пользователей
  if (requiredRole === 'Admin' && user.isAdmin) return true;
  if (requiredRole === 'SuperAdmin' && user.isSuperAdmin) return true;
  
  return false;
};
```
