export type AgeGroup = 'أطفال' | 'يافعين' | 'شباب' | 'كبار';

export type TimeSlot = 'صباح' | 'ظهر' | 'عصر' | 'مغرب' | 'عشاء';

export type Circle = {
  id: string;
  title: string;
  mosqueName: string;
  district: string;
  startsAt: string; // ISO
  durationMin: number;
  focus?: string;
  ageGroups: AgeGroup[];
  capacity: number;
  joinedCount: number;
  address?: string;
  lat: number;
  lng: number;
  notes?: string;
  teacherName?: string;
};

export type JoinRecord = {
  circleId: string;
  name: string;
  phone?: string;
  joinedAt: string;
};
