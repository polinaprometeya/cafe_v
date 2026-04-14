import { getMenuByCategory } from "../service/routes";
import Table from "../components/Table";
import { useEffect, useState } from "react";

export default function Category() {
    const [foodCategory, setFoodCategory] = useState([]);
    const [drinkCategory, setDrinkCategory] = useState([]);
    const [starterCategory, setStarterCategory] = useState([]);
    const [dessertCategory, setDessertCategory] = useState([]);

    useEffect(() => {
        getMenuByCategory().then((response) => {
            const categories = response?.data ?? response ?? [];

            const getMenu = (type) =>
                (categories.find((c) => c?.type === type)?.menu ?? []);

            setFoodCategory(getMenu("Food"));
            setDrinkCategory(getMenu("Drink"));
            setStarterCategory(getMenu("Starter"));
            setDessertCategory(getMenu("Dessert"));
        });
    }, []);


    return (
        <>
            <h3>Food</h3>
            <Table
                theadData={["Name", "Description", "Price"]}
                tbodyData={foodCategory.map((menuItem) => ({
                    id: menuItem?.id,
                    items: [menuItem?.name, menuItem?.description, menuItem?.price],
                }))}
            />

            <h3>Starter</h3>
            <Table
                theadData={["Name", "Description", "Price"]}
                tbodyData={starterCategory.map((menuItem) => ({
                    id: menuItem?.id,
                    items: [menuItem?.name, menuItem?.description, menuItem?.price],
                }))}
            />

            <h3>Dessert</h3>
            <Table
                theadData={["Name", "Description", "Price"]}
                tbodyData={dessertCategory.map((menuItem) => ({
                    id: menuItem?.id,
                    items: [menuItem?.name, menuItem?.description, menuItem?.price],
                }))}
            />

            <h3>Drink</h3>
            <Table
                theadData={["Name", "Description", "Price"]}
                tbodyData={drinkCategory.map((menuItem) => ({
                    id: menuItem?.id,
                    items: [menuItem?.name, menuItem?.description, menuItem?.price],
                }))}
            />
        </>
    );
}
