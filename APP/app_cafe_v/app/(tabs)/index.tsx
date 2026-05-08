import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import {
  getMenuByCategory,
  type Category,
  type MenuItem,
  type PaginatedCategoryResponse,
} from "../../src/api/routes";
import Table from "../features/table";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useAuthSession } from '@/src/auth/AuthProvider';

export default function HomeScreen() {
  const [foodCategory, setFoodCategory] = useState<Category["menu"]>([]);
  const [drinkCategory, setDrinkCategory] = useState<Category["menu"]>([]);
  const [starterCategory, setStarterCategory] = useState<Category["menu"]>([]);
  const [dessertCategory, setDessertCategory] = useState<Category["menu"]>([]);
  const [menuLoadError, setMenuLoadError] = useState<string | null>(null);
  const {signOut, token} = useAuthSession()
  const [tokenInUi, setTokenInUi] = useState<null|string|undefined>(null)


  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setMenuLoadError(null);
        const response: PaginatedCategoryResponse = await getMenuByCategory();
        const categories: Category[] = response?.data ?? [];

        const getMenu = (type: Category["type"]) =>
          (categories.find((c: Category) => c?.type === type)?.menu ?? []);

        if (!isMounted) return;
        setFoodCategory(getMenu("Food"));
        setDrinkCategory(getMenu("Drink"));
        setStarterCategory(getMenu("Starter"));
        setDessertCategory(getMenu("Dessert"));
      } catch (err) {
        if (!isMounted) return;
        setMenuLoadError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const tableHeaderData = ["Number", "Name", "Description", "Price"]

  const tableBodyData = (categoryData: MenuItem[] = []) =>
    categoryData.map((menuItem: MenuItem) => ({
      id: menuItem?.id,
      items: [
        menuItem?.number,
        menuItem?.name,
        menuItem?.description,
        menuItem?.price,
      ],
    }));

  const renderCategoryTable = (title: string, data: Category["menu"]) => (
    <ThemedView key={title} style={{ marginBottom: 16 }}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <Table theadData={tableHeaderData} tbodyData={tableBodyData(data)} />
    </ThemedView>
  );



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/table-scene-various-delicious-foods.jpg')}
          style={styles.reactLogo}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Menu</ThemedText>

 
      </ThemedView>
      <ThemedView>
        {menuLoadError ? (
          <ThemedText style={{ marginBottom: 12, color: '#b91c1c' }}>
            {menuLoadError}
          </ThemedText>
        ) : null}
        {/* <Table style={styles.table} tableData={foodCategory} /> */}
        {/* <Table  tableData={foodCategory} /> */}
        {renderCategoryTable("Food", foodCategory)}
        {renderCategoryTable("Drink", drinkCategory)}
        {renderCategoryTable("Starter", starterCategory)}
        {renderCategoryTable("Dessert", dessertCategory)}
  
      </ThemedView>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  // table: {
  //   width: "100%",
  //   marginTop: 12,
  //   marginBottom: 20,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#e5e7eb",
  //   borderRadius: 8,
  //   overflow: "hidden",
  // },
  
  
});
