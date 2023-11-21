import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _count: number;
  private _visibility: boolean;

  constructor() {
    this._count = 0;
    this._visibility = false;
  }

  get visibility() {
    return this._visibility;
  }

  show() {
    this._visibility = true;
    this._count++;
  }

  hide() {
    this._count--;
    if (this._count === 0) {
      this._visibility = false;
    }
  }
}
