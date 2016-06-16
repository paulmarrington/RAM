export class Headers {

    public static Prefix = `X-RAM`;

    public static AuthToken = `${Headers.Prefix}-Auth-Token`;
    public static AuthTokenDecoded = `${Headers.Prefix}-Auth-Token-Decoded`;

    public static Identity = `${Headers.Prefix}-Identity`;
    public static IdentityIdValue = `${Headers.Prefix}-Identity-IdValue`;

    public static GivenName = `${Headers.Prefix}-GivenName`;
    public static FamilyName = `${Headers.Prefix}-FamilyName`;
    public static UnstructuredName = `${Headers.Prefix}-UnstructuredName`;
    public static DOB = `${Headers.Prefix}-DOB`;

    public static ProfileProvider = `${Headers.Prefix}-ProfileProvider`;
    public static LinkIdScheme = `${Headers.Prefix}-LinkIdScheme`;
    public static AgencyScheme = `${Headers.Prefix}-AgencyScheme`;
    public static PublicIdentifierScheme = `${Headers.Prefix}-PublicIdentifierScheme`;

}