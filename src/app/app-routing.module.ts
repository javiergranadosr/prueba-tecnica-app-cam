import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { PhotoComponent } from './photo/photo.component';

const routes: Routes = [
  {
    path: '',
    component:CameraComponent,
    title: 'Capturar foto'
  },
  {
    path: 'detail',
    component: PhotoComponent,
    title: 'Detalles foto'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
