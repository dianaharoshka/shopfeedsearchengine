import { RowDataPacket } from "mysql2";
import { connection } from "./connection";

export interface ProductInfo extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  price: number;
  stockLevel: number;
  category_id: number;
  is_popular: number;
  image_url: string;
  description2: string;
}

export interface ProductId extends RowDataPacket {
  id: number;
}

export async function getProductId(
  name: string
): Promise<ProductId | undefined> {
  // SELECT id * FROM Products WHERE title=productName
  const conn = await connection;

  const [rows] = await conn.query<ProductId[]>(
    "SELECT id from Products where title=?",
    [name]
  );
  if (rows.length == 0) {
    return undefined;
  }
  return rows[0];
}

export async function getAllProducts(): Promise<ProductInfo[]> {
  // SELECT id * FROM Products WHERE title=productName
  const conn = await connection;

  const [rows] = await conn.query<ProductInfo[]>(
    "SELECT p.id, p.title, p.price, p.stockLevel, p.description, p.category_id, p.is_popular, p.image_url, c.name AS categoryName FROM Products p JOIN Categories c ON c.id = p.category_id"
  );
  return rows;
}

export async function updateProductDescription(
  id: number,
  description: string,
  color: string
) {
  // vi hjar ju skapat en koklumn i Products spom heter description2
  // också en som heter color2
  const conn = await connection;
  await conn.execute(
    "UPDATE Products SET description2=?, color2=? WHERE id=?",
    [description, color, id]
  );
}
