# Обновление API: отправка картинок в GET запросе `/admin/scenes`

## Что изменилось

Эндпоинт **GET** `/admin/scenes` теперь возвращает не только JSON данные, но и **превью изображений** в формате `multipart/form-data`.

### Основные изменения:

1. **Формат ответа**: Изменен с JSON на `multipart/form-data`
2. **Превью изображений**: Все изображения автоматически ресайзятся до максимум 100px по большей стороне и конвертируются в JPEG
3. **Структура данных**: JSON данные находятся в поле `scenesData`, изображения передаются отдельными частями

---

## Структура ответа

Ответ приходит в формате **multipart/form-data** с следующими частями:

### 1. `scenesData` (JSON строка)
Массив объектов сцен (как и раньше):
```json
[
  {
    "sceneId": "welcome_scene",
    "welcomeText": "Добро пожаловать!",
    "welcomeButtons": [...],
    "reminders": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

### 2. `welcomeImage_0`, `welcomeImage_1`, ... (бинарные файлы, опционально)
Превью изображений сцен. Индекс соответствует позиции сцены в массиве `scenesData`:
- `welcomeImage_0` - превью для `scenesData[0]`
- `welcomeImage_1` - превью для `scenesData[1]`
- и т.д.

**Формат**: JPEG, до 100px по большей стороне

### 3. `reminderImage_0_0`, `reminderImage_0_1`, `reminderImage_1_0`, ... (бинарные файлы, опционально)
Превью изображений напоминаний. Формат имени: `reminderImage_{sceneIndex}_{reminderIndex}`
- `reminderImage_0_0` - превью для `scenesData[0].reminders[0]`
- `reminderImage_0_1` - превью для `scenesData[0].reminders[1]`
- `reminderImage_1_0` - превью для `scenesData[1].reminders[0]`
- и т.д.

**Формат**: JPEG, до 100px по большей стороне

---

## Пример обработки на JavaScript/TypeScript

```typescript
import axios from 'axios';
import { parse } from 'multipart-form-data';

interface SceneData {
  sceneId: string;
  welcomeText: string;
  welcomeButtons: any[];
  reminders: Array<{
    timer: number;
    text: string;
    buttons: any[];
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface SceneWithPreview {
  scene: SceneData;
  welcomeImageUrl?: string;
  reminderImageUrls: Map<number, string>;
}

async function getScenes(authToken: string): Promise<SceneWithPreview[]> {
  const response = await axios.get('https://your-server.com/admin/scenes', {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    responseType: 'arraybuffer', // Важно: получаем бинарные данные
  });

  // Парсим multipart/form-data
  const contentType = response.headers['content-type'];
  const boundary = contentType.split('boundary=')[1];
  
  const parts = parse(Buffer.from(response.data), boundary);
  
  let scenesData: SceneData[] = [];
  const imagesMap = new Map<string, Blob>(); // ключ: имя поля, значение: Blob
  
  for (const part of parts) {
    const fieldName = part.name;
    
    if (fieldName === 'scenesData') {
      scenesData = JSON.parse(part.data.toString('utf-8'));
    } else {
      // Сохраняем все изображения в Map
      imagesMap.set(fieldName, new Blob([part.data], { type: part.type || 'image/jpeg' }));
    }
  }
  
  // Собираем результат: для каждой сцены находим соответствующие изображения
  return scenesData.map((scene, sceneIndex) => {
    const result: SceneWithPreview = {
      scene,
      reminderImageUrls: new Map(),
    };
    
    // Ищем welcomeImage для этой сцены
    const welcomeImageKey = `welcomeImage_${sceneIndex}`;
    if (imagesMap.has(welcomeImageKey)) {
      result.welcomeImageUrl = URL.createObjectURL(imagesMap.get(welcomeImageKey)!);
    }
    
    // Ищем reminderImages для этой сцены
    scene.reminders.forEach((_, reminderIndex) => {
      const reminderImageKey = `reminderImage_${sceneIndex}_${reminderIndex}`;
      if (imagesMap.has(reminderImageKey)) {
        result.reminderImageUrls.set(
          reminderIndex,
          URL.createObjectURL(imagesMap.get(reminderImageKey)!)
        );
      }
    });
    
    return result;
  });
}
```

---

## Пример обработки на React

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { parse } from 'multipart-form-data';

interface Scene {
  sceneId: string;
  welcomeText: string;
  welcomeButtons: any[];
  reminders: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface SceneWithPreview {
  scene: Scene;
  welcomeImageUrl?: string;
  reminderImageUrls: Map<number, string>;
}

function ScenesList() {
  const [scenes, setScenes] = useState<SceneWithPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScenes() {
      try {
        const response = await axios.get('/admin/scenes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'arraybuffer',
        });

        const contentType = response.headers['content-type'];
        const boundary = contentType.split('boundary=')[1];
        const parts = parse(Buffer.from(response.data), boundary);

        let scenesData: Scene[] = [];
        const imagesMap = new Map<string, Blob>();

        for (const part of parts) {
          if (part.name === 'scenesData') {
            scenesData = JSON.parse(part.data.toString('utf-8'));
          } else {
            imagesMap.set(part.name, new Blob([part.data], { type: part.type || 'image/jpeg' }));
          }
        }

        const scenesWithPreviews: SceneWithPreview[] = scenesData.map((scene, sceneIndex) => {
          const result: SceneWithPreview = {
            scene,
            reminderImageUrls: new Map(),
          };

          const welcomeImageKey = `welcomeImage_${sceneIndex}`;
          if (imagesMap.has(welcomeImageKey)) {
            result.welcomeImageUrl = URL.createObjectURL(imagesMap.get(welcomeImageKey)!);
          }

          scene.reminders.forEach((_, reminderIndex) => {
            const reminderImageKey = `reminderImage_${sceneIndex}_${reminderIndex}`;
            if (imagesMap.has(reminderImageKey)) {
              result.reminderImageUrls.set(
                reminderIndex,
                URL.createObjectURL(imagesMap.get(reminderImageKey)!)
              );
            }
          });

          return result;
        });

        setScenes(scenesWithPreviews);
      } catch (error) {
        console.error('Ошибка при загрузке сцен:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchScenes();
  }, []);

  // Освобождаем память при размонтировании
  useEffect(() => {
    return () => {
      scenes.forEach(scene => {
        if (scene.welcomeImageUrl) {
          URL.revokeObjectURL(scene.welcomeImageUrl);
        }
        scene.reminderImageUrls.forEach(url => {
          URL.revokeObjectURL(url);
        });
      });
    };
  }, [scenes]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      {scenes.map((sceneWithPreview, index) => (
        <div key={index} className="scene-card">
          <h3>{sceneWithPreview.scene.sceneId}</h3>
          <p>{sceneWithPreview.scene.welcomeText}</p>
          
          {sceneWithPreview.welcomeImageUrl && (
            <img 
              src={sceneWithPreview.welcomeImageUrl} 
              alt="Welcome" 
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}

          {sceneWithPreview.scene.reminders.map((reminder, reminderIndex) => (
            <div key={reminderIndex}>
              <p>{reminder.text}</p>
              {sceneWithPreview.reminderImageUrls.has(reminderIndex) && (
                <img 
                  src={sceneWithPreview.reminderImageUrls.get(reminderIndex)!} 
                  alt={`Reminder ${reminderIndex}`}
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## Важные замечания

### Характеристики превью

1. **Размер**: До 100px по большей стороне (с сохранением пропорций)
2. **Формат**: Всегда JPEG (`image/jpeg`), независимо от исходного формата
3. **Качество**: JPEG качество 85% для баланса между размером и качеством
4. **Размер файла**: Превью значительно меньше оригиналов (обычно в 10-100 раз)

### Индексация изображений

- **Welcome изображения**: `welcomeImage_{sceneIndex}` где `sceneIndex` - индекс сцены в массиве `scenesData`
- **Reminder изображения**: `reminderImage_{sceneIndex}_{reminderIndex}` где:
  - `sceneIndex` - индекс сцены в массиве `scenesData`
  - `reminderIndex` - индекс напоминания в массиве `reminders` этой сцены

### Обработка ошибок

При ошибке ответ приходит в формате JSON (не multipart):
```json
{
  "status": false,
  "errors": ["Ошибка при получении списка сцен"]
}
```

HTTP статус коды:
- `200` - успешно
- `401` - не авторизован
- `500` - внутренняя ошибка сервера

### Рекомендации

1. **Освобождение памяти**: Не забывайте освобождать созданные `URL.createObjectURL()` через `URL.revokeObjectURL()` после использования (особенно в React при размонтировании компонента)

2. **Обработка отсутствующих изображений**: Всегда проверяйте наличие изображений перед использованием, так как они опциональны

3. **Использование превью**: Превью идеально подходят для списков и миниатюр. Если нужны полные изображения, используйте прямые ссылки на файлы через URL из базы данных

4. **Библиотеки для парсинга**: Для парсинга multipart/form-data рекомендуется использовать библиотеку `multipart-form-data`:
   ```bash
   npm install multipart-form-data
   ```
