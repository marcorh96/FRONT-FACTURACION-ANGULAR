import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError, catchError } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError(e=>{
        if(e.status==401 ){
          //cuando expira el token pregunta si aun lo tiene guardado en el SessionStorage si es asi lo elimina y cierra sesión
          if(this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if(e.status==403 ){
          Swal.fire('Acceso Denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(()=>e);
      })
    );
  }
}
