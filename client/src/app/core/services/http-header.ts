import { HttpHeaders } from '@angular/common/http';

export const JSON_HEADERS = new HttpHeaders().set(
  'Content-Type',
  'application/json',
);
