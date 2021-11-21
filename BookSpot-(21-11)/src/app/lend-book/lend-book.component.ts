import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service'
import { DatePipe } from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';


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
  dum:any;
  x:any;
  
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
lendForm:any;
user:any={};
record:any;
submitted=false;
 loc:any;
 details:any;
 Name:any;
 Email:any;
 rcal:any;
 
 error:any;
 err=0;
 status:any;

 userRecord: any[] = [];

  constructor(private cS:CategoryService,private datePipe: DatePipe,private fb:FormBuilder) {
    this.loc=localStorage.getItem('Users')
    if(this.loc!=null){
      this.details=JSON.parse(this.loc)
      this.Name=this.details.Name
      this.Email=this.details.Email  
      this.rcal=this.details.rcal  
      
    }
   }

  ngOnInit(): void {
    this.showAll();
    this.onSelect(this.selectedCategory.id);

    this.lendForm = this.fb.group({
      Name: [this.Name, [Validators.required, Validators.minLength(4)]], 
      Email: [this.Email,[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      Validators.minLength(1)]],  
      To_cate: [], 
      To_book:[] ,
      rcal:[this.rcal,Validators.required],
      lcal:[],
      price:[]
    });  

    this.cS.getAllUser().subscribe((data: any) => {
      this.userRecord = data;
    });
    
  }

  get f() {
    return this.lendForm.controls;
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
// console.log(cat_id.value);
  //  this.dum = cat_id;
    this.cS.getAll().subscribe((res:any)=>{
      this.book = res['books'].filter(
        (res:any)=>res.cate_id == cat_id!.value
      );           
    })
  }
  // -- end --category & book

  // -- Start --cost--

  add(){      
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

  //-- start save--
  onSave(){
    this.lendForm.value.price=this.result;
    this.lendForm.value.lcal=this.day;  

    var x = this.category.category.filter(
      (res:any)=>res.id == this.lendForm.value['To_cate']
    ); 
    this.lendForm.value.To_cate = x[0].name;   
    
    var y = this.book.filter(
      (res:any)=>res.id == this.lendForm.value['To_book']
    ); 
    this.lendForm.value.To_book = y[0].name;

    console.log("save",this.lendForm.value);
    this.user=Object.assign(this.user, this.lendForm.value)
    localStorage.setItem('Users',JSON.stringify(this.user));
  }


//-- end save--

  //-- submit --
  submit(){
    this.submitted = true
    if(this.lendForm.invalid){
      alert("Kindly fill the form..!")
    }
    else{    
    this.lendForm.value.price=this.result;
    this.lendForm.value.lcal=this.day;
    // this.lendForm.value.To_cate = this.selectedCategory.id;
    // this.lendForm.value.To_book = this.book[0].name; 
    
    var x = this.category.category.filter(
      (res:any)=>res.id == this.lendForm.value['To_cate']
    ); 
    this.lendForm.value.To_cate = x[0].name;   
    
    var y = this.book.filter(
      (res:any)=>res.id == this.lendForm.value['To_book']
    ); 
    this.lendForm.value.To_book = y[0].name;

    console.log(this.lendForm.value);
      this.cS.addrecord(this.lendForm.value).subscribe((data) => {
        console.log(data);  
        alert('SUCCESS!! :-)\n\n Price:' + JSON.stringify(this.lendForm.value.price, null, 4));
        this.lendForm.reset();
        // this.record = data;
      },(err:string)=>{
        this.error=err
        alert(this.error.error.text)
      }
      );    
    
     
      localStorage.removeItem('Users');
    
    }
  }
  //-- end submit --

  //-- view report --

  // report(){
  //   this.cS.getAllUser().subscribe((data: any) => {
  //     this.record = data;
  //   });
  // }
 

}
