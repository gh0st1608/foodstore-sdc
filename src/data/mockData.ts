
export interface Dish {
    id: string;
    name: string;
    price: number;
    isVegan?: boolean;
    // agrega más atributos si lo requieres, p.ej. isVegan: boolean;
  }
  
  export interface Category {
    id: number;
    name: string;
    dishes: Dish[];
  }
  
  export const mockCategories: Category[] = [
    {
      id: 1,
      name: "Pizzas",
      dishes: [
        { id: "pizza1", name: "Pizza Margarita", price: 10 },
        { id: "pizza2", name: "Pizza Pepperoni", price: 12 },
        { id: "pizza3", name: "Pizza Vegetariana", price: 15, isVegan: true },
      ],
    },
    {
      id: 2,
      name: "Hamburguesas",
      dishes: [
        { id: "hamb1", name: "Hamburguesa Simple", price: 8 },
        { id: "hamb2", name: "Hamburguesa Doble", price: 12 },
      ],
    },
    {
      id: 3,
      name: "Ensaladas",
      dishes: [
        { id: "ens1", name: "Ensalada César", price: 6 },
        { id: "ens2", name: "Ensalada Mixta", price: 7 },
      ],
    },
  ];
  
  // Función para obtener TODOS los platos, de todas las categorías
  export function getAllDishes(): Dish[] {
    // “flatMap” para aplanar la lista de platos en un solo array
    return mockCategories.flatMap(cat => cat.dishes);
  }
  
  // Función para obtener platos de una categoría
  export function getDishesByCategory(categoryId: number): Dish[] {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.dishes : [];
  }
  export function getDishesByVegan(isVegan: boolean): Dish[] {
    const all = getAllDishes();
    return all.filter(dish => dish.isVegan === isVegan);
  }
  
  // Función para filtrar según atributos (ejemplo)
  export function getDishesByPrice(maxPrice: number) {
    const all = getAllDishes();
    return all.filter(dish => dish.price <= maxPrice);
  }
  