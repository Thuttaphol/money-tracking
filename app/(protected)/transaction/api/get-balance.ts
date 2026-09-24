import { getApiTransactionsTotalBalance } from "@/lib/api/generated";

export async function getBalance(signal: AbortSignal): Promise<string> {
  try {
    const { data } = await getApiTransactionsTotalBalance({
      signal: signal,
    });

    //number formatting
    const formattedBalance = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data?.totalBalance ?? 0);

    return formattedBalance;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get totalBalance");
  }
}
