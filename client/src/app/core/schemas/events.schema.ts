interface EventAttendance {
  id: number;
  created_at: string;
  updated_at: string;
  user_attende_id: number;
  event_id: number;
  response_type: string;
}

export interface Event {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  start_date_time: string;
  end_date_time: string;
  color: string;
  deleted: boolean;
  event_owner_id: number;
  Event_Attendance: EventAttendance[];
}
