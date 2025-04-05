

export async function mockAddFavorite(dishId: string): Promise<void> {
    // Simluación llamada con fetch
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dish", dishId, "added to favorites on mock server");
        resolve();
      }, 500);
    });
  }
  
  export async function mockRemoveFavorite(dishId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dish", dishId, "removed from favorites on mock server");
        resolve();
      }, 500);
    });
  }
  