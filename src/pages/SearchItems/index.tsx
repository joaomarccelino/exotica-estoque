import { useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import CadProduct from "../../components/CadProduct";
import ModalComponent from "../../components/Modal";
import { handleGetProducts } from "../../services/products";

const testData = [
  {
    code: "123456",
    active: 1,
    name: "Sutiã da vovó",
    category: "Moda íntima",
    subcategory: "Sutiã",
    description: "Muito bom esse aqui",
    price: 123.5,
    stock: [
      {
        size: "P",
        quantity: 3
      },
      {
        size: "M",
        quantity: 2
      }
    ]
  }
]

const SearchItems = () => {
  const [newProduct, setNewProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isLoading, error, data: products} = useQuery(['exotica-estoque-products'], 
  () => handleGetProducts().then(res => {return res}));

  function handleNavigateProduct(code: string) {
    navigate(`/${code}`)
  }

  function handleNewProduct() {
    setNewProduct(!newProduct);
  }

  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  return (
    <Container className="p-3">
      <InputGroup className="mb-3 d-flex align-items-end">
        <Form.Control
          placeholder="Digite o que procura"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <Button onClick={handleNewProduct} className="mb-3">+</Button>
      <section>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="text-center">Código</th>
              <th className="text-center">Produto</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              products && products
                .filter(p => p.active === 1)
                .filter(p => {
                  if (searchTerm == "") {
                    return p;
                  } else if (p.description.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                    return p;
                  } else if (p.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                    return p;
                  } else if (p.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                    return p;
                  } else if (p.subcategory.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                    return p;
                  }
                })
                .map(p => {
                  return (
                  <tr key={p.code}>
                    <td className="text-center">{p.code}</td>
                    <td>{p.name}</td>
                    <td>
                      <div className="d-flex justify-content-center"> 
                        <Button variant="success" className="me-3" onClick={() => handleNavigateProduct(p.code)}>Editar</Button>
                        <Button variant="danger">Excluir</Button>
                      </div>
                    </td>
                  </tr>
                )
                })
            }
          </tbody>
        </Table>
      </section>
      <ModalComponent show={newProduct} setShow={() => setNewProduct(false)} title="Cadastrar novo produto">
        <CadProduct setNewItem={() => {setNewProduct(false)}} />
      </ModalComponent>
    </Container>
  )
}

export default SearchItems