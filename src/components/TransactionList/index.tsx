import { Button, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { handleGetTransactions } from "../../services/products";

type TransactionListProps = {
  code: string
}

const TransactionList = ({code}: TransactionListProps) => {
  const { isLoading, error, data: transactions} = useQuery(['exotica-estoque-transactions'], 
  () => handleGetTransactions(code).then(res => {return res}));
  if (isLoading) return <p>Loading...</p>

  if (error) return <p>Ocorreu um erro:</p>;

  if (transactions) {
    return (
      <section>
        <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Código</th>
                <th className="text-center">Usuário</th>
                <th className="text-center">Memorando</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {
                transactions && transactions
                  .map(t => {
                    return (
                    <tr key={t.id}>
                      <td className="text-center">{t.id}</td>
                      <td className="text-center">{t.user}</td>
                      <td >{t.memo}</td>
                      <td>
                        <div className="d-flex justify-content-center"> 
                          <Button variant="success" className="me-3">Editar</Button>
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
    )
  } else {
    return (
      <h2>Nenhuma transação cadastrada</h2>
    )
  }
  
}

export default TransactionList;