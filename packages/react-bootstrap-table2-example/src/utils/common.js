/**
 * products generator for stories
 * 
 * @param {Number} quantity - quantity of products
 * @param {Function} callback - callback func which is similiar to 'mapFunction'
 * aims to customize product format
 * 
 * @return {Array} - products array
 */
export const productsGenerator = (quantity = 5, callback) => {
  if (callback) return Array.from({ length: quantity }, callback);

  // if no given callback, retrun default product format.
  return (
    Array.from({ length: quantity }, (value, index) => ({
      id: index,
      name: `Item name ${index}`,
      price: 2100 + index
    }))
  );
};

export const jobsGenerator = (quantity = 5) =>
  Array.from({ length: quantity }, (value, index) => ({
    id: index,
    name: `Job name ${index}`,
    owner: Math.floor(Math.random() * 3),
    type: Math.floor(Math.random() * 5)
  }));

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
