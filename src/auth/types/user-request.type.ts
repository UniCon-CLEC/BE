import { User as PrismaUser } from "@prisma/client"

export type AuthenticatedUser = PrismaUser & { onboarded: true }

export type NewUser = {
    id: string;
    email?: string;
    onboarded: false;
    name?: string;
    profileImageUrl?: string;
}

export type UserInRequest = AuthenticatedUser | NewUser