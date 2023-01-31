import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoCameraService {
  private photo$ = new BehaviorSubject<string>('');

  constructor() {}

  public validateFormats(formatImage: string): boolean {
    const formats: string[] = ['image/png', 'image/jpeg'];
    if (!formats.includes(formatImage)) {
      return false;
    }
    return true;
  }

  public setPhoto(photo: string): void {
    this.photo$.next(photo);
  }

  public getPhoto$(): Observable<string> {
    return this.photo$.asObservable();
  }
}
