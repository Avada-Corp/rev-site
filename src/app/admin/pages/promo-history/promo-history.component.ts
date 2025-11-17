import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { scenesSelector } from '../../store/selectors';
import { getScenesAction } from '../../store/actions/settings.actions';

interface UserInteraction {
  _id: string;
  chatId: number;
  username?: string;
  type: 'scene_view' | 'reminder_sent' | 'reminder_read';
  sceneId?: string;
  sceneText?: string;
  sceneButtons?: Array<{
    text: string;
    targetSceneId: string;
  }>;
  previousSceneId?: string;
  clickedAt?: Date;
  scheduledMessageId?: string;
  reminderText?: string;
  sentAt?: Date;
  isRead?: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SceneGroup {
  sceneId: string;
  sceneName?: string;
  sceneText?: string;
  isExpanded: boolean;
  users: Array<{
    chatId: number;
    username?: string;
    viewCount: number;
    lastViewed: Date;
  }>;
}

@Component({
  selector: 'app-promo-history',
  templateUrl: './promo-history.component.html',
  styleUrls: ['./promo-history.component.scss'],
})
export class PromoHistoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allInteractions: UserInteraction[] = [];
  loading = false;
  viewMode: 'grouped' | 'user' = 'grouped';
  selectedChatId: number | null = null;
  userInteractions: UserInteraction[] = [];

  sceneGroups: SceneGroup[] = [];
  uniqueChatIds: number[] = [];
  scenesMap: Map<string, string> = new Map(); // Map<sceneId, name>

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
    private store: Store
  ) {}

  ngOnInit() {
    // Загружаем сцены для получения name
    this.store.dispatch(getScenesAction());
    
    this.loadAllInteractions();
    
    // Подписываемся на изменения сцен
    this.store.select(scenesSelector).pipe(takeUntil(this.destroy$)).subscribe(scenes => {
      this.scenesMap.clear();
      scenes.forEach(scene => {
        if (scene.name) {
          this.scenesMap.set(scene.sceneId, scene.name);
        }
      });
      // Обновляем группы сцен, если они уже загружены
      if (this.sceneGroups.length > 0) {
        this.updateSceneGroupsNames();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllInteractions() {
    this.loading = true;
    this.adminService
      .getAllInteractions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status && response.data) {
            this.allInteractions = response.data;
            this.processInteractions();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: response.errors?.[0] || 'Не удалось загрузить историю',
            });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Ошибка загрузки взаимодействий:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Ошибка при загрузке истории взаимодействий',
          });
          this.loading = false;
        },
      });
  }

  processInteractions() {
    // Получаем уникальные chatId
    this.uniqueChatIds = [
      ...new Set(this.allInteractions.map((i) => i.chatId)),
    ].sort((a, b) => a - b);

    // Группируем по сценам (только scene_view)
    const sceneMap = new Map<string, Map<number, { count: number; lastDate: Date }>>();

    this.allInteractions
      .filter((i) => i.type === 'scene_view' && i.sceneId)
      .forEach((interaction) => {
        const sceneId = interaction.sceneId!;
        const chatId = interaction.chatId;
        const createdAt = new Date(interaction.createdAt);

        if (!sceneMap.has(sceneId)) {
          sceneMap.set(sceneId, new Map());
        }

        const userMap = sceneMap.get(sceneId)!;
        if (!userMap.has(chatId)) {
          userMap.set(chatId, { count: 0, lastDate: createdAt });
        }

        const userData = userMap.get(chatId)!;
        userData.count++;
        if (createdAt > userData.lastDate) {
          userData.lastDate = createdAt;
        }
      });

    // Преобразуем в массив SceneGroup
    this.sceneGroups = Array.from(sceneMap.entries()).map(([sceneId, userMap]) => {
      return {
        sceneId,
        sceneName: this.scenesMap.get(sceneId),
        sceneText: this.scenesMap.get(sceneId) || sceneId,
        isExpanded: false,
        users: Array.from(userMap.entries())
          .map(([chatId, data]) => {
            // Находим username для этого chatId из всех взаимодействий
            const userInteraction = this.allInteractions.find(
              (i) => i.chatId === chatId && i.username
            );
            return {
              chatId,
              username: userInteraction?.username,
              viewCount: data.count,
              lastViewed: data.lastDate,
            };
          })
          .sort((a, b) => b.viewCount - a.viewCount),
      };
    });

    // Сортируем группы по количеству пользователей
    this.sceneGroups.sort((a, b) => b.users.length - a.users.length);
  }

  updateSceneGroupsNames() {
    this.sceneGroups.forEach(group => {
      const name = this.scenesMap.get(group.sceneId);
      if (name) {
        group.sceneName = name;
        group.sceneText = name;
      }
    });
  }

  switchToUserView(chatId: number) {
    this.selectedChatId = chatId;
    this.viewMode = 'user';
    this.loadUserInteractions(chatId);
  }

  getCurrentUserUsername(): string | undefined {
    if (!this.selectedChatId) return undefined;
    const userInteraction = this.userInteractions.find(
      (i) => i.chatId === this.selectedChatId && i.username
    );
    return userInteraction?.username;
  }

  loadUserInteractions(chatId: number) {
    this.loading = true;
    this.adminService
      .getInteractionsByChatId(chatId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status && response.data) {
            this.userInteractions = response.data.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: response.errors?.[0] || 'Не удалось загрузить историю пользователя',
            });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Ошибка загрузки истории пользователя:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Ошибка при загрузке истории пользователя',
          });
          this.loading = false;
        },
      });
  }

  backToGroupedView() {
    this.viewMode = 'grouped';
    this.selectedChatId = null;
    this.userInteractions = [];
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      scene_view: 'Просмотр сцены',
      reminder_sent: 'Отправлено напоминание',
      reminder_read: 'Прочитано напоминание',
    };
    return labels[type] || type;
  }

  toggleSceneGroup(group: SceneGroup) {
    group.isExpanded = !group.isExpanded;
  }

  getUserDisplayName(chatId: number, username?: string): string {
    return username || chatId.toString();
  }

  getUserLink(username?: string): string | null {
    if (!username) return null;
    const cleanUsername = username.replace('@', '');
    return `https://t.me/${cleanUsername}`;
  }

  getSceneDisplayName(sceneId?: string): string | undefined {
    if (!sceneId) return undefined;
    return this.scenesMap.get(sceneId) || sceneId;
  }
}

