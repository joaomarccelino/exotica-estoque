import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap"
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/AuthContext";
import { handleAddProduct } from "../../services/products";
import { numberSizes, pmgSizes, sexSubCategories, subCategories } from "../../utils/commonData";

type SizeInputs = {
  size: string;
  quantity: number;
}

export type ProductInputs = {
  code: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  sizeType: string;
  stock: SizeInputs[];
}

type CadParams = {
  setNewItem: React.Dispatch<React.SetStateAction<boolean>>;
}

const CadProduct = ({setNewItem}: CadParams) => {
  const [fields, setFields] = useState([0])
  const [sizeSelect, setSizeSelect] = useState('number');
  const [categorySelect, setCategorySelect] = useState('Moda Íntima')
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, resetField } = useForm<ProductInputs>()

  const {user} = useAuth();
  console.log(user);

  function addNewStock() {
    setFields([...fields, fields.length])
  }

  function removeStock(index: number) {
    const newFields = [...fields]
    newFields.splice(index, 1);
    unregister(`stock.${index}.size`, {
      keepValue: false
    });
    setFields(newFields);
  }

  const {
    mutate: createNewProduct,
    isLoading,
    isError
  } = useMutation(handleAddProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['exotica-estoque-products']);
      setNewItem(false)
    }
  })

  const onSubmit: SubmitHandler<ProductInputs> = async ({ code, name, category, subcategory, description, price, sizeType, stock }) => {
    const newProduct = {
      code, name, category, subcategory, description, price, sizeType, stock, active: 1
    }

    const data = {
      product: newProduct,
      user: user.displayName
    }

    createNewProduct(data);
    reset()
  }

  useEffect(() => {
    const subscription = watch((value) => {
      setSizeSelect(value.sizeType || 'number')
      setCategorySelect(value.category || 'Moda Íntima')
    })

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Container className="p-3">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Código do produto</Form.Label>
          <Form.Control
            placeholder="Código do produto"
            {...register("code")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            placeholder="Nome do produto"
            {...register("name")}
          />
        </Form.Group>
        <Form.Label>Categoria</Form.Label>
        <div className="mb-3">
          <Form.Check
            {...register("category", { required: "Opção obrigatória" })}
            name="category"
            inline
            type='radio'
            label={`Moda Íntima`}
            value={'Moda Íntima'}
          />
          <Form.Check
            {...register("category", { required: "Opção obrigatória" })}
            name="category"
            inline
            type='radio'
            label={`SexShop`}
            value={'SexShop'}
          />
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Subcategoria</Form.Label>
          <Form.Select
            placeholder="Subcategoria"
            {...register("subcategory")}
          >
            {
              categorySelect === 'Moda Íntima' ?
                subCategories.map((s) => {
                  return (
                    <option key={s} value={s}>{s}</option>
                  )
                }) :
                sexSubCategories.map((s) => {
                  return (
                    <option key={s} value={s}>{s}</option>
                  )
                })
            }

          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            placeholder="Descrição"
            {...register("description")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Valor</Form.Label>
          <Form.Control
            placeholder="Valor"
            {...register("price")}
            type="number"
          />
        </Form.Group>
        <h2>Tamanhos</h2>
        <div className="mb-3">
          <Form.Check
            {...register("sizeType", { required: "Opção obrigatória" })}
            name="sizeType"
            inline
            type='radio'
            label={`Numérico`}
            value={'number'}
          />
          <Form.Check
            {...register("sizeType", { required: "Opção obrigatória" })}
            name="sizeType"
            inline
            type='radio'
            label={`PMG`}
            value={'pmg'}
          />
          <Form.Check
            {...register("sizeType", { required: "Opção obrigatória" })}
            name="sizeType"
            inline
            type='radio'
            label={`Tamanho único`}
            value={'unique'}
          />
        </div>
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
                      {...register(`stock.${index}.size`)}
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
                      {...register(`stock.${index}.quantity`)}
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

export default CadProduct