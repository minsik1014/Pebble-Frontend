import type { Alarm, FollowRequestAction } from "../types/alarm";
import { mockAlarms } from "../mock/alarmMock";
//현재 mock 데이터용 껍데기.

export const getAlarms = async (): Promise<Alarm[]> => {
  return mockAlarms;
};

export const readAlarm = async (alarmId: number): Promise<void> => {
  console.log("read alarm", alarmId);
};

export const deleteAlarm = async (alarmId: number): Promise<void> => {
  console.log("delete alarm", alarmId);
};

export const deleteAllAlarms = async (): Promise<void> => {
  console.log("delete all alarms");
};

export const respondFollowRequest = async (
  _alarmId: number,
  _action: FollowRequestAction,
): Promise<void> => {
  return;
};