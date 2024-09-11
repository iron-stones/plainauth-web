"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { hashPassword } from "@/utils/tools";
import { ScreenBg } from "@/components/layout/screen-bg";
import "./index.css";

type Inputs = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string({ required_error: "请输入邮箱" }).email("请输入正确的邮箱"),
  password: z.string({ required_error: "请输入密码" }),
});

export default function Login() {
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (
    data: z.infer<typeof formSchema>
  ) => {
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

      router.push("/auth");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <ScreenBg className="flex">
      <Card className="w-[350px] m-auto">
        <CardHeader className="text-center">
          <CardTitle>AI真香授权中心</CardTitle>
          <CardDescription>登录到AI 真香</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-[600px] mx-auto">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder="输入你的邮箱" {...field} />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-24px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="输入你的密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute bottom-[-24px]" />
                  </FormItem>
                )}
              />
              <Button type="submit">登录</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ScreenBg>
  );
}
