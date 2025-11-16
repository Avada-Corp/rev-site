# Инструкция по формированию таблицы "Комиссии за период"

## Обзор

Таблица "Комиссии за период" формируется на основе данных от API запроса `getWalletHistory` и содержит детализированную информацию о комиссиях пользователей с расчётными полями для финансовой аналитики.

## API запрос getWalletHistory

### Запрос
```
POST /admin/getWalletHistory
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Структура ответа
```json
{
  "status": true,
  "data": [
    {
      "email": "user@example.com",
      "explanation": "Комиссия за период... {\"startDate\":1640995200000,\"endDate\":1641081600000,\"apis\":[...]}",
      "amount": 2500, // в центах
      "date": "2025-01-15T10:30:00.000Z",
      "type": "commission",
      "explanationData": {
        "apiName": "API_NAME_1",
        "startBalance": 1000.50,
        "endBalance": 1200.75,
        "realizedPnl": 150.25,
        "startPnl": -50.00,
        "endPnl": 100.25,
        "startPeriod": "1/15/2025",
        "endPeriod": "1/31/2025"
      }
    }
  ]
}
```

## Обработка данных

### 1. Фильтрация транзакций
Из всех транзакций выбираются только те, где `type === "commission"`:

```javascript
const walletCommissions = allTransactions.filter(
  (t) => t.type === TransactionType.COMMISSION
);
```

### 2. Сортировка по дате
Комиссии сортируются по дате в убывающем порядке (новые сверху):

```javascript
commissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
```

## Структура таблицы

### Колонки
1. **Ключ** - Название API
2. **Период** - Период расчёта комиссии
3. **Доступный баланс (начало)** - Баланс на начало периода
4. **unPNL начало** - Нереализованная прибыль на начало
5. **Доступный баланс (конец)** - Баланс на конец периода
6. **unPNL конец** - Нереализованная прибыль на конец
7. **PNL** - Реализованная прибыль/убыток
8. **unPNL** - Изменение нереализованной прибыли
9. **Общая прибыль** - Общая прибыль (PNL + unPNL)
10. **Комиссия** - Размер комиссии
11. **Чистая прибыль** - Прибыль после вычета комиссии

## Логика расчёта полей

### Получение API данных
Для каждой комиссии ищется соответствующий API в JSON данных explanation:

```javascript
// Поиск API с комиссией, близкой к текущей (разница < 2)
const api = apis.find(api => 
  Math.abs(api.commission * 100 - commission.amount) < 2
) || null;
```

### Расчёт полей с приоритетом источников данных

#### 1. API Name (Ключ)
```javascript
const apiName = explanationData?.apiName || api?.apiName || 'Не найдено';
```

#### 2. Start Balance (Начальный баланс)
```javascript
const startBalance = explanationData?.startBalance ?? 
                    api?.startBalance ?? 
                    api?.totalBalanceStart ?? 
                    jsonData?.startBalance ?? 
                    0;
```

#### 3. End Balance (Конечный баланс)
```javascript
const endBalance = explanationData?.endBalance ?? 
                  api?.endBalance ?? 
                  api?.totalBalance ?? 
                  jsonData?.endBalance ?? 
                  0;
```

#### 4. PNL (Реализованная прибыль)
```javascript
const pnl = explanationData?.realizedPnl ?? 
           api?.cumulativePnl ?? 
           api?.realizedPnl ?? 
           jsonData?.realizedPnl ?? 
           0;
```

#### 5. Start PNL (Начальный PNL)
```javascript
const startPnl = explanationData?.startPnl ?? 
                api?.startPnl ?? 
                jsonData?.startPnl ?? 
                0;
```

#### 6. End PNL (Конечный PNL)
```javascript
const endPnl = explanationData?.endPnl ?? 
              api?.endPnl ?? 
              jsonData?.endPnl ?? 
              0;
```

#### 7. unPNL (Изменение нереализованной прибыли)
```javascript
const unPnl = endPnl - startPnl;
```

#### 8. Earned (Общая прибыль)
```javascript
const earned = pnl + unPnl;
```

#### 9. Commission (Комиссия)
```javascript
const commission = amount / 100; // amount хранится в центах
```

#### 10. Net Profit (Чистая прибыль)
```javascript
const netProfit = earned - (amount / 100);
```

### Форматирование периода
Период извлекается из `explanationData` или парсится из JSON в `explanation`:

```javascript
// Из explanationData (американский формат M/d/yyyy)
const period = `${formatPeriodDate(startPeriod)}-${formatPeriodDate(endPeriod)}`;

// Или из JSON данных
const period = `${formatDate(startDate)}-${formatDate(endDate)}`;

// Форматирование американского формата в русский
function formatPeriodDate(dateString) {
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    const year = match[3];
    return `${day}.${month}.${year}`;
  }
  return dateString;
}
```

## Стилизация и подсветка значений

### CSS классы для подсветки
```css
.positive-value {
  color: #28a745;
  font-weight: 600;
}

.negative-value {
  color: #dc3545;
  font-weight: 600;
}
```

### Логика применения стилей
```javascript
// Для каждого числового поля применяется условная стилизация
<span [ngClass]="{
  'positive-value': value > 0, 
  'negative-value': value < 0
}">
  {{formattedValue}}
</span>
```

## HTML структура таблицы

```html
<p-table [value]="commissionTableData" styleClass="p-datatable-striped">
  <ng-template pTemplate="header">
    <tr>
      <th rowspan="2">Ключ</th>
      <th rowspan="2">Период</th>
      <th colspan="4">Доступный баланс (с учетом unPNL)</th>
      <th rowspan="2">PNL</th>
      <th rowspan="2">unPNL</th>
      <th rowspan="2">Общая прибыль</th>
      <th rowspan="2">Комиссия</th>
      <th rowspan="2">Чистая прибыль</th>
    </tr>
    <tr>
      <th>Начало</th>
      <th>unPNL начало</th>
      <th>Конец</th>
      <th>unPNL конец</th>
    </tr>
  </ng-template>
  
  <ng-template pTemplate="body" let-commission>
    <tr>
      <td>{{commission.apiName}}</td>
      <td>{{getCommissionPeriod(commission)}}</td>
      <td><span [ngClass]="getValueClass(commission.startBalance)">
        {{commission.startBalance}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.startPnl)">
        {{commission.startPnl}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.endBalance)">
        {{commission.endBalance}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.endPnl)">
        {{commission.endPnl}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.pnl)">
        {{commission.pnl}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.unPnl)">
        {{commission.unPnl}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.earned)">
        {{commission.earned}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.amount)">
        {{(commission.amount/100).toFixed(2)}}
      </span></td>
      <td><span [ngClass]="getValueClass(commission.netProfit)">
        {{commission.netProfit}}
      </span></td>
    </tr>
  </ng-template>
</p-table>
```

## Воспроизведение для PDF

### 1. Структура данных для PDF
```javascript
const pdfTableData = commissions.map(commission => ({
  apiName: commission.apiName,
  period: getCommissionPeriod(commission),
  startBalance: formatNumber(commission.startBalance),
  startPnl: formatNumber(commission.startPnl), 
  endBalance: formatNumber(commission.endBalance),
  endPnl: formatNumber(commission.endPnl),
  pnl: formatNumber(commission.pnl),
  unPnl: formatNumber(commission.unPnl),
  earned: formatNumber(commission.earned),
  commission: formatNumber(commission.amount / 100),
  netProfit: formatNumber(commission.netProfit),
  // Цветовые классы для PDF
  startBalanceColor: getColorClass(commission.startBalance),
  startPnlColor: getColorClass(commission.startPnl),
  endBalanceColor: getColorClass(commission.endBalance),
  endPnlColor: getColorClass(commission.endPnl),
  pnlColor: getColorClass(commission.pnl),
  unPnlColor: getColorClass(commission.unPnl),
  earnedColor: getColorClass(commission.earned),
  commissionColor: getColorClass(commission.amount),
  netProfitColor: getColorClass(commission.netProfit)
}));
```

### 2. Функция определения цвета
```javascript
function getColorClass(value) {
  if (value > 0) return 'green';
  if (value < 0) return 'red';
  return 'black';
}

function formatNumber(value) {
  return value?.toFixed(2) || '0.00';
}
```

### 3. Пример генерации PDF таблицы
```javascript
const tableHeaders = [
  'Ключ', 'Период', 'Начало', 'unPNL начало', 
  'Конец', 'unPNL конец', 'PNL', 'unPNL', 
  'Общая прибыль', 'Комиссия', 'Чистая прибыль'
];

const tableRows = pdfTableData.map(row => [
  { text: row.apiName, color: 'black' },
  { text: row.period, color: 'black' },
  { text: row.startBalance, color: row.startBalanceColor },
  { text: row.startPnl, color: row.startPnlColor },
  { text: row.endBalance, color: row.endBalanceColor },
  { text: row.endPnl, color: row.endPnlColor },
  { text: row.pnl, color: row.pnlColor },
  { text: row.unPnl, color: row.unPnlColor },
  { text: row.earned, color: row.earnedColor },
  { text: row.commission, color: row.commissionColor },
  { text: row.netProfit, color: row.netProfitColor }
]);
```

## Важные моменты

1. **Приоритет данных**: `explanationData` > `api` > `jsonData` > `0`
2. **Формат суммы**: API возвращает amount в центах, нужно делить на 100
3. **Парсинг JSON**: Данные могут быть в поле `explanation` как JSON строка
4. **Форматы дат**: Американский формат M/d/yyyy конвертируется в dd.mm.yyyy
5. **Поиск API**: Ищется по близости комиссии (разница < 2)
6. **Цветовая кодировка**: Зелёный для положительных, красный для отрицательных значений
7. **Сортировка**: По дате убывание (новые сверху)

Эта инструкция позволит воспроизвести логику формирования таблицы "Комиссии за период" в любой другой системе с сохранением всех расчётов и стилизации.
