import { BotStatus } from 'src/app/shared/types/botStatus.interface';

export interface CurrentUserApi {
  key: string;
  secret: string;
  name: string;
  market: string;
  id: string;
  status: BotStatus;
  startedBotLongCount: string;
  startedBotShortCount: string;
  botIds: string[];
}
export interface EditApi {
  key: string;
  secret: string;
  name: string;
  market: string;
  id?: string;
  rev_id?: string;
}
