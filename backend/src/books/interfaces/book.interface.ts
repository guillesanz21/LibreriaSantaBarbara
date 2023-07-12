export interface IBook {
  id?: number;
  store_id?: number;
  location_id?: number;
  status_id?: number;
  ref?: number;
  ISBN: string;
  title: string;
  author?: string;
  publication_place?: string;
  publisher?: string;
  collection?: string;
  year?: number;
  size?: string;
  weight?: number;
  pages?: number;
  condition?: string;
  description?: string;
  price: number;
  stock?: number;
  binding?: string;
  private_note?: string;
  sold_at?: Date;
}
