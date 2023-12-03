import { IsArray, IsDateString, IsString } from 'class-validator';

interface Friend {
  id: number;
  first_name: string;
  last_name: string;
  profile_pic_url: string;
  email: string;
}

export class CreateEventDto {
  @IsString()
  eventTitle: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  friends: Friend[];
}
