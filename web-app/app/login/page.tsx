"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-xl py-12 px-8 text-center">
        <CardHeader className="space-y-1">
          <h2 className="text-4xl font-bold">Welcome!</h2>
          <p className="text-gray-600">Log in to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              window.location.href = "/auth/login";
            }}
          >
            Login
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/login" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}