export interface Friend {
  friend_request_id: number;
  friend_id: number;
  first_name: string;
  last_name: string;
  profile_pic_url: string;
  invitation_status: string;
  sender_id: number;
  receiver_id: number;
}

export interface FriendProfile {
  id: number;
  first_name: string;
  last_name: string;
  profile_pic_url: string;
  email: string;
}

export interface FriendSuggestion {
  id: number;
  name: string;
  email: string;
  profile_pic_url: string;
}

export interface UserProfileFriend extends Omit<FriendProfile, 'id'> {
  friend_id: number;
}
