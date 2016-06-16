export interface HrefValue2<T> {
    href:   string;
    value?: T;
}


interface RelationshipType2 {
}

interface Identity2 {
}

interface Party2 {
    partyType:  string;
    identities: Array<HrefValue2<Identity2>>;
}

export interface Name2 {
    givenName?:         string;
    familyName?:        string;
    unstructuredName?:  string;
}

export interface Relationship2 {
    relationshipType:   HrefValue2<RelationshipType2>;
    subject:            HrefValue2<Party2>;
    subjectNickName?:   Name2;
    delegate:           HrefValue2<Party2>;
    delegateNickName?:  Name2;
    startTimestamp:     string;
    endTimestamp?:      string; 
    status:             string;
}

export interface RelationshipSearchDTO {
    totalCount:     number;
    pageSize:       number;
    list:           Array<HrefValue2<Relationship2>>;
}
