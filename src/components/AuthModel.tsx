'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/app/store/authStore"
import {toast} from "sonner"

const LoginSchema = z.object({ username: z.string().min(2), password: z.string().min(6) })
const SignupSchema = z.object({ username: z.string().min(2), password: z.string().min(6) })

export default function AuthModal({ open, onOpenChange }: { open:boolean; onOpenChange:(o:boolean)=>void }) {
  toast("");
  const login = useAuthStore(s=>s.login)
  const setUser = useAuthStore(s=>s.setUser)
  const { register: r1, handleSubmit: hs1 } = useForm<z.infer<typeof LoginSchema>>({ resolver: zodResolver(LoginSchema) })
  const { register: r2, handleSubmit: hs2 } = useForm<z.infer<typeof SignupSchema>>({ resolver: zodResolver(SignupSchema) })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Welcome</DialogTitle></DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>


          <TabsContent value="login">
            <form className="space-y-3" onSubmit={hs1(async (data) => {
              try {
                const res = await fetch("https://techbuilders-backend.onrender.com/api/auth/jwt/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: data.username, password: data.password }),
                });
                const result = await res.json();
                if (res.ok && result.access) {
                  localStorage.setItem("token", result.access);
                  
                  const profileRes = await fetch("https://techbuilders-backend.onrender.com/api/auth/users/me/", {
                    headers: { Authorization: `Bearer ${result.access}` }
                  });
                  let user: { name?: string; email?: string; username?: string } = { username: data.username };
                  if (profileRes.ok) {
                    const userData = await profileRes.json();
                    user = { ...user, name: userData.name || userData.username || userData.email };
                  }
                  login(user);
                  toast("Logged in");
                  onOpenChange(false);
                } else {
                  toast(result.detail || "Login failed");
                  
                  console.error("Login error:", result);
                }
              } catch (err) {
                toast("Network error");
                
                console.error("Login network error:", err);
              }
            })}>
              <Input placeholder="Username" {...r1("username")} />
              <Input placeholder="Password" type="password" {...r1("password")} />
              <Button className="w-full" type="submit">Login</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-3" onSubmit={hs2(async (data) => {
              try {
                const res = await fetch("https://techbuilders-backend.onrender.com/api/auth/users/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: data.username, password: data.password }),
                });
                const result = await res.json();
                if (res.ok) {
                  
                  const loginRes = await fetch(
                    "https://techbuilders-backend.onrender.com/api/auth/jwt/create",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        username: data.username,
                        password: data.password,
                      }),
                    }
                  );
                  const loginResult = await loginRes.json();
                  if (loginRes.ok && loginResult.access) {
                    localStorage.setItem("token", loginResult.access);
                    
                    const profileRes = await fetch("https://techbuilders-backend.onrender.com/api/auth/users/me/", {
                      headers: { Authorization: `Bearer ${loginResult.access}` }
                    });
                    let user: { name?: string; email?: string; username?: string } = { username: data.username };
                    if (profileRes.ok) {
                      const userData = await profileRes.json();
                      user = { ...user, name: userData.name || userData.username || userData.email };
                    }
                    login(user);
                    toast("Signed up & logged in");
                    onOpenChange(false);
                  } else {
                    toast("Signup succeeded, but login failed");
                    console.error("Signup login error:", loginResult);
                  }
                } else {
                  // result may be { field: ["msg", ...], non_field_errors: [...] } or {detail: '...'}
                  let msg = "Signup failed";
                  try {
                    if (result.detail) msg = result.detail;
                    else if (typeof result === 'object' && result !== null) {
                      const parts: string[] = [];
                      for (const k of Object.keys(result)) {
                        const v = (result as any)[k];
                        if (Array.isArray(v)) parts.push(`${k}: ${v.join('; ')}`);
                        else parts.push(`${k}: ${String(v)}`);
                      }
                      if (parts.length) msg = parts.join(' | ');
                    } else if (typeof result === 'string') msg = result;
                  } catch (e) {
                    console.error('Error formatting signup error', e);
                  }
                  toast(msg);
                  console.error("Signup error:", result);
                }
              } catch (err) {
                toast("Network error");
                
                console.error("Signup network error:", err);
              }
            })}>
              <Input placeholder="Username" {...r2("username")} />
              <Input placeholder="Password" type="password" {...r2("password")} />
              {/* email removed: backend expects only username & password */}
              <Button className="w-full" type="submit">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}




