import { CardBrand } from '@stripe/stripe-react-native/lib/typescript/src/types/Token'

type BillingDetails = {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
};
  
type CardDetails = {
    brand: CardBrand;
    checks: {
    address_line1_check: string | null;
    address_postal_code_check: string | null;
    cvc_check: string | null;
    };
    country: string;
    display_brand: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: null | unknown;
    last4: string;
    networks: {
    available: string[];
    preferred: string | null;
    };
    three_d_secure_usage: {
    supported: boolean;
    };
    wallet: {
        apple_pay?: {
            type: "apple_pay";
        };
        dynamic_last4?: string;
        type: "apple_pay" | null;
    } | null;
};

export type ApplePayMethod = {
    id: string;
    object: "payment_method";
    allow_redisplay: "unspecified";
    billing_details: BillingDetails;
    card: CardDetails;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Record<string, unknown>;
    type: "card";
};

export type CardMethod = {
    id: string;
    object: "payment_method";
    allow_redisplay: "unspecified";
    billing_details: BillingDetails;
    card: CardDetails;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Record<string, unknown>;
    type: "card";
};

export type PayPalMethod = {
    id: string;
    object: "payment_method";
    allow_redisplay: "unspecified";
    billing_details: BillingDetails;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Record<string, unknown>;
    paypal: {
    country: string;
    payer_email: string;
    payer_id: string;
    };
    type: "paypal";
};
  
export type PaymentMethod = ApplePayMethod | CardMethod | PayPalMethod;
  