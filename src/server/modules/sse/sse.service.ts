import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private connections = new Map<string, Subject<MessageEvent>[]>();

  register(userId: string, subject: Subject<MessageEvent>) {
    const subjects = this.connections.get(userId) || [];
    subjects.push(subject);
    this.connections.set(userId, subjects);
  }

  unregister(userId: string, subject: Subject<MessageEvent>) {
    const subjects = this.connections.get(userId);
    if (!subjects) return;

    const filtered = subjects.filter(s => s !== subject);
    if (filtered.length === 0) {
      this.connections.delete(userId);
    } else {
      this.connections.set(userId, filtered);
    }
  }

  emit(account: string, event: string, payload: any) {
    if (!account || !event || !payload) return;

    const subjects = this.connections.get(account);
    if (!subjects) return;

    for (const subject of subjects) {
      subject.next({
        data: JSON.stringify({ event, data: payload }),
      } as MessageEvent);
    }
  }
}
