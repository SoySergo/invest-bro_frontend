import { auth } from "@/lib/auth";
import { getUserNotifications, getUnreadNotificationCount } from "@/lib/data/notifications";
import { NotificationBell } from "@/components/shared/notification-bell";

export async function NotificationBellWrapper() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(session.user.id, 20),
    getUnreadNotificationCount(session.user.id),
  ]);

  return (
    <NotificationBell
      initialNotifications={notifications}
      initialUnreadCount={unreadCount}
    />
  );
}
