import React from "react"
import { Container, Row } from "react-bootstrap"
import MainPageCard from "./MainPageCard"

const MainPage = () => (
    <Container className="py-4">
        <Row xs={1} md={3} className="g-4 align-items-stretch">
            <MainPageCard 
                header="Пользователи"
                body="Аккаунты пользователей, допущенных к управлению магазином"
                link="/admin/users"
            />
            <MainPageCard 
                header="Поля"
                body="Список полей товаров, используемых для добавления характеристик фильтрации"
                link="/admin/fields"
            />
            <MainPageCard 
                header="Категории"
                body="Архитектура каталога товаров, критерии группировки товаров на сайте"
                link="/admin/categories"
            />
            <MainPageCard 
                header="Товары"
                body="Информация о конкретных изделиях, наличии на складах и ценах"
                link="/admin/goods"
            />
        </Row>
    </Container>
)

export default MainPage