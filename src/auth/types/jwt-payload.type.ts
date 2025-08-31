export interface KakaoProperties {
    nickname?: string;
    profile_image?: string;
}

export interface AppleFullname {
    givenName?: string;
    familyName?: string;
}

export interface SupabaseUserMetadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  
  properties?: KakaoProperties;

  fullName?: AppleFullname;
}

export interface SupabaseJwtPayload {
    sub: string,
    email?: string,
    user_metadata: SupabaseUserMetadata
}