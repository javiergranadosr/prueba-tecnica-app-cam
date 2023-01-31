import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { PhotoCameraService } from '../services/photo-camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnDestroy {
  // Uitlizados cuando se toma foto con camara
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage!: WebcamImage;
  public isCameraActive: boolean = false;

  // Utilizados cuando seleccionamos archivos (Fotos)
  public imageUrl: string = '';
  public nameImage: string = '';
  public uploadForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: PhotoCameraService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      image: [null],
    });
  }

  ngOnInit(): void {
    this.configurationNavigator();
  }

  private configurationNavigator(): void {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 500,
          height: 500,
        },
        audio: false,
      })
      .then((res) => {
        this.isCameraActive = res.active;
      })
      .catch((err) => {
        if (err?.message === 'Permission denied') {
          console.log('No se pudo tener acceso a la cámara. Permiso denegado.');
        } else {
          console.log(
            'No se pudo tener acceso a la cámara. Intente nuevamente.'
          );
        }
      });
  }

  // Logica cuando seleccionamos archivos (Fotos)

  public showPreview(event: Event): void {
    let file = (event.target as HTMLInputElement).files[0];
    this.nameImage = file.name;
    if (this.service.validateFormats(file.type)) {
      this.uploadForm.patchValue({
        image: file,
      });
      this.uploadForm.get('image').updateValueAndValidity();
      // Procesamos la imagen en base64 para el preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Solo se permiten imágenes en formato PNG o JPEG.");
    }
  }

  // Logica cuando tomamos foto desde camara
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.imageUrl = this.webcamImage.imageAsDataUrl;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public save(): void {
    this.service.setPhoto(this.imageUrl);
    this.router.navigate(['/detail']);
  }

  ngOnDestroy(): void {
    this.trigger = new Subject<void>();
    this.imageUrl = '';
    this.nameImage = '';
    this.isCameraActive = false;
  }
}
