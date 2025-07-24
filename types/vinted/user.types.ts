export interface currentUser {
    id: number;
    anon_id: string;
    login: string;
    real_name: string;
    real_name_permission: number;
    birthday_permission: number;
    email: string;
    birthday: string | null;
    gender: string;
    currency: string;
    given_item_count: number;
    taken_item_count: number;
    followers_count: number;
    following_count: number;
    following_brands_count: number;
    account_status: number;
    is_login_via_external_system_only: boolean;
    accepts_payments: boolean;
    default_address: {
      id: number;
      user_id: number;
      country_id: number;
      entry_type: number;
      name: string;
      postal_code: string;
      city: string;
      state: string;
      line1: string;
      line2: string | null;
      phone_number: string | null;
    };
    created_at: string;
    last_loged_on_ts: string;
    city_id: number;
    city: string;
    country_id: number;
    country_code: string;
    country_iso_code: string;
    country_title: string;
    contacts_permission: number | null;
    contacts: any | null;
    path: string;
    is_god: boolean;
    is_tester: boolean;
    moderator: boolean;
    is_catalog_moderator: boolean;
    is_catalog_role_marketing_photos: boolean;
    hide_feedback: boolean;
    allow_direct_messaging: boolean;
    business_account_id: number | null;
    has_confirmed_payments_account: boolean;
    has_ship_fast_badge: boolean;
    about: string;
    verification: {
      email: VerificationStatus;
      facebook: VerificationStatus;
      google: VerificationStatus;
      phone: VerificationStatus;
    };
    avg_response_time: number | null;
    updated_on: number;
    underage: boolean;
    is_hated: boolean;
    hates_you: boolean;
    is_on_holiday: boolean;
    is_publish_photos_agreed: boolean;
    allow_my_favourite_notifications: boolean;
    allow_personalization: boolean;
    show_recently_viewed_items: boolean;
    undiscoverable: boolean;
    is_location_public: boolean;
    third_party_tracking: boolean;
    international_trading_enabled: boolean;
    locale: string;
    expose_location: boolean;
    is_favourite: boolean;
    profile_url: string;
    share_profile_url: string;
    facebook_user_id: string | null;
    is_online: boolean;
    can_view_profile: boolean;
    can_bundle: boolean;
    photo: UserPhoto;
    fundraiser: any | null;
    bundle_discount: {
      id: number;
      user_id: number;
      enabled: boolean;
      minimal_item_count: number;
      fraction: string;
      discounts: Discount[];
    };
    country_title_local: string;
    last_loged_on: string;
    external_id: string;
    generated_login: boolean;
    infoboard_seen: boolean;
    soft_restricted_by_terms: boolean;
    terms_update_available: boolean;
    restricted_by_unconfirmed_real_name: boolean;
    restricted_by_balance_activation: boolean;
    accepted_pay_in_methods: PaymentMethod[];
    localization: string;
    is_bpf_price_prominence_applied: boolean;
    msg_template_count: number;
    is_account_banned: boolean;
    account_ban_date: string | null;
    is_account_ban_permanent: boolean;
    business_account: any | null;
    business: boolean;
    item_count: number;
    total_items_count: number;
    positive_feedback_count: number;
    neutral_feedback_count: number;
    negative_feedback_count: number;
    feedback_reputation: number;
    feedback_count: number;
  }
  
  interface VerificationStatus {
    valid: boolean;
    verified_at: string | null;
    available: boolean;
  }
  
  interface UserPhoto {
    id: number;
    width: number;
    height: number;
    temp_uuid: string | null;
    url: string;
    dominant_color: string;
    dominant_color_opaque: string;
    thumbnails: Thumbnail[];
    is_suspicious: boolean;
    orientation: string | null;
    high_resolution: {
      id: string;
      timestamp: number;
      orientation: string | null;
    };
    full_size_url: string;
    is_hidden: boolean;
    extra: Record<string, unknown>;
  }
  
  interface Thumbnail {
    type: string;
    url: string;
    width: number;
    height: number;
    original_size: string | null;
  }
  
  interface Discount {
    minimal_item_count: number;
    fraction: string;
  }
  
  interface PaymentMethod {
    id: number;
    code: string;
    requires_credit_card: boolean;
    event_tracking_code: string;
    icon: string;
    enabled: boolean;
    translated_name: string;
    note: string;
    method_change_possible: boolean;
  }
  