"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { hashPassword } from "@/utils/tools";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", await hashPassword(data.password));

    try {
      const response = await fetch("/api/v1/auth/access/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseData = await response.json();
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("token_type", responseData.token_type);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="page-login">
      <div className="wrapper">
        <form
          className="w-fit mx-auto p-[24px] flex flex-col space-y-[24px]"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="form-item">
            <label htmlFor="email">
              <span className="inline-block w-[100px]">邮箱</span>
              <input
                id="email"
                placeholder="请输入邮箱"
                {...register("email", { required: "必须填" })}
              />
            </label>
            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>

          <div className="form-item">
            <label htmlFor="password">
              <span className="inline-block w-[100px]">密码</span>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                {...register("password", { required: "必须填" })}
              />
            </label>
            {errors.password && <p role="alert">{errors.password.message}</p>}
          </div>

          <button className="auth-btn" type="submit">
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
