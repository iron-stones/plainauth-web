"use client";

import { useEffect, useState } from "react";

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
    if (!token) {
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
      headers: { Authorization: `Bearer ${token}` },
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
  // http://localhost:4000/auth?redirect_uri=http://localhost:8000/oauth2/callback&client_id=fe217776275400d1&response_type=code&scope=basic&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJmZTIxNzc3NjI3NTQwMGQxIiwiZXhwIjoxNzI1OTQxMjA5LjA0ODUxMywiaWF0IjoxNzI1OTQxMTQ5LjA0ODUxOH0.sL3ilU2misHxXLIUT8LB6oVeI2etYQPKedln9b8Tt2M

  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>();

  useEffect(() => {
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
  }, []);

  return (
    <div className="page-auth">
      <div className="wrapper">
        <div className="wrapper-bg">
          <p>外部英语程序</p>
          <p>
            <b>{authInfo?.application.name}</b>
          </p>
          <p>想访问你的 {authInfo?.user.username} 账户</p>
          <p>
            正在以 xx 身份登录
            <a className="link" href="">
              什么？不是本人？
            </a>
          </p>

          <hr />

          <p>这意味着允许 {authInfo?.application.name} 的用户：</p>
          <p>✅ 访问您的用户名、头像信息</p>
          <p>✅ 访问您的电子邮箱和手机号</p>
          <p>❌ 请你吃一顿老北京铜锅涮肉</p>

          <hr />

          <p>授权后，你将离开 xxx, 跳转至: xxx</p>
          <p>LangChain 用户的隐私政策和服务条款适用于此 APP</p>
          <p>此 APP 不能以您的名义读取或发送信息</p>

          <button className="auth-btn">授 权</button>
        </div>
      </div>
    </div>
  );
}
