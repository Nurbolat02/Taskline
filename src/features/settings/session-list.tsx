"use client";

import { useSessionRevoke } from "@/hooks/use-session-revoke";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/db/schema";
import listStyles from "@/styles/list.module.css";
import styles from "./session-list.module.css";

export function SessionList({ sessions, currentSessionId }: { sessions: Session[]; currentSessionId: string | null }) {
  return (
    <ul className={listStyles.list}>
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} isCurrent={session.id === currentSessionId} />
      ))}
    </ul>
  );
}

function SessionRow({ session, isCurrent }: { session: Session; isCurrent: boolean }) {
  const { isRevoking, revokeSession } = useSessionRevoke(session.id);
  const isActive = !session.revokedAt && new Date(session.expiresAt) > new Date();

  return (
    <li className={listStyles.row}>
      <div className={styles.info}>
        <div className={styles.deviceLine}>
          <span>{session.userAgent ?? "Неизвестное устройство"}</span>
          {isCurrent && <Badge variant="secondary">Это устройство</Badge>}
          {!isActive && <Badge variant="outline">Завершена</Badge>}
        </div>
        <span className={styles.meta}>
          Создана: {new Date(session.createdAt).toLocaleString("ru-RU")}
          {session.ipAddress ? ` · IP: ${session.ipAddress}` : ""}
        </span>
      </div>
      {isActive && !isCurrent && (
        <Button variant="outline" size="sm" disabled={isRevoking} onClick={revokeSession}>
          Завершить
        </Button>
      )}
    </li>
  );
}
