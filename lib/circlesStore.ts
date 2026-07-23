import AsyncStorage from '@react-native-async-storage/async-storage';

import { CIRCLES, getCircleById as getSeedCircleById } from '@/data/circles';
import type { AgeGroup, Circle } from '@/types/circle';

const STORAGE_KEY = 'halqat.userCircles.v1';

const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  العليا: { lat: 24.6956, lng: 46.6857 },
  الملز: { lat: 24.7136, lng: 46.735 },
  النسيم: { lat: 24.74, lng: 46.82 },
  الياسمين: { lat: 24.82, lng: 46.64 },
  قرطبة: { lat: 24.81, lng: 46.74 },
  السليمانية: { lat: 24.69, lng: 46.72 },
  الروضة: { lat: 24.78, lng: 46.78 },
  الشفا: { lat: 24.56, lng: 46.7 },
  النرجس: { lat: 24.86, lng: 46.63 },
  الملقا: { lat: 24.8, lng: 46.61 },
  حطين: { lat: 24.76, lng: 46.6 },
  القيروان: { lat: 24.84, lng: 46.6 },
  الصحافة: { lat: 24.79, lng: 46.63 },
  الغدير: { lat: 24.78, lng: 46.65 },
  الورود: { lat: 24.74, lng: 46.68 },
  المصيف: { lat: 24.75, lng: 46.69 },
  المرسلات: { lat: 24.73, lng: 46.7 },
  التعاون: { lat: 24.72, lng: 46.71 },
  الربوة: { lat: 24.7, lng: 46.76 },
  المنصورة: { lat: 24.68, lng: 46.78 },
  العزيزية: { lat: 24.58, lng: 46.77 },
  الدرعية: { lat: 24.74, lng: 46.57 },
  'ظهرة لبن': { lat: 24.62, lng: 46.55 },
  طويق: { lat: 24.58, lng: 46.55 },
  العريجاء: { lat: 24.68, lng: 46.62 },
  السويدي: { lat: 24.66, lng: 46.66 },
  شبرا: { lat: 24.64, lng: 46.7 },
  الفيصلية: { lat: 24.65, lng: 46.72 },
  المنار: { lat: 24.76, lng: 46.8 },
};

export function coordsForDistrict(district: string): { lat: number; lng: number } {
  return DISTRICT_COORDS[district] ?? { lat: 24.7136, lng: 46.6753 };
}

function normalizeCircle(raw: Circle & { ageGroup?: AgeGroup }): Circle {
  if (Array.isArray(raw.ageGroups) && raw.ageGroups.length > 0) {
    return { ...raw, ageGroups: raw.ageGroups };
  }
  if (raw.ageGroup) {
    const { ageGroup, ...rest } = raw;
    return { ...rest, ageGroups: [ageGroup] };
  }
  return { ...raw, ageGroups: ['كبار'] };
}

async function readUserCircles(): Promise<Circle[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<Circle & { ageGroup?: AgeGroup }>;
    return parsed.map(normalizeCircle);
  } catch {
    return [];
  }
}

async function writeUserCircles(circles: Circle[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(circles));
}

export async function getAllCircles(): Promise<Circle[]> {
  const userCircles = await readUserCircles();
  return [...userCircles, ...CIRCLES];
}

export async function findCircleById(id: string): Promise<Circle | undefined> {
  const seed = getSeedCircleById(id);
  if (seed) return seed;
  const userCircles = await readUserCircles();
  return userCircles.find((c) => c.id === id);
}

export type NewCircleInput = {
  title: string;
  mosqueName: string;
  district: string;
  startsAt: string;
  durationMin: number;
  focus?: string;
  ageGroups: AgeGroup[];
  capacity: number;
  address?: string;
  teacherName?: string;
  notes?: string;
};

export async function addCircle(input: NewCircleInput): Promise<Circle> {
  const { lat, lng } = coordsForDistrict(input.district);
  const ageGroups =
    input.ageGroups.length > 0 ? input.ageGroups : (['كبار'] as AgeGroup[]);
  const circle: Circle = {
    id: `user-${Date.now()}`,
    title: input.title.trim(),
    mosqueName: input.mosqueName.trim(),
    district: input.district,
    startsAt: input.startsAt,
    durationMin: input.durationMin,
    focus: input.focus?.trim() || undefined,
    ageGroups,
    capacity: input.capacity,
    joinedCount: 0,
    address: input.address?.trim() || undefined,
    lat,
    lng,
    teacherName: input.teacherName?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  };

  const existing = await readUserCircles();
  await writeUserCircles([circle, ...existing]);
  return circle;
}

export function formatAgeGroups(ageGroups: AgeGroup[]): string {
  return ageGroups.join(' · ');
}
