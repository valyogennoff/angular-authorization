import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export default class ForgotPassComponent implements OnInit {
  resetPassForm !: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService)

  ngOnInit(): void {
    this.resetPassForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    })
  }

  submit() {
    this.authService.sendEmailService(this.resetPassForm.value.email)
      .subscribe({
        next: (res) => {
          alert(res.message);
          this.resetPassForm.reset()
        },
        error: (err) => {
          alert(err.message);
        }
      })

  }
}
