'use client'
import { FC, KeyboardEvent, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { QuestionSchema } from '@/lib/validations'
import { Badge } from '../ui/badge'
import Image from 'next/image'

interface QuestionProps {}

const type: any = 'create'
const Question: FC<QuestionProps> = () => {
  // to extract the value later
  const editorRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: '',
      explanation: '',
      tags: [],
    },
  })

  function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true)
    console.log(values)
    try {
      //
    } catch (error) {
      //
    } finally {
      //
    }
    form.reset()
  }
  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.',
          })
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue])
          tagInput.value = ''
          form.clearErrors('tags')
        }
      } else {
        form.trigger()
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag)

    form.setValue('tags', newTags)
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex w-full flex-col gap-10 text-slate-300 "
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                  Question Title <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="min-h-[56px] border text-slate-700 "
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5">
                  Be specific and imagine you&apos;re asking a question to
                  another person.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3 ">
                <FormLabel>
                  Detailed explanation of your problem{' '}
                  <span className="text-rose-500">*</span>
                </FormLabel>

                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'codesample',
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                      ],
                      toolbar:
                        ' undo redo | blocks | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:16px ',
                    }}
                  />
                </FormControl>

                <FormDescription className="mt-2.5">
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                  Tags <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      className="min-h-[56px] border text-slate-700 "
                      // {...field}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      placeholder="Add tags..."
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className=" flex items-center justify-center gap-2 rounded-md border-none bg-slate-400 px-4 py-2 capitalize hover:bg-slate-600 "
                            onClick={() => handleTagRemove(tag, field)}
                          >
                            {tag}
                            <Image
                              src={'/assets/icons/close.svg'}
                              alt="Close icon"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 "
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5">
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add tag.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            className="w-fit bg-slate-300 text-slate-800 hover:text-slate-200"
            type="submit"
          >
            {isSubmitting ? (
              <>{type === 'edit' ? 'Editing...' : 'Posting...'}</>
            ) : (
              <>{type === 'edit' ? 'Edit Question' : 'Ask a Question'}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Question
