import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherData } from './models/weather.model';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private weatherService: WeatherService) {}

  cityName: string = 'Mumbai'; 
  weatherData?: WeatherData; 

  ngOnInit(): void {
    this.getWeatherData(this.cityName);
    this.cityName = "";
  }

  onSubmit(){
    this.getWeatherData(this.cityName);
    this.cityName = "";
  }

  private getWeatherData(cityName: string){
    this.weatherService.getWeatherData(cityName)
      .subscribe({
        next: (response) => {
          this.weatherData = response;
          console.log(response);
        }
      });
  }

  generatePDF() {
    const generateInfo = document.getElementById('generateInfo');

    if (generateInfo && this.weatherData) {
      const contentToPrint = `
        Location: ${this.weatherData.name}
        Temperature: ${this.weatherData.main.temp}°C
        Humidity: ${this.weatherData.main.humidity}%
        Wind Speed: ${this.weatherData.wind.speed} km/h
      `;

      html2canvas(generateInfo).then((canvas) => {
        const pdf = new jsPDF();
        
        pdf.text(contentToPrint, 10, canvas.height + 20);
        pdf.save('weather_report.pdf');
      });
    } else {
      console.error('generateInfo element or weatherData not found');
    }
  }
}
