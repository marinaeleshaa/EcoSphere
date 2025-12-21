export interface ISubscribePlan {
	title: string;
	subtitle: string;
	price: string;
	btnText: string;
	planKey?: string; // logical key mapped on backend to a Stripe Price ID
	features: string[];
	icon: string;
}

export interface ISubscribePlanData {
	title: string;
	subtitle: string;
	price: number;
}
