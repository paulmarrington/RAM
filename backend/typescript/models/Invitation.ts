
export interface Invitation extends Relationship {
  // An AuthorisationCode represents an, as yet, unidentified Party.
  // It is given to one party of a Relationship as a future reference
  // to another party.  When that other party claims/ accpets the
  // Relationship  the AuthorisationCode in the Relationship is
  // swapped out for the parties real id.  The AuthorisationCode
  // is then attached permanently as an identity to the other party.
  authorisationCode:          string;
  // might be { dob: 21/11/1967 }
  secret:                     { type: string, value: string }
  // invitation must be claimed by this date
  invitationExpiryTimestamp:  Date;
}

 // Most relationships are between two parties.  However, one of those
 // parties may be unknown during the set-up phase for a relationship.
 // During that time the relationship will be referenced by invitation.
export const invitationStatus = {
    // Code issued to relationship creator and the AuthorisationCode
    // code is still valid for the other party to accept the
    // relationship
    pending:      "Pending",
    // The other party to the relationship has sucessfully accepted
    // the relationship
    active:       "Active",
    // The other parties details didn't match the expected values.
    // The other party has consented to returning their correct
    // profile details to the relationship creator to see if they
    // just misKeyed the details
    doubleCheck:  "Double-check Required",
    //The Relationship can no longer be accepted as the
    // AuthorisationCode is too old.
    expired:      "Expired"
}
