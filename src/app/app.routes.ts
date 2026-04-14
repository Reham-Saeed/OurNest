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
import { MothersCommunityComponent } from './components/mothers-community/mothers-community.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ClinicComponent } from './components/clinic/clinic.component';
import { TodoListComponent } from './components/organizer/todo-list/todo-list.component';
import { ReminderListComponent } from './components/organizer/reminder-list/reminder-list.component';
import { HomeMainComponent } from './components/home-main/home-main.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { BabyCareComponent } from './components/baby-care/baby-care.component';
import { FeedingTimeComponent } from './components/baby-care/feeding-time/feeding-time.component';
import { NapsComponent } from './components/baby-care/naps/naps.component';
import { CryingComponent } from './components/baby-care/crying/crying.component';
import { TemperatureComponent } from './components/baby-care/temperature/temperature.component';
import { VaccinationComponent } from './components/baby-care/vaccination/vaccination.component';
import { FeedingAdviceComponent } from './components/baby-care/feeding-advice/feeding-advice.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
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
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // { path: 'home', component: HomeMainComponent },
      { path: 'home', component: BabyCareComponent },
      { path: 'services', component: OurServicesComponent },
      { path: 'organizer/todo', component: TodoListComponent },
      { path: 'organizer/reminder', component: ReminderListComponent },
      { path: 'clinic', component: ClinicComponent },
      { path: 'community', component: MothersCommunityComponent },
      {
        path: 'baby-care',
        children: [
          { path: 'feeding-time', component: FeedingTimeComponent },
          { path: 'baby-naps', component: NapsComponent },
          { path: 'baby-crying', component: CryingComponent },
          { path: 'baby-temperature', component: TemperatureComponent },
          { path: 'feeding-guide', component: FeedingAdviceComponent },
          { path: 'vaccination', component: VaccinationComponent },
        ],
      },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
