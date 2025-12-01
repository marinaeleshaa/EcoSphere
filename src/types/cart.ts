export type CartItems = {
	id: string;
	title: string;
	description?: string;
	image: string;
	price: number; // cents or decimal? prefer cents (int) to avoid float errors
	quantity: number;
};
