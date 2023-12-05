import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilityService {
  getApiUrl() {
    const apiUrl = import.meta.env['NG_APP_API_URL'];
    if (!apiUrl) {
      throw new Error('Missing API URL');
    }
    return apiUrl;
  }

  convertDate(date: string) {
    const dateString = new Date(date).toDateString();
    const timeString = new Date(date).toLocaleTimeString();
    return dateString + ' ' + timeString;
  }
}
