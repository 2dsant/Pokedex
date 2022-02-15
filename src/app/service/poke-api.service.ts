import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { PokemonModel } from '../models/pokemon-model';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  constructor(
    private http: HttpClient
  ) { }

  public apiListAllPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`).pipe(
      tap(res => res),
      tap(res => {
        res.results.map((resPokemons: any) => {
          this.apiGetPokemons(resPokemons.url).subscribe({
            next: res => {
              resPokemons.status = res
            }
          })
        })
      })
    )
  }

  public searchByName(name: string): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`) 
  }

  public apiGetPokemons(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      map(
        res => res
      )
    )
  }
}
