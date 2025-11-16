export interface BotStatus {
  status: string;
  started: number;
  stopped: number;
  waitForStart: number;
  waitForStop: number;
}
