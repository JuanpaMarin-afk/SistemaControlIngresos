// angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { LoginService } from 'src/app/services/login-service/login.service';
import Swal from 'sweetalert2';

import { AuthService } from './authService';
import { LogService } from 'src/app/services/logs-service/log.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  // public method
  user = ""
  loginForm: FormGroup;
  constructor(private router: Router, private service: LoginService
    , private fb: FormBuilder, private authService: AuthService,
    private logService: LogService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/default'], { replaceUrl: true });
    }
  }

  // LOGICA PARA EL INICIO DE SESION
  listOfData: any[] = [];
  logIn(): void {
    this.service.verifyUserPassword({
      id_user: 0,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      encrypted_password: "",
      job: "",
      rol: "",
      status: ""
    }).subscribe(message => {
      if (message.result == true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Credenciales correctas!",
          showConfirmButton: false,
          timer: 1500
        });
        this.service.getAllUsers().subscribe(listOfData => {
          this.listOfData = listOfData;

          const item = this.listOfData.find(item => item.email === this.loginForm.value.email);

          this.authService.login(item.job, item.email, item.rol);

          this.user = item.email;

          const today: Date = new Date();
          this.logService.insertLogsAsync({
            description: "Ingreso Sistema:" + this.user,
            user: this.user,
            date: today.toISOString()
          }).subscribe(message => {

            if (message.result == true) {

              this.router.navigate(['/dashboard/default'], { replaceUrl: true });
            }
          });
        });

      }
      if (message.result == false) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "¡Credenciales incorrectas!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset();
  }


}

