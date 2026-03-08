import { Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EmailVerification() {
  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md self-start mt-20 ">
        <CardContent className="flex flex-col items-center justify-center gap-2">
          <div className="bg-green-200 rounded-full p-4">
            <Mail className="size-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Please verify your email</CardTitle>
          <p>Your're almost there! We sent a verification link to your email at: </p>
          <p></p>
        </CardContent>
      </Card>
    </div>
  )
}
