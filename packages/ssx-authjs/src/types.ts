import { SignInOptions } from "next-auth/react";

export interface SSXAuthRouteConfigOptions {
    getCsrfTokenParams?: any;
    signInOptions?: SignInOptions;
  }