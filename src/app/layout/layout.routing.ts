import { Routes } from "@angular/router";

import { Authorization } from 'app/pages/authorization/authorization.component';
import { RegistrationComponent } from '../pages/authorization/registration/registration.component';
import { QuestionVerification } from '../pages/authorization/questionVerification/questionVerification.component';

import { VoteComponent } from 'app/pages/vote/vote.component';
// import { BallotBuilder } from 'app/pages/ballotBuilder/ballotBuilder.component';
import { Ballot } from 'app/shared/ballot/ballot.component';

export const LayoutRoutes: Routes = [
  { path: "authorize", component: Authorization },
  { path: "vote", component: VoteComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "question", component: QuestionVerification },
  // { path: "ballot-builder", component: BallotBuilder },
  { path: "ballot", component: Ballot }
];
