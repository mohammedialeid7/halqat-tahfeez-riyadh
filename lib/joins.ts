import AsyncStorage from '@react-native-async-storage/async-storage';

import type { JoinRecord } from '@/types/circle';

const STORAGE_KEY = 'halqat.joins.v1';

async function readAll(): Promise<JoinRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JoinRecord[];
  } catch {
    return [];
  }
}

async function writeAll(records: JoinRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function getJoinRecord(circleId: string): Promise<JoinRecord | undefined> {
  const all = await readAll();
  return all.find((r) => r.circleId === circleId);
}

export async function getJoinedCircleIds(): Promise<string[]> {
  const all = await readAll();
  return all.map((r) => r.circleId);
}

export async function saveJoin(
  circleId: string,
  name: string,
  phone?: string,
): Promise<JoinRecord> {
  const all = await readAll();
  const record: JoinRecord = {
    circleId,
    name: name.trim(),
    phone: phone?.trim() || undefined,
    joinedAt: new Date().toISOString(),
  };
  const next = [...all.filter((r) => r.circleId !== circleId), record];
  await writeAll(next);
  return record;
}
