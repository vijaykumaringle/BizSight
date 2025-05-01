import { useEffect, useState } from "react";

export function useUserCurrency() {
  const [currency, setCurrency] = useState<string>("USD");

  useEffect(() => {
  }, []);

  return currency;
}