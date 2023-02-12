import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/AuthContext";
import { handleAddTransaction } from "../../services/products";
import { numberSizes, pmgSizes } from "../../utils/commonData";

type SizeInputs = {
  size: string;
  quantity: number;
}
type TransactionInputs = {
  productCode: string;
  quantity: SizeInputs[];
  user: string;
  memo: string;
  type: string;
}

type CadTransactionProps = {
  sizeType: string,
  stock: SizeInputs[];
  setNewItem: React.Dispatch<React.SetStateAction<boolean>>;
  productCode: string;
}

const CadTransaction = ({ sizeType, stock, setNewItem, productCode }: CadTransactionProps) => {
  const generateFields = () => {
    const fields = []
    for (let i = 0; i < stock.length; i++) {
      fields.push(i);
    }
    return fields
  }
  const [fields, setFields] = useState(generateFields());
  const [sizeSelect, setSizeSelect] = useState(sizeType);
  const {user} = useAuth();
  console.log(user);
  const queryClient = useQueryClient();
  const {
    mutate: createNewTransaction,
    isLoading,
    isError
  } = useMutation(handleAddTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries(['exotica-estoque-transactions', 'exotica-costumes-singleProduct']);
      setNewItem(false);
    }
  })
  const { register, unregister, handleSubmit, watch, reset} = useForm<TransactionInputs>();
  function addNewStock() {
    setFields([...fields, fields.length])
  }

  function removeStock(index: number) {
    const newFields = [...fields]
    newFields.splice(index, 1);
    unregister(`quantity.${index}.size`, {
      keepValue: false
    });
    setFields(newFields);
  }

  const onSubmit: SubmitHandler<TransactionInputs> = async data => {
    const updateStock = data.quantity.map(q => {
      const updateQtd = data.type === 'entry' ? q.quantity : (0 - q.quantity);
      return {
        size: q.size,
        quantity: updateQtd
      }
    })
    const newTransaction = {
      user: user.displayName,
      memo: data.memo,
      quantity: updateStock,
      productCode
    }

    const newData = {
      newTransaction,
      stock
    }

    createNewTransaction(newData);
    reset();

  }
  return (
    <Container className="p-3">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Form.Check
            {...register("type", { required: "Opção obrigatória" })}
            name="type"
            inline
            type='radio'
            label={`Entrada`}
            value={'entry'}
          />
          <Form.Check
            {...register("type", { required: "Opção obrigatória" })}
            name="type"
            inline
            type='radio'
            label={`Saída`}
            value={'exit'}
          />
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Memorando</Form.Label>
          <Form.Control
            placeholder="Memorando"
            {...register("memo")}
          />
        </Form.Group>
        {
          sizeSelect !== 'unique' &&
          <Button
            onClick={addNewStock}
            className="mb-3"
          >Adicionar tamanho</Button>
        }
        <div>
          {fields.map((field, index) => {
            return (
              <div key={index} className="border mb-3 mt-3 d-flex align-items-center justify-content-around">
                <Button onClick={() => removeStock(index)} variant="danger">-</Button>
                <div className="d-flex">
                  <Form.Group className="mb-3 me-3">
                    <Form.Label>Tamanho</Form.Label>
                    <Form.Select
                      {...register(`quantity.${index}.size`)}
                      defaultValue={stock[index].size}
                    >
                      {
                        sizeSelect === 'number' ?
                          numberSizes.map((n, index) => {
                            return (
                              <option key={n + index} value={n}>{n}</option>
                            )
                          }) : sizeSelect === 'pmg' ?
                            pmgSizes.map((p) => {
                              return (
                                <option key={p + index} value={p}>{p}</option>
                              )
                            }) :
                            <option value={'uniqueSize'}>{'T. único'}</option>
                      }
                    </Form.Select>
                  </Form.Group>


                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      className="mb-3 w-50"
                      placeholder="Quantidade"
                      {...register(`quantity.${index}.quantity`)}
                      type='number'
                    />
                  </Form.Group>
                </div>
              </div>
            )
          })}
        </div>
        <Button type="submit">Enviar</Button>
      </Form>
    </Container>
  )
}

export default CadTransaction;