const categoryDescriptions = {
  'mens-shirts': 'Camisa confeccionada com tecido de alta qualidade, proporcionando conforto e estilo. Ideal para ocasiões casuais ou formais, com corte moderno que se ajusta perfeitamente ao corpo.',
  'mens-shoes': 'Calçado masculino desenvolvido para garantir durabilidade e conforto. Possui solado antiderrapante e design sofisticado, perfeito para o homem moderno.',
  'mens-watches': 'Relógio de pulso elegante, resistente à água e com acabamento premium. O acessório indispensável para completar seu visual com classe.',
  'womens-dresses': 'Vestido deslumbrante com caimento leve e tecido suave. Uma peça versátil que realça a beleza feminina, ideal para festas e eventos especiais.',
  'womens-shoes': 'Sapato feminino que une conforto e tendência. Design exclusivo para mulheres que não abrem mão da elegância no dia a dia.',
  'womens-jewellery': 'Joia delicada com acabamento refinado. O toque final de brilho e sofisticação para compor looks incríveis.',
  'womens-bags': 'Bolsa espaçosa e estilosa, feita com materiais resistentes. Perfeita para carregar seus itens essenciais com muito charme.',
  'womens-watches': 'Relógio feminino delicado e preciso. Combina funcionalidade com um design que serve como uma verdadeira joia no pulso.'
};

const titleDictionary = {
  'Men\'s': 'Masculino',
  'Women\'s': 'Feminino',
  'Shirt': 'Camisa',
  'Shoes': 'Sapatos',
  'Watch': 'Relógio',
  'Dress': 'Vestido',
  'Bag': 'Bolsa',
  'Sneaker': 'Tênis',
  'Silver': 'Prata',
  'Gold': 'Ouro',
  'Leather': 'Couro',
  'Casual': 'Casual',
  'Cotton': 'Algodão',
  'Red': 'Vermelho',
  'Blue': 'Azul',
  'Black': 'Preto',
  'Brown': 'Marrom',
  'Green': 'Verde',
  'Slim': 'Slim Fit',
  'Classic': 'Clássico'
};

const categoryLabels = {
  'mens-shirts': 'Camisas',
  'mens-shoes': 'Sapatos',
  'mens-watches': 'Relógios',
  'womens-dresses': 'Vestidos',
  'womens-shoes': 'Sapatos Fem.',
  'womens-jewellery': 'Joias',
  'womens-bags': 'Bolsas',
  'womens-watches': 'Relógios Fem.'
};

export const translateProduct = (product) => {
  if (!product) return null;

  let translatedTitle = product.title;
  
  Object.keys(titleDictionary).forEach(key => {
    const regex = new RegExp(key, 'gi'); 
    translatedTitle = translatedTitle.replace(regex, titleDictionary[key]);
  });

  const description = categoryDescriptions[product.category] || product.description;
  const categoryLabel = categoryLabels[product.category] || product.category;

  return {
    ...product,
    title: translatedTitle,
    description,
    categoryLabel
  };
};