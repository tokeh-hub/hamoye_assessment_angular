import { Component, OnInit} from '@angular/core';
import { FlightsService } from 'src/app/flights.service';
import { Flight } from 'src/app/Flight';
import { Obj } from 'src/app/Obj';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  itemsPerPage: number = 10
  time: string = ''
  error = ''
  isLoading:boolean = false
  arr : string[] = []
  data : Flight [] = []
  ultimateArr : Obj[] = []
  loading: boolean = false
  date: string = "2018-01-29"
  from: string = '13:00'
  to: string = '14:00'
  totalPages = 0
  currentPage = 1
  begin: any = '1517227200'
  end: any = '1517230800'
  startIndex = (this.currentPage - 1) * this.itemsPerPage;
  endIndex = this.startIndex + this.itemsPerPage;
  airports : string[] = []
  date1: Date = new Date()
  date2: Date = new Date()

  constructor(private flights:FlightsService) { }

  ngOnInit(): void {
    this.getAllFlights()
  }
  
  getAllFlights(){
    this.changeTimeToCST(`${this.date}T${this.from}`)
    this.isLoading = true
    this.flights.getFlights(this.begin,this.end).subscribe(response => {
      this.data = response
      var array : string [] = []
      this.data.forEach(element=>{
        array.push(element.estDepartureAirport)
        array.push(element.estArrivalAirport)
      })
      const filtered = array.filter((val) => val !== null);
      this.arr = this.returnUniqueValues(filtered)
      // console.log(this.arr)
      this.getSeperateFlights()
      this.isLoading = false
    })
  }

  getSeperateFlights(){
    this.ultimateArr = []
    this.airports = this.arr.slice(this.startIndex,this.endIndex)
    this.airports.forEach(async (airport) => {
      this.isLoading = true
      var obj = {airport:'',numberOfArrivingFlights:0,numberOfDepartingFlights:0};
      try {
        this.isLoading = true
        this.flights.getArrivals(airport,this.begin,this.end).subscribe(response=>{
               obj.airport = airport
               obj.numberOfArrivingFlights = response ? response.length : 0
        })
        try {
          this.flights.getDeparture(airport,this.begin,this.end).subscribe(response=>{
            obj.airport = airport
            obj.numberOfDepartingFlights = response ? response.length : 0
     })
        } catch (error: any) {
          if (
                  error.response.status === 404 ||
                  error.response.status === 503 
                  // error.response.status === 0
                ) {
                  obj["airport"] = airport;
                  obj["numberOfDepartingFlights"] = 0;
                }
        }
        this.ultimateArr.push(obj);
    } catch(error: any){
      if (error.response.status === 404 || error.response.status === 503) {
            obj["airport"] = airport;
            obj["numberOfArrivingFlights"] = 0;
          }
    }
    this.isLoading = false
    });
  }

  returnUniqueValues(arr:string[]){
    return arr
      .filter((val) => val !== null)
      .filter((item, index) => arr.indexOf(item) === index);
  };

  updateSeparateFlights() {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.getSeperateFlights();
  }

  onTimeChange(){
      this.getAllFlights()
  }

  goToPrevious(){
    this.currentPage = this.currentPage - 1
    this.updateSeparateFlights();
  }

  goToNext(){
    this.currentPage = this.currentPage + 1
    this.updateSeparateFlights();
  }

  onInputChange(value:string){
    this.error = ''
    var d = `${this.date}T${value}`;
    var someDate = new Date(d).getTime();
    if(value === this.from){
      console.log('from')
      this.date1 = new Date(`${this.date}T${this.from}`)
      this.begin = (Math.floor(someDate / 1000));
      this.getTimeDiffInHours(this.date1,this.date2)
    }
    else if(value === this.to){
      console.log("to")
      this.date2 = new Date(`${this.date}T${this.to}`)
      this.end = (Math.floor(someDate / 1000));
      this.getTimeDiffInHours(this.date1,this.date2)
    }
    
  }


  formatDate(dateString:string){
    const dateParts = dateString.split("/");
    let year = dateParts[2];
    let month = dateParts[1];
    let day = dateParts[0];
  
    if (day.length === 1) {
      day = "0" + day;
    }
  
    if (month.length === 1) {
      month = "0" + month;
    }
  
    return `${year}-${month}-${day}`;
  }

  changeTimeToCST(date:string){
    let cstTime = new Date(date).toLocaleString("es-MX", {
        timeZone: "America/Mexico_City" });
    var first = cstTime.split(' ')[0]
    var sec = cstTime.split(' ')[1]
    var convertedTime = `${this.formatDate(first.replace(',',''))}T${sec}`
    var someDate = new Date(convertedTime);
    var minutes = someDate.getMinutes();
    var hours = someDate.getHours();
    var a  =  hours >= 12 ? 'PM' : 'AM';
    this.time = hours + ":" + minutes + ' ' + a
  }

  getTimeDiffInMilliseconds(date1:Date, date2:Date) {
    const timeDiff = date2.getTime() - date1.getTime();
    return timeDiff;
  }

  getTimeDiffInHours(date1:Date, date2:Date){
    const timeDiff = this.getTimeDiffInMilliseconds(date1, date2);
    var difference =  timeDiff / (1000 * 60 * 60); // convert milliseconds to hours
    if(difference > 2 || difference === 0){
      this.isLoading = false
      this.ultimateArr = []
      this.error = 'The difference between begin and end time shouldnt be more than 2 hours'
    }
  }
  

}
