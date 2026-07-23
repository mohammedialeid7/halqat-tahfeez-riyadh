import type { AgeGroup, Circle, TimeSlot } from '@/types/circle';

/** Upcoming men's circles across Riyadh — relative to "now" for a living demo. */
function atHourOffset(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const DISTRICTS = [
  'الكل',
  'العليا',
  'الملز',
  'النسيم',
  'الياسمين',
  'قرطبة',
  'السليمانية',
  'الروضة',
  'الشفا',
  'النرجس',
  'الملقا',
  'حطين',
  'القيروان',
  'الصحافة',
  'الغدير',
  'الورود',
  'المصيف',
  'المرسلات',
  'التعاون',
  'الربوة',
  'المنصورة',
  'العزيزية',
  'الدرعية',
  'ظهرة لبن',
  'طويق',
  'العريجاء',
  'السويدي',
  'شبرا',
  'الفيصلية',
  'المنار',
] as const;

export const AGE_GROUPS: AgeGroup[] = ['أطفال', 'يافعين', 'شباب', 'كبار'];

export const TIME_SLOTS: TimeSlot[] = ['صباح', 'ظهر', 'عصر', 'مغرب', 'عشاء'];

/** Map wall-clock hour to a filterable time slot. */
export function getTimeSlot(iso: string): TimeSlot {
  const hour = new Date(iso).getHours();
  if (hour < 12) return 'صباح';
  if (hour < 15) return 'ظهر';
  if (hour < 18) return 'عصر';
  if (hour < 20) return 'مغرب';
  return 'عشاء';
}

/** حلقات رجال فقط */
export const CIRCLES: Circle[] = [
  {
    id: '1',
    title: 'حلقة تحفيظ جزء عمّ',
    mosqueName: 'جامع الراجحي',
    district: 'العليا',
    startsAt: atHourOffset(0, 16, 30),
    durationMin: 60,
    focus: 'جزء عمّ — مراجعة وتثبيت',
    ageGroups: ['شباب', 'كبار'],
    capacity: 25,
    joinedCount: 14,
    address: 'طريق الملك فهد، حي العليا، الرياض',
    lat: 24.6956,
    lng: 46.6857,
    teacherName: 'الأستاذ خالد العتيبي',
    notes: 'يُفضّل إحضار المصحف. الحلقة بعد صلاة العصر مباشرة.',
  },
  {
    id: '2',
    title: 'حلقة حفظ سورة البقرة',
    mosqueName: 'مسجد جامعة الإمام سعود',
    district: 'الملز',
    startsAt: atHourOffset(0, 19, 45),
    durationMin: 75,
    focus: 'حفظ البقرة — الأوجه الأولى',
    ageGroups: ['شباب'],
    capacity: 30,
    joinedCount: 22,
    address: 'حي الملز، قرب جامعة الإمام سعود',
    lat: 24.7136,
    lng: 46.735,
    teacherName: 'الأستاذ عبدالعزيز الشمري',
    notes: 'للمبتدئين والمتوسطين.',
  },
  {
    id: '3',
    title: 'مجلس تدبّر وتلاوة',
    mosqueName: 'جامع الملك خالد',
    district: 'السليمانية',
    startsAt: atHourOffset(1, 17, 0),
    durationMin: 50,
    focus: 'تلاوة مجوّدة مع تدبّر قصير',
    ageGroups: ['كبار'],
    capacity: 40,
    joinedCount: 18,
    address: 'حي السليمانية، الرياض',
    lat: 24.69,
    lng: 46.72,
    teacherName: 'الشيخ عبدالرحمن القحطاني',
  },
  {
    id: '4',
    title: 'حلقة الفتيان — جزء تبارك',
    mosqueName: 'مسجد الياسمين',
    district: 'الياسمين',
    startsAt: atHourOffset(1, 16, 0),
    durationMin: 45,
    focus: 'جزء تبارك — تحفيظ للفتيان',
    ageGroups: ['أطفال', 'يافعين'],
    capacity: 20,
    joinedCount: 11,
    address: 'حي الياسمين، شمال الرياض',
    lat: 24.82,
    lng: 46.64,
    teacherName: 'الأستاذ فهد الدوسري',
    notes: 'للأعمار من ٧ إلى ١٢ سنة. يُفضّل حضور ولي الأمر في الجلسة الأولى.',
  },
  {
    id: '5',
    title: 'مراجعة الحزب المفصّل',
    mosqueName: 'جامع النسيم',
    district: 'النسيم',
    startsAt: atHourOffset(2, 20, 15),
    durationMin: 60,
    focus: 'مراجعة الحزب المفصّل',
    ageGroups: ['شباب'],
    capacity: 18,
    joinedCount: 9,
    address: 'حي النسيم الشرقي، الرياض',
    lat: 24.74,
    lng: 46.82,
    teacherName: 'الأستاذ سعد الحربي',
  },
  {
    id: '6',
    title: 'حلقة الإجازة والتجويد',
    mosqueName: 'مسجد قرطبة الكبير',
    district: 'قرطبة',
    startsAt: atHourOffset(2, 18, 30),
    durationMin: 90,
    focus: 'تجويد متقدّم وإجازة',
    ageGroups: ['كبار'],
    capacity: 15,
    joinedCount: 12,
    address: 'حي قرطبة، شرق الرياض',
    lat: 24.81,
    lng: 46.74,
    teacherName: 'الشيخ إبراهيم الزهراني',
    notes: 'يشترط إتقان الأحكام الأساسية. مقاعد محدودة.',
  },
  {
    id: '7',
    title: 'تحفيظ سورة الكهف',
    mosqueName: 'جامع الروضة',
    district: 'الروضة',
    startsAt: atHourOffset(3, 15, 45),
    durationMin: 55,
    focus: 'حفظ سورة الكهف',
    ageGroups: ['يافعين'],
    capacity: 22,
    joinedCount: 7,
    address: 'حي الروضة، الرياض',
    lat: 24.78,
    lng: 46.78,
    teacherName: 'الأستاذ محمد السبيعي',
  },
  {
    id: '8',
    title: 'حلقة المساء — تصحيح التلاوة',
    mosqueName: 'مسجد الشفا',
    district: 'الشفا',
    startsAt: atHourOffset(3, 21, 0),
    durationMin: 40,
    focus: 'تصحيح تلاوة يومي',
    ageGroups: ['كبار'],
    capacity: 28,
    joinedCount: 16,
    address: 'حي الشفا، جنوب الرياض',
    lat: 24.56,
    lng: 46.7,
    teacherName: 'الأستاذ يوسف الغامدي',
    notes: 'جلسة خفيفة بعد العشاء. مناسب للمشغولين.',
  },
  {
    id: '9',
    title: 'حلقة الصباح للصغار',
    mosqueName: 'جامع العليا',
    district: 'العليا',
    startsAt: atHourOffset(0, 9, 30),
    durationMin: 45,
    focus: 'قصار السور — تحفيظ',
    ageGroups: ['أطفال'],
    capacity: 16,
    joinedCount: 8,
    address: 'حي العليا، الرياض',
    lat: 24.7,
    lng: 46.68,
    teacherName: 'الأستاذ ناصر العتيبي',
    notes: 'بعد صلاة الضحى. للأعمار من ٦ إلى ١٠ سنوات.',
  },
  {
    id: '10',
    title: 'حلقة اليافعين بعد الظهر',
    mosqueName: 'مسجد الملز الكبير',
    district: 'الملز',
    startsAt: atHourOffset(1, 13, 15),
    durationMin: 50,
    focus: 'مراجعة وجزء قد سمع',
    ageGroups: ['يافعين'],
    capacity: 20,
    joinedCount: 10,
    address: 'حي الملز، الرياض',
    lat: 24.71,
    lng: 46.73,
    teacherName: 'الأستاذ تركي الحربي',
  },
];

export function getCircleById(id: string): Circle | undefined {
  return CIRCLES.find((c) => c.id === id);
}

export function formatCircleWhen(iso: string): { dayLabel: string; timeLabel: string } {
  const date = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  let dayLabel = date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  if (diffDays === 0) dayLabel = 'اليوم';
  else if (diffDays === 1) dayLabel = 'غداً';

  const timeLabel = date.toLocaleTimeString('ar-SA', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return { dayLabel, timeLabel };
}
