
import React, {useEffect} from "react";

import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { handleRegister } from "../../slices/userSlice";

export const RegisterPage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement> ) => {
        e.preventDefault()

        const loginField = e.currentTarget.elements[0] as HTMLInputElement
        const firstNameField = e.currentTarget.elements[1] as HTMLInputElement
        const lastNameField = e.currentTarget.elements[2] as HTMLInputElement
        const passwordField = e.currentTarget.elements[3] as HTMLInputElement

        const data = {
            username: loginField.value,
            first_name: firstNameField.value,
            last_name: lastNameField.value,
            password: passwordField.value
        }

        const result = await dispatch(handleRegister(data))

        if (result.type == "register/fulfilled") {
            navigate('/')
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/403/")
        }
    }, [isAuthenticated]);

    return (
        <main id="main" className="page">
            <div className="page__services _container">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit}>
                                        <h3 className="text-center">Форма регистрации</h3>

                                        <FormGroup className="mt-4">
                                            <Label for="name-input">Введите логин</Label>
                                            <Input
                                                placeholder="логин"
                                                type="text"
                                                id="name-input"
                                                required
                                               
                                            />
                                        </FormGroup>

                                        <FormGroup className="mt-4">
                                            <Label for="first-name-input">Введите имя</Label>
                                            <Input
                                                placeholder="Имя"
                                                type="text"
                                                id="first-name-input"
                                                required
                                              
                                            />
                                        </FormGroup>

                                        <FormGroup className="mt-4">
                                            <Label for="last-name-input">Введите фамилию</Label>
                                            <Input
                                                placeholder="Фамилия"
                                                type="text"
                                                id="last-name-input"
                                                required
                                                
                                            />
                                        </FormGroup>

                                        <FormGroup className="mt-4">
                                            <Label for="password-input">Введите пароль</Label>
                                            <Input
                                                placeholder="Пароль"
                                                type="password"
                                                id="password-input"
                                                required
                                               
                                            />
                                        </FormGroup>

                                        <Row className="justify-content-center mt-4">
                                            <Link to="/login/" style={{ textAlign: "center" }}>
                                                Уже есть аккаунт? Войти
                                            </Link>
                                        </Row>

                                        <Row className="justify-content-center mt-4">
                                            <Button color="primary" className="w-75">
                                                Зарегистрироваться
                                            </Button>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </main>
    );
};