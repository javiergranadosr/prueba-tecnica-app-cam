import { Component,OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhotoCameraService } from '../services/photo-camera.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit, OnDestroy {
  public imageUrl: string = '';
  private serviceSubscription!: Subscription;

  constructor(private service: PhotoCameraService, private router: Router) {}

  ngOnInit(): void {
    this.serviceSubscription = this.service.getPhoto$().subscribe((photo) => {
      if (!photo || photo.length === 0) {
        this.router.navigate(['/']);
      }
      this.imageUrl = photo;
    });
  }

  ngOnDestroy(): void {
    this.imageUrl = '';
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
      this.service.setPhoto('');
    }
  }
}
