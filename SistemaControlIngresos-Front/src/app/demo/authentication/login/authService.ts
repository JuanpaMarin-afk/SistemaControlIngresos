import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private isAuthenticated = false;

    constructor() { }

    login(job: string, email: string, role: string) {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('job', job);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('job');
        localStorage.removeItem('email');
    }

    getJob(): string {
        return localStorage.getItem("job");
    }

    getRole(): string {
        return localStorage.getItem("role");
    }

    getEmail(): string {
        return localStorage.getItem("email");
    }

    isLoggedIn(): boolean {
        if (!localStorage.getItem('isAuthenticated')) {
            this.isAuthenticated = false;
        } else {
            this.isAuthenticated = true;
        }
        return this.isAuthenticated;
    }

}