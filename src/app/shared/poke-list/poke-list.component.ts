import { Component, OnInit } from '@angular/core';
import { PokemonModel } from 'src/app/models/pokemon-model';
import { PokeApiService } from 'src/app/service/poke-api.service';

@Component({
  selector: 'poke-list',
  templateUrl: './poke-list.component.html',
  styleUrls: ['./poke-list.component.scss']
})
export class PokeListComponent implements OnInit {

  private setAllPokemons: any;
  public getAllPokemons: any;
  public apiError: boolean = false;
  public pageAtual: number = 1;
  public pageAnterior: number = 0;
  public totalPokemons: number = 50;
  public offset: number = 0;
  public isLoading: boolean = true;


  constructor(
    private pokeApiService : PokeApiService
  ) { }

  ngOnInit(): void {
    this.getPokemons();
  }

  public getPokemons() {
    if(this.pageAtual > 1)
      this.offset = (this.pageAtual * 12) - 12;
    else
      this.offset = 0;

    this.pokeApiService.apiListAllPokemons(12, this.offset).subscribe({
      next: (res) => {
        this.setAllPokemons = res.results;
        this.totalPokemons = res.count;
        this.getAllPokemons = this.setAllPokemons;
        this.offset += 12;
        this.isLoading = false;
      },
      error: (res) => {
        this.apiError = true;
      }
    });
  }
  
  public getSearch(value: string) {
    this.isLoading = true;
    if(value != "") {
      value = value.replace(/^0+/, '');
      this.pokeApiService.searchByName(value.toLowerCase()).subscribe({
        next: res => {
          let pokemonSearched: any = {};
          pokemonSearched.name = res.name;
          pokemonSearched.status = res;
          this.getAllPokemons = [pokemonSearched];
          this.isLoading = false;
        },
        error: res => {
          this.isLoading = false;
          this.getPokemons();
          alert("Pokemón não encontrado. Verifique se o nome ou id do pokemón está correto.");
        }
      })
    } else {
      this.getPokemons();
    }

    // const filter = this.setAllPokemons.filter( (res: any) => {
    //   return !res.name.indexOf(value.toLowerCase());
    // });

    // this.getAllPokemons = filter;
  }
}
