import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  url_ = "assets/book.json";

  getAll():any{
    return this.http.get<any>(this.url_);
  }
}
