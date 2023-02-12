import { useEffect } from "react";
import { Button, Container } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

type AuthInputs = {
  email: string;
  password: string;
}

const Authentication = () => {
  const navigate = useNavigate()
  const { handleLogin, user } = useAuth()

  const { register, handleSubmit, reset } = useForm<AuthInputs>()
  const onSubmit: SubmitHandler<AuthInputs> = async data => {
    handleLogin(data.email, data.password)
    navigate('/')
  }

  return (
    <Container className="p-5">
      <h1 className="text-center">Para acessar essa página é necessário o login</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="p-5">
        <Form.Group className="mb-3">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            placeholder="E-mail"
            {...register("email", { required: true })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            placeholder="Senha"
            {...register("password", { required: true })}
            type="password"
          />
        </Form.Group>
        <Button type="submit">Entrar</Button>
      </Form>
    </Container>
  )
}

export default Authentication