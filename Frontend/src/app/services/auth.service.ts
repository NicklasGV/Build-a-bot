// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }                      from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders }     from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, resetUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>;
  private storage: Storage;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = window.sessionStorage;
    } else {
      this.storage = {
        getItem:   (_: string) => null,
        setItem:   (_: string, __: string) => {},
        removeItem: (_: string) => {},
        clear:      () => {},
        key:        (_: number) => null,
        length:     0
      } as unknown as Storage;
    }

    let stored = this.storage.getItem('currentUser');
    if (!stored) {
      this.storage.setItem('currentUser', JSON.stringify(resetUser()));
      stored = this.storage.getItem('currentUser')!;
    }
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(stored));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}User/authenticate`, { email, password })
      .pipe(map(user => {
        this.storage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    this.storage.removeItem('currentUser');
    this.currentUserSubject.next(resetUser());
  } 

  loginWithDiscord(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const verifier = this.randomString(128);
    this.storage.setItem('discord_code_verifier', verifier);

    this.generateChallenge(verifier).then(challenge => {
      const params = new HttpParams({
        fromObject: {
          client_id:             environment.discord.clientId,
          redirect_uri:          environment.discord.redirectUri,
          response_type:         'code',
          scope:                 environment.discord.scopes.join(' '),
          code_challenge:        challenge,
          code_challenge_method: 'S256'
        }
      });
      window.location.href = `${environment.discord.authorizeUrl}?${params.toString()}`;
    });
  }

  handleDiscordCallback(code: string): Observable<User> {
    const verifier = this.storage.getItem('discord_code_verifier')!;
    const body = new HttpParams({
      fromObject: {
        client_id:     environment.discord.clientId,
        grant_type:    'authorization_code',
        code,
        redirect_uri:  environment.discord.redirectUri,
        code_verifier: verifier
      }
    });

    return this.http
      .post<{
        access_token: string;
        token_type:   string;
        expires_in:   number;
      }>(
        environment.discord.tokenUrl,
        body.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .pipe(
        switchMap(tokenRes =>
          this.http.get<{
            id:            number;
            discord_id:    string;
            username:      string;
            discriminator: string;
            avatar:        string | null;
            email?:        string;
          }>(
            environment.discord.userApiUrl,
            {
              headers: new HttpHeaders({
                Authorization: `${tokenRes.token_type} ${tokenRes.access_token}`
              })
            }
          )
        ),
        map(discordProfile => {
          const user: User = {
            id: 0,
            discord_id: discordProfile.id,
            email: discordProfile.email || '',
            userName: `${discordProfile.username}`,
            token: verifier,
            password: '',
            scripts: [],
            bots: [],
            favorites: [],
            posts: [],
            comments: [],
          };
          this.storage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  private async generateChallenge(v: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
    return this.base64UrlEncode(buf);
  }

  private base64UrlEncode(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private randomString(len: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const arr = crypto.getRandomValues(new Uint8Array(len));
    return Array.from(arr).map(b => charset[b % charset.length]).join('');
  }
}
