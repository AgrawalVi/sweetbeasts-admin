'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import React from "react";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  googleButtonText?: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  googleButtonText
} : CardWrapperProps) => {
  return (
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <Header label={headerLabel} />
        </CardHeader>
        <CardContent className="pb-3">
          { children }
        </CardContent>
        {showSocial && (
          <CardFooter className="pb-3">
            <Social googleButtonText={googleButtonText} />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton
            label={backButtonLabel}
            href={backButtonHref}
          >
          </BackButton>
        </CardFooter>
      </Card>
    )
}