export interface NewAddEntity extends Omit<AdEntity, 'id' | 'userId'> {
    id?: string;
    userId?: string;
}

export interface SimpleAdEntity {
    id: string;
    lat: number;
    lon: number;
}

export interface AnnouncementsForUser {
    id: string;
    name: string;
    description: string;
    price: number;
    url: string;
    streetAddress: string;
    numberStreet: string;
    city: string;
    postalCode: string;
}

export interface AdEntity extends SimpleAdEntity {
    name: string;
    description?: string;
    price: number;
    url: string;
    streetAddress?: string;
    numberStreet?: string;
    city: string;
    postalCode: string;
    userId: string;
}
