import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey:       string = 'MUbNgnDlOPMhj61V8QCYoebqJePwVoII';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http:HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready!');
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHystory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    const temporal = localStorage.getItem('history');
    if (!temporal) {
      return;
    }
    this._tagsHistory = JSON.parse(temporal);

    if(this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);


  }

  public searchTag(tag: string):void {
    if (tag.length === 0) {
      return;
    }
    this.organizeHystory(tag);

    // fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
    //   .then( resp => resp.json())
    //   .then( data => {
    //     console.log(data.data);
    //   });
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params:params })
      .subscribe( resp => {
        this.gifsList = resp.data;
        // console.log({gifs: this.gifsList});
      });
  }
}
