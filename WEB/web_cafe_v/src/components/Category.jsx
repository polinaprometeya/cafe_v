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

    const tableHeaderData = ["Number", "Name", "Description", "Price"]

    const tableBodyData = (categoryData = []) =>
        categoryData.map((menuItem) => ({
            id: menuItem?.id,
            items: [menuItem?.number, menuItem?.name, menuItem?.description, menuItem?.price],
        }));



    return (
        <>
            <h3>Food</h3>
            <Table
                theadData={tableHeaderData}
                tbodyData={tableBodyData(foodCategory)}
            />

            <h3>Starter</h3>
            <Table
                theadData={tableHeaderData}
                tbodyData={tableBodyData(starterCategory)}
            />

            <h3>Dessert</h3>
            <Table
                theadData={tableHeaderData}
                tbodyData={tableBodyData(dessertCategory)}
            />

            <h3>Drink</h3>
            <Table
                theadData={tableHeaderData}
                tbodyData={tableBodyData(drinkCategory)}
            />
        </>
    );
}
