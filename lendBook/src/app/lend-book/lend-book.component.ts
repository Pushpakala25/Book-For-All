import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-lend-book',
  templateUrl: './lend-book.component.html',
  styleUrls: ['./lend-book.component.css'],
  providers: [DatePipe]
})
export class LendBookComponent implements OnInit {

  // -- start -- category & book
  category: any;
  book: any;  
  
  selectedCategory: any = {
    id: 0, name: ''
  }
// -- end --category & book
// -- start --cost
  n1: any;
  result: any;
  rate:any;
  date = Date.now();
  day:any;
 
// -- end --cost
 
  constructor(private cS:CategoryService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.showAll();
    this.onSelect(this.selectedCategory.id);
  }

  // -- start -- category & book
  showAll(){
    this.cS.getAll().subscribe(
      (data:any)=>{
        this.category = data;

        // console.log(this.category);              
      }
    )
  }

  onSelect(cat_id:any){   
    this.cS.getAll().subscribe((res:any)=>{
      this.book = res['books'].filter(
        (res:any)=>res.cate_id == cat_id!.value
      );
           
    })
  }
  // -- end --category & book

  // -- Start --cost--

  add(){
    console.log(this.selectedCategory);
    
    // console.log(this.n1);    
    // console.log("hello",this.datePipe.transform(this.date, 'yyyy-MM-dd'));
    this.day = this.datePipe.transform(this.date, 'yyyy-MM-dd');  
    var Time = new Date(this.n1).getTime()- new Date(this.day).getTime(); 
    var Days = Time / (1000 * 3600 * 24);
    console.log(Days);

    if(Number(Days) <= 1){
      this.result = 0;
      return this.result; 
    }
    else if (Number(Days) <= 5){
      this.result = 100;      
      return this.result;       
    }
    else if (Number(Days) > 5){
      this.rate = Number(Days) - 5;
      this.rate = this.rate*20;
      this.result = 100 + this.rate;
      return this.result; 
    }          
  }
  
  // -- end --cost
  

}
