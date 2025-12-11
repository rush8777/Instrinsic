import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButton } from "@/components/ui/oauth-button";
import { LinkButton } from "@/components/ui/link-button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex w-full grow flex-col lg:flex-row">
        {/* Left - Login Form */}
        <div className="flex grow flex-col items-center justify-center gap-6 px-6 py-12 lg:px-12">
          <Link to="/" className="text-xl font-semibold text-foreground">
            Prompt<span className="gradient-text">IT</span>
          </Link>
          
          <div className="flex w-full max-w-[448px] flex-col items-center justify-center gap-8">
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
            
            <div className="flex w-full flex-col items-start justify-center gap-2">
              <OAuthButton
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417516/shared/z0i3zyjjqkobzuaecgno.svg"
              >
                Sign in with Google
              </OAuthButton>
              <OAuthButton
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417564/shared/zhcrzoah8kty6cup8zud.png"
              >
                Sign in with Slack
              </OAuthButton>
              <OAuthButton
                logo="https://res.cloudinary.com/subframe/image/upload/v1711417561/shared/kplo8lv2zjit3brqmadv.png"
              >
                Sign in with Apple
              </OAuthButton>
            </div>
            
            <div className="flex w-full items-center gap-2">
              <div className="h-px grow bg-border" />
              <span className="text-sm text-muted-foreground">
                or continue with email
              </span>
              <div className="h-px grow bg-border" />
            </div>
            
            <div className="flex w-full flex-col items-start justify-center gap-4">
              <div className="w-full space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <LinkButton variant="brand" className="text-xs">
                    Forgot password?
                  </LinkButton>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="h-10 w-full" size="lg">
                Sign In
              </Button>
            </div>
            
            <div className="flex flex-wrap items-start gap-2">
              <span className="text-sm text-muted-foreground">
                Don't have an account?
              </span>
              <Link to="/signup">
                <LinkButton variant="brand">Sign Up</LinkButton>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right - Testimonial */}
        <div className="flex grow flex-col items-center gap-12 bg-violet-950/20 px-6 py-12 lg:px-12">
          <div className="flex w-full max-w-[448px] grow flex-col items-center justify-center gap-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg" />
              <AvatarFallback>HW</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-center gap-6">
              <blockquote className="text-center text-xl font-medium text-foreground md:text-2xl">
                "In less than a week I've already saved hours upon hours of
                grunt work – it doesn't get much better than this for the
                price!"
              </blockquote>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Howard Wayne
                </span>
                <span className="text-sm text-muted-foreground">–</span>
                <span className="text-sm text-muted-foreground">
                  Founder, Parachute Inc.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
