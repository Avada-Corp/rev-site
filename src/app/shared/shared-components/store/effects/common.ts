import { MessageService } from 'primeng/api';

export function showErrors(errors: string[], messageService: MessageService) {
  for (const error of errors) {
    messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 10000,
    });
  }
}
