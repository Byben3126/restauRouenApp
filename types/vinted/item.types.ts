import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export interface Item {
  title: string;
  photos: Array<{
    url: string;
  }>;
  price: {
    amount: string;
    currency_code: string;
  };
  user: {
    id: number;
    login: string;
    feedback_reputation: Float;
  };
  service_fee: string;
  total_item_price: string;
  description: string;
  created_at_ts: string;
  catalog_id?: number;
  brand?: string;
  size?: string;
  status_id?: number;
}
