import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuestionsFlowComponent } from './components/questions-flow/questions-flow.component';
import { OurServicesComponent } from './components/our-services/our-services.component';
import { PregnancyTipsComponent } from './components/pregnancy-tips/pregnancy-tips.component';
import { FriendChatComponent } from './components/mothers-community/friend-chat/friend-chat.component';
import { MothersCommunityComponent } from './components/mothers-community/mothers-community.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'questions', component: QuestionsFlowComponent },
      { path: 'services', component: OurServicesComponent },
      { path: 'pregnancy-health', component: PregnancyTipsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'community', component: MothersCommunityComponent },
      { path: 'chat', component: FriendChatComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
