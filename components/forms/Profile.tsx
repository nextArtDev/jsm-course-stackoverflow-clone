'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProfileSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/user.action'

interface ProfileProps {
  userId: string
  user: string
}

const Profile: FC<ProfileProps> = ({ userId, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const parsedUser = JSON.parse(user)

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || '',
      username: parsedUser.username || '',
      portfolioWebsite: parsedUser.name || '',
      location: parsedUser.location || '',
      bio: parsedUser.name || '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true)
    await updateUser({
      userId,
      updateData: {
        name: values.name,
        username: values.username,
        portfolioWebsite: values.portfolioWebsite,
        location: values.location,
        bio: values.bio,
      },
      path: pathname,
    })
    try {
      router.back()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      console.log(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full gap-9 flex-col "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Name <span className="text-primary-500">*</span>{' '}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                Username <span className="text-primary-500">*</span>{' '}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border  placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your website"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your location"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your bio"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-end">
          <Button disabled={isSubmitting} type="submit" className="w-fit">
            {isSubmitting ? ' Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Profile
