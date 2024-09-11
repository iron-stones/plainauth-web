"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScreenBg } from "@/components/layout/screen-bg";

interface AuthQuery {
  redirectUri: string;
  clientId: string;
  responseType: string;
  scope: string;
  state: string;
}

export interface Application {
  id: number;
  client_id: string;
  name: string;
}
export interface User {
  open_id: string;
  username: string;
}
export interface AuthInfo {
  authorize: boolean;
  scopes?: string;
  application: Application;
  user: User;
  redirect_uri: string;
  authorize_at?: string;
}

// TODO scope 多个的情况下没有测试
const handleAuth = async (
  args: AuthQuery,
  auth?: boolean
): Promise<AuthInfo | null> => {
  const { redirectUri, clientId, responseType, scope, state } = args;

  if (state) {
    args.state = state;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token && typeof window !== "undefined") {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `/login?redirect=${currentUrl}`;
      return null;
    }

    const queryParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope,
      ...(state && { state }),
    }).toString();

    const url = `/api/v1/oauth2/authorize?${queryParams}`;
    const options: RequestInit = {
      method: auth ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(auth && { "Content-Type": "application/json" }),
      },
    };

    if (auth) {
      options.body = JSON.stringify({ authorize: true, scopes: scope });
    }

    const authResponse = await fetch(url, options);

    if (!authResponse.ok) throw new Error("Authorization failed");

    return await authResponse.json();
  } catch (error) {
    console.error("Authorization error:", error);
    return null;
  }
};

export default function Auth() {
  // http://localhost:4000/auth?redirect_uri=http://localhost:8000/oauth2/callback&client_id=fe217776275400d1&response_type=code&scope=basic&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJmZTIxNzc3NjI3NTQwMGQxIiwiZXhwIjoxNzI1OTY5OTcxLjM4NDcwMiwiaWF0IjoxNzI1OTY5OTExLjM4NDcwN30.0BQyfaajroJQY46q1nZtYXXzYJDGJ27lMXESN9qeCH4

  const [authInfo, setAuthInfo] = useState<AuthInfo | null>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUri = searchParams.get("redirect_uri");
      const clientId = searchParams.get("client_id");
      const responseType = searchParams.get("response_type");
      const scope = searchParams.get("scope");
      const state = searchParams.get("state");

      if (!redirectUri) return;
      if (!clientId) return;
      if (!responseType) return;
      if (!scope) return;
      if (!state) return;

      handleAuth({ redirectUri, clientId, responseType, scope, state }).then(
        (res) => {
          setAuthInfo(res);
        }
      );
    }
  }, []);

  function clickAuth() {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUri = searchParams.get("redirect_uri");
      const clientId = searchParams.get("client_id");
      const responseType = searchParams.get("response_type");
      const scope = searchParams.get("scope");
      const state = searchParams.get("state");

      if (!redirectUri) return;
      if (!clientId) return;
      if (!responseType) return;
      if (!scope) return;
      if (!state) return;

      //   {
      //     "authorize": true,
      //     "scopes": null,
      //     "application": {
      //         "id": 1,
      //         "client_id": "fe217776275400d1",
      //         "name": "demo1"
      //     },
      //     "user": {
      //         "open_id": "59d07a64-e1cc-4cbc-a9f3-f9edf308e265",
      //         "username": "aaamrh"
      //     },
      //     "redirect_uri": "http://localhost:8000/oauth2/callback?code=8a2e2d12a70a81bb909ea44ade74e206&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJmZTIxNzc3NjI3NTQwMGQxIiwiaXNzIjoicGxhaW5hdXRoLTAuMC4xIiwiZXhwIjoxNzI1OTcwMjM0LCJpYXQiOjE3MjU5Njk5MzR9.6lJquU8hjDYvU84bRWBQcCSUQvC88igSW8s98cynQow",
      //     "authorize_at": "2024-09-10T20:05:34.228971+08:00"
      // }
      handleAuth(
        { redirectUri, clientId, responseType, scope, state },
        true
      ).then((res) => {
        console.log("click Auth", res);
        // TODO 授权完成
      });
    }
  }

  return (
    <ScreenBg className="flex">
      <Card className="m-auto min-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>AI真香</CardTitle>
        </CardHeader>

        <CardContent className="">
          <div className="flex items-center justify-center space-x-4">
            <img className="w-[48px] h-[48px] rounded-full" src="" alt="" />
            <span>🔗</span>
            <img className="w-[48px] h-[48px] rounded-full" src="" alt="" />
          </div>

          <div className="text-center space-y-[8px] mt-[8px]">
            <p>外部应用程序</p>
            <p>
              <b>{authInfo?.application.name}</b>
            </p>
            <p>想访问您的 AI真香 账户</p>
            <p>
              正在以 {authInfo?.user.username} 身份登录
              <a className="link" href="">
                啥？不是本人？
              </a>
            </p>
          </div>

          <br />
          <hr />
          <br />

          <div className="space-y-[8px]">
            <p>这意味着允许 {authInfo?.application.name} 的用户：</p>
            <p>✅ 访问您的用户名、头像信息</p>
            <p>✅ 访问您的电子邮箱和手机号</p>
            <p>❌ 请你吃一顿老北京铜锅涮肉</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">取消</Button>
          <Button onClick={() => clickAuth()}>授权</Button>
        </CardFooter>
      </Card>
    </ScreenBg>
  );
}
