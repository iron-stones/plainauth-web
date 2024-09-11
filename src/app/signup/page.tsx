"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { hashPassword } from "@/utils/tools";

type Inputs = {
  email: string;
  username: string;
  password: string;
  "password-again": string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    console.log(data);
    const { email, password, username } = data;

    fetch("/api/v1/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: await hashPassword(password),
        username,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        console.log("注册结果", res);
      })
      .catch((e) => {
        console.log("注册失败", e);
      });
  };

  console.log("errors", errors);

  return (
    <div className="page-signup">
      <div className="wrapper">
        <div className="wrapper-bg">
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-item">
              <label htmlFor="email">
                <span className="label">邮箱</span>
                <input
                  id="email"
                  placeholder="请输入邮箱"
                  {...register("email", { required: "这个必须填" })}
                  type="email"
                />
              </label>
              {errors["email"] && <p role="alert">{errors.email.message}</p>}
            </div>

            <div className="form-item">
              <label htmlFor="username">
                <span className="label">用户名</span>
                <input
                  id="username"
                  placeholder="请输入用户名"
                  {...register("username", { required: "这个必须填" })}
                />
              </label>
              {errors.username && <p role="alert">{errors.username.message}</p>}
            </div>

            <div className="form-item">
              <label htmlFor="password">
                <span className="label">密码</span>
                <input
                  placeholder="请输入密码"
                  type="password"
                  {...register("password", { required: "这个必须填" })}
                />
              </label>
              {errors["password"] && (
                <p role="alert">{errors.password.message}</p>
              )}
            </div>

            <div className="form-item">
              <label htmlFor="password-again">
                <span className="label">确认密码</span>
                <input
                  id="password-again"
                  placeholder="请再次输入密码"
                  type="password"
                  {...register("password-again", {
                    required: "这个必须填",
                    validate: (value: string) =>
                      value === getValues("password") || "两次输入的密码不一致",
                  })}
                />
              </label>
              {errors["password-again"] && (
                <p role="alert">{errors["password-again"].message}</p>
              )}
            </div>

            <button className="submit" type="submit">
              注册
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
