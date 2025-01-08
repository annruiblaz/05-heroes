import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, map } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseURL: string = environments.baseURL; 

    constructor(private http: HttpClient){}

    getHeroes():Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseURL}/heroes`);
    }

    getHeroById(id: string): Observable<Hero | undefined> {
        return this.http.get<Hero>(`${this.baseURL}/heroes/${id}`)
        .pipe(
            catchError(error => of(undefined))
        );
    }

    getSuggestions(query: string):Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseURL}/heroes?q=${query}&_limit=6`);
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(`${this.baseURL}/heroes`, hero);
    }

    updateHero(hero: Hero): Observable<Hero> {
        if (!hero.id) throw Error('Hero id is required for patch')
        return this.http.patch<Hero>(`${this.baseURL}/heroes/${hero.id}`,hero);
    }

    deleteHeroById(id: string): Observable<boolean> {
        return this.http.delete(`${this.baseURL}/heroes/${id}`)
            .pipe(
                map( resp => true ),
                catchError( err => of(false) )
            );
    }
}