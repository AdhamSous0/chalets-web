import { AdminGate } from "./admin-gate";

export const metadata = {
  title: "لوحة التحكم — شاليهاتي",
  description: "إدارة الشاليهات والمستخدمين.",
};

export default function AdminPage() {
  return <AdminGate />;
}
