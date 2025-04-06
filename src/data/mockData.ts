
export interface Dish {
    id: string;
    name: string;
    price: number;
    isVegan?: boolean;
    description?: string;
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
        { id: "pizza1", name: "Pizza Margarita", price: 10, description: "Mozzarella, Tomate y Aceitunas" },
        { id: "pizza2", name: "Pizza Pepperoni", price: 12, description: "Mozzarella, Tomate, Pepperoni y Aceitunas" },
        { id: "pizza3", name: "Pizza Vegetariana", price: 15, isVegan: true },
      ],
    },
    {
      id: 2,
      name: "Hamburguesas",
      dishes: [
        { id: "hamb1", name: "Hamburguesa Simple", price: 8, description: "Carne y Queso" },
        { id: "hamb2", name: "Hamburguesa Doble", price: 12, description: "2 Carne y 2 Queso" },
        { id: "hamb3", name: "Hamburguesa Vegetariana", price: 10, isVegan: true },
        { id: "hamb4", name: "Hamburguesa de Pollo", price: 10, description: "Carne de Pollo y Queso" },
        { id: "hamb5", name: "Hamburguesa de Ternera", price: 12, description: "Carne de Ternera y Queso" },
        { id: "hamb6", name: "Hamburguesa de Res", price: 15, description: "Carne de Res y Queso" },
        { id: "hamb7", name: "Hamburguesa de Cerdo", price: 12, description: "Carne de Cerdo y Queso" },
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
  