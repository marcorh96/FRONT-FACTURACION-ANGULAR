import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  /*  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); */


  constructor(private http: HttpClient, private router: Router) { }

  /* private agregarAuthorizationHeader(){
    const token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  } */



  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint.concat("/regiones"));
  }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('Cliente Service: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          /* let datePipe = new DatePipe('es'); */
          //cliente.createAt =  datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');//formatDate(cliente.createAt, 'dd/MM/yyyy', 'en-US');
          return cliente;
        });
        return response;
      }),
      tap((response: any) => {
        console.log('Cliente Service: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente,).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        console.error(e.mensaje);
        return throwError(() => e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401) {
          this.router.navigate(['/clientes'])
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        this.router.navigate(['/clientes'])
        console.log(e.error.mensaje);
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        this.router.navigate(['/clientes'])
        console.error(e.error.mensaje);
        return throwError(() => e);
      })
    )
  }
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);



    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, { reportProgress: true });
    return this.http.request(req);
  }
}
