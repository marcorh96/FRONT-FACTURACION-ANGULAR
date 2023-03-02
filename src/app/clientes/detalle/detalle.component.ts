import { Component, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent {
  @Input() cliente: Cliente;
  titulo: string = 'Detalle del Cliente';
  protected fotoSeleccionada: File;
  protected progreso: number = 0;
  protected factura: Factura;


  constructor(private clienteService: ClienteService,
    protected modalService: ModalService,
    protected authService: AuthService,
    protected facturaService: FacturaService) { }

  ngOnInit() {
  }

  seleccionarFoto(event) {
    this.progreso = 0;
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error Seleccionar Imagen: ', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto ', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire('La foto se ha subido completamente!', response.mensaje, 'success');
          }
          /* this.cliente = cliente; */

        });
    }

  }

  cerrarModal() {
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.modalService.cerrarModal();
  }

  delete(factura: Factura): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro',
      text: `Seguro de que quieres eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
            swalWithBootstrapButtons.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito!`,
              'success'
            )
          }
        );

      }
    })
  }

}
