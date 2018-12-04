import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { CONTACTS } from './mock-contacts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  serverUrl = "/api/v1"

  constructor(private httpClient: HttpClient) { }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      //this.messageService.add(`HeroService: ${message}`);
      console.log(`HeroService: ${message}`);
    }
    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getContacts(): Observable<Contact[]> {
    const url = this.serverUrl + "/contacts";
    return this.httpClient.get<Contact[]>(url);
  }

  addContact(contact: Contact): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.serverUrl}/contacts`;
    return this.httpClient.post(url, contact, {responseType: 'text', headers: headers})
      .pipe(
          tap(() => this.log(`add contact name =${contact.name}`)),
          catchError(this.handleError('addContact', []))
      );
  }

  updateContact(contact: Contact): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    const url = `${this.serverUrl}/contacts/${contact.name}`;
    return this.httpClient.put(url, contact, {responseType: 'text', headers: headers})
        .pipe(
          tap(() => this.log(`updated contact name=${contact.name}`)),
          catchError(this.handleError('updateContact', []))
      );    
  }
}
