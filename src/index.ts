import path from "path";
import * as fs from "fs";
import {
  getAllProducts,
  getProductId,
  updateProductDescription,
} from "./database/database";
import { exit } from "process";
import {
  indexExists,
  createIndex,
  add,
  getDocumentIdOrUndefined,
  update,
  dropIndex,
} from "./searchengine/searchengine";

let index_name = process.env.SEARCH_INDEX_NAME || "default_index";

if ((await indexExists(index_name)) == false) {
  createIndex(index_name, "english"); //swedish
}

const products = await getAllProducts();
for (const product of products) {
  const searchObject = {
    webid: product.id,
    title: product.title,
    description: product.description2,
    combinedsearchtext: product.title + " " + product.categoryName,
    price: product.price,
    categoryName: product.categoryName,
    stockLevel: product.stockLevel,
    category_id: product.category_id,
    image_url: product.image_url,
    string_facet: [
      {
        facet_name: "Category",
        facet_value: product.categoryName,
      },
    ],
  };

  const docId = await getDocumentIdOrUndefined(
    index_name,
    product.id.toString()
  );
  if (docId != undefined) {
    update(index_name, docId, searchObject);
  } else {
    add(index_name, searchObject);
  }
}
