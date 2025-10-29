import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Calendar, Camera, Mail, MapPin } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatTime } from "@/utils/formatTime";
import { useUpdateUser } from "@/api/user/auth/useUpdateUser";
import { toast } from "sonner";

export default function EditProfile({ user }) {
  const { mutate, isPending } = useUpdateUser()
  const [date, setDate] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth) : null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(user?.profilePicture)
  const [form, setForm] = useState({ name: user?.name, email: user?.email, phoneNumber: user?.phoneNumber, gender: user?.gender?.toLowerCase() })

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
        console.log(res?.data)
      },
      onError: (err) => {
        toast.error("Something went wrong in update profile!")
      }
    })
  }

  return (
    <div className="container space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={preview} className="object-cover w-full h-full" alt="Profile" />
                <AvatarFallback className="text-2xl uppercase">
                  {
                    user?.name
                      ?.split(" ")
                      .slice(0, 2)
                      .map(word => word[0].toUpperCase())
                      .join("")
                  }
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="profile-file"
                className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </Label>

              <Input
                id="profile-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
              </div>
              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {user?.address || "Can't Find Location!"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {formatTime(user?.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Name">Full Name</Label>
              <Input disabled={isPending} id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input disabled={isPending} id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input disabled={isPending} id="phone" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Date Of Birth</Label>
              <DatePicker disabled={isPending} date={date} setDate={setDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Gender</Label>
              <Select disabled={isPending} value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
  );
}
