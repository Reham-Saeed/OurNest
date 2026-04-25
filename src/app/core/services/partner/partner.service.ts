import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  constructor(private http: HttpClient) {}

  invitePartner(partnerEmail: any) {
    return this.http.post<any>(`${baseUrl}partner/invite`, partnerEmail);
  }

  acceptPartnerInvite(invitationCode: any) {
    return this.http.post<any>(`${baseUrl}partner/accept/${invitationCode}`, {});
  }

  getFamilyDashboard() {
    return this.http.get<any>(`${baseUrl}family/dashboard`);
  }
  
}
