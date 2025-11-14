import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Camera, Loader2, Mail, Phone } from 'lucide-react'
import { useUpdateUser } from '@/api/user/auth/useUpdateUser'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/api/user/auth/useUser'
import { Spinner } from '@/components/ui/spinner'

export function ProfileSettings() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: useUser,
  })
  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdateUser()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: ""
  })
  const [date, setDate] = useState(null)
  const [preview, setPreview] = useState("")
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (userData?.user) {
      setForm({
        name: userData.user.name || "",
        email: userData.user.email || "",
        phoneNumber: userData.user.phoneNumber || "",
        gender: userData.user.gender || "",
      })

      setDate(userData.user.dateOfBirth ? new Date(userData.user.dateOfBirth) : null)
      setPreview(userData.user.profilePicture || "")
    }
  }, [userData])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleUpdateUser = () => {
    const payload = {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      gender: form.gender,
      dateOfBirth: date
    }

    mutate({ payload, file }, {
      onSuccess: (res) => {
        toast.success("Profile Updated Successfully.")
        queryClient.invalidateQueries(['admin'])
      },
      onError: (err) => {
        toast.error("Something went wrong in update profile!")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 py-20">
        <Spinner className="size-8 text-primary" />
        <span className="text-primary text-lg font-semibold">Loading...</span>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview} className="object-cover w-full h-full" alt="Profile" />
              <AvatarFallback className="text-2xl uppercase">
                {form?.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(word => word.charAt(0).toUpperCase())
                  .join("")
                }
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="profile-file"
              className="flex mt-2 cursor-pointer items-start justify-center p-2 w-fit rounded-md bg-primary text-white shadow-md hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              <span>Upload Image</span>
            </Label>

            <Input
              id="profile-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="phone"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Date Of Birth</Label>
              <DatePicker disabled={isPending} date={date} setDate={setDate} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div>
                <Badge className="bg-primary/20 text-primary border-primary/20">ADMIN</Badge>
              </div>
            </div>
          </div>
          <Button onClick={handleUpdateUser} className="w-full">
            {
              isPending ? "Updating Profile..." : "Update Profile"
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}