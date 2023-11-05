'use client'
import { FC, useRef, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { AnswerSchema } from '@/lib/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Editor } from '@tinymce/tinymce-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { createAnswer } from '@/lib/actions/answer.actions'
import { usePathname } from 'next/navigation'

interface AnswerProps {
  question:string
questionId:string
authorId:string
}

const Answer: FC<AnswerProps> = ({question, questionId, authorId}) => {
  const pathname= usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editorRef = useRef(null)

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  })

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema) => {
    setIsSubmitting(true)
    try {
      await createAnswer({
        content:values.answer,
        author:JSON.parse(authorId),
        question:JSON.parse(questionId),
        path:pathname
      })

      form.reset()

      if(editorRef.current){
        const editor = editorRef.current as any 

        editor.setContent('')

      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="font-semibold">Write Your Answer Here</h4>
      </div>
      <Button
        variant={'outline'}
        className="gap-1.5 rounded-md px-4 py-2.5 text-slate-500 shadow-none "
        onClick={() => {}}
      >
        <Image
          src={'/assets/icons/stars.svg'}
          alt="star"
          width={12}
          height={12}
          className="object-contain"
        />
        Generate an AI Answer
      </Button>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3 ">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(connect) => field.onChange(connect)}
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
                      skin: 'oxide-dark',
                      //   content_css:'dark',
                    }}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Answer