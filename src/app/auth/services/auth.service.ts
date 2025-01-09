import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { User } from '../../interfaces/user.interface';

@Injectable({providedIn: 'root'})
export class AuthService {
    private baseURL: string = environments.baseURL;
    private user?: User;
    constructor(
        private http: HttpClient    ) { }

    get currentUser(): User | undefined {
        if(!this.user) return undefined;
        return structuredClone(this.user);
    }

    login(email: string, password: string):Observable<User> {
        //En lugar de get, http.post('login',{email,password});
        return this.http.get<User>(`${this.baseURL}/users/1`)
            .pipe(
                tap( resp => this.user = resp),
                tap(resp => localStorage.setItem('token', resp.id.toString()))
            );
    }

    checkAuthentication(): Observable<boolean> {
        if( !localStorage.getItem('token') ) return of (false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(`${this.baseURL}/users/1`)
            .pipe(
                tap( user => this.user = user),
                map(user => !!user),
                catchError( err => of (false) )
            );
    }

    logout():void {
        this.user = undefined;
        localStorage.clear();
    }


}