import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    public modalService: ModalService, public authService: AuthService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log('Clientes Component: Tap 3'), (response.content as Cliente[]).forEach(cliente => console.log(cliente));
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[]
        this.paginador = response;
      });
    });

    
    this.modalService.notificarUpload.subscribe(cliente =>{
      console.log(cliente);
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente && clienteOriginal.id === cliente.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }



  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro',
      text: `Seguro de que quieres eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito!`,
              'success'
            )
          }
        );

      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
