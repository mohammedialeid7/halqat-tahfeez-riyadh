import AsyncStorage from '@react-native-async-storage/async-storage';

import { CIRCLES, getCircleById as getSeedCircleById } from '@/data/circles';
import type { Circle } from '@/types/circle';

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
};

export function coordsForDistrict(district: string): { lat: number; lng: number } {
  return DISTRICT_COORDS[district] ?? { lat: 24.7136, lng: 46.6753 };
}

async function readUserCircles(): Promise<Circle[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Circle[];
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
  focus: string;
  ageGroup: Circle['ageGroup'];
  capacity: number;
  address: string;
  teacherName?: string;
  notes?: string;
};

export async function addCircle(input: NewCircleInput): Promise<Circle> {
  const { lat, lng } = coordsForDistrict(input.district);
  const circle: Circle = {
    id: `user-${Date.now()}`,
    title: input.title.trim(),
    mosqueName: input.mosqueName.trim(),
    district: input.district,
    startsAt: input.startsAt,
    durationMin: input.durationMin,
    focus: input.focus.trim(),
    ageGroup: input.ageGroup,
    capacity: input.capacity,
    joinedCount: 0,
    address: input.address.trim(),
    lat,
    lng,
    teacherName: input.teacherName?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  };

  const existing = await readUserCircles();
  await writeUserCircles([circle, ...existing]);
  return circle;
}
