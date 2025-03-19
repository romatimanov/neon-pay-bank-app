import { Info } from '@/app/components/accounts/info/Info'

export default async function Accounts({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log(id)

  return (
    <>
      <Info id={id} />
    </>
  )
}
