import {
  Component,
  OnInit
}

from '@angular/core';

import {
  FormControl,
  FormGroup
}

from '@angular/forms';

import { Hero, Publisher }from '../../interfaces/hero.interface';

import { HeroesService }from '../../services/heroes.service';

import { ActivatedRoute, Router}
from '@angular/router';
import { filter, switchMap, tap}from 'rxjs';

import { MatSnackBar}from '@angular/material/snack-bar';
import { MatDialog }from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'heroes-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl < string > (''),
    superhero: new FormControl < string > ('', {
      nonNullable: true
    }),
    alter_ego: new FormControl < string > (''),
    first_appearance: new FormControl < string > (''),
    publisher: new FormControl < Publisher > (Publisher.DCComics),
    characters: new FormControl < string > (''),
    alt_img: new FormControl < string > (''),
  });

  public publishers = [{
      value: 'DC Comics',
      name: 'DC - Comics'
    },
    {
      value: 'Marvel Comics',
      name: 'Marvel - Comics'
    },
  ]

  constructor(
    private heroesService: HeroesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.checkIsEdit();
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar('Héroe actualizado con éxito');
        });

      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['heroes/edit', hero.id]);
        this.showSnackbar('Héroe creado con éxito')
      });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {duration: 2500})
  }

  private checkIsEdit(): any {
    this.activatedRoute.params
      .pipe(
        switchMap(({
          id
        }) => this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });
  }

  onDeleteHero() {
    if(!this.currentHero.id) throw Error('hero.id is required for delete');
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {data: this.heroForm.value});

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result),
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
        tap( wasDeleted => console.log(wasDeleted)),
        filter((wasDeleted: boolean) => wasDeleted),
      ).subscribe( result => {
        this.router.navigateByUrl('/heroes');
      });

/*
    dialogRef.afterClosed().subscribe( result => {
      if (!result) return;

      this.heroesService.deleteHero(this.currentHero.id)
        .subscribe( wasDeleted => {
          if (wasDeleted) this.router.navigateByUrl('/heroes')

        });
    }) */
  }
}
