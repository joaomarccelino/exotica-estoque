import { useFieldArray, useFormContext } from "react-hook-form"

interface StockFormValues {
  stock: {
    size: string,
    quantity: number
  } []
}

const useStockFormField = () => {
  const {control, register} = useFormContext<StockFormValues>()

  const {fields, append, remove} = useFieldArray<StockFormValues>({
    control,
    name: 'stock'
  })

  const addNewStock = () => {
    append({
      size: '',
      quantity: 0
    })
  }

  const removeStock = (stockIndex: number) => {
    remove(stockIndex)
  }

  return {
    fields,
    register,
    addNewStock,
    removeStock
  }
}

export default useStockFormField