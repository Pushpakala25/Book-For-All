import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
record:any;
  constructor(private http: HttpClient) { }

  url_ = "assets/book.json";

  getAll():any{
    return this.http.get<any>(this.url_);
  }

  addrecord(x:any) {
    return this.http.post<any>('http://localhost:2525/newlend', x);
  }

  getAllUser() {
    return this.http.get('http://localhost:2525/view');
  }

}
