import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ShiftAttendanceWidget from "@/components/attendance/ShiftAttendanceWidget";
import { getUserRole, getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/auth";
import VietnamClock from "@/components/VietnamClock";

const Attendance = () => {
  const [role, setRole] = useState<UserRole>('staff');

  useEffect(() => {
    const loadRole = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      const userRole = await getUserRole(user.id);
      setRole(userRole);
    };
    loadRole();
  }, []);

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Chấm Công
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý chấm công theo ca làm việc và theo dõi tăng ca
            </p>
          </div>
          <VietnamClock />
        </div>

        {/* Content */}
        <ShiftAttendanceWidget />
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
