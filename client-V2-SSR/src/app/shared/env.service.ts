import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  get baseUrl(){
    return 'https://pollar-api-rxlv.onrender.com'
  }
  constructor() { }
}
