import { PRODUCTS, type Product, type Category } from "@/lib/products";

export type Gender = "men" | "women" | "kids";

export type Style =
  | "eastern"
  | "western";

export type Occasion =
  | "Wedding"
  | "Eid"
  | "Casual"
  | "Office"
  | "Party"
  | "Formal";


export type StylistRequest = {
  gender: Gender;
  style: Style;
  occasion: Occasion;
  budgetPKR: number;
  colorPreference?: string;
  /** Only used when gender is "kids" — filters kids products to boy or girl. */
  kidsGender?: "boy" | "girl";
  /** Product IDs already shown earlier in this conversation — avoid repeating them. */
  excludeIds?: string[];
};


export type OutfitItem = {
  role: string;
  product: Product;
};


export type RecommendedLook = {
  title: string;
  occasion: Occasion;
  items: OutfitItem[];
  totalPKR: number;
  explanation: string;
};



function getCategories(
  gender: Gender,
  style: Style
): {role:string; category:Category}[] {


  if(gender==="women"){

    if(style==="eastern"){
      return [
        {
          role:"Main Outfit",
          category:"women-eastern"
        },
        {
          role:"Jewellery",
          category:"jewellery"
        },
        {
          role:"Accessory",
          category:"accessories"
        },
        {
          role:"Perfume",
          category:"perfumes"
        }
      ];
    }


    return [
      {
        role:"Main Outfit",
        category:"women-western"
      },
      {
        role:"Accessory",
        category:"accessories"
      },
      {
        role:"Perfume",
        category:"perfumes"
      }
    ];

  }



  if(gender==="kids"){

    return [
      {
        role:"Kids Outfit",
        category:"kids"
      },
      {
        role:"Accessory",
        category:"accessories"
      }
    ];

  }




  if(style==="eastern"){

    return [
      {
        role:"Main Outfit",
        category:"men-eastern"
      },
      {
        role:"Accessory",
        category:"accessories"
      },
      {
        role:"Perfume",
        category:"perfumes"
      }
    ];

  }


  return [
    {
      role:"Main Outfit",
      category:"men-western"
    },
    {
      role:"Accessory",
      category:"accessories"
    },
    {
      role:"Perfume",
      category:"perfumes"
    }
  ];

}




function matchesColor(
 product:Product,
 color?:string
){

 if(!color) return true;


 const text =
 `${product.name} ${product.description}`
 .toLowerCase();


 return text.includes(
  color.toLowerCase()
 );

}



function scoreProduct(
 product:Product
){

 let score=0;


 if(product.tag==="Bestseller")
 score+=20;


 if(product.tag==="New")
 score+=10;


 return score;

}



function chooseProduct(
 products:Product[],
 budget:number,
 color?:string,
 excludeIds?:string[]
){

 const affordable =
 products.filter(
 p=>p.price<=budget
 );


 if(affordable.length===0)
 return null;


 // Prefer products not already shown earlier in the conversation — fall back if nothing's left.
 const notExcluded =
 excludeIds && excludeIds.length
 ? affordable.filter(p=>!excludeIds.includes(p.id))
 : affordable;

 const basePool =
 notExcluded.length
 ? notExcluded
 : affordable;



 const colorProducts =
 basePool.filter(
 p=>matchesColor(p,color)
 );


 const pool =
 colorProducts.length
 ? colorProducts
 : basePool;



 return pool.sort(
 (a,b)=>
 scoreProduct(b)-scoreProduct(a)
 )[0];

}




export function generateLook(
 request:StylistRequest
):RecommendedLook{


 const plan =
 getCategories(
  request.gender,
  request.style
 );


 let remaining =
 request.budgetPKR;


 const items:OutfitItem[]=[];



 for(const step of plan){


 const products =
  PRODUCTS.filter(
   p=>
   p.category===step.category &&
   (
     step.category!=="kids" ||
     !request.kidsGender ||
     p.kidsGender===request.kidsGender
   ) &&
   (
     !p.suitableFor ||
     p.suitableFor.includes(request.gender as "men" | "women")
   )
  );


  const selected =
  chooseProduct(
   products,
   remaining,
   request.colorPreference,
   request.excludeIds
  );


  if(selected){

    items.push({
      role:step.role,
      product:selected
    });


    remaining -= selected.price;

  }


 }



 const totalPKR =
 items.reduce(
 (sum,item)=>
 sum+item.product.price,
 0
 );



 return {

 title:
 `${request.gender} ${request.style} Look`,

 occasion:
 request.occasion,

 items,

 totalPKR,


 explanation:
 `This House of Aura look is curated for ${request.occasion}. 
The selected pieces are matched according to your style preference and budget.`

 };


}