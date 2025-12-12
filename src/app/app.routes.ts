import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { HomeComponent } from './components/home/home.component';
import { QuestionsFlowComponent } from './components/questions-flow/questions-flow.component';
import { OurServicesComponent } from './components/our-services/our-services.component';
import { PregnancyTipsComponent } from './components/pregnancy-tips/pregnancy-tips.component';
import { FirstTrimesterComponent } from './components/trimesters/first-trimester/first-trimester.component';
import { SecondTrimesterComponent } from './components/trimesters/second-trimester/second-trimester.component';
import { ThirdTrimesterComponent } from './components/trimesters/third-trimester/third-trimester.component';
import { FriendChatComponent } from './components/mothers-community/friend-chat/friend-chat.component';
import { MothersCommunityComponent } from './components/mothers-community/mothers-community.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ClinicComponent } from './components/clinic/clinic.component';
import { HeroComponent } from './components/hero/hero.component';
import { TodoListComponent } from './components/organizer/todo-list/todo-list.component';
import { ReminderListComponent } from './components/organizer/reminder-list/reminder-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
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
      { path: 'trimester/first', component: FirstTrimesterComponent },
      { path: 'trimester/second', component: SecondTrimesterComponent },
      { path: 'trimester/third', component: ThirdTrimesterComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'hero', pathMatch: 'full' },
      { path: 'hero', component: HeroComponent },
      { path: 'services', component: OurServicesComponent },
      { path: 'organizer/todo', component: TodoListComponent },
      { path: 'organizer/reminder', component: ReminderListComponent },
      { path: 'clinic', component: ClinicComponent },
      { path: 'community', component: MothersCommunityComponent },
      { path: 'chat', component: FriendChatComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
