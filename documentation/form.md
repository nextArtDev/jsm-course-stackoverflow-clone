## adding mandatory star to fields

```typescript
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                //Adding Star
                  Question Title <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-slate-700"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
```