import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bot } from '../../app/models/bot.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private readonly apiUrl = environment.apiUrl + 'Bot/';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Bot[]>{
    return this.http.get<Bot[]>(this.apiUrl);
  }

  delete(botId: number): Observable<Bot> {
    return this.http.delete<Bot>(this.apiUrl + botId);
  }

  findById(botId: number): Observable<Bot> {
    return this.http.get<Bot>(this.apiUrl + botId);
  }

  create(bot: Bot): Observable<Bot> {
      const formData = new FormData();
  
      formData.append('UserId', bot.user.id.toString());
      formData.append('Name', bot.name);
  
      if (bot.botScripts) {
        bot.botScripts.forEach(scriptId => {
          formData.append('scriptIds', scriptId.toString());
        });
      }
  
      return this.http.post<Bot>(this.apiUrl, formData);
    }
}
