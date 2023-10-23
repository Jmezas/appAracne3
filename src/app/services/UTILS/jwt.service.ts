import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(public jwtHelper: JwtHelperService) { }

  decodeToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const helper = new JwtHelperService();
      const decode = helper.decodeToken(token);
      resolve(decode);
    });
  }
}
