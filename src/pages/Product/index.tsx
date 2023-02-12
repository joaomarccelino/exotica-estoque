import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useQuery } from "react-query"
import { useParams } from "react-router-dom";
import { ProductInputs } from "../../components/CadProduct";
import CadTransaction from "../../components/CadTransaction";
import ModalComponent from "../../components/Modal";
import TransactionList from "../../components/TransactionList";
import { handleGetProduct } from "../../services/products";
import { numberSizes, pmgSizes } from "../../utils/commonData";


const Product = () => {
  const [newTransaction, setNewTransaction] = useState(false);
  const [changeSizePattern, setChangeSizePattern] = useState(false);
  const [categorySelect, setCategorySelect] = useState('Moda Íntima')
  const { id } = useParams();
  const { isLoading, error, data: product } = useQuery(['exotica-costumes-singleProduct'],
    () => handleGetProduct(id || '').then(res => { return res }));
  const [sizeSelect, setSizeSelect] = useState(product?.sizeType)

  const { register, handleSubmit, watch, formState: { errors }, reset, unregister, resetField } = useForm<ProductInputs>();

  useEffect(() => {
    const subscription = watch((value) => {
      setSizeSelect(value.sizeType || 'number')
      setCategorySelect(value.category || 'Moda Íntima')
    })

    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  if (product) {
    return (
      <Container className="p-3">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Código do produto</Form.Label>
            <Form.Control
              placeholder="Código do produto"
              defaultValue={product.code}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              placeholder="Nome do produto"
              defaultValue={product.name}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              placeholder="Categoria"
              defaultValue={product.category}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Subcategoria</Form.Label>
            <Form.Control
              placeholder="Subcategoria"
              defaultValue={product.subcategory}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              placeholder="Descrição"
              defaultValue={product.description}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valor</Form.Label>
            <Form.Control
              placeholder="Valor"
              defaultValue={product.price}
            />
          </Form.Group>
        </Form>
        <h1>Estoque</h1>
        <Button className="mb-3" onClick={() => setChangeSizePattern(!changeSizePattern)}>{changeSizePattern ? "Cancelar": "Trocar padrão de tamanho"}</Button>
        {
          changeSizePattern &&
          <div className="mb-3">
            <Form.Check
              {...register("sizeType", { required: "Opção obrigatória" })}
              name="sizeType"
              inline
              type='radio'
              label={`Numérico`}
              value={'number'}
              defaultChecked={sizeSelect === 'number'}
            />
            <Form.Check
              {...register("sizeType", { required: "Opção obrigatória" })}
              name="sizeType"
              inline
              type='radio'
              label={`PMG`}
              value={'pmg'}
              defaultChecked={sizeSelect === 'pmg'}
            />
            <Form.Check
              {...register("sizeType", { required: "Opção obrigatória" })}
              name="sizeType"
              inline
              type='radio'
              label={`Tamanho único`}
              value={'unique'}
              defaultChecked={sizeSelect === 'unique'}
            />
          </div>
        }
        {
          product.stock.map((s, index) => {
            return (
              <div className="d-flex" key={index}>
                <Form.Group className="mb-3 me-3">
                  <Form.Label>Tamanho</Form.Label>
                  <Form.Select
                    {...register(`stock.${index}.size`)}
                    defaultValue={product.stock[index].size}
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
                    defaultValue={product.stock[index].quantity}
                    type='number'
                  />
                </Form.Group>
              </div>
            )
          })
        }
        <ModalComponent show={newTransaction} setShow={() => setNewTransaction(false)} title="Cadastrar nova transação">
          <CadTransaction 
          sizeType={product.sizeType} 
          stock={product.stock} 
          setNewItem={() => {setNewTransaction(false)}}
          productCode={product.code}
          />
        </ModalComponent>
        <Button className="mb-3" onClick={() => setNewTransaction(true)}>Adicionar Transação</Button>
        {
          id && <TransactionList code={id} />
        }

      </Container>
    )
  } else {
    return <h1>Algo deu errado</h1>
  }

}

export default Product