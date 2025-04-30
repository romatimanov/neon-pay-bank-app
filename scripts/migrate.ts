import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

console.log('URL:', process.env.SUPABASE_URL)
console.log('KEY:', process.env.SUPABASE_ANON_KEY?.slice(0, 10) + '...')

import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const filePath = join(__dirname, '../storage/data.json')

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

async function migrate() {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const json = JSON.parse(raw)

  const accounts = Object.values(json.accounts) as {
    account: string
    balance: number
    mine: boolean
    transactions?: {
      date: string
      from: string
      to: string
      amount: number
    }[]
  }[]

  for (const acc of accounts) {
    const { data: existing } = await supabase
      .from('accounts')
      .select('account')
      .eq('account', acc.account)
      .single()

    if (!existing) {
      await supabase
        .from('accounts')
        .insert({
          id: uuidv4(),
          account: acc.account,
          balance: acc.balance,
          mine: acc.mine
        })
        .select()
      console.log(`✅ Аккаунт ${acc.account} добавлен`)
    } else {
      console.log(`⚠️ Аккаунт ${acc.account} уже есть`)
    }

    const recentTx = acc.transactions?.slice(-100) || []

    await Promise.all(
      recentTx.map(async (tx) => {
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id')
          .eq('date', tx.date)
          .eq('from', tx.from)
          .eq('to', tx.to)
          .eq('amount', tx.amount)
          .maybeSingle()

        if (!existingTx) {
          await supabase
            .from('transactions')
            .insert({
              id: uuidv4(),
              date: tx.date,
              from: tx.from,
              to: tx.to,
              amount: tx.amount
            })
            .select()
          console.log(`➡️ Транзакция ${tx.from} → ${tx.to} на ${tx.amount} записана`)
        }
      })
    )
  }

  console.log('\n🎉 Миграция завершена')
}

migrate().catch((err) => {
  console.error('❌ Ошибка миграции:', err)
})
