import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


export const options: NextAuthOptions = {
    providers: [GithubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {
                label: "Email",
                type: "text",
                placeholder: "email here",
            },
            password: {
                label: "Password",
                type: "password",
                placeholder: "password here",
            }
        },
        async authorize(credentials) {
            const user = {id: "1", email: "mohumadkhald@gmail.com", password: "123456Ax"}
            if(credentials?.email === user.email && credentials?.password === user.password)
            {
                // return Promise.resolve(user)
                return user
            } else {
                return null
            }
        },
    })
],
}