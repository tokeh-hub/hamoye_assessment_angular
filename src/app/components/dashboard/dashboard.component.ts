import { Component, OnInit, OnChanges } from '@angular/core';
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
  arr : string[] = []
  data : Flight [] = []
  ultimateArr : Obj[] = []
  loading: boolean = false
  date: string = "2018-01-29"
  from: string = '12:00'
  to: string = '13:00'
  totalPages = 0
  currentPage = 1
  begin: any = '1517227200'
  end: any = '1517230800'
  startIndex = (this.currentPage - 1) * this.itemsPerPage;
  endIndex = this.startIndex + this.itemsPerPage;
  airports : string[] = []

  constructor(private flights:FlightsService) { }

  ngOnInit(): void {
    this.getAllFlights()
  }
  
  getAllFlights(){
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
      this.loading = false
    })
  }

  getSeperateFlights(){
    this.ultimateArr = []
    this.airports = this.arr.slice(this.startIndex,this.endIndex)
    this.airports.forEach(async (airport) => {
      this.loading = true
      let arrivingFlights, departingFlights;
      var obj = {airport:'',numberOfArrivingFlights:0,numberOfDepartingFlights:0};
      try {
        this.flights.getArrivals(airport,this.begin,this.end).subscribe(response=>{
               console.log('arrivals',response)
               obj.airport = airport
               obj.numberOfArrivingFlights = response ? response.length : 0
        })
        try {
          this.flights.getDeparture(airport,this.begin,this.end).subscribe(response=>{
            console.log('arrivals',response)
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
    var d = `${this.date}T${value}`;
    var someDate = new Date(d).getTime();
    this.begin = (Math.floor(someDate / 1000));
  }

}
