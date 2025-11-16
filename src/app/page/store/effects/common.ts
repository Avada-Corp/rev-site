import { Message, MessageService } from 'primeng/api';

export function showErrors(
  errors: string[] = [],
  messageService: MessageService
) {
  for (const error of errors) {
    messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 10000,
    });
  }
}

export function showInfoMessages(
  messages: string[],
  messageService: MessageService
) {
  const messagesInfo: Message[] = messages.map((text) => ({
    severity: 'info',
    summary: 'Info',
    life: 8000,
    detail: text,
  }));
  messageService.addAll(messagesInfo);
}
