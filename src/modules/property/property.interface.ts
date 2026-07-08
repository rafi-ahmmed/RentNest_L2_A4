export interface ICreatePropertyPayload {
   title: string;
   description: string;
   rent: number;
   size: string;
   bedroom: number;
   bathroom: number;
   location: string;
   address: string;
   amenities: string[];
   images: string[];
   categoryId: string;
}

export interface IUpdatePropertyPayload {
   title?: string;
   description?: string;
   rent?: number;
   size?: string;
   bedroom?: number;
   bathroom?: number;
   location?: string;
   address?: string;
   amenities?: string[];
   images?: string[];
   categoryId?: string;
}

export interface IPropertyQuery {
   location?: string;
   maxPrice?: string;
   minPrice?: string;
   amenities?: string;
   type?: string;
}
