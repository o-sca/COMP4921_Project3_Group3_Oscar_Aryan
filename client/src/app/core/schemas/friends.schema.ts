export interface Friend {
  id: number;
  created_at: Date;
  updated_at: Date;
  receiver_id: number;
  sender_id: number;
  invitation_status: string;
  receiver: {
    first_name: string;
    last_name: string;
    profile_pic_url: string;
  };
}

export interface FriendProfile {
  first_name: string;
  last_name: string;
  profile_pic_url: string;
  email: string;
}
