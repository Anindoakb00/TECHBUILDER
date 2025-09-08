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

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
const SignupSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) })

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
            <form className="space-y-3" onSubmit={hs1(async (data)=>{
              // TODO: call Django login
              login({ name: "Customer", email: data.email })
              toast("Logged in" )
              onOpenChange(false)
            })}>
              <Input placeholder="Email" {...r1("email")} />
              <Input placeholder="Password" type="password" {...r1("password")} />
              <Button className="w-full" type="submit">Login</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-3" onSubmit={hs2(async (data)=>{
              // TODO: call Django signup
              setUser({ name: data.name, email: data.email })
              toast("Account created" )
              onOpenChange(false)
            })}>
              <Input placeholder="Name" {...r2("name")} />
              <Input placeholder="Email" {...r2("email")} />
              <Input placeholder="Password" type="password" {...r2("password")} />
              <Button className="w-full" type="submit">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
