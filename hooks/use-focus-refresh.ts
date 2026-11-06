import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export function useFocusRefresh(callback: () => void | Promise<void>) {
  useFocusEffect(
    useCallback(() => {
      void callback();
    }, [callback]),
  );
}
