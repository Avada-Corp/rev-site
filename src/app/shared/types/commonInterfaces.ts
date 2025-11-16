export enum BotStatus {
  Started = 'Запущен',
  WaitStop = 'Ожидание остановки',
  Stopped = 'Остановлен',
  NeedCreate = 'Еще не создан',
  Creating = 'Создается',
  NotFind = 'Не найден юзер',
  Unknown = 'Неизвестен',
}

export const BotStatusServer: Record<string, BotStatus> = {
  Started: BotStatus.Started,
  WaitStop: BotStatus.WaitStop,
  Stopped: BotStatus.Stopped,
  NeedCreate: BotStatus.NeedCreate,
  Creating: BotStatus.Creating,
  NotFind: BotStatus.NotFind,
  Unknown: BotStatus.Unknown,
};
