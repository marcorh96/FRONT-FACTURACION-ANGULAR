import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  public cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo: string = 'Crear cliente';
  errores: string[];


  constructor(private clienteService: ClienteService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }


  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    });
  };

  public create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} creado con exito!`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: ', err.status)
        console.error(err.error.errors);
      }
    );
  }
  public update(): void {
    console.log(this.cliente);
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con exito!`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: ', err.status)
        console.error(err.error.errors);
      }
    );
  }

  compararRegion(o1: Region, o2: Region): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
