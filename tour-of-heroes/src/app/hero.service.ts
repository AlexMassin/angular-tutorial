import {
  Injectable
} from '@angular/core';
import {
  Hero
} from './hero';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Observable,
  of
} from 'rxjs';
import {
  MessageService
} from './message.service';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api

  /** GET heroes from the server */
  getHeroes(): Observable < Hero[] > {
    return this.http.get < Hero[] > (this.heroesUrl);
  }

  private handleError < T > (operation = 'operation', result ? : T) {
    return (error: any): Observable < T > => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable < Hero[] > {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get < Hero[] > (`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError < Hero[] > ('searchHeroes', []))
    );
  }


  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable < Hero > {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete < Hero > (url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError < Hero > ('deleteHero'))
    );
  }

  updateHero(hero: Hero): Observable < any > {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError < any > ('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable < Hero > {
    return this.http.post < Hero > (this.heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError < Hero > ('addHero'))
    );
  }

  getHero(id: number): Observable < Hero > {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get < Hero > (url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError < Hero > (`getHero id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {}
}
