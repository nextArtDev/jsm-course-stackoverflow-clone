import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import randomInteger from 'random-int'
import TrezSMSClient from 'trez-sms-client'

export async function POST(req: NextRequest) {
  const verificationCode = randomInteger(100123, 999879)
  const client = new TrezSMSClient(
    process.env.SMS_USERNAME!,
    process.env.SMS_PASSWORD!
  )
  try {
    const body = await req.json()
    const { phone } = body
    console.log(phone)

    const messageId = await client.manualSendCode(
      phone,
      ` \n کد تایید شما: ${
        verificationCode as number
      } \n مدت اعتبار این کد ۲ دقیقه می‌باشد`
    )

    console.log(messageId)
    if (messageId <= 2000) {
      return NextResponse.json(
        {
          message: 'ارسال کد تایید با خطا مواجه شد لطفا دوباره تلاش نمایید',
        },
        { status: 500 }
      )
    }
    const user = await prisma.user.findUnique({
      where: { phone },
    })
    if (!user) {
      return NextResponse.json(
        {
          message: 'شما هنوز ثبت نام نکرده‌اید',
        },
        { status: 500 }
      )
    }
    // await prisma.user.findUnique({
    //   where: {
    //     phone,
    //   },
    // })

    await prisma.user.update({
      where: { phone },
      data: { verificationCode, verificationDate: new Date() },
    })
    console.log(verificationCode)
    return NextResponse.json(
      {
        phone,
        message: 'رمز عبور با موفقیت ریست شد',
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: 'مشکلی پیش آمده. لطفا دوباره امتحان کنید.',
      },
      { status: 500 }
    )
  }
}
