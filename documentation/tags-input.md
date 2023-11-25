# How to create a tag input to create tags by enter

```typescript

// removing tags
  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag)

    form.setValue('tags', newTags)
  }


const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {

    // Applying this special functionality just on tags input
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
        
// check if tag does not exists already within the fields
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


  // ---

    <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                  تگ‌ها <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      disabled={type === 'Edit'}
                      className="min-h-[56px] border "
                      // {...field}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      placeholder="اضافه کردن تگ..."
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className=" flex items-center justify-center gap-2 rounded-md border-none bg-slate-400 px-4 py-2 capitalize hover:bg-slate-600 "
                            onClick={() =>
                              type !== 'Edit'
                                ? handleTagRemove(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== 'Edit' && (
                              <Image
                                src={'/assets/icons/close.svg'}
                                alt="Close icon"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 "
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5">
 
                  با حداکثر سه تگ توضیح دهید سوال شما درباره چیست. (بعد از هر تگ
                  اینتر بزنید)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

```