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
  type PaginatedCategoryResponse,
} from "../routes";
import Table from "../components/table";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const [foodCategory, setFoodCategory] = useState<Category["menu"]>([]);
  const [drinkCategory, setDrinkCategory] = useState<Category["menu"]>([]);
  const [starterCategory, setStarterCategory] = useState<Category["menu"]>([]);
  const [dessertCategory, setDessertCategory] = useState<Category["menu"]>([]);

  useEffect(() => {
      getMenuByCategory().then((response: PaginatedCategoryResponse) => {
          const categories: Category[] = response?.data ?? [];

          const getMenu = (type: Category["type"]) =>
              (categories.find((c: Category) => c?.type === type)?.menu ?? []);

          setFoodCategory(getMenu("Food"));
          setDrinkCategory(getMenu("Drink"));
          setStarterCategory(getMenu("Starter"));
          setDessertCategory(getMenu("Dessert"));
      });
  }, []);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>

 
      </ThemedView>
      <ThemedView>
        {/* <Table style={styles.table} tableData={foodCategory} /> */}
        <Table  tableData={foodCategory} />
        <Table  tableData={drinkCategory} />
        <Table   tableData={starterCategory} />
        <Table   tableData={dessertCategory} />
  
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
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
