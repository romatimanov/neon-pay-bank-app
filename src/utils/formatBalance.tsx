export function formatBalance(balance: number) {
  const balanceNum = balance?.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
  return balanceNum
}
