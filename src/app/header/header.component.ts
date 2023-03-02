import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',

})
export class HeaderComponent {
    title: string = 'App Angular';

    constructor(public authService: AuthService, private router: Router) {
    }

    logout(): void {
        Swal.fire('Logout', `Hola ${this.authService.usuario.username}, has cerado sesión con exito!`, 'success');
        this.authService.logout();
        this.router.navigate(['/login']);        
    }
}